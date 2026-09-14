import React from 'react';
import { 
  Building2, 
  Users, 
  ChevronRight, 
  BookOpen, 
  BellRing
} from 'lucide-react';
import { useUIFormat } from '../context/UIFormatContext';

export default function ExamCompactListView({ 
  exams = [], 
  onSelectExam, 
  onQuickUpdate,
  adminUser 
}) {
  const { density } = useUIFormat();
  const isCompact = density === 'compact';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Admit Card Out':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Exam Ongoing':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Upcoming':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  if (exams.length === 0) {
    return (
      <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No government recruitments found matching filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {exams.map((exam, idx) => {
        const latestUpdate = exam.updates && exam.updates.length > 0 ? exam.updates[exam.updates.length - 1] : null;

        return (
          <div
            key={exam._id || idx}
            onClick={() => onSelectExam(exam)}
            className={`group apple-glass-card rounded-2xl ${
              isCompact ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'
            } flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer`}
          >
            {/* Left Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-orange-500 transition-colors">
                    {exam.title}
                  </h3>
                  {exam.shortName && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {exam.shortName}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadge(exam.status)}`}>
                    {exam.status || 'Active'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{exam.conductingBody}</span>
                  <span>•</span>
                  <span>{exam.eligibility?.educationLevel || 'Graduate'}</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{exam.salary?.payLevel || 'Level 7'}</span>
                  
                  {latestUpdate && (
                    <>
                      <span>•</span>
                      <span className="text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-1">
                        <BellRing className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[160px]">{latestUpdate.title}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Quick Badges & Action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Users className="w-3 h-3 text-orange-500" />
                  <span>{Number(exam.vacancies).toLocaleString('en-IN')} Posts</span>
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold hidden md:block">
                  {exam.salary?.inHandEstimate?.split('+')[0] || '₹60,000+ /mo'}
                </div>
              </div>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onSelectExam(exam)}
                  className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-600 dark:text-orange-400 hover:text-slate-950 transition-all font-bold text-xs flex items-center gap-1 border border-orange-500/30"
                  title="View Exam Details"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Books</span>
                </button>

                {adminUser && onQuickUpdate && (
                  <button
                    onClick={() => onQuickUpdate(exam)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-500/20 text-slate-500 hover:text-orange-500 transition-all border border-slate-200 dark:border-slate-700"
                    title="Post Notice Update"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
