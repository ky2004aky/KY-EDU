import React from 'react';
import { 
  Landmark, 
  BookOpen, 
  Compass, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Landmark },
    { id: 'exams', label: 'Exams', icon: BookOpen },
    { id: 'careers', label: 'Careers', icon: Compass },
    { id: 'eligibility', label: 'Matcher', icon: CheckCircle2 },
    { id: 'compare', label: 'Compare', icon: SlidersHorizontal }
  ];

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 sm:inset-x-6 z-40 pointer-events-none select-none">
      <nav className="pointer-events-auto max-w-lg mx-auto bg-white/85 dark:bg-[#07090e]/90 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 flex items-center justify-around gap-1 safe-bottom transition-all duration-300">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-250 cursor-pointer active:scale-90 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight leading-none font-medium truncate max-w-[56px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
