import React from 'react';
import { 
  GitCommit, 
  Calendar, 
  Users, 
  ArrowUpRight, 
  BellRing, 
  BookOpen, 
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useUIFormat } from '../context/UIFormatContext';

export default function ExamTimelineView({ 
  exams = [], 
  onSelectExam, 
  onQuickUpdate,
  adminUser 
}) {
  const { accentStyle, t } = useUIFormat();

  const stages = [
    {
      id: 'Active',
      title: 'Active Applications',
      hindi: 'ऑनलाइन आवेदन चालू',
      color: 'border-emerald-500/40 bg-emerald-500/5',
      badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-500'
    },
    {
      id: 'Admit Card Out',
      title: 'Admit Cards Released',
      hindi: 'प्रवेश पत्र जारी',
      color: 'border-amber-500/40 bg-amber-500/5',
      badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500'
    },
    {
      id: 'Exam Ongoing',
      title: 'Exam Ongoing / Results',
      hindi: 'परीक्षा प्रक्रिया जारी',
      color: 'border-blue-500/40 bg-blue-500/5',
      badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      dot: 'bg-blue-500'
    },
    {
      id: 'Upcoming',
      title: 'Upcoming Notifications',
      hindi: 'आगामी भर्ती कैलेंडर',
      color: 'border-purple-500/40 bg-purple-500/5',
      badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      dot: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
      {stages.map((stage) => {
        const stageExams = exams.filter((e) => {
          if (stage.id === 'Upcoming') {
            return e.status === 'Upcoming' || e.status === 'Closed';
          }
          return e.status === stage.id;
        });

        return (
          <div 
            key={stage.id} 
            className={`apple-glass rounded-3xl border ${stage.color} p-4 sm:p-5 flex flex-col gap-3 min-h-[400px] transition-colors relative overflow-hidden`}
          >
            {/* Specular reflection line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stage.dot} animate-pulse`} />
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {stage.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                    {stage.hindi}
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 text-xs font-black rounded-full border ${stage.badge}`}>
                {stageExams.length}
              </span>
            </div>

            {/* Stage Exam Cards */}
            <div className="space-y-3 flex-1">
              {stageExams.length === 0 ? (
                <div className="p-6 text-center text-slate-400 dark:text-slate-600 text-xs italic">
                  No exams in this stage currently.
                </div>
              ) : (
                stageExams.map((exam) => {
                  const latestUpdate = exam.updates && exam.updates.length > 0 ? exam.updates[exam.updates.length - 1] : null;

                  return (
                    <div
                      key={exam._id}
                      onClick={() => onSelectExam(exam)}
                      className="group apple-glass-card rounded-2xl p-4 transition-all cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                            {exam.conductingBody}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug">
                            {exam.title}
                          </h4>
                        </div>
                        {exam.shortName && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                            {exam.shortName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Users className="w-3 h-3 text-orange-500" />
                          <span>{Number(exam.vacancies).toLocaleString('en-IN')} Posts</span>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {exam.salary?.payLevel || 'Level 7'}
                        </span>
                      </div>

                      {latestUpdate && (
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                          <BellRing className="w-3 h-3 shrink-0" />
                          <span className="truncate">{latestUpdate.title}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectExam(exam)}
                          className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Details & Books</span>
                        </button>

                        {adminUser && onQuickUpdate && (
                          <button
                            onClick={() => onQuickUpdate(exam)}
                            className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                            title="Apply Update"
                          >
                            <BellRing className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
