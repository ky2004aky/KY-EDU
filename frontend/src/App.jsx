import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveUpdatesTicker from './components/LiveUpdatesTicker';
import MobileBottomNav from './components/MobileBottomNav';
import ExamDetailModal from './components/ExamDetailModal';
import ExamCrudModal from './components/ExamCrudModal';
import PostUpdateModal from './components/PostUpdateModal';
import AdminLoginModal from './components/AdminLoginModal';
import UiFormatModal from './components/UiFormatModal';
import UiFormatFloatingButton from './components/UiFormatFloatingButton';
import Toast from './components/Toast';
import { useUIFormat } from './context/UIFormatContext';

import HomePage from './pages/HomePage';
import GovtExamsPage from './pages/GovtExamsPage';
import CareerScopesPage from './pages/CareerScopesPage';
import ComparePage from './pages/ComparePage';
import AdminPortalPage from './pages/AdminPortalPage';
import EligibilityCalculator from './components/EligibilityCalculator';

import UserAuthModal from './components/UserAuthModal';
import UserProfileModal from './components/UserProfileModal';

import { 
  api, 
  getAdminInfo, 
  clearAdminSession, 
  getUserInfo, 
  clearUserSession 
} from './services/api';
import fallbackData from './data/fallbackData.json';

export default function App() {
  const { isFormatModalOpen, setIsFormatModalOpen } = useUIFormat();
  const [activeTab, setActiveTab] = useState('home');
  const [exams, setExams] = useState([]);
  const [careers, setCareers] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ky_edu_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Student User Auth State (Name, Age, Std, Department saved in MongoDB)
  const [currentUser, setCurrentUser] = useState(() => {
    return getUserInfo();
  });
  const [showUserAuthModal, setShowUserAuthModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);

  // Admin Auth state
  const [adminUser, setAdminUser] = useState(() => {
    return getAdminInfo();
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Modals state
  const [selectedExam, setSelectedExam] = useState(null);
  const [showCrudModal, setShowCrudModal] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [examToUpdateNotice, setExamToUpdateNotice] = useState(null);

  // Filter pass-through state for navigation
  const [examFilters, setExamFilters] = useState({});

  // Feedback Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title });
  };

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ky_edu_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAdminLogout = () => {
    clearAdminSession();
    setAdminUser(null);
    showToast('Administrator session ended.', 'info', 'Logged Out');
  };

  const handleUserAuthSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, 'success', 'Signed In');
  };

  const handleUserLogout = () => {
    clearUserSession();
    setCurrentUser(null);
    showToast('You have been signed out successfully.', 'info', 'Signed Out');
  };

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    showToast('Your study profile & department details were updated!', 'success', 'Profile Saved');
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [examsRes, careersRes, updatesRes, statsRes] = await Promise.allSettled([
        api.getExams(),
        api.getCareers(),
        api.getUpdates(),
        api.getStats()
      ]);

      const loadedExams = (examsRes.status === 'fulfilled' && examsRes.value.success && examsRes.value.data?.length > 0)
        ? examsRes.value.data
        : (fallbackData.exams || []);

      const loadedCareers = (careersRes.status === 'fulfilled' && careersRes.value.success && careersRes.value.data?.length > 0)
        ? careersRes.value.data
        : (fallbackData.careers || []);

      const loadedUpdates = (updatesRes.status === 'fulfilled' && updatesRes.value.success && updatesRes.value.data?.length > 0)
        ? updatesRes.value.data
        : (fallbackData.updates || []);

      setExams(loadedExams);
      setCareers(loadedCareers);
      setUpdates(loadedUpdates);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.stats || null);
      } else {
        setStats({
          totalExams: loadedExams.length,
          totalCareers: loadedCareers.length,
          totalUpdates: loadedUpdates.length,
          activeAlerts: loadedUpdates.filter((u) => u.priority === 'High' || u.important).length
        });
      }
    } catch (err) {
      console.warn('Backend offline, using bundled data:', err.message);
      setExams(fallbackData.exams || []);
      setCareers(fallbackData.careers || []);
      setUpdates(fallbackData.updates || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // CRUD: Create or Update Exam (Admin Protected)
  const handleSaveExam = async (payload, id) => {
    if (!adminUser) {
      setShowAdminLoginModal(true);
      throw new Error('Admin authentication required.');
    }

    try {
      if (id) {
        // UPDATE (CRUD rule)
        await api.updateExam(id, payload);
        showToast('Exam specifications updated successfully!', 'success', 'Exam Updated');
      } else {
        // CREATE (CRUD rule)
        await api.createExam(payload);
        showToast('New government exam created and added to directory!', 'success', 'Exam Created');
      }
      await loadAllData();
    } catch (err) {
      if (err.authRequired) {
        setShowAdminLoginModal(true);
      }
      showToast(err.message, 'error', 'Operation Failed');
      throw err;
    }
  };

  // CRUD: Apply Live Circular Update ("crud rules applay the update")
  const handleApplyExamUpdate = async (id, updatePayload) => {
    if (!adminUser) {
      setShowAdminLoginModal(true);
      throw new Error('Admin authentication required.');
    }

    try {
      const res = await api.applyExamUpdate(id, updatePayload);
      showToast('Official update applied to exam and published to live ticker!', 'success', 'Update Published');
      await loadAllData();
      if (selectedExam && selectedExam._id === id) {
        const fresh = await api.getExamById(id);
        if (fresh.success) setSelectedExam(fresh.data);
      }
      return res;
    } catch (err) {
      if (err.authRequired) {
        setShowAdminLoginModal(true);
      }
      showToast(err.message, 'error', 'Update Failed');
      throw err;
    }
  };

  // CRUD: Delete Exam (Admin Protected)
  const handleDeleteExam = async (id) => {
    if (!adminUser) {
      setShowAdminLoginModal(true);
      return;
    }

    try {
      await api.deleteExam(id);
      showToast('Exam removed from portal.', 'info', 'Record Deleted');
      await loadAllData();
    } catch (err) {
      if (err.authRequired) {
        setShowAdminLoginModal(true);
      }
      showToast(err.message, 'error', 'Deletion Error');
    }
  };

  // Database Seed
  const handleSeed = async () => {
    try {
      await api.seedDatabase();
      showToast('KY EDU Database refreshed with authentic records!', 'success', 'Database Synced');
      await loadAllData();
    } catch (err) {
      showToast(err.message, 'error', 'Seeding Failed');
    }
  };

  const handleNavigateWithFilters = (tab, filters = {}) => {
    setExamFilters(filters);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fb] dark:bg-[#000000] text-[#111827] dark:text-[#f8fafc] selection:bg-[#2563eb] selection:text-white transition-colors duration-500 relative overflow-hidden">
      {/* macOS Liquid Caustic Ambient Lighting Mesh (Refracted through Liquid Glass) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Right Neon Sapphire & Violet Liquid Orb */}
        <div className="absolute -top-48 -right-48 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-blue-500/25 via-indigo-500/20 to-purple-600/15 dark:from-blue-600/22 dark:via-indigo-500/18 dark:to-purple-900/25 blur-3xl animate-liquid-orb-1" />
        {/* Mid-Left Cyan & Electric Teal Liquid Orb */}
        <div className="absolute top-[35%] -left-48 w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-transparent dark:from-cyan-600/18 dark:via-blue-800/15 dark:to-transparent blur-3xl animate-liquid-orb-2" />
        {/* Bottom-Center Warm Amber & Rose Nebula */}
        <div className="absolute top-[75%] left-[25%] w-[580px] h-[580px] rounded-full bg-gradient-to-tl from-amber-400/15 via-rose-400/10 to-transparent dark:from-purple-950/30 dark:via-blue-900/15 dark:to-transparent blur-3xl animate-liquid-orb-3" />
      </div>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setExamFilters({});
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        exams={exams}
        onSearch={(query) => {
          handleNavigateWithFilters('exams', { 
            search: query, 
            category: 'All', 
            stream: 'All', 
            educationLevel: 'All' 
          });
        }}
        onSelectExam={(exam) => setSelectedExam(exam)}
        onSeedTrigger={handleSeed}
        theme={theme}
        onToggleTheme={toggleTheme}
        adminUser={adminUser}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onAdminLogout={handleAdminLogout}
        currentUser={currentUser}
        onOpenUserAuth={() => setShowUserAuthModal(true)}
        onOpenUserProfile={() => setShowUserProfileModal(true)}
        onUserLogout={handleUserLogout}
      />

      {/* Live Sarkari Alerts Ticker */}
      <LiveUpdatesTicker
        updates={updates}
        onSelectUpdate={(item) => {
          if (item.examId) {
            const found = exams.find((e) => e._id === item.examId);
            if (found) setSelectedExam(found);
          } else if (item.link) {
            window.open(item.link, '_blank');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-12 relative z-10">
        {loading && exams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <div className="w-12 h-12 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
              Loading official exam directory...
            </p>
          </div>
        ) : (
          <div key={activeTab} className="animate-apple-spring">
            {activeTab === 'home' && (
              <HomePage
                stats={stats}
                exams={exams}
                careers={careers}
                notices={updates}
                currentUser={currentUser}
                onOpenUserAuth={() => setShowUserAuthModal(true)}
                onOpenUserProfile={() => setShowUserProfileModal(true)}
                onSelectExam={(exam) => setSelectedExam(exam)}
                onSelectCareer={() => setActiveTab('careers')}
                onNavigate={handleNavigateWithFilters}
                onQuickUpdate={(exam) => {
                  if (!adminUser) {
                    setShowAdminLoginModal(true);
                  } else {
                    setExamToUpdateNotice(exam);
                    setShowNoticeModal(true);
                  }
                }}
              />
            )}

            {activeTab === 'exams' && (
              <GovtExamsPage
                exams={exams}
                adminUser={adminUser}
                onSelectExam={(exam) => setSelectedExam(exam)}
                onOpenCreateExam={() => {
                  if (!adminUser) {
                    setShowAdminLoginModal(true);
                  } else {
                    setExamToEdit(null);
                    setShowCrudModal(true);
                  }
                }}
                onQuickUpdate={(exam) => {
                  if (!adminUser) {
                    setShowAdminLoginModal(true);
                  } else {
                    setExamToUpdateNotice(exam);
                    setShowNoticeModal(true);
                  }
                }}
                initialFilters={examFilters}
              />
            )}

            {activeTab === 'careers' && (
              <CareerScopesPage
                careers={careers}
                onNavigateToExam={(examName) => {
                  handleNavigateWithFilters('exams', { search: examName });
                }}
              />
            )}

            {activeTab === 'eligibility' && (
              <div className="max-w-5xl mx-auto">
                <EligibilityCalculator
                  onSelectExam={(exam) => setSelectedExam(exam)}
                />
              </div>
            )}

            {activeTab === 'compare' && (
              <ComparePage
                exams={exams}
                onSelectExam={(exam) => setSelectedExam(exam)}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPortalPage
                exams={exams}
                notices={updates}
                adminUser={adminUser}
                onOpenAdminLogin={() => setShowAdminLoginModal(true)}
                onAdminLogout={handleAdminLogout}
                onOpenCreateExam={() => {
                  setExamToEdit(null);
                  setShowCrudModal(true);
                }}
                onOpenEditExam={(exam) => {
                  setExamToEdit(exam);
                  setShowCrudModal(true);
                }}
                onOpenApplyUpdate={(exam) => {
                  setExamToUpdateNotice(exam);
                  setShowNoticeModal(true);
                }}
                onDeleteExam={handleDeleteExam}
                onSeedDatabase={handleSeed}
                onNavigate={setActiveTab}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setExamFilters({});
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      {/* 1. Exam Breakdown Modal with Subject Details Tab */}
      {selectedExam && (
        <ExamDetailModal
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
          onApplyUpdate={(exam) => {
            if (!adminUser) {
              setShowAdminLoginModal(true);
            } else {
              setExamToUpdateNotice(exam);
              setShowNoticeModal(true);
            }
          }}
          onEditExam={adminUser ? (exam) => {
            setSelectedExam(null);
            setExamToEdit(exam);
            setShowCrudModal(true);
          } : null}
        />
      )}

      {/* 2. Admin Protected CRUD Modal */}
      {showCrudModal && (
        <ExamCrudModal
          examToEdit={examToEdit}
          onClose={() => {
            setShowCrudModal(false);
            setExamToEdit(null);
          }}
          onSave={handleSaveExam}
        />
      )}

      {/* 3. Admin Protected Apply Update Modal */}
      {showNoticeModal && examToUpdateNotice && (
        <PostUpdateModal
          exam={examToUpdateNotice}
          onClose={() => {
            setShowNoticeModal(false);
            setExamToUpdateNotice(null);
          }}
          onUpdateSubmitted={handleApplyExamUpdate}
        />
      )}

      {/* 4. Student User Authentication Modal (Login / Register with Name, Age, Std, Dept) */}
      <UserAuthModal
        isOpen={showUserAuthModal}
        onClose={() => setShowUserAuthModal(false)}
        onAuthSuccess={handleUserAuthSuccess}
      />

      {/* 5. Student User Profile Modal (View / Update studying details in MongoDB) */}
      <UserProfileModal
        isOpen={showUserProfileModal}
        onClose={() => setShowUserProfileModal(false)}
        user={currentUser}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* 6. Admin Login Modal */}
      {showAdminLoginModal && (
        <AdminLoginModal
          onClose={() => setShowAdminLoginModal(false)}
          onLoginSuccess={(admin) => {
            setAdminUser(admin);
            showToast('Admin mode unlocked! You can now manage exams and post updates.', 'success', 'Welcome Admin');
          }}
        />
      )}

      {/* 5. UI Format Changer Modal */}
      <UiFormatModal
        isOpen={isFormatModalOpen}
        onClose={() => setIsFormatModalOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Floating UI Format Changer Launcher */}
      <UiFormatFloatingButton />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Mobile & Tablet Liquid Glass Floating Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
