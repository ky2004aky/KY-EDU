import React from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  ExternalLink, 
  Eye, 
  BellRing, 
  BookOpen, 
  CheckCircle,
  IndianRupee,
  Clock
} from 'lucide-react';
import { useUIFormat } from '../context/UIFormatContext';

export default function ExamTableView({ 
  exams = [], 
  onSelectExam, 
  onQuickUpdate,
  adminUser 
}) {
  const { density, accentStyle, t } = useUIFormat();
  const isCompact = density === 'compact';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Admit Card Out':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Exam Ongoing':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Upcoming':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  if (exams.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No government examinations match the selected filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="apple-glass rounded-3xl border border-white/60 dark:border-white/10 shadow-sm overflow-hidden transition-colors relative">
      {/* Specular reflection line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className={`px-4 sm:px-6 ${isCompact ? 'py-2.5' : 'py-3.5'}`}>Recruitment & Body</th>
              <th className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-3.5'}`}>Category / Stream</th>
              <th className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-3.5'}`}>{t('vacancies')}</th>
              <th className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-3.5'}`}>{t('age_limit')} & Eligibility</th>
              <th className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-3.5'}`}>{t('salary_scale')}</th>
              <th className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-3.5'}`}>{t('status')}</th>
              <th className={`px-4 sm:px-6 ${isCompact ? 'py-2.5' : 'py-3.5'} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {exams.map((exam, idx) => {
              const latestUpdate = exam.updates && exam.updates.length > 0 ? exam.updates[exam.updates.length - 1] : null;

              return (
                <tr 
                  key={exam._id || idx}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectExam(exam)}
                >
                  {/* Recruitment & Body */}
                  <td className={`px-4 sm:px-6 ${isCompact ? 'py-2.5' : 'py-4'}`}>
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                            {exam.title}
                          </span>
                          {exam.shortName && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                              {exam.shortName}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {exam.conductingBody}
                        </span>

                        {latestUpdate && (
                          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            <BellRing className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[200px]">{latestUpdate.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category / Stream */}
                  <td className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-4'} whitespace-nowrap`}>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                      {exam.category || 'Central Govt'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {exam.stream || 'Any Stream'}
                    </span>
                  </td>

                  {/* Vacancies */}
                  <td className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-4'} whitespace-nowrap`}>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white">
                      <Users className="w-3.5 h-3.5 text-orange-500" />
                      <span>{Number(exam.vacancies).toLocaleString('en-IN')}</span>
                    </div>
                  </td>

                  {/* Age & Eligibility */}
                  <td className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-4'}`}>
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {exam.eligibility?.minAge || 18} - {exam.eligibility?.maxAge || 32} Yrs
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {exam.eligibility?.educationLevel || 'Graduate'} ({exam.eligibility?.education || 'Recognized Univ'})
                      </span>
                    </div>
                  </td>

                  {/* Salary Scale */}
                  <td className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-4'} whitespace-nowrap`}>
                    <div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-xs">
                        {exam.salary?.payLevel || 'Level 7'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {exam.salary?.payScale || '7th CPC Matrix'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className={`px-3 sm:px-4 ${isCompact ? 'py-2.5' : 'py-4'} whitespace-nowrap`}>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(exam.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      <span>{exam.status || 'Active'}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td 
                    className={`px-4 sm:px-6 ${isCompact ? 'py-2.5' : 'py-4'} text-right whitespace-nowrap`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectExam(exam)}
                        className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-600 dark:text-orange-400 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1 border border-orange-500/30"
                        title="View Details & Subject Books"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Details & Books</span>
                      </button>

                      {adminUser && onQuickUpdate && (
                        <button
                          onClick={() => onQuickUpdate(exam)}
                          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                          title="Apply Circular Update"
                        >
                          <BellRing className="w-3.5 h-3.5 text-amber-500" />
                          <span className="hidden sm:inline">Update</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
