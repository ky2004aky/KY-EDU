import React from 'react';
import { 
  X, 
  Sparkles, 
  LayoutGrid, 
  Table2, 
  AlignJustify, 
  GitCommit, 
  Languages, 
  Maximize2, 
  Minimize2, 
  Palette, 
  RotateCcw,
  Zap,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { useUIFormat } from '../context/UIFormatContext';

export default function UiFormatModal({ isOpen, onClose, theme = 'light', setTheme }) {
  const {
    viewFormat,
    setViewFormat,
    density,
    setDensity,
    language,
    setLanguage,
    accent,
    setAccent,
    accentStyle,
    applyPreset,
    resetFormat,
    t
  } = useUIFormat();

  if (!isOpen) return null;

  const viewFormats = [
    {
      id: 'grid',
      title: 'Modern Cards Grid',
      hindi: 'आधुनिक कार्ड ग्रिड',
      desc: 'Rich interactive cards with pay pills, stream tags, and details.',
      icon: LayoutGrid,
      badge: 'Default'
    },
    {
      id: 'table',
      title: 'Sarkari Directory Table',
      hindi: 'सरकारी तालिका प्रारूप',
      desc: 'High-density official table comparing vacancies, qualifications & salary.',
      icon: Table2,
      badge: 'Sarkari Pro'
    },
    {
      id: 'compact',
      title: 'Fast-Scan Compact Feed',
      hindi: 'त्वरित स्कैनर सूची',
      desc: 'Single-line streamlined cards inspired by SarkariResult and FreeJobAlert.',
      icon: AlignJustify,
      badge: 'Fast'
    },
    {
      id: 'timeline',
      title: 'Recruitment Stage Pipeline',
      hindi: 'भर्ती चरण टाइमलाइन',
      desc: 'Stage-wise Kanban board: Active, Admit Cards, Ongoing, Upcoming.',
      icon: GitCommit,
      badge: 'Stages'
    }
  ];

  const densities = [
    {
      id: 'comfortable',
      title: 'Comfortable Spacing',
      hindi: 'सुगम एवं विस्तृत',
      desc: 'Spacious padding, relaxed reading font size.',
      icon: Maximize2
    },
    {
      id: 'compact',
      title: 'High Density (Compact)',
      hindi: 'सघन / Sarkari Pro',
      desc: 'Tight rows, fits more notifications on one screen.',
      icon: Minimize2
    }
  ];

  const languages = [
    {
      id: 'bilingual',
      label: 'Bilingual (Eng + हिंदी)',
      sub: 'Standard for Indian aspirants'
    },
    {
      id: 'en',
      label: 'English Standard',
      sub: 'Official recruitment terminology'
    },
    {
      id: 'hi',
      label: 'शुद्ध हिंदी (Hindi)',
      sub: 'सरकारी परीक्षा शब्दावली'
    }
  ];

  const accents = [
    { id: 'orange', name: 'Saffron Kesari', color: '#f97316', ring: 'ring-orange-500' },
    { id: 'emerald', name: 'Tiranga Emerald', color: '#10b981', ring: 'ring-emerald-500' },
    { id: 'blue', name: 'Oceanic Blue', color: '#0ea5e9', ring: 'ring-sky-500' },
    { id: 'purple', name: 'Imperial Violet', color: '#a855f7', ring: 'ring-purple-500' },
    { id: 'slate', name: 'Monochrome Slate', color: '#64748b', ring: 'ring-slate-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${accentStyle.bgLight} border ${accentStyle.borderLight} flex items-center justify-center ${accentStyle.text}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {t('format_changer')}
                </h2>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${accentStyle.badge}`}>
                  Live Preview
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('format_changer_sub')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Quick 1-Click Presets */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Popular Presets (त्वरित प्रीसेट्स)</span>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => applyPreset('cards')}
                className="p-2.5 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-orange-500/50 transition-all text-xs"
              >
                <span className="font-bold text-slate-900 dark:text-white block">🎴 Modern Cards</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Default grid + comfortable</span>
              </button>

              <button
                onClick={() => applyPreset('sarkari')}
                className="p-2.5 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-orange-500/50 transition-all text-xs"
              >
                <span className="font-bold text-slate-900 dark:text-white block">📊 Sarkari Table</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Directory tabular matrix</span>
              </button>

              <button
                onClick={() => applyPreset('scanner')}
                className="p-2.5 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-sky-500/50 transition-all text-xs"
              >
                <span className="font-bold text-slate-900 dark:text-white block">⚡ Fast Scanner</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Single-line compact</span>
              </button>

              <button
                onClick={() => applyPreset('timeline')}
                className="p-2.5 text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-500/50 transition-all text-xs"
              >
                <span className="font-bold text-slate-900 dark:text-white block">⏳ Stage Pipeline</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Active vs upcoming</span>
              </button>
            </div>
          </div>

          {/* Section 1: Presentation Layout Format */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                1. Exam Display Format (प्रारूप)
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Active: <span className="text-orange-500 uppercase">{viewFormat}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {viewFormats.map((item) => {
                const Icon = item.icon;
                const isSelected = viewFormat === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setViewFormat(item.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all relative ${
                      isSelected
                        ? `${accentStyle.bgLight} ${accentStyle.border} shadow-sm`
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isSelected ? accentStyle.primary + ' text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-orange-600 dark:text-orange-400 font-medium block">
                        {item.hindi}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 text-orange-500">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Language & Terminology Format */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" />
                <span>2. Language Format (भाषा प्रारूप)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {languages.map((l) => {
                const isSelected = language === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? `${accentStyle.bgLight} ${accentStyle.border}`
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {l.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {l.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Density & Spacing */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                3. Display Density (डेटा घनत्व)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {densities.map((d) => {
                const Icon = d.icon;
                const isSelected = density === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDensity(d.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? `${accentStyle.bgLight} ${accentStyle.border}`
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? accentStyle.primary + ' text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {d.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {d.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Accent Theme Color */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>4. Accent Theme Color (रंग थीम)</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {accentStyle.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {accents.map((acc) => {
                const isSelected = accent === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setAccent(acc.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent ring-2 ' + acc.ring
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: acc.color }}
                    />
                    <span>{acc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Theme Mode (Light White vs Dark Midnight) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                <span>5. Theme Mode (थीम मोड: लाइट / डार्क)</span>
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Active: <span className="text-orange-500 uppercase font-black">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTheme && setTheme('light')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  theme !== 'dark'
                    ? `${accentStyle.bgLight} ${accentStyle.border} shadow-sm`
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  theme !== 'dark' ? 'bg-[#ffe500] text-slate-900 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Light Mode (Flipkart White)
                    </span>
                    {theme !== 'dark' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Clean bright white canvas with royal blue accents
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme && setTheme('dark')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  theme === 'dark'
                    ? `${accentStyle.bgLight} ${accentStyle.border} shadow-sm`
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  theme === 'dark' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Dark Mode (Midnight Dark)
                    </span>
                    {theme === 'dark' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Deep slate aesthetic comfortable for night reading
                  </span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            onClick={resetFormat}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('reset_defaults')}</span>
          </button>

          <button
            onClick={onClose}
            className={`px-5 py-2.5 ${accentStyle.primary} ${accentStyle.primaryHover} text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105`}
          >
            Apply & Close (लागू करें)
          </button>
        </div>
      </div>
    </div>
  );
}
