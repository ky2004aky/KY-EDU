import React, { useState } from 'react';
import { 
  GraduationCap, 
  Wrench, 
  Stethoscope, 
  Briefcase, 
  Shield, 
  Landmark, 
  ArrowRight
} from 'lucide-react';

export default function StreamHubSection({ onSelectHub }) {
  const [activeHub, setActiveHub] = useState('foundation');

  const hubs = [
    {
      id: 'foundation',
      title: '12th & School Pass',
      icon: GraduationCap,
      description: 'NDA, SSC CHSL, MTS, State Police & NIOS Open Schooling pathways.',
      topRecruitments: ['NDA & NA', 'SSC CHSL', 'SSC MTS', 'Railway Group D'],
      filterKey: { educationLevel: '12th' }
    },
    {
      id: 'technical',
      title: 'ITI & Technical Diploma',
      icon: Wrench,
      description: 'Trades (Fitter, Electrician), Polytechnic & Engineering cadres.',
      topRecruitments: ['RRB ALP & Tech', 'SSC Junior Engineer (JE)', 'DRDO CEPTAM', 'ISRO'],
      filterKey: { category: 'Railways' }
    },
    {
      id: 'medical_agri',
      title: 'Healthcare & Agriculture',
      icon: Stethoscope,
      description: 'B.Sc Nursing, MBBS, B.Pharm & B.Sc (Hons) Agriculture opportunities.',
      topRecruitments: ['AIIMS NORCET', 'IBPS Agriculture Field Officer (AFO)', 'UPSC CMS'],
      filterKey: { category: 'Medical' }
    },
    {
      id: 'commerce_law',
      title: 'Commerce, Law & Finance',
      icon: Briefcase,
      description: 'Chartered Accountancy, LL.B Judiciary, SEBI & banking officer positions.',
      topRecruitments: ['State PCS-J (Judiciary)', 'SEBI Legal', 'IBPS PO', 'CAG Auditor'],
      filterKey: { category: 'Law / Judiciary' }
    },
    {
      id: 'defense_uniform',
      title: 'Defense & Uniformed',
      icon: Shield,
      description: 'Indian Armed Forces (Army, Navy, Air Force) & Paramilitary services.',
      topRecruitments: ['UPSC CDS', 'UPSC NDA', 'AFCAT', 'CAPF Assistant Commandant'],
      filterKey: { category: 'Defense' }
    },
    {
      id: 'graduate_civil',
      title: 'All-Graduate & Civil Services',
      icon: Landmark,
      description: 'Any recognized graduate degree (Regular, IGNOU, Distance learning).',
      topRecruitments: ['UPSC CSE (IAS/IPS)', 'SSC CGL', 'State PSCs', 'Bank PO'],
      filterKey: { category: 'UPSC' }
    }
  ];

  const current = hubs.find((h) => h.id === activeHub) || hubs[0];
  const CurrentIcon = current.icon;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Stream Pathways
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Find Opportunities by Educational Background
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          Select your education stream to view verified eligibility and target examinations.
        </p>
      </div>

      {/* Modern Horizontal Capsule Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {hubs.map((hub) => {
          const Icon = hub.icon;
          const isActive = activeHub === hub.id;
          return (
            <button
              key={hub.id}
              onClick={() => setActiveHub(hub.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{hub.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Stream Spotlight Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
            <CurrentIcon className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {current.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
              {current.description}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Major Targets:</span>
              {current.topRecruitments.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700/60"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectHub(current.filterKey)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-xs whitespace-nowrap transition-all shadow-sm self-stretch sm:self-auto shrink-0"
        >
          <span>View Matching Exams</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
