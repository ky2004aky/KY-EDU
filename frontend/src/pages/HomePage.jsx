import React, { useState } from 'react';
import { 
  Sparkles, 
  Landmark, 
  BookOpen, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Wrench, 
  Stethoscope, 
  Briefcase, 
  Shield, 
  Scale,
  Wheat,
  Flame,
  Cpu,
  Plane
} from 'lucide-react';
import ExamCard from '../components/ExamCard';
import CareerCard from '../components/CareerCard';
import CareerIntakeWizard from '../components/CareerIntakeWizard';

export default function HomePage({
  exams = [],
  careers = [],
  currentUser,
  onOpenUserProfile,
  onSelectExam,
  onNavigate,
  onQuickUpdate
}) {
  const [showWizardModal, setShowWizardModal] = useState(false);

  // Top Categories Strip with Apple Squircle Icons
  const topCategories = [
    { id: '12th', label: '10th & 12th Pass', icon: GraduationCap, filter: { stream: '12th Pass' } },
    { id: 'iti', label: 'ITI & Diploma', icon: Wrench, filter: { stream: 'Polytechnic / ITI' } },
    { id: 'upsc', label: 'Civil Services (UPSC)', icon: Landmark, filter: { category: 'UPSC' } },
    { id: 'ssc', label: 'SSC & Staff Selection', icon: Briefcase, filter: { category: 'SSC' } },
    { id: 'banking', label: 'Banking & Finance', icon: Building2, filter: { category: 'Banking' } },
    { id: 'railway', label: 'Railways & ALP', icon: Flame, filter: { category: 'Railways' } },
    { id: 'medical', label: 'Medical & Nursing', icon: Stethoscope, filter: { category: 'Medical' } },
    { id: 'agri', label: 'Agriculture & AFO', icon: Wheat, filter: { stream: 'Agriculture' } },
    { id: 'teaching', label: 'Teaching (UGC/CTET)', icon: BookOpen, filter: { category: 'Teaching' } },
    { id: 'defense', label: 'Defense (NDA/CAPF)', icon: Shield, filter: { category: 'Defense' } },
    { id: 'eng', label: 'Engineers & PSUs', icon: Cpu, filter: { category: 'Engineering/PSU' } },
    { id: 'aviation', label: 'Aviation & AFCAT', icon: Plane, filter: { category: 'Defense' } },
    { id: 'law', label: 'Judiciary (PCS-J)', icon: Scale, filter: { category: 'Law / Judiciary' } },
  ];

  const getUserExamFilter = (user) => {
    if (!user) return {};
    const dept = (user.department || '').toLowerCase();
    const std = (user.std || '').toLowerCase();

    if (dept.includes('agri') || std.includes('agri')) return { stream: 'Agriculture' };
    if (dept.includes('law') || std.includes('law')) return { category: 'Law / Judiciary' };
    if (dept.includes('medical') || std.includes('medical') || std.includes('nurs') || std.includes('pharma')) return { category: 'Medical' };
    if (dept.includes('vocational') || std.includes('iti')) return { stream: 'Polytechnic / ITI' };
    if (dept.includes('commerce') || std.includes('commerce')) return { category: 'Banking' };
    if (dept.includes('defense') || std.includes('pcm')) return { stream: 'Science (PCM)' };
    if (dept.includes('computer') || dept.includes('science & tech') || std.includes('b.tech') || std.includes('polytechnic')) return { stream: 'Engineering / Technology' };
    if (std.includes('10th')) return { stream: '10th / Matriculation' };
    if (std.includes('12th')) return { stream: '12th Pass' };
    if (dept.includes('civil')) return { category: 'UPSC' };
    return { category: 'All' };
  };

  const topExams = exams.slice(0, 4);
  const topCareers = careers.slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      {/* 0. Student Profile Status Banner (When logged in) */}
      {currentUser && (
        <div className="apple-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-white/60 dark:border-white/10 animate-apple-spring">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2874f0] to-blue-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md shadow-blue-500/20">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Namaste, {currentUser.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50/80 dark:bg-blue-950/50 text-[#2874f0] dark:text-blue-400 font-bold text-[10.5px] border border-blue-200/60 dark:border-blue-800/40">
                  {currentUser.std}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Department: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser.department}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('exams', getUserExamFilter(currentUser))}
              className="px-4 py-2 bg-[#2874f0] hover:bg-[#1e60c8] text-white font-bold text-xs rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Matched Sarkari Exams
            </button>
            <button
              onClick={onOpenUserProfile}
              className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:bg-white text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-full active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              Edit Study Details
            </button>
          </div>
        </div>
      )}

      {/* 1. Apple-Signature Frosted Glass Category Strip */}
      <div className="apple-glass rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-sm border border-white/60 dark:border-white/10 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[720px] sm:min-w-full gap-2">
          {topCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('exams', cat.filter)}
                className="flex flex-col items-center gap-2 p-2 hover:text-[#2874f0] transition-colors group text-center shrink-0 cursor-pointer active:scale-95"
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/5 shadow-2xs group-hover:bg-[#2874f0] group-hover:text-white group-hover:border-[#2874f0] group-hover:shadow-md group-hover:shadow-blue-500/20 flex items-center justify-center text-[#2874f0] dark:text-blue-400 transition-all duration-300 group-hover:-translate-y-1">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#2874f0] dark:group-hover:text-blue-400 whitespace-nowrap transition-colors">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Section: Top Government Examinations */}
      <div className="apple-glass rounded-2xl sm:rounded-3xl shadow-sm border border-white/60 dark:border-white/10 p-5 sm:p-7 space-y-5">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-white/5">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Top Government Examinations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified Central UPSC, SSC, Railways, Banking & Defense Recruitments
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowWizardModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/25 font-bold text-xs rounded-full active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fb641b]" />
              <span>AI Career Finder</span>
            </button>
            <button
              onClick={() => onNavigate('exams')}
              className="px-4 py-2 bg-[#2874f0] hover:bg-[#1e60c8] text-white font-bold text-xs rounded-full shadow-md shadow-blue-500/20 active:scale-95 uppercase tracking-wider transition-all cursor-pointer"
            >
              VIEW ALL
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {topExams.map((exam) => (
            <ExamCard
              key={exam._id}
              exam={exam}
              onSelect={onSelectExam}
              onQuickUpdate={onQuickUpdate}
            />
          ))}
        </div>
      </div>

      {/* 3. Section: Career Scopes & Stream Roadmaps */}
      <div className="apple-glass rounded-2xl sm:rounded-3xl shadow-sm border border-white/60 dark:border-white/10 p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-white/5">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Career Scopes & Degree Roadmaps
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Step-by-step career pathways from 10th, 12th, ITI, Polytechnic, Law to B.Sc Agriculture
            </p>
          </div>

          <button
            onClick={() => onNavigate('careers')}
            className="px-4 py-2 bg-[#2874f0] hover:bg-[#1e60c8] text-white font-bold text-xs rounded-full shadow-md shadow-blue-500/20 active:scale-95 uppercase tracking-wider transition-all shrink-0 cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {topCareers.map((career) => (
            <CareerCard
              key={career._id}
              career={career}
              onSelectGovtExam={(examName) => onNavigate('exams', { search: examName })}
            />
          ))}
        </div>
      </div>

      {/* 4. Apple-Style Trust & Assured Glass Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="apple-glass-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 border border-white/60 dark:border-white/10">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center text-[#2874f0] shrink-0 shadow-2xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">Standard Booklists</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">M. Laxmikanth, RS Aggarwal, Spectrum</p>
          </div>
        </div>

        <div className="apple-glass-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 border border-white/60 dark:border-white/10">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-[#388e3c] shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">7th CPC Pay Scale Matrix</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Official in-hand salaries & age criteria</p>
          </div>
        </div>

        <div className="apple-glass-card rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 border border-white/60 dark:border-white/10">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#fb641b] shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">Fluid Glass & Speed</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Apple frosted glass, buttery springs</p>
          </div>
        </div>
      </div>

      {/* AI Career Path Finder Dialog Modal */}
      <CareerIntakeWizard
        isOpen={showWizardModal}
        isModal={true}
        onClose={() => setShowWizardModal(false)}
        onSelectExam={onSelectExam}
        onNavigateToExams={(query) => {
          setShowWizardModal(false);
          onNavigate('exams', { search: query });
        }}
      />
    </div>
  );
}
