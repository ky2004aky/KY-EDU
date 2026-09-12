import React, { useState } from 'react';
import { 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  IndianRupee, 
  ArrowRight,
  Landmark,
  GraduationCap
} from 'lucide-react';

export default function CareerCard({ career, onSelectGovtExam }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="apple-glass-card liquid-shimmer rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden border border-white/60 dark:border-white/10">
      {/* Specular Top Reflection Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

      <div>
        {/* Stream Tag & Outlook */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/50 dark:border-white/5">
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            {career.stream}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" />
            <span>{career.growthOutlook || 'High Growth'}</span>
          </span>
        </div>

        {/* Title & Overview */}
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug mb-2">
          {career.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3.5">
          {career.overview}
        </p>

        {/* Remuneration & Entrance metrics */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
            <IndianRupee className="w-3 h-3" />
            <span>{career.averageStartingSalary}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/80 dark:border-white/10 truncate max-w-[210px] shadow-2xs">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            <span>{career.keyEntranceExams?.slice(0, 2).join(', ') || 'Direct / CUET'}</span>
          </span>
        </div>

        {/* Related Govt Exams */}
        {career.relatedGovtExams && career.relatedGovtExams.length > 0 && (
          <div className="space-y-1.5 mb-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sarkari Exam Scopes:</span>
            <div className="flex flex-wrap gap-1.5">
              {career.relatedGovtExams.map((exName, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectGovtExam && onSelectGovtExam(exName)}
                  className="text-[11px] font-bold bg-white/80 dark:bg-slate-800/80 hover:bg-[#2874f0] hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 px-3 py-1 rounded-full active:scale-95 transition-all shadow-2xs cursor-pointer"
                >
                  {exName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Step-by-Step Roadmap */}
        {expanded && career.roadmapSteps && (
          <div className="pt-3 border-t border-slate-200/50 dark:border-white/5 space-y-2.5 mt-2 animate-apple-spring">
            <h4 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Step-by-Step Career Trajectory
            </h4>
            <div className="space-y-2.5 pl-3 border-l-2 border-indigo-500/40">
              {career.roadmapSteps.map((st) => (
                <div key={st.step} className="pl-1 text-xs">
                  <span className="font-black text-slate-900 dark:text-white block text-[11px]">
                    Step {st.step}: {st.title}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                    {st.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toggle roadmap button */}
      <div className="pt-3 border-t border-slate-200/50 dark:border-white/5 mt-3 flex items-center justify-between text-xs">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 font-bold text-[#2874f0] dark:text-blue-400 hover:underline active:scale-95 transition-transform cursor-pointer"
        >
          <span>{expanded ? 'Hide Roadmap' : 'View Step Roadmap'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
