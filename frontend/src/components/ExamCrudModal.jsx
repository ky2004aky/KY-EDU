import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Landmark } from 'lucide-react';

export default function ExamCrudModal({ examToEdit, onClose, onSave }) {
  const isEditing = Boolean(examToEdit && examToEdit._id);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    shortName: '',
    conductingBody: '',
    category: 'UPSC',
    stream: 'Any Stream',
    status: 'Active',
    vacancies: '',
    featured: false,
    eligibility: {
      minAge: 18,
      maxAge: 32,
      educationLevel: 'Graduate',
      education: '',
      attempts: ''
    },
    salary: {
      payLevel: 'Level 10 (7th CPC)',
      payScale: '',
      inHandEstimate: '',
      perks: ''
    },
    importantDates: {
      notificationDate: '',
      applicationDeadline: '',
      examDate: ''
    },
    officialWebsite: '',
    applyLink: '',
    postsInput: '',
    syllabusInput: ''
  });

  useEffect(() => {
    if (examToEdit) {
      setFormData({
        title: examToEdit.title || '',
        shortName: examToEdit.shortName || '',
        conductingBody: examToEdit.conductingBody || '',
        category: examToEdit.category || 'UPSC',
        stream: examToEdit.stream || 'Any Stream',
        status: examToEdit.status || 'Active',
        vacancies: examToEdit.vacancies || '',
        featured: Boolean(examToEdit.featured),
        eligibility: {
          minAge: examToEdit.eligibility?.minAge ?? 18,
          maxAge: examToEdit.eligibility?.maxAge ?? 32,
          educationLevel: examToEdit.eligibility?.educationLevel || 'Graduate',
          education: examToEdit.eligibility?.education || '',
          attempts: examToEdit.eligibility?.attempts || ''
        },
        salary: {
          payLevel: examToEdit.salary?.payLevel || '',
          payScale: examToEdit.salary?.payScale || '',
          inHandEstimate: examToEdit.salary?.inHandEstimate || '',
          perks: Array.isArray(examToEdit.salary?.perks) ? examToEdit.salary.perks.join(', ') : ''
        },
        importantDates: {
          notificationDate: examToEdit.importantDates?.notificationDate || '',
          applicationDeadline: examToEdit.importantDates?.applicationDeadline || '',
          examDate: examToEdit.importantDates?.examDate || ''
        },
        officialWebsite: examToEdit.officialWebsite || '',
        applyLink: examToEdit.applyLink || '',
        postsInput: Array.isArray(examToEdit.posts) ? examToEdit.posts.join(', ') : '',
        syllabusInput: Array.isArray(examToEdit.syllabusHighlights) ? examToEdit.syllabusHighlights.join('\n') : ''
      });
    }
  }, [examToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please provide the exam title');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        posts: formData.postsInput.split(',').map((p) => p.trim()).filter(Boolean),
        syllabusHighlights: formData.syllabusInput.split('\n').map((s) => s.trim()).filter(Boolean),
        salary: {
          ...formData.salary,
          perks: formData.salary.perks.split(',').map((p) => p.trim()).filter(Boolean)
        }
      };
      delete payload.postsInput;
      delete payload.syllabusInput;

      await onSave(payload, isEditing ? examToEdit._id : null);
      onClose();
    } catch (err) {
      alert('Failed to save exam: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {isEditing ? 'Edit / Update Exam Details' : 'Add New Government Exam Entry'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing ? `Updating ${examToEdit.title}` : 'Fill in the eligibility, syllabus, and 7th CPC salary data'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Section: Basic Info */}
          <div>
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
              1. Basic Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Full Exam Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPSC Civil Services Examination (CSE)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Name</label>
                <input
                  type="text"
                  placeholder="e.g. UPSC CSE"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Conducting Authority *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Union Public Service Commission"
                  value={formData.conductingBody}
                  onChange={(e) => setFormData({ ...formData, conductingBody: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="UPSC">UPSC</option>
                  <option value="SSC">SSC</option>
                  <option value="Banking">Banking</option>
                  <option value="Railways">Railways</option>
                  <option value="Defense">Defense</option>
                  <option value="Medical">Medical / Healthcare</option>
                  <option value="Law / Judiciary">Law / Judiciary</option>
                  <option value="State PSC">State PSC</option>
                  <option value="Engineering/PSU">Engineering / PSU</option>
                  <option value="Teaching">Teaching / NET</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Stream Requirement</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Any Stream">Any Stream</option>
                  <option value="Science (PCM)">Science (PCM)</option>
                  <option value="Science (PCB)">Science (PCB)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Engineering/B.Tech">Engineering / B.Tech</option>
                  <option value="ITI / Polytechnic">ITI / Polytechnic Trades</option>
                  <option value="B.Sc Agriculture">B.Sc Agriculture / Allied</option>
                  <option value="Law (LL.B)">Law (LL.B)</option>
                  <option value="Medical / Nursing">Medical / Nursing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Status & Vacancies */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Application Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Active">Active (Ongoing)</option>
                <option value="Admit Card Out">Admit Card Out</option>
                <option value="Exam Ongoing">Exam Ongoing</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Result Declared">Result Declared</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Total Vacancies</label>
              <input
                type="number"
                placeholder="e.g. 1056"
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featCheck"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-slate-800 border-slate-700"
              />
              <label htmlFor="featCheck" className="text-slate-300 font-semibold cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>

          {/* Section: Eligibility */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
              2. Eligibility Criteria
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Min Age (Years)</label>
                <input
                  type="number"
                  value={formData.eligibility.minAge}
                  onChange={(e) => setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, minAge: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Age (General)</label>
                <input
                  type="number"
                  value={formData.eligibility.maxAge}
                  onChange={(e) => setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, maxAge: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Min Education Level</label>
                <select
                  value={formData.eligibility.educationLevel}
                  onChange={(e) => setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, educationLevel: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="ITI">ITI Trade Certificate</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Graduate">Graduate (Any Bachelor Degree)</option>
                  <option value="B.Sc Agriculture">B.Sc Agriculture</option>
                  <option value="Medical / Nursing">Medical / Nursing</option>
                  <option value="Law (LL.B)">Law (LL.B)</option>
                  <option value="Post Graduate">Post Graduate (Master's)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Education Requirement Details</label>
                <input
                  type="text"
                  placeholder="e.g. Bachelor's Degree in any discipline or equivalent"
                  value={formData.eligibility.education}
                  onChange={(e) => setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, education: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Attempts Rule</label>
                <input
                  type="text"
                  placeholder="e.g. Gen: 6, OBC: 9, SC/ST: Unlimited"
                  value={formData.eligibility.attempts}
                  onChange={(e) => setFormData({
                    ...formData,
                    eligibility: { ...formData.eligibility, attempts: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Salary & Remuneration */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
              3. 7th CPC Salary & Perks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pay Matrix Level</label>
                <input
                  type="text"
                  placeholder="e.g. Level 10 (7th CPC)"
                  value={formData.salary.payLevel}
                  onChange={(e) => setFormData({
                    ...formData,
                    salary: { ...formData.salary, payLevel: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pay Scale Bracket</label>
                <input
                  type="text"
                  placeholder="e.g. ₹56,100 - ₹1,77,500"
                  value={formData.salary.payScale}
                  onChange={(e) => setFormData({
                    ...formData,
                    salary: { ...formData.salary, payScale: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Monthly In-Hand</label>
                <input
                  type="text"
                  placeholder="e.g. ₹75,000 - ₹95,000"
                  value={formData.salary.inHandEstimate}
                  onChange={(e) => setFormData({
                    ...formData,
                    salary: { ...formData.salary, inHandEstimate: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-300 font-semibold mb-1">Perks & Allowances (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Government Bungalow, Chauffeur Driven Vehicle, CGHS Medical, Pension"
                  value={formData.salary.perks}
                  onChange={(e) => setFormData({
                    ...formData,
                    salary: { ...formData.salary, perks: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Important Dates & Links */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
              4. Dates & Official Portals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notification Date</label>
                <input
                  type="date"
                  value={formData.importantDates.notificationDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    importantDates: { ...formData.importantDates, notificationDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={formData.importantDates.applicationDeadline}
                  onChange={(e) => setFormData({
                    ...formData,
                    importantDates: { ...formData.importantDates, applicationDeadline: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Exam Date</label>
                <input
                  type="date"
                  value={formData.importantDates.examDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    importantDates: { ...formData.importantDates, examDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-slate-300 font-semibold mb-1">Official Portal URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.officialWebsite}
                  onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Apply Online Portal URL</label>
                <input
                  type="url"
                  placeholder="https://upsconline.nic.in"
                  value={formData.applyLink}
                  onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Posts & Syllabus */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
              5. Posts and Syllabus Outline
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Posts / Cadres Included (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. IAS, IPS, IFS, IRS, Group A Officer"
                  value={formData.postsInput}
                  onChange={(e) => setFormData({ ...formData, postsInput: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Key Syllabus Topics (one per line)
                </label>
                <textarea
                  rows="3"
                  placeholder="Indian Polity & Constitution&#10;Modern Indian History&#10;Quantitative Aptitude"
                  value={formData.syllabusInput}
                  onChange={(e) => setFormData({ ...formData, syllabusInput: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Saving...' : isEditing ? 'Save Changes (Update)' : 'Create Exam'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
