import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Search,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  ChevronDown,
  User,
  X
} from 'lucide-react';
import { useUIFormat } from '../context/UIFormatContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme,
  onToggleTheme,
  adminUser,
  onOpenAdminLogin,
  onAdminLogout,
  currentUser,
  onOpenUserAuth,
  onOpenUserProfile,
  onUserLogout,
  onSearch,
  exams = [],
  onSelectExam
}) {
  const { viewFormat, setIsFormatModalOpen } = useUIFormat();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(navSearch.trim());
    } else {
      setActiveTab('exams');
    }
  };

  const matchingSuggestions = navSearch.trim().length >= 1
    ? exams.filter((exam) => {
        const q = navSearch.toLowerCase().trim();
        const searchableText = [
          exam.title,
          exam.shortName,
          exam.conductingBody,
          exam.stream,
          exam.category,
          exam.eligibility?.educationLevel,
          exam.eligibility?.education,
          ...(Array.isArray(exam.posts) ? exam.posts : []),
          ...(Array.isArray(exam.tags) ? exam.tags : [])
        ].filter(Boolean).join(' ').toLowerCase();

        const words = q.split(/\s+/).filter(Boolean);
        return words.every((word) => {
          if (word.length <= 3) {
            const regex = new RegExp(`(^|[^a-z0-9])${word}([^a-z0-9]|$)`, 'i');
            return regex.test(searchableText);
          }
          return searchableText.includes(word);
        });
      }).slice(0, 6)
    : [];

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'exams', label: 'Sarkari Exams' },
    { id: 'careers', label: 'Career Scopes' },
    { id: 'eligibility', label: 'Eligibility Matcher' },
    { id: 'compare', label: 'Compare' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-black/70 backdrop-blur-3xl border-b border-slate-200/60 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/80 text-slate-800 dark:text-white transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center cursor-pointer group active:scale-95 transition-transform duration-200 select-none shrink-0"
          >
            <span className="text-xl sm:text-2xl font-black italic tracking-wide text-slate-900 dark:text-white drop-shadow-xs">
              KY <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EDU</span>
            </span>
          </div>

          {/* Apple-Style Center Frosted Search Pill Omnibar */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl relative">
            <form 
              onSubmit={handleSearchSubmit} 
              className="relative flex items-center bg-slate-100/90 dark:bg-white/[0.07] backdrop-blur-xl rounded-full border border-slate-200/80 dark:border-white/10 shadow-inner dark:shadow-none overflow-hidden text-slate-800 dark:text-slate-100 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:bg-white dark:focus-within:bg-[#101420]/90 focus-within:border-transparent transition-all duration-300"
            >
              <input
                type="text"
                value={navSearch}
                onChange={(e) => {
                  setNavSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (navSearch.trim().length >= 1) setShowSuggestions(true);
                }}
                placeholder="Search exams, syllabus, eligibility..."
                className="w-full pl-3.5 sm:pl-5 pr-12 sm:pr-14 py-1.5 sm:py-2.5 text-xs sm:text-sm bg-transparent placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />

              {navSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setNavSearch('');
                    setShowSuggestions(false);
                    if (onSearch) onSearch('');
                  }}
                  className="absolute right-9 sm:right-10 text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-full hover:bg-gray-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button 
                type="submit"
                className="m-0.5 sm:m-1 p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer active:scale-95 shadow-xs"
                title="Search Exams"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>

            {/* Auto-suggestions Dropdown with Apple Frosted Glass */}
            {showSuggestions && matchingSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 apple-glass rounded-2xl shadow-2xl border border-white/60 dark:border-slate-700/80 z-50 overflow-hidden text-xs divide-y divide-gray-100/60 dark:divide-slate-700/60 animate-apple-spring">
                <div className="px-4 py-2 bg-gray-50/70 dark:bg-slate-900/60 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Suggested Examinations ({matchingSuggestions.length})
                </div>
                {matchingSuggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setNavSearch(item.shortName || item.title);
                      setShowSuggestions(false);
                      if (onSelectExam) {
                        onSelectExam(item);
                      } else {
                        handleSearchSubmit();
                      }
                    }}
                    className="px-4 py-2.5 hover:bg-blue-50/80 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                        {item.shortName ? item.shortName[0] : 'E'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 dark:text-white truncate text-xs sm:text-sm">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                          <span>{item.conductingBody}</span>
                          {item.vacancies && <span>• {Number(item.vacancies).toLocaleString('en-IN')} Posts</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0">
                      {item.category}
                    </span>
                  </div>
                ))}
                <div 
                  onClick={handleSearchSubmit}
                  className="px-4 py-2 text-center text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50/50 dark:hover:bg-slate-800/50 cursor-pointer text-xs"
                >
                  View all results for "{navSearch}" &rarr;
                </div>
              </div>
            )}
          </div>

          {/* Right Nav Items & Actions */}
          <nav className="flex items-center gap-2.5 sm:gap-4 shrink-0 text-xs sm:text-sm font-semibold">
            {/* macOS Segmented Pill Nav Tabs */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-white/[0.06] p-1 rounded-full border border-slate-200/80 dark:border-white/5 backdrop-blur-md shadow-inner dark:shadow-none">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
                      isActive 
                        ? 'bg-white text-blue-600 dark:bg-white/95 dark:text-black font-black shadow-sm' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Student User Login & Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200/80 dark:border-white/10 font-bold rounded-full text-xs shadow-xs active:scale-95 transition-all cursor-pointer select-none"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'S'}
                  </div>
                  <span className="hidden sm:inline font-bold max-w-[110px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>

                {/* Apple Glass Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 apple-glass rounded-2xl shadow-2xl border border-white/60 dark:border-slate-700/80 p-2 z-50 text-xs text-[#212121] dark:text-white animate-apple-spring overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-gray-100/60 dark:border-slate-800/60">
                      <div className="font-bold text-sm text-[#212121] dark:text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{currentUser.std}</div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{currentUser.department}</div>
                      <div className="text-[10px] text-gray-400 mt-1">Age: {currentUser.age} yrs • {currentUser.email}</div>
                    </div>

                    <div className="py-1.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); onOpenUserProfile(); }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-500/10 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2 font-medium transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>My Study Profile & Std</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); setActiveTab('eligibility'); }}
                        className="w-full px-3 py-2 text-left hover:bg-emerald-500/10 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2 font-medium transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Matched Sarkari Exams</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100/60 dark:border-slate-800/60 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); onUserLogout(); }}
                        className="w-full px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 rounded-xl flex items-center gap-2 font-bold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenUserAuth}
                className="px-2.5 sm:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-xs sm:text-sm shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Student Login</span>
                <span className="sm:hidden text-[11px]">Login</span>
              </button>
            )}

            {/* Admin Portal Control */}
            {adminUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-emerald-500 text-white font-bold rounded-full text-xs shadow-md shadow-emerald-900/20 hover:bg-emerald-600 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Admin Active</span>
                </button>
                <button
                  type="button"
                  onClick={onAdminLogout}
                  title="Logout Administrator"
                  className="p-1 sm:p-1.5 text-slate-500 hover:text-slate-800 dark:text-white/80 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                title="System Administrator Access"
                className="p-1.5 sm:p-2 bg-slate-100/90 hover:bg-slate-200/90 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white border border-slate-200/60 dark:border-white/10 active:scale-90 transition-all cursor-pointer shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* UI Format Changer & Theme Toggle */}
            <div className="flex items-center gap-1 sm:gap-1.5 border-l border-slate-200 dark:border-white/15 pl-1.5 sm:pl-3 shrink-0">
              <button
                onClick={() => setIsFormatModalOpen(true)}
                title="UI Format Settings"
                className="hidden sm:flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-slate-100/90 hover:bg-slate-200/90 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-xs text-slate-700 dark:text-white border border-slate-200/60 dark:border-white/10 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span className="hidden lg:inline uppercase font-bold text-[10px]">{viewFormat}</span>
              </button>

              <button
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-1.5 sm:p-2 bg-slate-100/90 hover:bg-slate-200/90 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-slate-700 dark:text-white border border-slate-200/60 dark:border-white/10 active:scale-90 transition-all cursor-pointer shrink-0"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
