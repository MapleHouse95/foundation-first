export interface GoogleMapsLatLngLiteral {
  lat: number;
  lng: number;
}

export interface GoogleMapsApi {
  maps: {
    LatLngBounds: new () => {
      extend: (location: GoogleMapsLatLngLiteral) => void;
    };
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (
      element: HTMLElement,
      options: Record<string, unknown>,
    ) => {
      addListener: (eventName: string, handler: () => void) => { remove: () => void };
      fitBounds: (bounds: unknown, padding?: number) => void;
      getZoom: () => number | undefined;
      panTo: (location: GoogleMapsLatLngLiteral) => void;
      setCenter: (location: GoogleMapsLatLngLiteral) => void;
      setZoom: (zoom: number) => void;
    };
    Marker: new (options: Record<string, unknown>) => {
      addListener: (eventName: string, handler: () => void) => void;
      setIcon: (icon: Record<string, unknown>) => void;
      setMap: (map: unknown | null) => void;
    };
    OverlayView: new () => {
      draw: () => void;
      getProjection: () => {
        fromLatLngToDivPixel: (location: unknown) => { x: number; y: number } | null;
      } | null;
      onAdd: () => void;
      onRemove: () => void;
      setMap: (map: unknown | null) => void;
    };
    Point: new (x: number, y: number) => unknown;
    Polyline: new (options: Record<string, unknown>) => {
      setMap: (map: unknown | null) => void;
    };
    Size: new (width: number, height: number) => unknown;
    SymbolPath: {
      CIRCLE: number;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleMapsApi;
    __mapleHouseGoogleMapsInit?: () => void;
    __mapleHouseGoogleMapsPromise?: Promise<GoogleMapsApi>;
  }
}

const GOOGLE_MAPS_SCRIPT_ID = "maplehouse-google-maps-js";
let googleMapsPromise: Promise<GoogleMapsApi> | null = null;

export function loadGoogleMapsApi(apiKey: string | undefined): Promise<GoogleMapsApi> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  if (window.__mapleHouseGoogleMapsPromise) {
    googleMapsPromise = window.__mapleHouseGoogleMapsPromise;
    return googleMapsPromise;
  }

  if (!apiKey?.trim()) {
    return Promise.reject(new Error("Google Maps API key is missing"));
  }

  googleMapsPromise = new Promise<GoogleMapsApi>((resolve, reject) => {
    const existingScript =
      (document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null) ??
      (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') as HTMLScriptElement | null);
    let settled = false;

    const waitForGoogleMaps = () => {
      const deadline = Date.now() + 10000;
      const check = () => {
        if (settled) return;
        if (window.google?.maps) {
          settled = true;
          resolve(window.google);
          return;
        }
        if (Date.now() > deadline) {
          settled = true;
          googleMapsPromise = null;
          window.__mapleHouseGoogleMapsPromise = undefined;
          reject(new Error("Google Maps did not initialize"));
          return;
        }
        window.setTimeout(check, 100);
      };

      check();
    };

    const handleReady = () => {
      if (window.google?.maps) {
        settled = true;
        resolve(window.google);
      } else {
        waitForGoogleMaps();
      }
    };

    const handleError = () => {
      settled = true;
      googleMapsPromise = null;
      window.__mapleHouseGoogleMapsPromise = undefined;
      reject(new Error("Google Maps failed to load"));
    };

    if (existingScript) {
      if (!existingScript.id) existingScript.id = GOOGLE_MAPS_SCRIPT_ID;
      window.__mapleHouseGoogleMapsInit = handleReady;
      existingScript.addEventListener("load", handleReady, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=marker`;
    script.addEventListener("load", handleReady, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  });

  window.__mapleHouseGoogleMapsPromise = googleMapsPromise;
  return googleMapsPromise;
}
