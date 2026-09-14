import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BellRing, 
  History, 
  Settings, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Search, 
  Lock, 
  Unlock, 
  LogOut, 
  Database, 
  ShieldAlert, 
  Download, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp, 
  Award 
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPortalPage({
  exams = [],
  notices = [],
  adminUser,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenCreateExam,
  onOpenEditExam,
  onOpenApplyUpdate,
  onDeleteExam,
  onSeedDatabase,
  onNavigate
}) {
  // Navigation tabs: 'overview' | 'exams' | 'students' | 'circulars' | 'audit' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Exam section state
  const [examSearch, setExamSearch] = useState('');
  const [examCategory, setExamCategory] = useState('All');
  const [examStatus, setExamStatus] = useState('All');

  // Student directory state
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDept, setStudentDept] = useState('All');
  const [studentTotal, setStudentTotal] = useState(0);

  // Dashboard analytics state
  const [dashboardStats, setDashboardStats] = useState(null);

  // Circular broadcaster form state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('Notification');
  const [newNoticeDept, setNewNoticeDept] = useState('Government of India');
  const [newNoticeLink, setNewNoticeLink] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState('High');
  const [submittingNotice, setSubmittingNotice] = useState(false);
  const [noticeSuccess, setNoticeSuccess] = useState(null);

  // Settings / Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Seeding state
  const [seeding, setSeeding] = useState(false);

  // Fetch dashboard stats
  const fetchStats = React.useCallback(async () => {
    if (!adminUser) return;
    try {
      const res = await api.getAdminStats();
      if (res && res.success) {
        setDashboardStats(res.stats || res);
      }
    } catch {
      // Graceful offline fallback
    }
  }, [adminUser]);

  // Fetch students list
  const fetchStudents = React.useCallback(async () => {
    if (!adminUser) return;
    try {
      const res = await api.getAdminStudents({
        search: studentSearch,
        department: studentDept,
        limit: 100
      });
      if (res && res.success) {
        setStudents(res.users || res.data || []);
        setStudentTotal(res.total || res.count || (res.data ? res.data.length : 0));
      }
    } catch {
      // Graceful offline fallback
    }
  }, [adminUser, studentSearch, studentDept]);

  useEffect(() => {
    if (adminUser) {
      fetchStats();
    }
  }, [adminUser, fetchStats]);

  useEffect(() => {
    if (adminUser && activeTab === 'students') {
      fetchStudents();
    }
  }, [adminUser, activeTab, fetchStudents]);

  // Handle student search with debounce
  useEffect(() => {
    if (adminUser && activeTab === 'students') {
      const timer = setTimeout(() => {
        fetchStudents();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [studentSearch, adminUser, activeTab, fetchStudents]);

  const handleSeed = async () => {
    if (!window.confirm('Reset and re-seed MongoDB database with authentic Indian examination records?')) {
      return;
    }
    setSeeding(true);
    try {
      await onSeedDatabase();
      await fetchStats();
    } finally {
      setSeeding(false);
    }
  };

  // Handle circular broadcast
  const handlePublishNotice = async (e) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;
    setSubmittingNotice(true);
    setNoticeSuccess(null);
    try {
      await api.createUpdate({
        title: newNoticeTitle.trim(),
        category: newNoticeCategory,
        department: newNoticeDept.trim(),
        link: newNoticeLink.trim(),
        priority: newNoticePriority,
        badge: newNoticeCategory.toUpperCase(),
        date: new Date().toISOString().split('T')[0]
      });
      setNewNoticeTitle('');
      setNewNoticeLink('');
      setNoticeSuccess('Circular published successfully! It will appear on the student ticker.');
      fetchStats();
      setTimeout(() => setNoticeSuccess(null), 4000);
    } catch (err) {
      alert('Failed to publish circular: ' + err.message);
    } finally {
      setSubmittingNotice(false);
    }
  };

  // Handle Admin Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await api.updateAdminPassword({
        currentPassword,
        newPassword
      });
      if (res.success) {
        setPasswordStatus({ type: 'success', message: 'Password updated successfully in MongoDB!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: res.error || 'Password update failed.' });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err.message || 'Error updating password.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student account: "${studentName}"?`)) {
      return;
    }
    try {
      await api.deleteAdminStudent(studentId);
      fetchStudents();
      fetchStats();
    } catch (err) {
      alert('Failed to delete student: ' + err.message);
    }
  };

  // Export students to CSV
  const handleExportStudentsCSV = () => {
    if (students.length === 0) {
      alert('No student records to export.');
      return;
    }

    const headers = ['Name', 'Age', 'Educational Standard', 'Studying Department', 'Email', 'Phone', 'Registered At'];
    const rows = students.map(s => [
      `"${s.name || ''}"`,
      s.age || '',
      `"${s.std || ''}"`,
      `"${s.department || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ky_edu_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter exams
  const filteredExams = exams.filter((e) => {
    const q = examSearch.toLowerCase().trim();
    const matchQuery = !q || (
      e.title?.toLowerCase().includes(q) ||
      e.shortName?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.conductingBody?.toLowerCase().includes(q)
    );
    const matchCat = examCategory === 'All' || e.category === examCategory;
    const matchStatus = examStatus === 'All' || (e.status || 'Active') === examStatus;
    return matchQuery && matchCat && matchStatus;
  });

  // 1. LOCKED VIEW FOR UNAUTHENTICATED USERS
  if (!adminUser) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#2874f0]/10 border border-[#2874f0]/20 flex items-center justify-center text-[#2874f0] shadow-xl">
          <Lock className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-[#2874f0] text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Authorized Personnel Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            KY EDU Administrative Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Restricted zone to manage Indian examination directories, student databases, 7th CPC pay scale specifications, and official live notifications.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm shadow-sm max-w-md mx-auto text-xs text-left space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200">Default Access Credentials:</div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Quick 6-Digit PIN:</span>
            <code className="bg-gray-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[#2874f0] font-bold">123456</code>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Admin Email:</span>
            <code className="bg-gray-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[#2874f0]">admin@kyedu.in</code>
          </div>
        </div>

        <div>
          <button
            onClick={onOpenAdminLogin}
            className="px-8 py-3 bg-[#fb641b] hover:bg-[#e05615] text-white font-bold rounded-sm text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Control Center (Enter PIN)</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED REAL-WORLD DASHBOARD VIEW
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 sm:p-5 rounded-sm shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SuperAdmin Session Active</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>MongoDB 8.0 Connected</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            KY EDU Control Center
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Logged in as: <strong className="text-slate-800 dark:text-slate-200">{adminUser.name || 'System Administrator'}</strong> ({adminUser.email || 'admin@kyedu.in'})
          </p>
        </div>

        {/* Global Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-sm transition-colors"
              title="Preview Student Portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Student Portal</span>
            </button>
          )}

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-sm transition-colors disabled:opacity-50"
            title="Reset default exams in DB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin text-orange-500' : ''}`} />
            <span>{seeding ? 'Syncing...' : 'Seed DB'}</span>
          </button>

          <button
            onClick={onAdminLogout}
            className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-sm text-xs font-bold hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Right Active Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden p-2 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Navigation Menu
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#2874f0] text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-bold transition-colors ${
              activeTab === 'exams'
                ? 'bg-[#2874f0] text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4" />
              <span>Exams Management</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'exams' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
              {exams.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-bold transition-colors ${
              activeTab === 'students'
                ? 'bg-[#2874f0] text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Student Directory</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'students' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
              {dashboardStats?.stats?.totalStudents ?? (students.length || 1)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('circulars')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-bold transition-colors ${
              activeTab === 'circulars'
                ? 'bg-[#2874f0] text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BellRing className="w-4 h-4" />
              <span>Official Circulars</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'circulars' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
              {notices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-bold transition-colors ${
              activeTab === 'audit'
                ? 'bg-[#2874f0] text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4" />
              <span>Audit & Logs</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-bold transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#2874f0] text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Security & Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* Right Active Workspace */}
        <div className="lg:col-span-9 space-y-6">

          {/* ========================================================= */}
          {/* 1. OVERVIEW DASHBOARD TAB */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* 5 Real-Time KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                
                {/* 1. Registered Students */}
                <div 
                  onClick={() => setActiveTab('students')}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3.5 rounded-sm shadow-xs hover:border-[#2874f0] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Students</span>
                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#2874f0]">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {dashboardStats?.stats?.totalStudents ?? 1}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>Live in MongoDB</span>
                  </div>
                </div>

                {/* 2. Active Exams */}
                <div 
                  onClick={() => setActiveTab('exams')}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3.5 rounded-sm shadow-xs hover:border-[#2874f0] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Active Exams</span>
                    <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-[#fb641b]">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    {dashboardStats?.stats?.activeExams ?? exams.length}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">
                    of {exams.length} total listed
                  </div>
                </div>

                {/* 3. Total Vacancies */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3.5 rounded-sm shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Open Posts</span>
                    <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {(dashboardStats?.stats?.totalVacancies || exams.reduce((sum, e) => sum + (Number(e.vacancies) || 0), 0)).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">
                    Projected vacancies
                  </div>
                </div>

                {/* 4. Live Circulars */}
                <div 
                  onClick={() => setActiveTab('circulars')}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3.5 rounded-sm shadow-xs hover:border-[#2874f0] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Circulars</span>
                    <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
                      <BellRing className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">
                    {notices.length}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">
                    Live ticker feeds
                  </div>
                </div>

                {/* 5. Closing Soon */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-3.5 rounded-sm shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Closing Soon</span>
                    <div className="w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                    {dashboardStats?.closingSoon?.length ?? 0}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">
                    Next 14 days
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-sm shadow-sm">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                  Quick Management Shortcuts
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={onOpenCreateExam}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#fb641b] hover:bg-[#e05615] text-white text-xs font-bold rounded-sm shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Exam</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('circulars')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#2874f0] hover:bg-blue-600 text-white text-xs font-bold rounded-sm shadow-xs transition-colors"
                  >
                    <BellRing className="w-4 h-4" />
                    <span>Broadcast Circular</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('students')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-xs transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>View Registered Students</span>
                  </button>

                  <button
                    onClick={handleExportStudentsCSV}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Students CSV</span>
                  </button>
                </div>
              </div>

              {/* Analytics: Department & Category Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Department Enrollment Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-sm shadow-sm">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Student Department Distribution</span>
                    <span className="text-[10px] text-gray-500 font-normal">Live from MongoDB</span>
                  </h3>
                  
                  {dashboardStats?.departmentStats && Object.keys(dashboardStats.departmentStats).length > 0 ? (
                    <div className="space-y-2.5">
                      {Object.entries(dashboardStats.departmentStats).map(([dept, count]) => {
                        const total = dashboardStats?.stats?.totalStudents || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={dept} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[220px]" title={dept}>{dept}</span>
                              <span className="font-bold text-slate-900 dark:text-white">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#2874f0] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${Math.max(pct, 5)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 py-6 text-center italic">
                      No student department data yet. Students registering will appear here.
                    </div>
                  )}
                </div>

                {/* Exam Categories Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-sm shadow-sm">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Recruitment Categories</span>
                    <span className="text-[10px] text-gray-500 font-normal">{exams.length} Exams</span>
                  </h3>

                  <div className="space-y-2.5">
                    {Object.entries(dashboardStats?.categoryStats || {}).map(([cat, count]) => {
                      const total = exams.length || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{cat}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#fb641b] h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.max(pct, 8)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Audit Stream Preview */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <History className="w-4 h-4 text-[#2874f0]" />
                    <span>Recent Administrative Audit Trail</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-xs text-[#2874f0] hover:underline font-semibold"
                  >
                    View All Logs →
                  </button>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {(dashboardStats?.recentLogs || []).slice(0, 5).map((log, idx) => (
                    <div key={idx} className="p-3 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2874f0]">
                          {log.action}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {log.details || log.action}
                        </span>
                      </div>
                      <span className="text-gray-400 text-[11px] shrink-0">
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>
                  ))}
                  {(!dashboardStats?.recentLogs || dashboardStats.recentLogs.length === 0) && (
                    <div className="p-4 text-xs text-gray-400 text-center italic">
                      No logged events yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. EXAMS MANAGEMENT TAB */}
          {/* ========================================================= */}
          {activeTab === 'exams' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-sm shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Search omnibar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search recruitment title, conducting body, posts..."
                    value={examSearch}
                    onChange={(e) => setExamSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2874f0]"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={examCategory}
                  onChange={(e) => setExamCategory(e.target.value)}
                  className="px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Central">Central Govt</option>
                  <option value="Railways">Railways</option>
                  <option value="Defense">Defense</option>
                  <option value="Banking">Banking</option>
                  <option value="State">State PSC</option>
                  <option value="Judiciary">Judiciary</option>
                  <option value="Medical">Medical & Nursing</option>
                  <option value="Agriculture">Agriculture</option>
                </select>

                {/* Status filter */}
                <select
                  value={examStatus}
                  onChange={(e) => setExamStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Admit Card Released">Admit Card Released</option>
                  <option value="Answer Key Out">Answer Key Out</option>
                  <option value="Result Declared">Result Declared</option>
                </select>

                <button
                  onClick={onOpenCreateExam}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#fb641b] hover:bg-[#e05615] text-white text-xs font-bold rounded-sm shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Exam</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-slate-800/80 text-gray-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Recruitment & Authority</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Vacancies</th>
                        <th className="p-3">7th CPC Salary</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {filteredExams.map((exam) => (
                        <tr key={exam._id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{exam.title}</div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <span>{exam.conductingBody}</span>
                              {exam.shortName && <span className="text-[#2874f0] font-semibold">({exam.shortName})</span>}
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-xs bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                              {exam.category}
                            </span>
                          </td>

                          <td className="p-3 font-bold text-slate-900 dark:text-white">
                            {exam.vacancies ? Number(exam.vacancies).toLocaleString('en-IN') : 'TBA'}
                          </td>

                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            {exam.salary?.inHandSalary ? `₹${Number(exam.salary.inHandSalary).toLocaleString('en-IN')}` : `Level ${exam.salary?.payLevel || '7'}`}
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
                              {exam.status || 'Active'}
                            </span>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onOpenApplyUpdate(exam)}
                                title="Apply Status Update to Live Circulars"
                                className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#2874f0] dark:bg-blue-950/60 dark:text-blue-400 rounded-sm font-bold text-[11px] transition-colors"
                              >
                                <BellRing className="w-3 h-3" />
                                <span>Status</span>
                              </button>

                              <button
                                onClick={() => onOpenEditExam(exam)}
                                title="Edit Exam Specifications"
                                className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-sm transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Permanently delete recruitment "${exam.title}" from MongoDB?`)) {
                                    onDeleteExam(exam._id);
                                  }
                                }}
                                title="Delete Exam"
                                className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-sm transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 text-[11px] text-gray-500 flex justify-between">
                  <span>Showing {filteredExams.length} recruitments</span>
                  <span>Total in DB: {exams.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. STUDENT DIRECTORY TAB (NEW REAL-WORLD FEATURE) */}
          {/* ========================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-sm shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search students by name, email, standard, or department..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2874f0]"
                    />
                  </div>

                  <select
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value)}
                    className="px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="Science & Technology / Engineering">Science & Technology</option>
                    <option value="Medical & Allied Health Sciences">Medical & Healthcare</option>
                    <option value="Civil & Administrative Studies">Civil Services</option>
                    <option value="Commerce, Accounts & Banking">Commerce & Banking</option>
                    <option value="Law, Judiciary & Legal Studies">Law & Judiciary</option>
                    <option value="Agriculture & Rural Development">Agriculture</option>
                    <option value="Defense & Uniformed Services">Defense</option>
                  </select>

                  <button
                    onClick={handleExportStudentsCSV}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-xs transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Student Directory Table */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-slate-800/80 text-gray-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Age</th>
                        <th className="p-3">Studying Standard (Std)</th>
                        <th className="p-3">Department for Studying</th>
                        <th className="p-3">Contact (Email / Phone)</th>
                        <th className="p-3">Registered On</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {students.map((st) => (
                        <tr key={st._id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#2874f0]/10 text-[#2874f0] font-bold flex items-center justify-center text-xs shrink-0">
                                {st.name ? st.name.charAt(0).toUpperCase() : 'S'}
                              </div>
                              <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                            </div>
                          </td>

                          <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">
                            {st.age || 'N/A'} Yrs
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-xs bg-blue-50 dark:bg-blue-950/60 text-[#2874f0] font-semibold text-[11px]">
                              {st.std || '12th'}
                            </span>
                          </td>

                          <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                            {st.department || 'General'}
                          </td>

                          <td className="p-3 text-slate-600 dark:text-slate-400">
                            <div>{st.email}</div>
                            {st.phone && <div className="text-[10px] text-gray-400">{st.phone}</div>}
                          </td>

                          <td className="p-3 text-gray-500 text-[11px]">
                            {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : 'Recent'}
                          </td>

                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteStudent(st._id, st.name)}
                              title="Delete Student Record"
                              className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-sm transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 text-[11px] text-gray-500 flex justify-between">
                  <span>Displaying {students.length} students</span>
                  <span>Total registered in MongoDB: {studentTotal}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. OFFICIAL CIRCULARS BROADCASTER TAB */}
          {/* ========================================================= */}
          {activeTab === 'circulars' && (
            <div className="space-y-6 animate-fade-in">
              {/* Broadcast New Notice Form */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-sm shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                    <BellRing className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Broadcast Live Official Circular / Press Alert
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Published notifications appear instantly on the live aspirant ticker and circular directory.
                    </p>
                  </div>
                </div>

                {noticeSuccess && (
                  <div className="p-3 mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{noticeSuccess}</span>
                  </div>
                )}

                <form onSubmit={handlePublishNotice} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">
                      Circular Title / Announcement *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UPSC CSE 2026 Prelims Admit Card Released. Download hall tickets."
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2874f0]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">
                        Category
                      </label>
                      <select
                        value={newNoticeCategory}
                        onChange={(e) => setNewNoticeCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white"
                      >
                        <option value="Notification">Official Notification</option>
                        <option value="Admit Card">Admit Card Release</option>
                        <option value="Answer Key">Answer Key / Objection</option>
                        <option value="Result">Final Result Declared</option>
                        <option value="Exam Date">Revised Exam Dates</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">
                        Conducting Authority / Department
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UPSC / SSC / Railway Board"
                        value={newNoticeDept}
                        onChange={(e) => setNewNoticeDept(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">
                        Priority Level
                      </label>
                      <select
                        value={newNoticePriority}
                        onChange={(e) => setNewNoticePriority(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white"
                      >
                        <option value="High">Urgent / Flash (Top Ticker)</option>
                        <option value="Normal">Normal Announcement</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">
                      Official Document / Portal URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://upsc.gov.in/notifications/..."
                      value={newNoticeLink}
                      onChange={(e) => setNewNoticeLink(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingNotice}
                    className="px-5 py-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs rounded-sm shadow-xs transition-colors disabled:opacity-50"
                  >
                    {submittingNotice ? 'Publishing...' : 'Broadcast to Live Ticker'}
                  </button>
                </form>
              </div>

              {/* Published Circulars Feed */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Active Live Circulars ({notices.length})
                </div>

                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {notices.map((n) => (
                    <div key={n._id} className="p-3 text-xs flex items-center justify-between gap-3 hover:bg-gray-50/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            {n.category || 'Notification'}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {n.department} • {n.date || 'Today'}
                        </div>
                      </div>

                      {n.link && (
                        <a
                          href={n.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2874f0] hover:underline flex items-center gap-1 text-[11px] shrink-0"
                        >
                          <span>Doc</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. AUDIT & LOGS TAB */}
          {/* ========================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-sm shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Administrative Audit Trail & Activity History
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Tracks every creation, update, circular release, and administrative login with timestamps.
                  </p>
                </div>
                <button
                  onClick={fetchStats}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-xs font-semibold rounded-sm transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 dark:bg-slate-800/80 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Entity</th>
                        <th className="p-3">Action Details</th>
                        <th className="p-3">Admin</th>
                        <th className="p-3">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {(dashboardStats?.recentLogs || []).map((log, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="p-3 text-gray-500 whitespace-nowrap">
                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2874f0]">
                              {log.action}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 capitalize font-medium">
                            {log.entityType || 'General'}
                          </td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white max-w-sm truncate">
                            {log.details}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">
                            {log.adminName || 'System Admin'}
                          </td>
                          <td className="p-3 text-gray-400 text-[11px]">
                            {log.ip || '127.0.0.1'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. SECURITY & SETTINGS TAB */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              {/* System Diagnostic Status */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-sm shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  System Diagnostics & Database Engine
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-sm">
                    <span className="text-gray-400 block text-[10px]">Database Engine</span>
                    <strong className="text-emerald-600 flex items-center gap-1 mt-0.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>MongoDB 8.0 (ky_edu_db)</span>
                    </strong>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-sm">
                    <span className="text-gray-400 block text-[10px]">Backend Framework</span>
                    <strong className="text-slate-800 dark:text-slate-200 block mt-0.5">
                      PHP 8.2 (REST API Layer)
                    </strong>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-sm">
                    <span className="text-gray-400 block text-[10px]">Security Protocol</span>
                    <strong className="text-[#2874f0] flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>BCrypt Hashing + Token Auth</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-sm shadow-sm max-w-lg">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Change Administrator Password
                </h3>
                <p className="text-[11px] text-gray-500 mb-4">
                  Update your SuperAdmin password stored in MongoDB `admins` collection.
                </p>

                {passwordStatus && (
                  <div className={`p-3 mb-3 text-xs rounded-sm flex items-center gap-2 ${
                    passwordStatus.type === 'success' 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}>
                    {passwordStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password (default: KYEDU@2026)"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-5 py-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs rounded-sm shadow-xs transition-colors disabled:opacity-50"
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
