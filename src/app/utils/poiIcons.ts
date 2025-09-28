"use client";

// Farb- und Icon-Mapping für verschiedene POI-Kategorien
export const POI_STYLES: Record<string, { color: string; icon: string; bgColor: string }> = {
  // Bildung
  school: { color: "#3b82f6", icon: "🏫", bgColor: "#dbeafe" },
  university: { color: "#6366f1", icon: "🎓", bgColor: "#e0e7ff" },
  college: { color: "#8b5cf6", icon: "📚", bgColor: "#ede9fe" },
  kindergarten: { color: "#ec4899", icon: "🧸", bgColor: "#fce7f3" },
  music_school: { color: "#8b5cf6", icon: "🎵", bgColor: "#ede9fe" },
  language_school: { color: "#6366f1", icon: "🗣️", bgColor: "#e0e7ff" },
  driving_school: { color: "#f59e0b", icon: "🚗", bgColor: "#fef3c7" },
  educational_institution: { color: "#6366f1", icon: "📖", bgColor: "#e0e7ff" },
  
  // Gesundheit
  hospital: { color: "#dc2626", icon: "🏥", bgColor: "#fee2e2" },
  pharmacy: { color: "#059669", icon: "💊", bgColor: "#d1fae5" },
  doctor: { color: "#0891b2", icon: "👨‍⚕️", bgColor: "#cffafe" },
  dentist: { color: "#7c3aed", icon: "🦷", bgColor: "#ede9fe" },
  clinic: { color: "#dc2626", icon: "🏥", bgColor: "#fee2e2" },
  
  // Einkaufen
  supermarket: { color: "#ea580c", icon: "🛒", bgColor: "#fed7aa" },
  bakery: { color: "#fbbf24", icon: "🥖", bgColor: "#fef3c7" },
  hairdresser: { color: "#a855f7", icon: "✂️", bgColor: "#f3e8ff" },
  convenience: { color: "#ea580c", icon: "🏪", bgColor: "#fed7aa" },
  beauty: { color: "#ec4899", icon: "💄", bgColor: "#fce7f3" },
  
  // Finanzen
  bank: { color: "#1f2937", icon: "🏦", bgColor: "#f3f4f6" },
  atm: { color: "#10b981", icon: "🏧", bgColor: "#d1fae5" },
  
  // Öffentliche Dienste
  post_office: { color: "#eab308", icon: "📮", bgColor: "#fef3c7" },
  post_depot: { color: "#eab308", icon: "📦", bgColor: "#fef3c7" },
  police: { color: "#1e40af", icon: "🚔", bgColor: "#dbeafe" },
  fire_station: { color: "#dc2626", icon: "🚒", bgColor: "#fee2e2" },
  
  // Freizeit & Sport
  park: { color: "#059669", icon: "🌳", bgColor: "#d1fae5" },
  recreation_ground: { color: "#16a34a", icon: "🌿", bgColor: "#dcfce7" },
  fitness_centre: { color: "#6b7280", icon: "🏋️", bgColor: "#f3f4f6" },
  sports_centre: { color: "#6b7280", icon: "⚽", bgColor: "#f3f4f6" },
  gym: { color: "#6b7280", icon: "💪", bgColor: "#f3f4f6" },
  playground: { color: "#f59e0b", icon: "🎠", bgColor: "#fef3c7" },
  
  // Fallback für unbekannte Typen
  unknown: { color: "#6b7280", icon: "📍", bgColor: "#f3f4f6" }
};

// Cached Leaflet instance
let leafletInstance: any = null;

// Load Leaflet only once
const getLeaflet = async () => {
  if (!leafletInstance && typeof window !== 'undefined') {
    leafletInstance = await import('leaflet');
  }
  return leafletInstance;
};

// Funktion zum Erstellen eines farbigen SVG-Icons
export const createColoredIcon = (category: string, subcategory?: string) => {
  // Bestimme die beste Kategorie für das Styling
  let styleKey = category;
  
  // Spezielle Behandlung für Schulen mit Untertypen
  if (category === "school" && subcategory) {
    // Alle Schularten bekommen das Schul-Icon, aber behalten die blaue Farbe
    styleKey = "school";
  }
  
  const style = POI_STYLES[styleKey] || POI_STYLES.unknown;
  
  const iconHtml = `
    <div style="
      width: 32px;
      height: 32px;
      background-color: ${style.bgColor};
      border: 2px solid ${style.color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      position: relative;
    ">
      ${style.icon}
      <div style="
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background-color: ${style.color};
        border: 1px solid white;
        border-radius: 50%;
      "></div>
    </div>
  `;

  // Return a default icon for SSR, real icon will be created client-side
  if (typeof window === 'undefined' || !leafletInstance) {
    // This will be replaced once Leaflet loads
    return {
      html: iconHtml,
      className: 'custom-poi-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    } as any;
  }
  
  return leafletInstance.divIcon({
    html: iconHtml,
    className: 'custom-poi-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Initialize Leaflet when needed
export const initializeLeaflet = async () => {
  await getLeaflet();
};

// Hilfsfunktion zur Bestimmung der Kategorie aus POI-Properties
export const determinePOICategory = (properties: any): string => {
  if (properties.amenity) return properties.amenity;
  if (properties.shop) return properties.shop;
  if (properties.healthcare) return properties.healthcare;
  if (properties.leisure) return properties.leisure;
  if (properties.category) return properties.category;
  return "unknown";
};