"use client";

interface SearchHereButtonProps {
  onSearchHere: () => void;
  isLoading: boolean;
}

export default function SearchHereButton({ onSearchHere, isLoading }: SearchHereButtonProps) {
  return (
    <div className="absolute z-[1000] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <button
        onClick={onSearchHere}
        disabled={isLoading}
        className="pointer-events-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-700 flex items-center gap-2 transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
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
    </div>
  );
}