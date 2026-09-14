import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';

export default function EligibilityCalculator({ onSelectExam }) {
  const [age, setAge] = useState(22);
  const [educationLevel, setEducationLevel] = useState('B.Tech / B.E (Engineering Degree)');
  const [stream, setStream] = useState('Engineering / Technology');
  const [category, setCategory] = useState('General');
  const [degreeStatus, setDegreeStatus] = useState('completed'); // 'completed' | 'appearing'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filterOnlyEligible, setFilterOnlyEligible] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState(null);

  const calculate = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.checkEligibility({
        age: Number(age),
        educationLevel,
        stream,
        category,
        isAppearing: degreeStatus === 'appearing'
      });
      if (res.success) {
        setResults(res.results || []);
      }
    } catch (err) {
      console.warn('Eligibility check notice:', err.message);
    } finally {
      setLoading(false);
    }
  }, [age, educationLevel, stream, category, degreeStatus]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const displayedResults = filterOnlyEligible 
    ? results.filter((r) => r.isEligible)
    : results;

  const eligibleCount = results.filter((r) => r.isEligible).length;

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls Container */}
      <div className="apple-glass rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm border border-white/60 dark:border-white/10 transition-colors">
        <div className="max-w-3xl mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-[#2874f0] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2.5 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Eligibility & Education Diagnostic</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Find Every Indian Government Exam You Are Legally Eligible For
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Input your current age, degree level, stream, and category reservation to compute age relaxations (OBC +3, SC/ST +5, PwD +10) and qualifying exams with deep educational criteria.
          </p>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Age Input */}
          <div className="apple-glass rounded-2xl p-4 border border-white/60 dark:border-white/5 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Your Age:
              </label>
              <span className="text-sm font-black text-[#2874f0] dark:text-blue-400">
                {age} Years
              </span>
            </div>
            <input
              type="range"
              min="16"
              max="42"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2874f0]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
              <span>16 Yrs</span>
              <span>28 Yrs</span>
              <span>42 Yrs</span>
            </div>
          </div>

          {/* 2. Highest Educational Qualification */}
          <div className="apple-glass rounded-2xl p-4 border border-white/60 dark:border-white/5 shadow-2xs">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              Qualification (Std / Degree) *
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 rounded-full text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 shadow-xs cursor-pointer"
            >
              <option value="10th Pass (Matriculation)">10th Pass (Matriculation / Secondary)</option>
              <option value="12th Science (PCM)">12th Science (PCM - Physics, Chem, Maths)</option>
              <option value="12th Science (PCB)">12th Science (PCB - Physics, Chem, Bio)</option>
              <option value="12th Commerce">12th Commerce (Accounts & Economics)</option>
              <option value="12th Arts / Humanities">12th Arts / Humanities</option>
              <option value="12th Pass (General / Any Stream)">12th Pass (General / Any Stream)</option>
              <option value="ITI Trades (Fitter / Electrician / Welder)">ITI Trades (Fitter / Electrician / Welder)</option>
              <option value="Polytechnic Diploma">Polytechnic Diploma (3-Year Technical)</option>
              <option value="B.Tech / B.E (Engineering Degree)">B.Tech / B.E (Engineering Degree)</option>
              <option value="B.Sc Agriculture / Allied">B.Sc Agriculture / Allied Sciences</option>
              <option value="Medical / B.Sc Nursing / GNM">Medical / B.Sc Nursing / GNM</option>
              <option value="Law Degree (LL.B)">Law Degree (LL.B / B.A. LL.B)</option>
              <option value="General Graduate (B.A / B.Com / B.Sc)">General Graduate (B.A / B.Com / B.Sc)</option>
              <option value="Post Graduate (Master's / M.Tech / MBA)">Post Graduate (Master's / MBA)</option>
            </select>
          </div>

          {/* 3. Academic Stream / Department */}
          <div className="apple-glass rounded-2xl p-4 border border-white/60 dark:border-white/5 shadow-2xs">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              Stream / Department *
            </label>
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 rounded-full text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 shadow-xs cursor-pointer"
            >
              <option value="Any">Any Stream / Open to All</option>
              <option value="Engineering / Technology">Engineering / Technology</option>
              <option value="Science (PCM)">Science (PCM - Physics, Maths)</option>
              <option value="Science (PCB)">Science (PCB - Medical / Bio)</option>
              <option value="Commerce & Finance">Commerce, Accounts & Banking</option>
              <option value="Arts & Humanities">Arts, Humanities & Civil Studies</option>
              <option value="Agriculture & Horticulture">Agriculture & Rural Development</option>
              <option value="Law & Legal Studies">Law & Judicial Studies</option>
              <option value="Medical & Nursing">Medical, Nursing & Healthcare</option>
              <option value="Vocational / ITI Trades">Vocational & Craftsman Trades</option>
            </select>
          </div>

          {/* 4. Reservation Category (Age Relaxation) */}
          <div className="apple-glass rounded-2xl p-4 border border-white/60 dark:border-white/5 shadow-2xs">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 rounded-full text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 shadow-xs cursor-pointer"
            >
              <option value="General">General (UR) / EWS (No Age Relax)</option>
              <option value="OBC">OBC - Non Creamy (+3 Yrs)</option>
              <option value="SC">SC - Scheduled Caste (+5 Yrs)</option>
              <option value="ST">ST - Scheduled Tribe (+5 Yrs)</option>
              <option value="PwD">PwD - General/EWS (+10 Yrs)</option>
              <option value="PwD (OBC)">PwD + OBC (+13 Yrs)</option>
              <option value="PwD (SC/ST)">PwD + SC/ST (+15 Yrs)</option>
              <option value="Ex-Servicemen">Ex-Servicemen (+5 Yrs)</option>
            </select>
          </div>
        </div>

        {/* Secondary Education Filters */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/50 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Degree Status:</span>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="degreeStatus"
                value="completed"
                checked={degreeStatus === 'completed'}
                onChange={() => setDegreeStatus('completed')}
                className="text-[#2874f0]"
              />
              <span className="text-slate-800 dark:text-slate-200 font-medium">Completed</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="degreeStatus"
                value="appearing"
                checked={degreeStatus === 'appearing'}
                onChange={() => setDegreeStatus('appearing')}
                className="text-[#2874f0]"
              />
              <span className="text-slate-800 dark:text-slate-200 font-medium">Final Year / Appearing</span>
            </label>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Marks Criteria:</span>
            <select
              value={minMarks}
              onChange={(e) => setMinMarks(e.target.value)}
              className="px-3 py-1.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
            >
              <option value="pass">Passing Marks (No Cut-off)</option>
              <option value="50">50%+ in Aggregate</option>
              <option value="55">55%+ in Aggregate</option>
              <option value="60">60%+ (First Division)</option>
            </select>
          </div>
        </div>

        {/* Results Overview Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/50 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-full font-black text-xs flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{eligibleCount} Recruitments Fully Eligible</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              out of {results.length} total government examinations evaluated
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="filterEligibleCheck"
              checked={filterOnlyEligible}
              onChange={(e) => setFilterOnlyEligible(e.target.checked)}
              className="w-4 h-4 rounded text-[#2874f0] border-slate-300 focus:ring-[#2874f0]"
            />
            <label htmlFor="filterEligibleCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Show only 100% Eligible Recruitments
            </label>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          Computing age relaxations, educational specifications, and reservation matrices...
        </div>
      ) : displayedResults.length === 0 ? (
        <div className="text-center py-16 apple-glass rounded-3xl border border-white/60 dark:border-white/10 p-8">
          <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-900 dark:text-white">No Matching Recruitments Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            Try adjusting your age or educational qualification to view alternative central and state recruitment opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedResults.map((item) => {
            const { 
              exam, 
              isEligible, 
              matchScore, 
              ageCriteria = {}, 
              eduCriteria = {} 
            } = item;
            
            const isExpanded = expandedExamId === exam._id;

            return (
              <div
                key={exam._id}
                className={`apple-glass-card rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
                  isEligible
                    ? 'border-white/60 dark:border-white/10'
                    : 'border-white/40 dark:border-white/5 opacity-85'
                }`}
              >
                {/* Specular reflection line */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

                <div className="p-5 space-y-3.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 shadow-2xs">
                      {exam.category}
                    </span>

                    {isEligible ? (
                      <span className="px-2.5 py-0.5 text-[11px] font-black rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Eligible ({matchScore}%)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1 shadow-2xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>Criteria Gap ({matchScore}%)</span>
                      </span>
                    )}
                  </div>

                  {/* Exam Title & Authority */}
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {exam.conductingBody} {exam.shortName && <span className="text-[#2874f0] font-bold">({exam.shortName})</span>}
                    </p>
                  </div>

                  {/* Educational Details Box */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/40 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/60 dark:border-white/5 space-y-2 text-xs">
                    
                    {/* Education Verdict */}
                    <div className="flex items-start gap-1.5">
                      <GraduationCap className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${eduCriteria.isEduEligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`} />
                      <div>
                        <span className="font-bold text-[11px] block text-slate-800 dark:text-slate-200">
                          Education Requirement:
                        </span>
                        <p className={`text-[11px] font-semibold ${eduCriteria.isEduEligible ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {eduCriteria.verdict || (eduCriteria.isEduEligible ? 'Qualification Met' : 'Requires Graduate')}
                        </p>
                      </div>
                    </div>

                    {/* Minimum Official Degree */}
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Minimum Credential: </span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {exam.eligibility?.educationLevel || 'Graduate in any discipline'}
                      </span>
                    </div>

                    {/* Age Evaluation */}
                    <div className="flex items-center justify-between text-[11px] border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Max Age ({category}):</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {ageCriteria.effectiveMaxAge || item.effectiveMaxAge || 32} Yrs 
                        {ageCriteria.relaxationYears > 0 && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-1">(+{ageCriteria.relaxationYears}y relax)</span>
                        )}
                      </span>
                    </div>

                    {/* In-Hand Pay Scale */}
                    <div className="flex items-center justify-between text-[11px] border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">
                      <span className="text-slate-500 dark:text-slate-400">7th CPC Pay Scale:</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {exam.salary?.inHandSalary ? `₹${Number(exam.salary.inHandSalary).toLocaleString('en-IN')}/mo` : (exam.salary?.payScale || 'Level 7')}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Accordion */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedExamId(isExpanded ? null : exam._id)}
                      className="w-full text-[11px] text-[#2874f0] dark:text-blue-400 hover:underline font-bold flex items-center justify-between py-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Education Details' : 'View Full Education Criteria & Equivalents'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3.5 bg-blue-50/60 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700 text-[11px] space-y-2 animate-apple-spring">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                            Official Education Specification:
                          </span>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {exam.eligibility?.education || 'Graduation in any discipline from a recognized University.'}
                          </p>
                        </div>

                        {eduCriteria.acceptedQualifications && eduCriteria.acceptedQualifications.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                              Recognized Degrees & Equivalent Pathways:
                            </span>
                            <ul className="space-y-1 pl-3 list-disc text-slate-600 dark:text-slate-300">
                              {eduCriteria.acceptedQualifications.map((q, idx) => (
                                <li key={idx}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-100 dark:border-slate-700 text-[10px]">
                          <div>
                            <span className="text-slate-500 block">Distance / Open School:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">100% Recognized (IGNOU/NIOS)</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Marks Cut-Off:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">Passing Marks</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-white/40 dark:bg-slate-900/40 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs backdrop-blur-xs">
                  <span className="text-slate-500 text-[11px]">
                    Posts: <strong className="text-slate-800 dark:text-slate-200 font-black">{exam.vacancies ? Number(exam.vacancies).toLocaleString('en-IN') : 'TBA'}</strong>
                  </span>

                  <button
                    onClick={() => onSelectExam(exam)}
                    className="flex items-center gap-1 font-bold text-[#2874f0] dark:text-blue-400 hover:underline active:scale-95 transition-transform cursor-pointer"
                  >
                    <span>Syllabus & Books</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
