import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowLeftRight, Check, X, Building2, Users, IndianRupee } from 'lucide-react';

export default function ComparePage({ exams = [], onSelectExam }) {
  const [exam1Id, setExam1Id] = useState(exams[0]?._id || '');
  const [exam2Id, setExam2Id] = useState(exams[1]?._id || '');

  useEffect(() => {
    if (!exam1Id && exams.length > 0) setExam1Id(exams[0]._id);
    if (!exam2Id && exams.length > 1) setExam2Id(exams[1]._id);
  }, [exams]);

  const exam1 = exams.find((e) => e._id === exam1Id) || exams[0];
  const exam2 = exams.find((e) => e._id === exam2Id) || exams[1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Decision Support Tool</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Compare Govt Exams Side-by-Side
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Evaluate two government recruitments across age limits, stages, 7th CPC pay scales, and career prestige.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <label className="block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1.5">
            Select Exam 1:
          </label>
          <select
            value={exam1Id}
            onChange={(e) => setExam1Id(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-orange-500"
          >
            {exams.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.title} ({ex.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
            Select Exam 2:
          </label>
          <select
            value={exam2Id}
            onChange={(e) => setExam2Id(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
          >
            {exams.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.title} ({ex.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      {exam1 && exam2 && (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm dark:shadow-2xl transition-colors">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white">
                <th className="p-4 w-1/4 uppercase text-slate-500 dark:text-slate-400 text-xs font-bold">Feature / Metric</th>
                <th className="p-4 w-3/8 text-orange-600 dark:text-orange-400 font-bold text-base border-l border-slate-200 dark:border-slate-700">
                  {exam1.shortName || exam1.title}
                </th>
                <th className="p-4 w-3/8 text-indigo-600 dark:text-indigo-400 font-bold text-base border-l border-slate-200 dark:border-slate-700">
                  {exam2.shortName || exam2.title}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">Conducting Body</td>
                <td className="p-4 text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800 font-medium">{exam1.conductingBody}</td>
                <td className="p-4 text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800 font-medium">{exam2.conductingBody}</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">Category & Cadre</td>
                <td className="p-4 border-l border-slate-200 dark:border-slate-800">
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-bold">
                    {exam1.category}
                  </span>
                </td>
                <td className="p-4 border-l border-slate-200 dark:border-slate-800">
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold">
                    {exam2.category}
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">Total Vacancies</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold border-l border-slate-200 dark:border-slate-800">
                  {exam1.vacancies ? Number(exam1.vacancies).toLocaleString('en-IN') : 'TBA'}
                </td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold border-l border-slate-200 dark:border-slate-800">
                  {exam2.vacancies ? Number(exam2.vacancies).toLocaleString('en-IN') : 'TBA'}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">Age Limit (General)</td>
                <td className="p-4 text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800">
                  <strong>{exam1.eligibility?.minAge || 18} - {exam1.eligibility?.maxAge || 32} Years</strong>
                </td>
                <td className="p-4 text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800">
                  <strong>{exam2.eligibility?.minAge || 18} - {exam2.eligibility?.maxAge || 32} Years</strong>
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">Min Education Level</td>
                <td className="p-4 text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {exam1.eligibility?.educationLevel || 'Graduate'}
                  </span>
                </td>
                <td className="p-4 text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {exam2.eligibility?.educationLevel || 'Graduate'}
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">7th CPC Pay Scale</td>
                <td className="p-4 text-amber-700 dark:text-amber-300 font-bold border-l border-slate-200 dark:border-slate-800">
                  {exam1.salary?.payScale || exam1.salary?.payLevel || '7th CPC'}
                </td>
                <td className="p-4 text-amber-700 dark:text-amber-300 font-bold border-l border-slate-200 dark:border-slate-800">
                  {exam2.salary?.payScale || exam2.salary?.payLevel || '7th CPC'}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">In-Hand Salary Projection</td>
                <td className="p-4 text-emerald-700 dark:text-emerald-300 font-medium border-l border-slate-200 dark:border-slate-800">
                  {exam1.salary?.inHandEstimate || '₹50,000+ / mo'}
                </td>
                <td className="p-4 text-emerald-700 dark:text-emerald-300 font-medium border-l border-slate-200 dark:border-slate-800">
                  {exam2.salary?.inHandEstimate || '₹50,000+ / mo'}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">Selection Stages Count</td>
                <td className="p-4 text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800">
                  {exam1.stages?.length || 2} Stage{exam1.stages?.length > 1 ? 's' : ''}
                </td>
                <td className="p-4 text-slate-800 dark:text-slate-200 border-l border-slate-200 dark:border-slate-800">
                  {exam2.stages?.length || 2} Stage{exam2.stages?.length > 1 ? 's' : ''}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">Key Govt Perks</td>
                <td className="p-4 text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-slate-800">
                  {exam1.salary?.perks?.slice(0, 3).join(', ') || 'Standard Govt Allowances'}
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-slate-800">
                  {exam2.salary?.perks?.slice(0, 3).join(', ') || 'Standard Govt Allowances'}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">Full Details</td>
                <td className="p-4 border-l border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => onSelectExam(exam1)}
                    className="px-3 py-1.5 bg-orange-500/15 hover:bg-orange-500/25 text-orange-700 dark:text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold"
                  >
                    View {exam1.shortName || 'Exam 1'}
                  </button>
                </td>
                <td className="p-4 border-l border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => onSelectExam(exam2)}
                    className="px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold"
                  >
                    View {exam2.shortName || 'Exam 2'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
