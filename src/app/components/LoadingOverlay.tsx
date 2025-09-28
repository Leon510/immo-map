"use client";

interface LoadingOverlayProps {
  isVisible: boolean;
  currentCount: number;
  message?: string;
}

export default function LoadingOverlay({ isVisible, currentCount, message }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute z-[1000] top-4 left-1/2 transform -translate-x-1/2">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-3 max-w-sm">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-r-blue-400 rounded-full animate-spin-slow"></div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">
            {message || "Lade POIs..."}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {currentCount > 0 ? `${currentCount} Ergebnisse gefunden` : "Daten werden geladen..."}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">{currentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}