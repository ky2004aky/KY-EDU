import React, { useState } from 'react';
import { Compass, Search, BookOpen, Sparkles } from 'lucide-react';
import CareerCard from '../components/CareerCard';
import { useUIFormat } from '../context/UIFormatContext';

export default function CareerScopesPage({ careers = [], onNavigateToExam }) {
  const { viewFormat, setIsFormatModalOpen, t } = useUIFormat();
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState('All');

  const streams = React.useMemo(() => {
    const list = Array.from(new Set(careers.map((c) => c.stream).filter(Boolean)));
    return ['All', ...list];
  }, [careers]);

  const filteredCareers = careers.filter((c) => {
    if (selectedStream !== 'All' && c.stream !== selectedStream) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = c.title?.toLowerCase().includes(q);
      const matchOverview = c.overview?.toLowerCase().includes(q);
      const matchRoles = c.topRoles?.some((r) => r.toLowerCase().includes(q));
      if (!matchTitle && !matchOverview && !matchRoles) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Educational Trajectories & Industry Roadmaps</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t('nav_careers')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Detailed step-by-step career pathways, top entrance exams, salary projections, and corresponding government exam avenues.
          </p>
        </div>

        <button
          onClick={() => setIsFormatModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
          title="Open UI Format Changer"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>UI Format:</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase">
            {viewFormat}
          </span>
        </button>
      </div>

      {/* Search & Stream Filter Bar */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-sm dark:shadow-xl transition-colors">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pathways (e.g. ITI, Polytechnic, Agriculture, Medicine, Law, Civil Services, Engineering)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Stream Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mr-1 shrink-0">Stream:</span>
          {streams.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStream(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStream === st
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Career Cards */}
      {filteredCareers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Career Pathways Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try selecting 'All' streams or clearing your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <CareerCard
              key={career._id}
              career={career}
              onSelectGovtExam={onNavigateToExam}
            />
          ))}
        </div>
      )}
    </div>
  );
}
