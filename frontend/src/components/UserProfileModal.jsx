import React, { useState } from 'react';
import { 
  X, 
  User, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { api, setUserSession, getUserToken } from '../services/api';

export default function UserProfileModal({ isOpen, onClose, user, onProfileUpdated }) {
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '20');
  const [std, setStd] = useState(user?.std || '12th Science (PCM)');
  const [department, setDepartment] = useState(user?.department || 'Science & Technology / Engineering');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen || !user) return null;

  const stdOptions = [
    '10th Pass (Matriculation)',
    '12th Science (PCM)',
    '12th Science (PCB)',
    '12th Commerce',
    '12th Arts / Humanities',
    'ITI Trades (Fitter / Electrician / Welder)',
    'Polytechnic Diploma (Engineering)',
    'B.Tech / B.E (Engineering)',
    'B.Sc Agriculture / Allied',
    'Medical / Nursing / B.Pharma',
    'Law Degree (LL.B / B.A. LL.B)',
    'General Graduate (B.A / B.Com / B.Sc)',
    'Post Graduate (M.A / M.Sc / M.Tech / MBA)'
  ];

  const departmentOptions = [
    'Science & Technology / Engineering',
    'Computer Science & Information Technology',
    'Civil & Administrative Studies',
    'Medical & Allied Health Sciences',
    'Agriculture & Rural Development',
    'Commerce, Accounts & Banking',
    'Arts, Humanities & Social Sciences',
    'Law, Judiciary & Legal Studies',
    'Defense & Uniformed Services',
    'Vocational & Technical Trades'
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await api.updateUserProfile({
        name,
        age: parseInt(age, 10),
        std,
        department,
        phone
      });

      if (res.success && res.user) {
        const token = getUserToken();
        setUserSession(token, res.user);
        if (onProfileUpdated) onProfileUpdated(res.user);
        setSuccessMsg('Your studying profile details were saved successfully!');
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        setError(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.message || 'Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-3xl transition-all duration-300">
      <div 
        className="liquid-glass w-full max-w-lg rounded-[28px] shadow-2xl border border-white/70 dark:border-white/12 dark:bg-[#07090e]/85 overflow-hidden flex flex-col max-h-[92vh] animate-apple-spring relative text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular reflection line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-blue-400/40 to-transparent pointer-events-none" />

        {/* macOS Window Titlebar Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-white/75 dark:bg-[#0c0f17]/90 backdrop-blur-2xl">
          {/* KY EDU Brand Logo */}
          <div className="flex items-center gap-2 select-none shrink-0">
            <span className="text-base font-black italic tracking-wide text-slate-900 dark:text-white drop-shadow-xs">
              KY <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EDU</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-800 dark:text-white tracking-tight">
            <div className="w-5 h-5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-[#2563eb] dark:text-blue-400 flex items-center justify-center font-bold">
              🎓
            </div>
            <span>Student Study Profile</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpdate} className="p-6 overflow-y-auto space-y-4">
          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Info Badges */}
          <div className="p-3.5 apple-glass rounded-2xl border border-white/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Account Active</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '2026'}</span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 text-slate-900 dark:text-white shadow-inner"
              />
            </div>
          </div>

          {/* Age & Std */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Age
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min="12"
                  max="70"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 text-slate-900 dark:text-white shadow-inner"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Educational Standard (Std)
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={std}
                  onChange={(e) => setStd(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 text-slate-900 dark:text-white shadow-xs cursor-pointer"
                >
                  {stdOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Department for studying */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Department for Studying (विभाग / स्ट्रीम)
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 text-slate-900 dark:text-white shadow-xs cursor-pointer"
              >
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Mobile Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 text-slate-900 dark:text-white shadow-inner"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Registered Email (Cannot be changed)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-xs"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#2874f0] hover:bg-[#1f60c7] text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}