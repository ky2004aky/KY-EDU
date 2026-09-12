import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  User, 
  Mail, 
  Lock, 
  BookOpen, 
  Calendar, 
  Building2, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  KeyRound, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { api, setUserSession } from '../services/api';

export default function UserAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // 1. Password Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2. Register state
  const [name, setName] = useState('');
  const [age, setAge] = useState('21');
  const [std, setStd] = useState('12th Science (PCM)');
  const [department, setDepartment] = useState('Science & Technology / Engineering');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // 3. Forgot Password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isOpen) return null;

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

  const resetMessages = () => {
    setError(null);
    setSuccessMsg(null);
  };

  // --- Handlers ---

  // 1. Student Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await api.userLogin({
        email: loginEmail.trim(),
        password: loginPassword
      });

      if (res.success && res.token) {
        setUserSession(res.token, res.user);
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Authentication failed.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Student Registration (No OTP Required)
  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await api.userRegister({
        name: name.trim(),
        age: parseInt(age, 10),
        std,
        department,
        email: regEmail.trim(),
        password: regPassword,
        phone: phone.trim()
      });

      if (res.success && res.token) {
        setUserSession(res.token, res.user);
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Reset Password (No OTP Required)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    resetMessages();
    setLoading(true);

    try {
      const res = await api.resetPassword({
        identifier: forgotIdentifier.trim(),
        newPassword: newPassword.trim()
      });

      if (res.success && res.token) {
        setUserSession(res.token, res.user);
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Failed to update password.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update password. Please check your details.');
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
        {/* Top Specular Highlight Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-blue-400/40 to-transparent pointer-events-none" />

        {/* macOS Window Titlebar Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-white/75 dark:bg-[#0c0f17]/90 backdrop-blur-2xl">
          {/* KY EDU Brand Logo */}
          <div className="flex items-center gap-2 select-none shrink-0">
            <span className="text-base font-black italic tracking-wide text-slate-900 dark:text-white drop-shadow-xs">
              KY <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EDU</span>
            </span>
          </div>

          {/* Window Title */}
          <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-800 dark:text-white tracking-tight">
            <div className="w-5 h-5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-[#2563eb] dark:text-blue-400 flex items-center justify-center">
              {tab === 'forgot' ? <KeyRound className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
            </div>
            <span>
              {tab === 'login' && 'Student Portal Sign In'}
              {tab === 'register' && 'New Student Registration'}
              {tab === 'forgot' && 'Reset Student Password'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* macOS Segmented Tab Switcher */}
        <div className="p-2.5 bg-slate-100/60 dark:bg-black/40 border-b border-black/5 dark:border-white/5">
          <div className="flex p-1 bg-white/70 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/5 shadow-inner gap-1">
            <button
              type="button"
              onClick={() => { setTab('login'); resetMessages(); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
                tab === 'login'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/25 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In (लॉगिन)
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); resetMessages(); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
                tab === 'register'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/25 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              New Student (पंजीकरण)
            </button>
            <button
              type="button"
              onClick={() => { setTab('forgot'); resetMessages(); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
                tab === 'forgot'
                  ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/25 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reset Password
            </button>
          </div>
        </div>

        {/* Body Container */}
        <div className="p-6 overflow-y-auto space-y-4">

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-2xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5 animate-apple-spring">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-xs text-emerald-700 dark:text-emerald-400 flex items-start gap-2.5 animate-apple-spring">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 1: LOGIN (Direct Password Login) */}
          {/* ========================================================== */}
          {tab === 'login' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); resetMessages(); }}
                    className="text-[11px] text-[#2563eb] dark:text-blue-400 hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-black rounded-full text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In with Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Quick Switch */}
              <div className="text-center pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have a profile yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('register'); resetMessages(); }}
                    className="text-[#2563eb] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    Create Account (नया खाता)
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* ========================================================== */}
          {/* TAB 2: REGISTER (Student Info & Direct Account Creation) */}
          {/* ========================================================== */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                  />
                </div>
              </div>

              {/* Age & Std Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="12"
                      max="70"
                      placeholder="21"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Std / Educational Standard <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={std}
                      onChange={(e) => setStd(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-white/80 dark:bg-[#121624] border border-slate-200/80 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white shadow-xs cursor-pointer"
                    >
                      {stdOptions.map((opt) => (
                        <option key={opt} value={opt} className="dark:bg-[#121624] dark:text-white">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Department for studying */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department for Studying (विभाग / स्ट्रीम) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs bg-white/80 dark:bg-[#121624] border border-slate-200/80 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white shadow-xs cursor-pointer"
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept} className="dark:bg-[#121624] dark:text-white">{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-black rounded-full text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Account (पंजीकरण करें)</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); resetMessages(); }}
                    className="text-[#2563eb] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* ========================================================== */}
          {/* TAB 3: FORGOT PASSWORD (Simple Direct Reset) */}
          {/* ========================================================== */}
          {tab === 'forgot' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Apna registered Email ya Mobile number daalein aur naya password set karein.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. student@kyedu.in or 9876543210"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Password (नया पासवर्ड)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password (पासवर्ड दोबारा लिखें)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Re-type your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/75 dark:bg-white/[0.06] border border-slate-200/70 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-black rounded-full text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password & Sign In</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); resetMessages(); }}
                    className="text-[#2563eb] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}