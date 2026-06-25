# TTC GTFS Overlay

## TTC GTFS Source Location

Local source data:

- `tools/ttc/ttc-gtfs.zip`
- `tools/ttc/gtfs/`

These files are local generation inputs and should not be committed.

## Required GTFS Files

- `stops.txt`
- `routes.txt`
- `trips.txt`
- `stop_times.txt`
- `shapes.txt`

If these files cannot be found or parsed, stop and report the exact missing path. Do not invent coordinates.

## Active Rail And LRT Lines

Use only:

- Line 1 Yonge-University
- Line 2 Bloor-Danforth
- Line 4 Sheppard
- Line 5 Eglinton
- Line 6 Finch West

## Do Not Include

- Line 3 Scarborough as an active line.
- Bus overlays.
- Streetcar overlays.
- Rough hand-drawn coordinates.
- Fake schematic coordinates.

## Generated Data

Generated app data:

- `src/lib/ttcRapidTransitOverlay.generated.ts`

This file should not be manually edited. Regenerate it from:

```powershell
node tools\ttc\generate-ttc-rapid-overlay.cjs
```

Generated stations include active TTC line membership in `lineIds`. The listings map uses this membership to color station labels and to draw very soft center angled split labels for two-line transfer stations.

## Station Naming Rules

- Use `parent_station` where available.
- Prefer `location_type = 1` records.
- Use passenger-friendly station names.
- Remove platform and direction suffixes.
- Preserve real direction words that are part of station names, such as `Finch West` and `Eglinton West`.
- Bloor/Yonge line-specific stops should be merged into `Bloor-Yonge Station`.
- UI labels should append `Station`.

## Listings Map Styling Rules

- Listing count markers remain blue circular bubbles with white numbers.
- TTC station labels use very soft pastel TTC line colors instead of blue.
- Transfer stations with exactly two active line memberships use one center angled split pill label.
- Transfer labels split by color only and do not use a visible white divider line.
- Transfer labels should not use a harsh full diagonal slash.
- Passenger-friendly station labels still include `Station` exactly once.

## Listings Map Toggle Rules

- The route toggle label is localized as `노선도` in Korean, `Lines` in English, and `Lignes` in French.
- The toggle controls custom TTC lines, custom station dots, custom station labels, and TTC attribution together.
- Listing count markers remain blue and stay visible when the TTC route overlay is off.
- The map also supports roadmap, satellite, and hybrid map types.

## Bad UI Labels That Must Never Show

- `Southbound`
- `Northbound`
- `Eastbound`
- `Westbound`
- `Platform`
- `Station - Southbound`
- `Eastbound Platform`
- `Westbound Platform`

## Attribution Text

Korean:

```text
TTC ?몄꽑 ?뺣낫 異쒖쿂: Open Government Licence - Toronto
```

English:

```text
TTC route data: Open Government Licence - Toronto
```

French:

```text
Donn챕es TTC : Open Government Licence - Toronto
```
