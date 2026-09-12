import React from 'react';
import { BellRing, Flame } from 'lucide-react';

export default function LiveUpdatesTicker({ updates = [], onSelectUpdate }) {
  if (!updates || updates.length === 0) return null;

  // Duplicate items for seamless continuous marquee loop
  const tickerItems = [...updates, ...updates];

  return (
    <div className="bg-white/45 dark:bg-slate-900/40 backdrop-blur-xl border-b border-orange-500/20 dark:border-white/5 py-2 overflow-hidden transition-colors shadow-xs relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Fixed Ticker Label with Apple Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold text-[11px] shrink-0 uppercase tracking-wider shadow-xs backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-sm shadow-orange-500" />
          <span>Live Alerts</span>
        </div>

        {/* Scrolling list */}
        <div className="overflow-hidden relative w-full">
          <div className="animate-marquee flex items-center gap-8 text-xs">
            {tickerItems.map((item, index) => (
              <div
                key={`${item._id || item.id || index}-${index}`}
                onClick={() => onSelectUpdate && onSelectUpdate(item)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors whitespace-nowrap group active:scale-95"
              >
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-xs">
                  {item.badge || item.category || 'NOTICE'}
                </span>
                <span className="font-semibold group-hover:underline">
                  {item.title}
                </span>
                {item.date && (
                  <span className="text-slate-400 text-[10px] font-medium">
                    ({item.date})
                  </span>
                )}
                <span className="text-slate-300 dark:text-slate-700 ml-4">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
