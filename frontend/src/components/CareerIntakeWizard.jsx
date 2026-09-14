import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  X,
  Check
} from 'lucide-react';

export default function CareerIntakeWizard({ 
  isOpen = true,
  onClose,
  isModal = false,
  _onSelectExam, 
  onNavigateToExams 
}) {
  const [step, setStep] = useState(1);
  const [eduBackground, setEduBackground] = useState('12th Science (PCM)');
  const [ambition, setAmbition] = useState('civil_services');
  const [recommendation, setRecommendation] = useState(null);

  if (isModal && !isOpen) return null;

  const eduOptions = [
    { id: '10th', label: '10th Pass (Matriculation)', category: 'School' },
    { id: '12th Science (PCM)', label: '12th Science (PCM)', category: 'School' },
    { id: '12th Science (PCB)', label: '12th Science (PCB)', category: 'School' },
    { id: '12th Commerce', label: '12th Commerce / Arts', category: 'School' },
    { id: 'ITI Trades', label: 'ITI Trades (Fitter / Electrician)', category: 'Technical' },
    { id: 'Polytechnic Diploma', label: 'Polytechnic Diploma (Engg)', category: 'Technical' },
    { id: 'B.Tech / B.E', label: 'B.Tech / B.E (Engineering)', category: 'Technical' },
    { id: 'B.Sc Agriculture', label: 'B.Sc Agriculture / Allied', category: 'Specialized' },
    { id: 'Medical / Nursing', label: 'Medical / Nursing / Pharma', category: 'Specialized' },
    { id: 'Law (LL.B)', label: 'Law Degree (LL.B)', category: 'Specialized' },
    { id: 'Any Graduate', label: 'Any Graduate (B.A / B.Com / B.Sc / Distance)', category: 'Graduation' },
  ];

  const ambitionOptions = [
    { id: 'civil_services', icon: '🏛️', label: 'Civil & Administrative Services', desc: 'IAS, IPS, State SDM, Ministry officers' },
    { id: 'defense', icon: '🛡️', label: 'Defense & Uniformed Services', desc: 'Commissioned Officer in Army, Navy, Air Force' },
    { id: 'railways_tech', icon: '🚂', label: 'Railways & Technical Specialist', desc: 'Loco Pilot, Junior Engineer, Technical cadres' },
    { id: 'banking_finance', icon: '🏦', label: 'Banking & Financial Services', desc: 'Bank PO, RBI Grade B, Public sector finance' },
    { id: 'tech_engg', icon: '💻', label: 'PSU Engineering & Research', desc: 'ISRO, DRDO, IOCL, NTPC Maharatnas' },
    { id: 'judiciary', icon: '⚖️', label: 'Judiciary & Legal Prosecution', desc: 'Civil Judge (PCS-J), Public Prosecutor' },
    { id: 'medical_healthcare', icon: '🏥', label: 'Central Healthcare & Nursing', desc: 'AIIMS Nursing Officer, Medical Services' },
    { id: 'agriculture', icon: '🌾', label: 'Agriculture & Rural Banking', desc: 'IBPS Agriculture Field Officer, NABARD' },
  ];

  const generateRecommendation = () => {
    let rec = {
      title: 'Civil Services & Central Administrative Leadership',
      fitScore: '96% Fit',
      rationale: 'Based on your background and governance ambition, your highest return path is structured Civil Services & Central SSC preparation.',
      topExams: ['UPSC Civil Services Examination (CSE)', 'SSC Combined Graduate Level Examination (CGL)'],
      startingSalary: '₹75,000 - ₹1,20,000 / month',
      fiveYearSalary: '₹1,50,000 - ₹2,20,000 / month',
      immediateSteps: [
        'Complete NCERT Foundation Class 6 to 12 in History, Geography, and Polity.',
        'Read M. Laxmikanth (Indian Polity) and Daily Editorials.',
        'Solve 5 years of previous year prelims question papers.'
      ],
      primarySubjectFocus: 'Indian Polity (M. Laxmikanth) & Modern History (Spectrum)'
    };

    if (ambition === 'defense') {
      rec = {
        title: 'Armed Forces Commissioned Officer (Army / Navy / Air Force)',
        fitScore: '94% Fit',
        rationale: 'Your ambition for defense leadership is best served through direct officer entry schemes.',
        topExams: ['UPSC Combined Defence Services Examination (CDS)', 'Railway Assistant Loco Pilot & Technician (RRB ALP / Tech)'],
        startingSalary: '₹95,000 - ₹1,25,000 / month + CSD & Housing',
        fiveYearSalary: '₹1,40,000 - ₹1,80,000 / month',
        immediateSteps: [
          'Master Mathematics and General English fundamentals.',
          'Start daily 5km running and endurance physical conditioning.',
          'Read current affairs monthly roundups for SSB interview.'
        ],
        primarySubjectFocus: 'General English & Mathematics (Pathfinder Series)'
      };
    } else if (ambition === 'railways_tech' || eduBackground.includes('ITI') || eduBackground.includes('Diploma')) {
      rec = {
        title: 'Indian Railways Technical & Operational Cadre',
        fitScore: '98% Fit',
        rationale: 'Your technical credential gives you dedicated reservation in major Railway recruitments with huge vacancy volumes.',
        topExams: ['Railway Assistant Loco Pilot & Technician (RRB ALP / Tech)', 'SSC Combined Graduate Level Examination (CGL)'],
        startingSalary: '₹35,000 - ₹55,000 / mo + Kilometre Allowance',
        fiveYearSalary: '₹75,000 - ₹1,10,000 / month',
        immediateSteps: [
          'Study NIMI Trade Theory books for Part-B qualifying test.',
          'Practice Basic Science & Engineering numerical questions daily.',
          'Take weekly mock CBT tests on speed and calculation.'
        ],
        primarySubjectFocus: 'Basic Science, Engineering & Trade Theory (NIMI)'
      };
    } else if (ambition === 'agriculture' || eduBackground.includes('Agri')) {
      rec = {
        title: 'Agricultural Field Officer & Rural Banking Specialist',
        fitScore: '97% Fit',
        rationale: 'B.Sc Agriculture provides dedicated, high-yield reservations with limited competition compared to open exams.',
        topExams: ['IBPS Agriculture Field Officer (IBPS SO AFO)', 'UPSC Civil Services Examination (CSE)'],
        startingSalary: '₹65,000 - ₹75,000 / month + Leased Accommodation',
        fiveYearSalary: '₹1,00,000 - ₹1,40,000 / month',
        immediateSteps: [
          'Master Nem Raj Sunda - A Competitive Book of Agriculture cover to cover.',
          'Memorize latest crop statistics, MSP rates, and NABARD guidelines.',
          'Practice Sectional Prelims tests for English and Quantitative Aptitude.'
        ],
        primarySubjectFocus: 'Agricultural Sciences (Nem Raj Sunda & Arun Katyayan)'
      };
    } else if (ambition === 'medical_healthcare' || eduBackground.includes('Medical')) {
      rec = {
        title: 'Central Healthcare & Nursing Officer',
        fitScore: '98% Fit',
        rationale: 'Healthcare graduates enter Level 7-10 7th CPC central hospital cadres with prestigious clinical status.',
        topExams: ['AIIMS Nursing Officer Recruitment (NORCET)', 'UPSC Civil Services Examination (CSE)'],
        startingSalary: '₹72,000 - ₹85,000 / month + Nursing Allowances',
        fiveYearSalary: '₹1,10,000 - ₹1,45,000 / month',
        immediateSteps: [
          'Practice emergency clinical care scenarios, ECG readings, and pharmacology.',
          'Solve Target High comprehensive question banks.',
          'Review infection control protocols and BMW guidelines.'
        ],
        primarySubjectFocus: 'Medical-Surgical Nursing (Target High Review)'
      };
    } else if (ambition === 'judiciary' || eduBackground.includes('Law')) {
      rec = {
        title: 'Judicial Magistrate (Civil Judge PCS-J)',
        fitScore: '95% Fit',
        rationale: 'Direct courtroom authority with premier constitutional immunity and judicial perquisites.',
        topExams: ['State Judicial Service Examination (Civil Judge / PCS-J)', 'UPSC Civil Services Examination (CSE)'],
        startingSalary: '₹95,000 - ₹1,20,000 / month + Official Bungalow',
        fiveYearSalary: '₹1,50,000 - ₹1,90,000 / month',
        immediateSteps: [
          'Memorize Bare Acts of Criminal Law, CPC, and Constitution.',
          'Practice daily judgment writing and issue framing.',
          'Read monthly Supreme Court case law summaries.'
        ],
        primarySubjectFocus: 'Criminal & Civil Procedural Bare Acts'
      };
    }

    setRecommendation(rec);
  };

  const content = (
    <div className="space-y-6">
      {!recommendation ? (
        <>
          {/* Step indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${step === 1 ? 'bg-orange-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
                1
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {step === 1 ? 'Select Your Education' : 'Your Goal'}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Step {step} of 2</span>
          </div>

          {step === 1 ? (
            /* Step 1: Education */
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                What is your current or highest qualification?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {eduOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setEduBackground(opt.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      eduBackground === opt.id
                        ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {eduBackground === opt.id && <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-xs transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Ambition */
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                What is your dream career sector?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {ambitionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAmbition(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      ambition === opt.id
                        ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base shrink-0">{opt.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{opt.label}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Back
                </button>

                <button
                  onClick={generateRecommendation}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Career Roadmap</span>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Result Diagnostic Card */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Recommended Career Trajectory
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-slate-950 font-black text-[10px]">
                {recommendation.fitScore}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {recommendation.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {recommendation.rationale}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-medium">Starting Salary (7th CPC)</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs block mt-0.5">
                {recommendation.startingSalary}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block font-medium">Core Preparation Focus</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block mt-0.5 truncate">
                {recommendation.primarySubjectFocus}
              </span>
            </div>
          </div>

          {/* Immediate Steps */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Next Action Steps:</span>
            {recommendation.immediateSteps.map((s, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{s}</span>
              </div>
            ))}
          </div>

          {/* Top Exam Chips */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">Top Matching Exams:</span>
            <div className="flex flex-wrap gap-1.5">
              {recommendation.topExams.map((examName, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateToExams ? onNavigateToExams(examName.split(' ')[0]) : null}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all"
                >
                  {examName}
                </button>
              ))}
            </div>
          </div>

          {/* Retake */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => { setRecommendation(null); setStep(1); }}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retake Diagnostic</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  AI Career Path Finder
                </h2>
                <p className="text-[11px] text-slate-400">2-Minute Diagnostic for Indian Aspirants</p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
      {content}
    </div>
  );
}
