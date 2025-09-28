"use client";

const CATEGORIES = [
  { id: "school", label: "Schulen", icon: "🏫", color: "blue" },
  { id: "kindergarten", label: "Kindergärten", icon: "🧸", color: "pink" },
  { id: "hospital", label: "Krankenhäuser", icon: "🏥", color: "red" },
  { id: "pharmacy", label: "Apotheken", icon: "💊", color: "green" },
  { id: "supermarket", label: "Supermärkte", icon: "🛒", color: "orange" },
  { id: "bakery", label: "Bäckereien", icon: "🥖", color: "yellow" },
  { id: "doctor", label: "Ärzte", icon: "👨‍⚕️", color: "teal" },
  { id: "dentist", label: "Zahnärzte", icon: "🦷", color: "purple" },
  { id: "bank", label: "Banken", icon: "🏦", color: "indigo" },
  { id: "post", label: "Post", icon: "📮", color: "amber" },
  { id: "police", label: "Polizei", icon: "🚔", color: "blue" },
  { id: "fire", label: "Feuerwehr", icon: "🚒", color: "red" },
  { id: "park", label: "Parks", icon: "🌳", color: "green" },
  { id: "gym", label: "Fitness", icon: "🏋️", color: "slate" },
  { id: "playground", label: "Spielplätze", icon: "🎠", color: "pink" },
  { id: "atm", label: "Geldautomaten", icon: "🏧", color: "emerald" },
  { id: "hairdresser", label: "Friseure", icon: "✂️", color: "violet" }
];

const COLOR_VARIANTS = {
  blue: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  pink: "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100", 
  red: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  green: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
  orange: "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
  teal: "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100",
  purple: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  amber: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
  slate: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  violet: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
};

interface CategoryPickerProps {
  value: string[];
  onChange: (v: string[]) => void;
  onSearchHere: () => void;
  isLoading: boolean;
}

export default function CategoryPicker({ value, onChange, onSearchHere, isLoading }: CategoryPickerProps) {
  const toggleCategory = (categoryId: string) => {
    onChange(
      value.includes(categoryId) 
        ? value.filter(v => v !== categoryId)
        : [...value, categoryId]
    );
  };

  const selectAll = () => {
    onChange(CATEGORIES.map(c => c.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="absolute z-[1000] top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Kategorien wählen</h3>
          <div className="flex gap-1">
            <button
              onClick={selectAll}
              className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              Alle
            </button>
            <button
              onClick={clearAll}  
              className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            >
              Keine
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {value.length} von {CATEGORIES.length} ausgewählt
        </p>
      </div>

      {/* Categories */}
      <div className="p-3 max-h-80 overflow-y-auto">
        <div className="grid gap-2">
          {CATEGORIES.map(cat => {
            const isSelected = value.includes(cat.id);
            const colorClass = COLOR_VARIANTS[cat.color as keyof typeof COLOR_VARIANTS];
            
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`
                  flex items-center gap-3 p-2 rounded-md border transition-all text-left
                  ${isSelected 
                    ? colorClass
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <div className="text-lg">{cat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{cat.label}</div>
                </div>
                <div className={`
                  w-4 h-4 rounded border-2 flex items-center justify-center
                  ${isSelected 
                    ? "border-current bg-current" 
                    : "border-gray-300"
                  }
                `}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Search Button */}
      <div className="px-3 pb-3">
        <button
          onClick={onSearchHere}
          disabled={isLoading || value.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-sm border border-blue-700 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Suche läuft...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-medium">Hier suchen</span>
            </>
          )}
        </button>
        {value.length === 0 && (
          <p className="text-xs text-gray-500 mt-1 text-center">
            Wähle mindestens eine Kategorie aus
          </p>
        )}
      </div>
    </div>
  );
}
