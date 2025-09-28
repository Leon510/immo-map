"use client";
import { useState } from "react";
import { POI_STYLES } from "../utils/poiIcons";

const CATEGORY_GROUPS = {
  "Bildung": ["school", "university", "college", "kindergarten", "music_school", "language_school", "driving_school"],
  "Gesundheit": ["hospital", "pharmacy", "doctor", "dentist", "clinic"], 
  "Einkaufen": ["supermarket", "bakery", "hairdresser", "convenience", "beauty"],
  "Finanzen": ["bank", "atm"],
  "Öffentlich": ["post_office", "police", "fire_station"],
  "Freizeit": ["park", "fitness_centre", "sports_centre", "playground"]
};

const CATEGORY_NAMES: Record<string, string> = {
  school: "Schulen",
  university: "Universitäten", 
  college: "Hochschulen",
  kindergarten: "Kindergärten",
  music_school: "Musikschulen",
  language_school: "Sprachschulen",
  driving_school: "Fahrschulen",
  hospital: "Krankenhäuser",
  pharmacy: "Apotheken",
  doctor: "Ärzte",
  dentist: "Zahnärzte",
  clinic: "Kliniken",
  supermarket: "Supermärkte",
  bakery: "Bäckereien", 
  hairdresser: "Friseure",
  convenience: "Convenience",
  beauty: "Kosmetik",
  bank: "Banken",
  atm: "Geldautomaten",
  post_office: "Post",
  police: "Polizei",
  fire_station: "Feuerwehr",
  park: "Parks",
  fitness_centre: "Fitness",
  sports_centre: "Sport",
  playground: "Spielplätze"
};

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute z-[1000] top-4 left-1/2 transform -translate-x-1/2">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <span>🗺️ Legende</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Legend Content */}
        {isOpen && (
          <div className="border-t border-gray-100 p-4 max-h-80 overflow-y-auto">
            <div className="space-y-4">
              {Object.entries(CATEGORY_GROUPS).map(([groupName, categories]) => (
                <div key={groupName}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {groupName}
                  </h4>
                  <div className="space-y-1">
                    {categories.map(category => {
                      const style = POI_STYLES[category];
                      if (!style) return null;
                      
                      return (
                        <div key={category} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 flex-shrink-0"
                            style={{ 
                              backgroundColor: style.bgColor,
                              borderColor: style.color
                            }}
                          >
                            {style.icon}
                          </div>
                          <span className="text-sm text-gray-700">
                            {CATEGORY_NAMES[category] || category}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}