"use client";
import { useState } from "react";

type Hit = { display_name:string; boundingbox:[string,string,string,string]; };

export default function PlaceSearch({ onSelect }:{ onSelect:(bbox:[number,number,number,number])=>void }) {
  const [q,setQ] = useState(""); 
  const [hits,setHits] = useState<Hit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const search = async () => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=de&limit=8`);
      const j = await r.json();
      setHits(j);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="absolute z-[1000] top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[320px]">
      <div className="flex">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            value={q} 
            onChange={e=>setQ(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Ort, PLZ, Stadt suchen..." 
            className="w-full pl-10 pr-4 py-3 text-sm border-0 focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
          />
        </div>
        <button 
          onClick={search} 
          disabled={!q.trim() || isLoading}
          className="px-4 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Suchen"
          )}
        </button>
      </div>
      
      {hits.length > 0 && (
        <div className="border-t border-gray-100 max-h-64 overflow-auto">
          {hits.map((h,i)=>(
            <button
              key={i} 
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 focus:bg-blue-50 focus:outline-none"
              onClick={()=>{
                const bb = h.boundingbox.map(Number) as [number,number,number,number]; 
                onSelect([bb[2], bb[0], bb[3], bb[1]]); // -> [minLon,minLat,maxLon,maxLat]
                setHits([]);
                setQ("");
              }}
            >
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-2">{h.display_name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
