import React, { useState } from 'react';
import { 
  Search, 
  Landmark, 
  Plus, 
  LayoutGrid, 
  Table2, 
  AlignJustify, 
  GitCommit, 
  X
} from 'lucide-react';
import ExamCard from '../components/ExamCard';
import ExamTableView from '../components/ExamTableView';
import ExamCompactListView from '../components/ExamCompactListView';
import ExamTimelineView from '../components/ExamTimelineView';
import { useUIFormat } from '../context/UIFormatContext';

export default function GovtExamsPage({
  exams = [],
  adminUser,
  onSelectExam,
  onOpenCreateExam,
  onQuickUpdate,
  initialFilters = {}
}) {
  const { 
    viewFormat, 
    setViewFormat 
  } = useUIFormat();

  const [search, setSearch] = useState(initialFilters.search || '');
  const [category, setCategory] = useState(initialFilters.category || 'All');
  const [stream, setStream] = useState(initialFilters.stream || 'All');
  const [educationLevel, setEducationLevel] = useState(initialFilters.educationLevel || 'All');
  const [status, setStatus] = useState(initialFilters.status || 'All');
  const [sortBy, setSortBy] = useState('updated');

  React.useEffect(() => {
    if (initialFilters.search !== undefined) setSearch(initialFilters.search || '');
    if (initialFilters.category !== undefined) setCategory(initialFilters.category || 'All');
    if (initialFilters.stream !== undefined) setStream(initialFilters.stream || 'All');
    if (initialFilters.educationLevel !== undefined) setEducationLevel(initialFilters.educationLevel || 'All');
    if (initialFilters.status !== undefined) setStatus(initialFilters.status || 'All');
  }, [initialFilters]);

  const categories = [
    'All', 
    'UPSC', 
    'SSC', 
    'Banking', 
    'Railways', 
    'Defense', 
    'Medical', 
    'Law / Judiciary', 
    'State PSC', 
    'Engineering/PSU', 
    'Teaching'
  ];

  const streams = [
    { id: 'All', label: 'All Fields' },
    { id: 'Any Stream', label: 'Any Stream' },
    { id: '10th / Matriculation', label: '10th Pass' },
    { id: '12th Pass', label: '12th Pass (10+2)' },
    { id: 'Science (PCM)', label: 'Science / Defense' },
    { id: 'Commerce & Finance', label: 'Commerce & Banking' },
    { id: 'Arts & Humanities', label: 'Arts & Teaching' },
    { id: 'Engineering / Technology', label: 'Engineering / CS' },
    { id: 'Polytechnic / ITI', label: 'ITI / Diploma' },
    { id: 'Medical & Nursing', label: 'Medical & Nursing' },
    { id: 'Agriculture', label: 'Agriculture (AFO)' },
    { id: 'Forestry & Environment', label: 'Forestry & Ecology' },
    { id: 'Food & Life Sciences', label: 'Food & Life Sciences' },
    { id: 'Law', label: 'Law & Judiciary' }
  ];

  const eduLevels = ['All', '10th', '12th', 'ITI', 'Polytechnic', 'Diploma', 'Graduate', 'Post Graduate'];
  const statuses = ['All', 'Active', 'Admit Card Out', 'Exam Ongoing', 'Upcoming', 'Closed'];

  // Filter exams
  const filteredExams = exams.filter((exam) => {
    // Comprehensive tokenized search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const searchableText = [
        exam.title,
        exam.shortName,
        exam.conductingBody,
        exam.stream,
        exam.category,
        exam.eligibility?.educationLevel,
        exam.eligibility?.education,
        exam.salary?.payLevel,
        exam.salary?.payScale,
        ...(Array.isArray(exam.posts) ? exam.posts : []),
        ...(Array.isArray(exam.tags) ? exam.tags : []),
        ...(Array.isArray(exam.subjectDetails) ? exam.subjectDetails.map((s) => `${s.subjectName || ''} ${(s.keyTopics || []).join(' ')}`) : [])
      ].filter(Boolean).join(' ').toLowerCase();

      const words = q.split(/\s+/).filter(Boolean);
      const matchesAllWords = words.every((word) => {
        if (word.length <= 3) {
          const regex = new RegExp(`(^|[^a-z0-9])${word}([^a-z0-9]|$)`, 'i');
          return regex.test(searchableText);
        }
        return searchableText.includes(word);
      });
      if (!matchesAllWords) return false;
    }

    // Category
    if (category !== 'All' && exam.category !== category) return false;

    // Academic Field / Stream
    if (stream !== 'All') {
      const s = stream.toLowerCase();
      const examStream = (exam.stream || '').toLowerCase();
      const examCategory = (exam.category || '').toLowerCase();
      const examEdu = (exam.eligibility?.educationLevel || '').toLowerCase();
      const examEduDesc = (exam.eligibility?.education || '').toLowerCase();
      const examTitle = (exam.title || '').toLowerCase();
      const examShort = (exam.shortName || '').toLowerCase();

      if (stream === 'Any Stream') {
        if (!examStream.includes('any')) return false;
      } else if (stream === '10th / Matriculation') {
        const match = examEdu.includes('10th') || examStream.includes('matriculation') || examTitle.includes('10th') || examShort.includes('10th') || examEduDesc.includes('matriculation') || examEduDesc.includes('10th');
        if (!match) return false;
      } else if (stream === '12th Pass') {
        const match = examEdu.includes('12th') || examStream.includes('12th') || examTitle.includes('12th') || examShort.includes('12th') || examShort.includes('10+2') || examEduDesc.includes('10+2') || examEduDesc.includes('12th');
        if (!match) return false;
      } else if (stream === 'Science (PCM)') {
        const match = examStream.includes('pcm') || examStream.includes('science') || examEduDesc.includes('physics') || examEduDesc.includes('maths') || examCategory.includes('defense');
        if (!match) return false;
      } else if (stream === 'Commerce & Finance') {
        const match = examStream.includes('commerce') || examStream.includes('finance') || examCategory.includes('banking') || examShort.includes('cgl');
        if (!match) return false;
      } else if (stream === 'Arts & Humanities') {
        const match = examStream.includes('arts') || examStream.includes('humanities') || examCategory.includes('teaching') || examCategory.includes('state psc') || examStream.includes('any');
        if (!match) return false;
      } else if (stream === 'Engineering / Technology') {
        const match = examStream.includes('engineering') || examStream.includes('technology') || examStream.includes('computer') || examCategory.includes('engineering') || examEdu.includes('b.tech') || examEdu.includes('polytechnic');
        if (!match) return false;
      } else if (stream === 'Polytechnic / ITI') {
        const match = examStream.includes('iti') || examStream.includes('polytechnic') || examStream.includes('vocational') || examEdu.includes('iti') || examEdu.includes('diploma');
        if (!match) return false;
      } else if (stream === 'Medical & Nursing') {
        const match = examStream.includes('medical') || examStream.includes('nursing') || examCategory.includes('medical') || examStream.includes('pharmac');
        if (!match) return false;
      } else if (stream === 'Agriculture') {
        const match = examStream.includes('agri') || examTitle.includes('agri') || examShort.includes('afo');
        if (!match) return false;
      } else if (stream === 'Forestry & Environment') {
        const match = examStream.includes('forest') || examStream.includes('environ') || examTitle.includes('forest') || examShort.includes('ifos');
        if (!match) return false;
      } else if (stream === 'Food & Life Sciences') {
        const match = examStream.includes('food') || examStream.includes('life sciences') || examTitle.includes('food') || examShort.includes('fssai') || examShort.includes('csir');
        if (!match) return false;
      } else if (stream === 'Law') {
        const match = examStream.includes('law') || examCategory.includes('law') || examStream.includes('ll.b') || examEdu.includes('ll.b') || examShort.includes('law');
        if (!match) return false;
      } else {
        if (!examStream.includes(s) && !examCategory.includes(s) && !examEdu.includes(s)) return false;
      }
    }

    // Education Level
    if (educationLevel !== 'All') {
      const examEdu = (exam.eligibility?.educationLevel || '').toLowerCase();
      const target = educationLevel.toLowerCase();
      if (target === 'graduate') {
        const isGrad = examEdu.includes('graduate') || examEdu.includes('b.tech') || examEdu.includes('b.sc') || examEdu.includes('ll.b') || examEdu.includes('bachelor');
        if (!isGrad) return false;
      } else if (target === 'diploma') {
        const isDip = examEdu.includes('diploma') || examEdu.includes('polytechnic');
        if (!isDip) return false;
      } else if (!examEdu.includes(target)) {
        return false;
      }
    }

    // Status
    if (status !== 'All' && exam.status !== status) return false;

    return true;
  });

  // Sort exams
  const sortedExams = [...filteredExams].sort((a, b) => {
    if (sortBy === 'vacancies') {
      return (Number(b.vacancies) || 0) - (Number(a.vacancies) || 0);
    }
    if (sortBy === 'age') {
      return (a.eligibility?.maxAge || 32) - (b.eligibility?.maxAge || 32);
    }
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });

  const formatButtons = [
    { id: 'grid', label: 'Cards Grid', icon: LayoutGrid },
    { id: 'table', label: 'Sarkari Table', icon: Table2 },
    { id: 'compact', label: 'Fast Scanner', icon: AlignJustify },
    { id: 'timeline', label: 'Stage Pipeline', icon: GitCommit },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="apple-glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-white/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#2874f0] font-bold uppercase tracking-wider mb-1">
            <Landmark className="w-3.5 h-3.5" />
            <span>Official Government Portals & Boards</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sarkari Examinations & Vacancies Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Browse verified recruitments, total vacancies, 7th CPC pay scales, and syllabus weightage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {adminUser && onOpenCreateExam && (
            <button
              onClick={onOpenCreateExam}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#fb641b] hover:bg-[#e05615] text-white font-bold rounded-full text-xs shadow-md shadow-orange-500/20 active:scale-95 uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
          )}
        </div>
      </div>

      {/* Apple Frosted Glass Search & Filters Panel */}
      <div className="apple-glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm border border-white/60 dark:border-white/10">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Exam Name, Conducting Body, Stream, Posts, Qualification (e.g. UPSC, SSC, 10th, 12th, B.Tech, Police)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-11 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 shadow-inner"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 shadow-xs cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="vacancies">Highest Vacancies</option>
              <option value="age">Max Age Limit</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Chips (Smooth Apple Squircles) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                category === cat
                  ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-white border border-slate-200/60 dark:border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Academic Field / Stream Horizontal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0">Field / Stream:</span>
          {streams.map((st) => (
            <button
              key={st.id}
              onClick={() => setStream(st.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                stream === st.id
                  ? 'bg-[#fb641b] text-white shadow-md shadow-orange-500/20'
                  : 'bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-white border border-slate-200/60 dark:border-white/5'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/50 dark:border-white/5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Qualification:</span>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-xs font-medium text-slate-900 dark:text-white"
            >
              {eduLevels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-xs font-medium text-slate-900 dark:text-white"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {(search || category !== 'All' || stream !== 'All' || educationLevel !== 'All' || status !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setStream('All');
                setEducationLevel('All');
                setStatus('All');
              }}
              className="text-xs text-[#2874f0] hover:underline ml-auto font-bold active:scale-95 transition-transform cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results & Format Switcher Strip */}
      <div className="apple-glass rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-white/60 dark:border-white/10">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong className="text-slate-900 dark:text-white font-black">{sortedExams.length}</strong> examinations
        </div>

        {/* View Format Pill Tabs */}
        <div className="flex items-center gap-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1 rounded-full border border-slate-200/60 dark:border-white/5">
          {formatButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = viewFormat === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setViewFormat(btn.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exam Listings based on active viewFormat */}
      {sortedExams.length === 0 ? (
        <div className="apple-glass rounded-3xl p-10 sm:p-14 text-center shadow-sm border border-white/60 dark:border-white/10 space-y-4 animate-apple-spring">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
            <Landmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {search ? `No exams found matching "${search}"` : 'No Examinations Found'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
              {search && (category !== 'All' || stream !== 'All' || educationLevel !== 'All')
                ? `Filters for Category (${category}), Stream (${stream}), or Education (${educationLevel}) may be narrowing your search results.`
                : 'Try searching with different keywords like UPSC, SSC, 10th, 12th, B.Tech, Police, or Railway.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setStream('All');
                setEducationLevel('All');
                setStatus('All');
              }}
              className="px-5 py-2.5 bg-[#2874f0] hover:bg-[#1e60c8] text-white text-xs font-bold rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
            {search && (category !== 'All' || stream !== 'All' || educationLevel !== 'All') && (
              <button
                onClick={() => {
                  setCategory('All');
                  setStream('All');
                  setEducationLevel('All');
                }}
                className="px-5 py-2.5 bg-[#fb641b] hover:bg-[#e05615] text-white text-xs font-bold rounded-full shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Search "{search}" in All Categories
              </button>
            )}
          </div>
        </div>
      ) : viewFormat === 'table' ? (
        <ExamTableView
          exams={sortedExams}
          onSelectExam={onSelectExam}
          onQuickUpdate={onQuickUpdate}
          adminUser={adminUser}
        />
      ) : viewFormat === 'compact' ? (
        <ExamCompactListView
          exams={sortedExams}
          onSelectExam={onSelectExam}
          onQuickUpdate={onQuickUpdate}
          adminUser={adminUser}
        />
      ) : viewFormat === 'timeline' ? (
        <ExamTimelineView
          exams={sortedExams}
          onSelectExam={onSelectExam}
          onQuickUpdate={onQuickUpdate}
          adminUser={adminUser}
        />
      ) : (
        /* 4-Column Card Grid with Apple Spring Elevation */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {sortedExams.map((exam) => (
            <ExamCard
              key={exam._id}
              exam={exam}
              onSelect={onSelectExam}
              onQuickUpdate={adminUser ? onQuickUpdate : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
