"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { POPULAR_CITIES } from "@/lib/mockData";

export default function CitySelector() {
  const [city, setCity] = useState("");
  const router = useRouter();

  function navigate(destination: string) {
    const slug = destination.trim().toLowerCase().replace(/\s+/g, "-");
    if (slug) router.push(`/chat/${encodeURIComponent(slug)}`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(city);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">📍</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter any city in the world..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 text-base focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={!city.trim()}
          className="px-6 py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-indigo-950 font-bold rounded-2xl transition-colors text-base whitespace-nowrap"
        >
          Let&apos;s Go →
        </button>
      </form>

      <div>
        <p className="text-white/50 text-xs text-center mb-3 uppercase tracking-widest">
          Popular destinations
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_CITIES.map(({ name, emoji }) => (
            <button
              key={name}
              onClick={() => navigate(name)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full text-white/80 hover:text-white text-sm transition-all"
            >
              <span>{emoji}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
