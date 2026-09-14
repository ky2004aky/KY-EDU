import React from 'react';
import { Sparkles, LayoutGrid, Table2, AlignJustify, GitCommit } from 'lucide-react';
import { useUIFormat } from '../context/UIFormatContext';

export default function UiFormatFloatingButton() {
  const { viewFormat, setIsFormatModalOpen, accentStyle } = useUIFormat();

  const formatIcons = {
    grid: LayoutGrid,
    table: Table2,
    compact: AlignJustify,
    timeline: GitCommit
  };

  const Icon = formatIcons[viewFormat] || Sparkles;

  return (
    <div className="fixed bottom-20 right-3.5 md:bottom-5 md:right-5 z-30 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <button
        onClick={() => setIsFormatModalOpen(true)}
        className="group flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-950 font-bold rounded-2xl shadow-xl shadow-slate-950/20 border border-slate-700/50 dark:border-slate-200 backdrop-blur-md hover:scale-105 transition-all text-xs"
        title="Open UI Format Changer (प्रारूप बदलें)"
      >
        <div className={`p-1 rounded-lg ${accentStyle.primary} text-slate-950`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline">UI Format:</span>
        <span className="text-orange-400 dark:text-orange-600 uppercase font-black tracking-wide">
          {viewFormat}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    </div>
  );
}
