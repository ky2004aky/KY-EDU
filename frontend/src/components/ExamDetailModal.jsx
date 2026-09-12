import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  Calendar, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Award, 
  IndianRupee, 
  Clock, 
  AlertCircle, 
  BellRing,
  BookOpen,
  Plus,
  Library
} from 'lucide-react';

export default function ExamDetailModal({ exam, onClose, onApplyUpdate, onEditExam }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!exam) return null;

  const elig = exam.eligibility || {};
  const salary = exam.salary || {};
  const dates = exam.importantDates || {};
  const stages = exam.stages || [];
  const updates = exam.updates || [];
  const subjectDetails = exam.subjectDetails || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-3xl flex items-center justify-center p-3 sm:p-6 transition-all duration-300">
      <div className="liquid-glass rounded-[28px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100 border border-white/70 dark:border-white/12 dark:bg-[#07090e]/85 animate-apple-spring relative">
        {/* Specular Top Reflection Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-blue-400/40 to-transparent pointer-events-none" />

        {/* macOS Window Titlebar Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-white/75 dark:bg-[#0c0f17]/90 backdrop-blur-2xl">
          {/* KY EDU Brand Logo */}
          <div className="flex items-center gap-2 select-none shrink-0">
            <span className="text-base font-black italic tracking-wide text-slate-900 dark:text-white drop-shadow-xs">
              KY <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EDU</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-800 dark:text-white tracking-tight truncate max-w-xs sm:max-w-md">
            <Building2 className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
            <span className="truncate">{exam.shortName || exam.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {onApplyUpdate && (
              <button
                onClick={() => onApplyUpdate(exam)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-orange-500/15 hover:bg-orange-500/25 text-orange-600 dark:text-orange-400 border border-orange-500/30 rounded-full text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
                title="Apply Official Notice / Update"
              >
                <BellRing className="w-3 h-3" />
                <span>Apply Notice</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subheader with title and badges */}
        <div className="p-5 sm:p-6 border-b border-black/5 dark:border-white/5 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent dark:from-blue-950/20 dark:via-slate-900/40 dark:to-transparent">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-blue-500/15 text-[#2563eb] dark:text-blue-400 border border-blue-500/30">
              {exam.category}
            </span>
            <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              {exam.status || 'Active'}
            </span>
            {exam.vacancies && (
              <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-white/80 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                {Number(exam.vacancies).toLocaleString('en-IN')} Vacancies
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {exam.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{exam.conductingBody}</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md overflow-x-auto px-4 sm:px-6 py-2 gap-1.5 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Posts', icon: BookOpen },
            { id: 'subjects', label: `Subject Details & Books (${subjectDetails.length || 'Detailed'})`, icon: Library },
            { id: 'eligibility', label: 'Eligibility & Age Limit', icon: CheckCircle2 },
            { id: 'pattern', label: 'Exam Pattern & Stages', icon: FileText },
            { id: 'salary', label: 'Salary & Perks (7th CPC)', icon: IndianRupee },
            { id: 'updates', label: `Notices & Updates (${updates.length})`, icon: BellRing }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-3.5 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content with Spring Entrance */}
        <div key={activeTab} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm animate-apple-spring">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="apple-glass-card p-4 rounded-2xl border border-white/60 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block font-medium">Total Vacancies</span>
                  <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {exam.vacancies ? Number(exam.vacancies).toLocaleString('en-IN') : 'To be notified'}
                  </span>
                </div>

                <div className="apple-glass-card p-4 rounded-2xl border border-white/60 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block font-medium">Education Level</span>
                  <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {elig.educationLevel || 'Graduate'}
                  </span>
                </div>

                <div className="apple-glass-card p-4 rounded-2xl border border-white/60 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block font-medium">Age Bracket</span>
                  <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {elig.minAge || 18} - {elig.maxAge || 32} Yrs
                  </span>
                </div>

                <div className="apple-glass-card p-4 rounded-2xl border border-white/60 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400 text-xs block font-medium">Selection Stages</span>
                  <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {stages.length} Stage{stages.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {exam.posts && exam.posts.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Posts, Cadres & Services Included
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {exam.posts.map((post, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 bg-white/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-[#2874f0] shrink-0" />
                        <span className="font-medium">{post}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Important Exam Calendar
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 bg-white/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-2xs">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Notification Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{dates.notificationDate || 'Gazette Notification'}</span>
                  </div>
                  <div className="p-4 bg-white/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-2xs">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Application Deadline</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400 text-sm mt-0.5 block">{dates.applicationDeadline || 'Check official site'}</span>
                  </div>
                  <div className="p-4 bg-white/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-2xs">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Examination Date</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">{dates.examDate || 'Scheduled Annually'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECT DETAILS & RECOMMENDED BOOKS */}
          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-[#2874f0] dark:text-blue-400 uppercase tracking-wider mb-1">
                  Subject-Wise Weightage, High-Yield Topics & Standard Booklists
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive breakdown of subjects tested, weightage percentage, high-yield chapters, and topper-recommended standard books.
                </p>
              </div>

              {subjectDetails.length === 0 ? (
                <div className="p-8 apple-glass rounded-2xl border border-white/60 dark:border-white/5 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Core subjects include General Studies, Quantitative Aptitude, Reasoning, and Technical fundamentals.
                  </p>
                  <p className="text-xs text-slate-500">
                    Refer to standard NCERT Class 6-12 books and Previous Year Question (PYQ) compilations.
                  </p>
                </div>
              ) : (
                subjectDetails.map((sub, idx) => (
                  <div key={idx} className="p-5 sm:p-6 apple-glass rounded-2xl border border-white/60 dark:border-white/5 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-blue-500/15 text-[#2874f0] dark:text-blue-400 font-black flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <h5 className="font-black text-base text-slate-900 dark:text-white">
                          {sub.subjectName}
                        </h5>
                      </div>
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/10 text-[#2874f0] dark:text-blue-400 border border-blue-500/25">
                        Weightage: {sub.weightage}
                      </span>
                    </div>

                    {/* Key Topics */}
                    {sub.keyTopics && (
                      <div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-2">
                          High-Yield Examination Topics:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sub.keyTopics.map((top, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2874f0] shrink-0" />
                              <span className="font-medium">{top}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Books */}
                    {sub.recommendedBooks && sub.recommendedBooks.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Topper-Recommended Books & Resources:</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {sub.recommendedBooks.map((bk, bIdx) => (
                            <div key={bIdx} className="p-3.5 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-white/5 text-xs shadow-2xs">
                              <span className="font-black text-slate-900 dark:text-white block">{bk.title}</span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">by {bk.author} • <strong className="text-orange-500">{bk.type}</strong></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strategy */}
                    {sub.prepStrategy && (
                      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        <strong>Preparation Strategy:</strong> {sub.prepStrategy}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ELIGIBILITY */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              <div className="p-5 apple-glass rounded-2xl border border-white/60 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-black text-[#2874f0] dark:text-blue-400 uppercase tracking-wider">
                  Educational Qualification & Equivalence
                </h4>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {elig.education || "Bachelor's Degree in any discipline from a recognized University or equivalent (Regular, Distance, NIOS or IGNOU)."}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Stream:</span>
                  <span>{exam.stream || 'Any Stream'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Category-Wise Age Limit & Relaxations (Govt of India Rules)
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-sm">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase text-[11px]">
                      <tr>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Relaxation Years</th>
                        <th className="p-3.5">Effective Max Age</th>
                        <th className="p-3.5">Attempts Policy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 bg-white/70 dark:bg-slate-900/50">
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">General (UR) / EWS</td>
                        <td className="p-3.5 text-slate-500 dark:text-slate-400">0 Years</td>
                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-black">{elig.maxAge || 32} Years</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">Standard Category Attempts</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">OBC (Non-Creamy Layer)</td>
                        <td className="p-3.5 text-amber-600 dark:text-amber-400 font-black">+3 Years</td>
                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-black">{(elig.maxAge || 32) + 3} Years</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">Relaxed Attempts</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">SC / ST</td>
                        <td className="p-3.5 text-amber-600 dark:text-amber-400 font-black">+5 Years</td>
                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-black">{(elig.maxAge || 32) + 5} Years</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">Unlimited till age ceiling</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">PwD (Divyangjan)</td>
                        <td className="p-3.5 text-amber-600 dark:text-amber-400 font-black">+10 Years</td>
                        <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-black">{(elig.maxAge || 32) + 10} Years</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">Relaxed as per reservation</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {elig.attempts && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-800 dark:text-amber-300">
                  <strong>Attempts Policy:</strong> {elig.attempts}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PATTERN */}
          {activeTab === 'pattern' && (
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Stages of Selection & Examination Pattern
              </h4>
              {stages.map((stg, idx) => (
                <div key={idx} className="p-4 sm:p-5 apple-glass rounded-2xl border border-white/60 dark:border-white/5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-black text-base text-[#2874f0] dark:text-blue-400">{stg.stage}</span>
                    <span className="px-3 py-0.5 text-xs rounded-full bg-slate-200/80 dark:bg-slate-700/80 text-slate-800 dark:text-slate-300 font-bold">
                      {stg.type}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                    <strong>Marks Scheme:</strong> {stg.marks}
                  </p>
                  {stg.negativeMarking && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                      <strong>Negative Marking:</strong> {stg.negativeMarking}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SALARY & PERKS */}
          {activeTab === 'salary' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-transparent border border-emerald-500/30 rounded-3xl backdrop-blur-md">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  7th Central Pay Commission Pay Matrix
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {salary.payScale || 'Level 10 (₹56,100 - ₹1,77,500)'}
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-2 font-bold">
                  Estimated In-Hand: {salary.inHandEstimate || '₹70,000 - ₹95,000 / month'}
                </div>
              </div>

              {salary.perks && salary.perks.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Allowances & Government Perks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {salary.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3.5 bg-white/70 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 shadow-2xs">
                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: NOTICES */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Official Notice Timeline
                </h4>
                {onApplyUpdate && (
                  <button
                    onClick={() => onApplyUpdate(exam)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fb641b] hover:bg-[#e05615] text-white font-bold text-xs rounded-full shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post New Notice</span>
                  </button>
                )}
              </div>

              {updates.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No previous update logs recorded.
                </div>
              ) : (
                updates.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 sm:p-5 apple-glass rounded-2xl border border-white/60 dark:border-white/5 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-slate-800 dark:text-slate-200 text-sm">{item.title}</span>
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-bold">{item.date}</span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2874f0] dark:text-blue-400 hover:underline pt-1 font-bold"
                      >
                        <span>View Official Notice Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer actions with Apple Squircle buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onEditExam && (
              <button
                onClick={() => onEditExam(exam)}
                className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/5 rounded-full text-xs sm:text-sm font-semibold active:scale-95 transition-all cursor-pointer"
              >
                Edit Exam Specs (Admin)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {exam.officialWebsite && (
              <a
                href={exam.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
              >
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {exam.applyLink && (
              <a
                href={exam.applyLink}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-gradient-to-r from-[#fb641b] to-orange-500 hover:from-[#e05615] hover:to-orange-600 text-white rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/25 active:scale-95 transition-all"
              >
                <span>Apply Online Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
