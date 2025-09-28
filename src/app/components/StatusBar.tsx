"use client";

interface StatusBarProps {
  poisCount: number;
  categories: string[];
  isLoading: boolean;
  hasSearched: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  school: "Schulen",
  kindergarten: "Kindergärten", 
  hospital: "Krankenhäuser",
  pharmacy: "Apotheken",
  supermarket: "Supermärkte",
  bakery: "Bäckereien",
  doctor: "Ärzte",
  dentist: "Zahnärzte",
  bank: "Banken",
  post: "Post",
  police: "Polizei", 
  fire: "Feuerwehr",
  park: "Parks",
  gym: "Fitness",
  playground: "Spielplätze",
  atm: "Geldautomaten",
  hairdresser: "Friseure"
};

export default function StatusBar({ poisCount, categories, isLoading, hasSearched }: StatusBarProps) {
  const categoryLabels = categories.map(cat => CATEGORY_LABELS[cat] || cat);

  return (
    <div className="absolute z-[1000] bottom-4 left-4 right-4 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-3 pointer-events-auto">
        <div className="flex items-center justify-between gap-4">
          {/* POI Count oder Hinweis */}
          <div className="flex items-center gap-3">
            {hasSearched ? (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`}></div>
                <span className="text-sm font-medium text-gray-900">
                  {poisCount} POIs
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm font-medium text-gray-600">
                  Klicken Sie "Hier suchen" um POIs zu laden
                </span>
              </div>
            )}
            
            {poisCount > 0 && hasSearched && (
              <div className="hidden sm:flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-gray-500">auf der Karte</span>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 text-right truncate">
              <span className="hidden sm:inline">Kategorien: </span>
              {categoryLabels.length > 0 ? (
                <span className="font-medium text-gray-700">
                  {categoryLabels.length <= 3 
                    ? categoryLabels.join(", ")
                    : `${categoryLabels.slice(0, 2).join(", ")} +${categoryLabels.length - 2} weitere`
                  }
                </span>
              ) : (
                <span className="text-gray-400 italic">Keine ausgewählt</span>
              )}
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-xs text-gray-500 hidden sm:inline">Lädt...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}