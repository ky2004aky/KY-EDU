import React from 'react';
import { ExternalLink, Shield, Award } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const officialPortals = [
    { name: 'UPSC (Civil Services)', url: 'https://upsc.gov.in' },
    { name: 'SSC (Staff Selection)', url: 'https://ssc.gov.in' },
    { name: 'IBPS (Banking Personnel)', url: 'https://ibps.in' },
    { name: 'Indian Railways (RRB)', url: 'https://rrbapply.gov.in' },
    { name: 'National Testing Agency (NTA)', url: 'https://nta.ac.in' },
    { name: 'GATE Official Portal', url: 'https://gate.iitd.ac.in' },
    { name: 'State PSCs (UPPSC)', url: 'https://uppsc.up.nic.in' },
    { name: 'ISRO Careers', url: 'https://isro.gov.in/careers' }
  ];

  return (
    <footer className="bg-[#0e1726]/95 dark:bg-[#06090e]/95 backdrop-blur-2xl border-t border-white/10 text-slate-400 mt-16 transition-colors duration-300 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white italic tracking-wide">
                KY <span className="text-[#ffe500]">EDU</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              India's premier education and government recruitment navigation portal. Helping students navigate 10th/12th stream selection, ITI, Polytechnic, and prestigious Sarkari exam opportunities.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full w-fit font-bold shadow-2xs">
              <Shield className="w-3.5 h-3.5" />
              <span>100% Official Exam Data</span>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Explore Guidance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('exams')} className="hover:text-[#ffe500] hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  All Sarkari Exams Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('careers')} className="hover:text-[#ffe500] hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  10th, 12th & Technical Roadmaps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('eligibility')} className="hover:text-[#ffe500] hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Interactive Eligibility Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-[#ffe500] hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Side-by-Side Exam Comparator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-[#ffe500] hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Admin Panel (Protected)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Portals */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Official Portals
            </h4>
            <ul className="space-y-2.5 text-xs">
              {officialPortals.map((portal) => (
                <li key={portal.name}>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-[#ffe500] hover:translate-x-1 transition-all duration-200"
                  >
                    <span>{portal.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Aspirant Advisory */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Aspirant Advisory
            </h4>
            <div className="bg-white/5 dark:bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2 text-xs shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Award className="w-4 h-4" />
                <span>Stay Vigilant</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Always cross-verify official notification PDFs and eligibility criteria directly on the respective conducting authority portals before submitting application fees.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KY EDU. Built for Indian Students & Aspirants.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Empowering Bharat's Youth with Knowledge & Career Pathways
          </p>
        </div>
      </div>
    </footer>
  );
}
