import CitySelector from "@/components/CitySelector";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-500 opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-500 opacity-10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600 opacity-5 blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-medium mb-6">
            <span>🌍</span>
            <span>Your personal travel concierge</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
            Your City
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
              Bucket List
            </span>
          </h1>

          <p className="text-lg text-indigo-200 mb-10 max-w-lg mx-auto leading-relaxed">
            Tell me where you&apos;re headed and I&apos;ll give you the insider guide — food, sights, nightlife, hidden gems and more.
          </p>

          <CitySelector />
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-slate-500 text-sm font-medium uppercase tracking-widest mb-10">
            What your concierge knows
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[
              { emoji: "🍽️", label: "Food & Drink", desc: "From fine dining to street food gems" },
              { emoji: "🏛️", label: "Sights", desc: "Iconic landmarks and hidden architecture" },
              { emoji: "🎉", label: "Activities", desc: "Adventures and local experiences" },
              { emoji: "🌙", label: "Nightlife", desc: "The best bars, clubs, and venues" },
              { emoji: "👨‍👩‍👧", label: "Family", desc: "Kid-friendly picks the whole family loves" },
              { emoji: "🗝️", label: "Hidden Gems", desc: "Insider secrets most tourists miss" },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="text-center p-4">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-semibold text-slate-800 text-sm">{label}</div>
                <div className="text-slate-500 text-xs mt-1">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
