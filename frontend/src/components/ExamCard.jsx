import React from 'react';
import { 
  BellRing,
  Star,
  ChevronRight
} from 'lucide-react';

export default function ExamCard({ exam, onSelect, onQuickUpdate }) {
  const formattedVacancies = exam.vacancies 
    ? Number(exam.vacancies).toLocaleString('en-IN') 
    : 'Active';

  const latestUpdate = exam.updates && exam.updates.length > 0 
    ? exam.updates[exam.updates.length - 1] 
    : null;

  return (
    <div 
      onClick={() => onSelect(exam)}
      className="group apple-glass-card liquid-shimmer gpu-smooth rounded-[22px] p-4 sm:p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden active-spring"
    >
      {/* Specular Top Reflection Line */}
      <div className="liquid-specular-top" />

      <div>
        {/* Top Header: Conducting Body & Apple-Style Status Pill */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
              {exam.conductingBody || 'Central Govt'}
            </span>
            {exam.shortName && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200/60 dark:border-white/5">
                {exam.shortName}
              </span>
            )}
          </div>

          {/* Status Pill */}
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#388e3c] text-white text-[10.5px] font-bold shrink-0 shadow-xs">
            <span>{exam.status === 'Active' ? 'Active' : exam.status || 'Verified'}</span>
            <Star className="w-2.5 h-2.5 fill-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-[#2874f0] transition-colors duration-250 line-clamp-2 leading-snug mb-2">
          {exam.title}
        </h3>

        {/* Academic Stream / Field Badge */}
        {exam.stream && (
          <div className="mb-2.5">
            <span className="inline-flex items-center px-2.5 py-0.5 text-[10.5px] font-bold bg-blue-50/80 dark:bg-blue-950/40 text-[#2874f0] dark:text-blue-400 rounded-full border border-blue-200/60 dark:border-blue-900/40 line-clamp-1">
              {exam.stream}
            </span>
          </div>
        )}

        {/* Vacancies and Qualification Meta */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {formattedVacancies} Vacancies
          </span>
          <span>•</span>
          <span>{exam.eligibility?.educationLevel || 'Graduate'}</span>
          <span>•</span>
          <span>Age {exam.eligibility?.minAge || 18}-{exam.eligibility?.maxAge || 32} Yrs</span>
        </div>

        {/* Apple-Frosted Salary Box */}
        <div className="flex items-baseline justify-between mb-3 bg-slate-50/70 dark:bg-slate-800/40 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {exam.salary?.payScale ? exam.salary.payScale.split('-')[0].trim() : '₹56,100'}
            </span>
            <span className="text-xs text-[#388e3c] font-bold">
              {exam.salary?.payLevel || '7th CPC Level 7'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
            7th CPC Pay
          </span>
        </div>

        {/* Live Circular Alert Pill */}
        {latestUpdate && (
          <div className="p-2.5 mb-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 shadow-2xs">
            <BellRing className="w-3 h-3 text-orange-500 shrink-0 animate-pulse" />
            <span className="truncate font-medium">{latestUpdate.title}</span>
          </div>
        )}
      </div>

      {/* Action Buttons with Spring Micro-bounce */}
      <div className="pt-2 border-t border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onSelect(exam)}
            className="flex-1 py-2 sm:py-2.5 px-3 bg-[#fb641b] hover:bg-[#e05615] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 active:scale-[0.97] transition-all uppercase tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Details & Books</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-80" />
          </button>

          {onQuickUpdate && (
            <button
              onClick={() => onQuickUpdate(exam)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 text-slate-600 dark:text-slate-300 active:scale-95 transition-all cursor-pointer border border-slate-200/60 dark:border-white/5"
              title="Post Notice Update"
            >
              <BellRing className="w-3.5 h-3.5 text-[#fb641b]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
