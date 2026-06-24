import type { GoogleMapsLatLngLiteral } from "@/lib/googleMapsLoader";

export type TransitCityId = "toronto" | "vancouver" | "calgary" | "quebec";

export interface TransitProfile {
  cityId: TransitCityId;
  center: GoogleMapsLatLngLiteral;
  zoom: number;
  primaryMode: "subway_lrt" | "skytrain_seabus" | "ctrain_bus" | "bus_local_area";
  overlayAvailable: boolean;
  overlaySourceLabel: string;
  supportedFilters: {
    station: boolean;
    area: boolean;
  };
}

export const TRANSIT_CITY_PROFILES: Record<TransitCityId, TransitProfile> = {
  toronto: {
    cityId: "toronto",
    center: { lat: 43.6532, lng: -79.3832 },
    zoom: 12,
    primaryMode: "subway_lrt",
    overlayAvailable: true,
    overlaySourceLabel: "Open Government Licence - Toronto",
    supportedFilters: { station: true, area: true },
  },
  vancouver: {
    cityId: "vancouver",
    center: { lat: 49.2827, lng: -123.1207 },
    zoom: 12,
    primaryMode: "skytrain_seabus",
    overlayAvailable: false,
    overlaySourceLabel: "TransLink GTFS Static Data",
    supportedFilters: { station: false, area: true },
  },
  calgary: {
    cityId: "calgary",
    center: { lat: 51.0447, lng: -114.0719 },
    zoom: 12,
    primaryMode: "ctrain_bus",
    overlayAvailable: false,
    overlaySourceLabel: "Calgary Transit Scheduling Data",
    supportedFilters: { station: false, area: true },
  },
  quebec: {
    cityId: "quebec",
    center: { lat: 46.8139, lng: -71.208 },
    zoom: 12,
    primaryMode: "bus_local_area",
    overlayAvailable: false,
    overlaySourceLabel: "RTC GTFS / shapefile",
    supportedFilters: { station: false, area: true },
  },
};

export const DEFAULT_TRANSIT_CITY_ID: TransitCityId = "toronto";
