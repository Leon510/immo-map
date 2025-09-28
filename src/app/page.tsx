"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type * as L from "leaflet";
import PlaceSearch from "./components/PlaceSearch";
import CategoryPicker from "./components/CategoryPicker";
import LoadingOverlay from "./components/LoadingOverlay";
import StatusBar from "./components/StatusBar";
import MapLegend from "./components/MapLegend";
import {
  createColoredIcon,
  determinePOICategory,
  POI_STYLES,
  initializeLeaflet,
} from "./utils/poiIcons";

// Category names for display
const CATEGORY_NAMES: Record<string, string> = {
  school: "Schule",
  university: "Universität",
  college: "Hochschule",
  kindergarten: "Kindergarten",
  music_school: "Musikschule",
  language_school: "Sprachschule",
  driving_school: "Fahrschule",
  hospital: "Krankenhaus",
  pharmacy: "Apotheke",
  doctor: "Arzt",
  dentist: "Zahnarzt",
  clinic: "Klinik",
  supermarket: "Supermarkt",
  bakery: "Bäckerei",
  hairdresser: "Friseur",
  convenience: "Laden",
  beauty: "Kosmetik",
  bank: "Bank",
  atm: "Geldautomat",
  post_office: "Post",
  police: "Polizei",
  fire_station: "Feuerwehr",
  park: "Park",
  fitness_centre: "Fitnessstudio",
  sports_centre: "Sportzentrum",
  playground: "Spielplatz",
  unknown: "Unbekannt",
};

// Fix Leaflet default icons
import "leaflet/dist/leaflet.css";

// Dynamically import React-Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function Home() {
  const mapRef = useRef<L.Map | null>(null);
  const [pois, setPois] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cats, setCats] = useState<string[]>([
    "school",
    "pharmacy",
    "supermarket",
  ]);
  const [hasSearched, setHasSearched] = useState(false);

  // Initialize Leaflet for icons
  useEffect(() => {
    initializeLeaflet();
  }, []);

  // Funktion zum Fliegen zu einer bestimmten BBox
  const flyToBbox = (bbox: [number, number, number, number]) => {
    const m = mapRef.current;
    if (!m || typeof window === 'undefined') return;
    
    // Import Leaflet dynamically to avoid SSR issues
    import('leaflet').then((L) => {
      const bounds = L.latLngBounds(
        [bbox[1], bbox[0]], // SW corner [lat, lng]
        [bbox[3], bbox[2]] // NE corner [lat, lng]
      );
      m.fitBounds(bounds, { padding: [20, 20] });
    });

    // KEINE automatische Suche mehr nach dem Zoom
  };

  // Lade POIs basierend auf aktueller Karten-BBox und ausgewählten Kategorien
  const load = async () => {
    const m = mapRef.current;
    if (!m || cats.length === 0) return;

    try {
      setIsLoading(true);
      const bounds = m.getBounds();
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ].join(",");
      const cat = cats.join(",");

      console.log("Loading POIs for bbox:", bbox, "categories:", cat);

      const response = await fetch(
        `/api/osm?bbox=${bbox}&cat=${encodeURIComponent(cat)}`,
        {
          cache: "no-store",
        }
      );
      const data = await response.json();
      console.log("Loaded GeoJSON data:", data);

      if (data && data.features) {
        setPois(data.features);
        setHasSearched(true);
        console.log("Set POIs:", data.features.length, "features");
      }
    } catch (error) {
      console.error("Error loading POIs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual search in current view
  const searchHere = () => {
    load();
  };

  // Effect für Karten-Events (moveend) - ENTFERNT: Keine automatische Suche mehr
  // useEffect(() => {
  //   const m = mapRef.current;
  //   if (!m) return;
  //
  //   let timeout: any;
  //   const handler = () => {
  //     if (hasSearched) {
  //       clearTimeout(timeout);
  //       timeout = setTimeout(load, 150);
  //     }
  //   };
  //
  //   m.on("moveend", handler);
  //
  //   return () => {
  //     m.off("moveend", handler);
  //     clearTimeout(timeout);
  //   };
  // }, [hasSearched, cats]);

  // Effect für Kategorienwechsel - ENTFERNT: Keine automatische Suche bei Category-Wechsel
  // useEffect(() => {
  //   if (hasSearched) {
  //     load();
  //   }
  // }, [cats]);

  return (
    <div className="h-screen relative bg-gray-100">
      {/* Controls */}
      <PlaceSearch onSelect={flyToBbox} />
      <CategoryPicker 
        value={cats} 
        onChange={setCats} 
        onSearchHere={searchHere} 
        isLoading={isLoading} 
      />
      <MapLegend />

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isLoading}
        currentCount={pois.length}
        message={hasSearched ? "Aktualisiere Ergebnisse..." : "Suche POIs..."}
      />

      {/* Map */}
      <MapContainer
        center={[51.163, 10.447]} // Deutschland Zentrum
        zoom={6}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* Render POIs als farbkodierte Marker */}
        {pois.map((poi, index) => {
          const [lng, lat] = poi.geometry.coordinates;
          const name = poi.properties?.name || "(unbenannt)";

          // Bestimme Kategorie und erstelle farbiges Icon
          const category = determinePOICategory(poi.properties);
          const subcategory =
            poi.properties?.school_type || poi.properties?.subcategory;
          const customIcon = createColoredIcon(category, subcategory);

          return (
            <Marker
              key={`${poi.properties.id || index}-${
                poi.properties.name || "unnamed"
              }`}
              position={[lat, lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-3 min-w-[250px]">
                  {/* Header with Icon and Name */}
                  <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg border-2 flex-shrink-0"
                      style={{
                        backgroundColor:
                          POI_STYLES[category]?.bgColor ||
                          POI_STYLES.unknown.bgColor,
                        borderColor:
                          POI_STYLES[category]?.color ||
                          POI_STYLES.unknown.color,
                      }}
                    >
                      {POI_STYLES[category]?.icon || POI_STYLES.unknown.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 flex-1">
                      {name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {poi.properties?.school_type && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          Schultyp:
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {poi.properties.school_type}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">
                        Kategorie:
                      </span>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor:
                            POI_STYLES[category]?.bgColor ||
                            POI_STYLES.unknown.bgColor,
                          color:
                            POI_STYLES[category]?.color ||
                            POI_STYLES.unknown.color,
                        }}
                      >
                        {CATEGORY_NAMES[category] ||
                          poi.properties?.category ||
                          "Unbekannt"}
                      </span>
                    </div>

                    {poi.properties?.address?.street && (
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>
                          {poi.properties.address.street}
                          {poi.properties.address.housenumber &&
                            ` ${poi.properties.address.housenumber}`}
                          {poi.properties.address.city && (
                            <>
                              <br />
                              {poi.properties.address.postcode}{" "}
                              {poi.properties.address.city}
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {poi.properties?.phone && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <a
                          href={`tel:${poi.properties.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {poi.properties.phone}
                        </a>
                      </div>
                    )}

                    {poi.properties?.website && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        <a
                          href={poi.properties.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Website öffnen
                        </a>
                      </div>
                    )}

                    {poi.properties?.opening_hours && (
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {poi.properties.opening_hours}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 mt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        📍 {lat.toFixed(4)}, {lng.toFixed(4)} • ID:{" "}
                        {poi.properties?.id}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Status Bar */}
      <StatusBar
        poisCount={pois.length}
        categories={cats}
        isLoading={isLoading}
        hasSearched={hasSearched}
      />
    </div>
  );
}
