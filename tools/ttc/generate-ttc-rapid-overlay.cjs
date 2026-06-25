const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = path.resolve(__dirname, "..", "..");
const gtfsDir = path.join(__dirname, "gtfs");
const outputPath = path.join(root, "src", "lib", "ttcRapidTransitOverlay.generated.ts");

const activeRapidRouteShortNames = new Set(["1", "2", "4", "5", "6"]);
const fallbackColors = {
  1: "#D5C82B",
  2: "#008000",
  4: "#B300B3",
  5: "#FF8000",
  6: "#808080",
};

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') quoted = true;
    else if (char === ",") {
      cells.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }

  cells.push(cell);
  return cells;
}

function rowFromCells(headers, cells) {
  return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
}

function readCsv(fileName) {
  const filePath = path.join(gtfsDir, fileName);
  if (!fs.existsSync(filePath)) throw new Error(`Missing ${filePath}`);

  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(headerLine);
  return lines.map((line) => rowFromCells(headers, parseCsvLine(line)));
}

async function streamCsv(fileName, onRow) {
  const filePath = path.join(gtfsDir, fileName);
  if (!fs.existsSync(filePath)) throw new Error(`Missing ${filePath}`);

  const rl = readline.createInterface({
    crlfDelay: Infinity,
    input: fs.createReadStream(filePath, { encoding: "utf8" }),
  });

  let headers = null;
  for await (const rawLine of rl) {
    const line = headers ? rawLine : rawLine.replace(/^\uFEFF/, "");
    if (!line) continue;
    if (!headers) {
      headers = parseCsvLine(line);
      continue;
    }
    await onRow(rowFromCells(headers, parseCsvLine(line)));
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeStationName(value) {
  const name = value
    .replace(/\s*-\s*(Subway|LRT)?\s*Platform.*$/i, "")
    .replace(/\s*-\s*(Northbound|Southbound|Eastbound|Westbound)\s*Platform.*$/i, "")
    .replace(/\s*-\s*(Northbound|Southbound|Eastbound|Westbound).*$/i, "")
    .replace(/\s+(Northbound|Southbound|Eastbound|Westbound)\s*Platform.*$/i, "")
    .replace(/\s+(Northbound|Southbound|Eastbound|Westbound).*$/i, "")
    .replace(/\s+Platform.*$/i, "")
    .replace(/\s+Station\s+(Subway|LRT)$/i, "")
    .replace(/\s+(Subway|LRT)\s+Station$/i, "")
    .replace(/\s+Station$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (name === "Bloor" || name === "Yonge") return "Bloor-Yonge";
  if (name === "St. George") return "St George";
  return name;
}

function toCoord(stop) {
  return {
    lat: Number(stop.stop_lat),
    lng: Number(stop.stop_lon),
  };
}

function hasUsableCoord(stop) {
  const coord = toCoord(stop);
  return Number.isFinite(coord.lat) && Number.isFinite(coord.lng);
}

function averageCoord(stops) {
  const coords = stops.map(toCoord).filter((coord) => Number.isFinite(coord.lat) && Number.isFinite(coord.lng));
  if (coords.length === 0) return null;

  return {
    lat: coords.reduce((sum, coord) => sum + coord.lat, 0) / coords.length,
    lng: coords.reduce((sum, coord) => sum + coord.lng, 0) / coords.length,
  };
}

function buildChildrenByParent(stops) {
  const childrenByParent = new Map();

  stops.forEach((stop) => {
    if (!stop.parent_station) return;
    const children = childrenByParent.get(stop.parent_station) ?? [];
    children.push(stop);
    childrenByParent.set(stop.parent_station, children);
  });

  return childrenByParent;
}

function getStation(stop, lineId, stopsById, childrenByParent) {
  const parent =
    stop.parent_station && stopsById.has(stop.parent_station)
      ? stopsById.get(stop.parent_station)
      : null;
  const parentIsStation = parent?.location_type === "1";
  const displayStop = parentIsStation ? parent : stop;
  const name = normalizeStationName(displayStop.stop_name || stop.stop_name || "");
  const parentChildren = parent ? childrenByParent.get(parent.stop_id) ?? [] : [];
  const averaged = parentChildren.length > 0 ? averageCoord(parentChildren) : null;
  const coord = parentIsStation && hasUsableCoord(parent) ? toCoord(parent) : averaged ?? toCoord(stop);
  if (!name || !Number.isFinite(coord.lat) || !Number.isFinite(coord.lng)) return null;
  const id = parentIsStation ? slugify(name) : slugify(name);

  return {
    id,
    name,
    lineIds: [lineId],
    lat: coord.lat,
    lng: coord.lng,
  };
}

function mergeStations(stations) {
  const merged = new Map();

  stations.forEach((station) => {
    const current = merged.get(station.id);
    if (!current) {
      merged.set(station.id, { ...station });
      return;
    }
    current.lineIds = Array.from(new Set([...current.lineIds, ...station.lineIds])).sort();
    current.lat = (current.lat + station.lat) / 2;
    current.lng = (current.lng + station.lng) / 2;
  });

  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function assertNoPlatformLabels(stations) {
  const badStations = stations.filter((station) =>
    /(Southbound|Northbound|Eastbound|Westbound|Platform|Station\s*-)/i.test(station.name),
  );

  if (badStations.length > 0) {
    const examples = badStations
      .slice(0, 10)
      .map((station) => `${station.id}: ${station.name}`)
      .join("; ");
    throw new Error(`GTFS station label cleanup failed. Platform/direction labels remain: ${examples}`);
  }
}

function writeGeneratedFile(stations, lines) {
  const content = `export type TtcLineId = "1" | "2" | "4" | "5" | "6";

export interface TtcStation {
  id: string;
  name: string;
  lineIds: TtcLineId[];
  lat: number;
  lng: number;
  major?: boolean;
  terminal?: boolean;
}

export interface TtcLine {
  id: TtcLineId;
  label: string;
  color: string;
  path: Array<{ lat: number; lng: number }>;
  stationIds: string[];
}

export const TTC_STATIONS: TtcStation[] = ${JSON.stringify(stations, null, 2)};

export const TTC_LINES: TtcLine[] = ${JSON.stringify(lines, null, 2)};
`;

  fs.writeFileSync(outputPath, content, "utf8");
}

async function main() {
  if (!fs.existsSync(gtfsDir)) {
    throw new Error(`Place expanded TTC GTFS files in ${gtfsDir}`);
  }

  const routes = readCsv("routes.txt")
    .filter((route) => activeRapidRouteShortNames.has(route.route_short_name))
    .sort((a, b) => Number(a.route_short_name) - Number(b.route_short_name));
  const routeById = new Map(routes.map((route) => [route.route_id, route]));
  const stops = readCsv("stops.txt");
  const stopsById = new Map(stops.map((stop) => [stop.stop_id, stop]));
  const childrenByParent = buildChildrenByParent(stops);
  const tripsByRoute = new Map(routes.map((route) => [route.route_id, []]));
  const tripToRoute = new Map();
  const shapeToRoute = new Map();

  readCsv("trips.txt").forEach((trip) => {
    const route = routeById.get(trip.route_id);
    if (!route) return;
    tripToRoute.set(trip.trip_id, trip.route_id);
    shapeToRoute.set(trip.shape_id, trip.route_id);
    tripsByRoute.get(trip.route_id)?.push(trip);
  });

  const stopSequencesByTrip = new Map();
  await streamCsv("stop_times.txt", (stopTime) => {
    const routeId = tripToRoute.get(stopTime.trip_id);
    if (!routeId) return;

    const sequence = Number(stopTime.stop_sequence);
    if (!Number.isFinite(sequence)) return;

    const list = stopSequencesByTrip.get(stopTime.trip_id) ?? [];
    list.push({ sequence, stopId: stopTime.stop_id });
    stopSequencesByTrip.set(stopTime.trip_id, list);
  });

  const bestTripsByRoute = new Map();
  routes.forEach((route) => {
    const trips = tripsByRoute.get(route.route_id) ?? [];
    const bestTrip = trips
      .map((trip) => ({
        trip,
        stops: (stopSequencesByTrip.get(trip.trip_id) ?? []).sort(
          (a, b) => a.sequence - b.sequence,
        ),
      }))
      .sort((a, b) => b.stops.length - a.stops.length)[0];
    if (bestTrip) bestTripsByRoute.set(route.route_id, bestTrip);
  });

  const shapePointsByShape = new Map();
  await streamCsv("shapes.txt", (shapePoint) => {
    const routeId = shapeToRoute.get(shapePoint.shape_id);
    if (!routeId) return;

    const list = shapePointsByShape.get(shapePoint.shape_id) ?? [];
    list.push({
      lat: Number(shapePoint.shape_pt_lat),
      lng: Number(shapePoint.shape_pt_lon),
      sequence: Number(shapePoint.shape_pt_sequence),
    });
    shapePointsByShape.set(shapePoint.shape_id, list);
  });

  const bestShapeByRoute = new Map();
  shapePointsByShape.forEach((points, shapeId) => {
    const routeId = shapeToRoute.get(shapeId);
    const cleanPoints = points
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
      .sort((a, b) => a.sequence - b.sequence)
      .map(({ lat, lng }) => ({ lat, lng }));
    const current = bestShapeByRoute.get(routeId);
    if (!current || cleanPoints.length > current.path.length) {
      bestShapeByRoute.set(routeId, { shapeId, path: cleanPoints });
    }
  });

  const routeStationLists = new Map();
  const stationCandidates = [];
  routes.forEach((route) => {
    const lineId = route.route_short_name;
    const bestTrip = bestTripsByRoute.get(route.route_id);
    const seen = new Set();
    const stations = [];

    (bestTrip?.stops ?? []).forEach(({ stopId }) => {
      const stop = stopsById.get(stopId);
      if (!stop) return;

      const station = getStation(stop, lineId, stopsById, childrenByParent);
      if (!station || seen.has(station.id)) return;

      seen.add(station.id);
      stations.push(station);
      stationCandidates.push(station);
    });

    routeStationLists.set(route.route_id, stations);
  });

  const stations = mergeStations(stationCandidates);
  const terminalStationIds = new Set();
  routeStationLists.forEach((stationList) => {
    if (stationList.length === 0) return;
    terminalStationIds.add(stationList[0].id);
    terminalStationIds.add(stationList[stationList.length - 1].id);
  });
  stations.forEach((station) => {
    if (station.lineIds.length > 1) station.major = true;
    if (terminalStationIds.has(station.id)) station.terminal = true;
  });
  assertNoPlatformLabels(stations);
  const lines = routes.map((route) => {
    const lineId = route.route_short_name;
    const stationList = routeStationLists.get(route.route_id) ?? [];
    const shape = bestShapeByRoute.get(route.route_id);

    return {
      id: lineId,
      label: route.route_long_name || `Line ${lineId}`,
      color: `#${route.route_color || fallbackColors[lineId].replace("#", "")}`,
      path:
        shape?.path && shape.path.length > 0
          ? shape.path
          : stationList.map((station) => ({ lat: station.lat, lng: station.lng })),
      stationIds: stationList.map((station) => station.id),
    };
  });

  writeGeneratedFile(stations, lines);
  console.log(
    `Generated ${stations.length} TTC rapid stations and ${lines.length} lines at ${outputPath}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
