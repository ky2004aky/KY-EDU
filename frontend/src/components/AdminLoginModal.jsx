import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api, setAdminSession } from '../services/api';

export default function AdminLoginModal({ onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('pin'); // 'pin' | 'password'
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('admin@kyedu.in');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = mode === 'pin' ? { pin } : { email, password };
      const res = await api.loginAdmin(payload);

      if (res.success && res.token) {
        setAdminSession(res.token, res.admin);
        onLoginSuccess(res.admin);
        onClose();
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const quickFillAdmin = () => {
    if (mode === 'pin') {
      setPin('123456');
    } else {
      setEmail('admin@kyedu.in');
      setPassword('KYEDU@2026');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-3xl flex items-center justify-center p-4 transition-all duration-300">
      <div className="liquid-glass rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden border border-white/70 dark:border-white/12 dark:bg-[#07090e]/85 animate-apple-spring relative text-slate-900 dark:text-slate-100">
        {/* Specular Top Reflection Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-emerald-400/40 to-transparent pointer-events-none" />

        {/* macOS Window Titlebar Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-white/75 dark:bg-[#0c0f17]/90 backdrop-blur-2xl">
          {/* KY EDU Brand Logo */}
          <div className="flex items-center gap-2 select-none shrink-0">
            <span className="text-base font-black italic tracking-wide text-slate-900 dark:text-white drop-shadow-xs">
              KY <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EDU</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-800 dark:text-white tracking-tight">
            <div className="w-5 h-5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Lock className="w-3 h-3" />
            </div>
            <span>Admin Authentication</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Alert Note */}
        <div className="px-6 pt-4">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Administrative privileges are strictly restricted to prevent unauthorized alteration of official exam notices and vacancies.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex p-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full mx-6 mt-4 border border-slate-200/60 dark:border-white/5">
          <button
            type="button"
            onClick={() => { setMode('pin'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all active:scale-95 cursor-pointer ${
              mode === 'pin'
                ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Quick 6-Digit PIN
          </button>
          <button
            type="button"
            onClick={() => { setMode('password'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all active:scale-95 cursor-pointer ${
              mode === 'password'
                ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Admin Credentials
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-600 dark:text-rose-400 font-semibold">
              {error}
            </div>
          )}

          {mode === 'pin' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Enter Security PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength="6"
                  required
                  placeholder="e.g. 123456"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-slate-900 dark:text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 shadow-inner"
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                <span>Default PIN: <strong className="text-emerald-600 dark:text-emerald-400">123456</strong></span>
                <button
                  type="button"
                  onClick={quickFillAdmin}
                  className="text-[#2874f0] dark:text-blue-400 hover:underline font-bold"
                >
                  Auto Fill
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Master Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="KYEDU@2026"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0]/40 shadow-inner"
                />
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                  <span>Default Pass: <strong className="text-emerald-600 dark:text-emerald-400">KYEDU@2026</strong></span>
                  <button
                    type="button"
                    onClick={quickFillAdmin}
                    className="text-[#2874f0] dark:text-blue-400 hover:underline font-bold"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-full text-xs sm:text-sm shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Unlock Admin Panel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
