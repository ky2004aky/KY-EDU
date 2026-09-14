import fallbackData from '../data/fallbackData.json';

// Detect if running on a static deployment (GitHub Pages, etc.) without an explicit custom backend URL
export const isStaticDeployment = typeof window !== 'undefined' && (
  window.location.hostname.endsWith('github.io') ||
  window.location.hostname.includes('pages.dev') ||
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('netlify.app') ||
  (window.location.protocol === 'https:' && !import.meta.env.VITE_API_BASE) ||
  (!import.meta.env.VITE_API_BASE && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
);

// API Service for KY EDU PHP Backend with Cloud Demo Fallbacks for GitHub Pages
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export function getAdminToken() {
  return localStorage.getItem('ky_edu_admin_token') || '';
}

export function setAdminSession(token, admin) {
  if (token) {
    localStorage.setItem('ky_edu_admin_token', token);
    localStorage.setItem('ky_edu_admin_info', JSON.stringify(admin || { role: 'SuperAdmin' }));
  }
}

export function clearAdminSession() {
  localStorage.removeItem('ky_edu_admin_token');
  localStorage.removeItem('ky_edu_admin_info');
}

export function getAdminInfo() {
  try {
    const raw = localStorage.getItem('ky_edu_admin_info');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Student User Session
export function getUserToken() {
  return localStorage.getItem('ky_edu_user_token') || '';
}

export function setUserSession(token, user) {
  if (token) {
    localStorage.setItem('ky_edu_user_token', token);
    localStorage.setItem('ky_edu_user_info', JSON.stringify(user));
  }
}

export function clearUserSession() {
  localStorage.removeItem('ky_edu_user_token');
  localStorage.removeItem('ky_edu_user_info');
}

export function getUserInfo() {
  try {
    const raw = localStorage.getItem('ky_edu_user_info');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Local mock user storage for offline / GitHub Pages static hosting
function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem('ky_edu_mock_users') || '[]');
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem('ky_edu_mock_users', JSON.stringify(users));
  } catch {}
}

// Local mock exams storage for offline / GitHub Pages static hosting
function getLocalExams() {
  try {
    const raw = localStorage.getItem('ky_edu_mock_exams');
    return raw ? JSON.parse(raw) : (fallbackData.exams || []);
  } catch {
    return fallbackData.exams || [];
  }
}

function saveLocalExams(exams) {
  try {
    localStorage.setItem('ky_edu_mock_exams', JSON.stringify(exams));
  } catch {}
}

// Client-side Eligibility Evaluator Fallback
function localCheckEligibility(params) {
  const age = Number(params.age || 21);
  const edu = (params.educationLevel || '').toLowerCase();
  const stream = (params.stream || '').toLowerCase();
  const category = params.category || 'General';

  let relaxation = 0;
  if (category === 'OBC') relaxation = 3;
  else if (category === 'SC' || category === 'ST') relaxation = 5;
  else if (category === 'PwD') relaxation = 10;

  const exams = getLocalExams();
  const results = exams.map((exam) => {
    const minAge = exam.eligibility?.minAge || 18;
    const maxAge = (exam.eligibility?.maxAge || 32) + relaxation;
    const isAgeEligible = age >= minAge && age <= maxAge;

    const examEdu = (exam.eligibility?.educationLevel || '').toLowerCase();
    const examStream = (exam.stream || '').toLowerCase();

    let isEduEligible = true;
    if (examEdu.includes('10th') || examEdu.includes('matric')) {
      isEduEligible = true;
    } else if (examEdu.includes('12th')) {
      isEduEligible = !edu.includes('10th') && !edu.includes('iti');
    } else if (examEdu.includes('graduate') || examEdu.includes('b.tech') || examEdu.includes('b.sc')) {
      isEduEligible = edu.includes('graduate') || edu.includes('b.tech') || edu.includes('b.e') || edu.includes('degree') || edu.includes('post graduate');
    } else if (examEdu.includes('post graduate')) {
      isEduEligible = edu.includes('post graduate') || edu.includes('m.a') || edu.includes('m.sc') || edu.includes('m.tech') || edu.includes('mba');
    }

    let isStreamEligible = true;
    if (examStream.includes('any')) {
      isStreamEligible = true;
    } else if (examStream.includes('science') || examStream.includes('pcm')) {
      isStreamEligible = stream.includes('science') || stream.includes('pcm') || stream.includes('engineering') || edu.includes('b.tech');
    } else if (examStream.includes('commerce')) {
      isStreamEligible = stream.includes('commerce') || stream.includes('banking');
    } else if (examStream.includes('agri')) {
      isStreamEligible = stream.includes('agri');
    } else if (examStream.includes('medical') || examStream.includes('nursing')) {
      isStreamEligible = stream.includes('medical') || stream.includes('nursing') || stream.includes('pcb');
    } else if (examStream.includes('engineering') || examStream.includes('polytechnic')) {
      isStreamEligible = stream.includes('engineering') || stream.includes('tech') || edu.includes('diploma') || edu.includes('b.tech');
    }

    const isEligible = isAgeEligible && isEduEligible && isStreamEligible;
    const matchPercentage = isEligible ? 95 : (isAgeEligible ? 65 : 35);

    const reasons = [];
    if (!isAgeEligible) {
      if (age < minAge) reasons.push(`Below minimum age of ${minAge} years.`);
      if (age > maxAge) reasons.push(`Exceeds maximum age limit of ${maxAge} years (including ${category} relaxation).`);
    }
    if (!isEduEligible) {
      reasons.push(`Requires ${exam.eligibility?.educationLevel || 'higher qualification'}.`);
    }
    if (!isStreamEligible) {
      reasons.push(`Specific stream required: ${exam.stream}.`);
    }

    return {
      exam,
      isEligible,
      matchPercentage,
      reasons: reasons.length > 0 ? reasons : ['Meets all core age, educational and stream eligibility benchmarks!'],
      ageDetails: {
        userAge: age,
        minAge,
        maxAge,
        category,
        relaxationYears: relaxation
      }
    };
  });

  results.sort((a, b) => (b.isEligible ? 1 : 0) - (a.isEligible ? 1 : 0));
  return { success: true, results };
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}/${endpoint}`;
  const adminToken = getAdminToken();
  const userToken = getUserToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
    headers['X-Admin-Token'] = adminToken;
  } else if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
    headers['X-User-Token'] = userToken;
  }

  const config = {
    headers,
    ...options,
  };

  const res = await fetch(url, config);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    const err = new Error(data.error || `HTTP error ${res.status}`);
    err.authRequired = Boolean(data.authRequired);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // Student User Auth
  userRegister: async (userData) => {
    if (isStaticDeployment) {
      const users = getLocalUsers();
      const existing = users.find((u) => u.email.toLowerCase() === (userData.email || '').toLowerCase());
      if (existing) {
        throw new Error('An account with this email already exists.');
      }
      const newUser = {
        _id: 'user_' + Date.now(),
        name: userData.name || 'Student',
        email: userData.email,
        password: userData.password,
        age: userData.age || 21,
        std: userData.std || '12th Science (PCM)',
        department: userData.department || 'Science & Technology / Engineering',
        phone: userData.phone || '',
        created_at: new Date().toISOString()
      };
      users.push(newUser);
      saveLocalUsers(users);
      return {
        success: true,
        message: 'Registered successfully!',
        token: 'local_token_' + Date.now(),
        user: newUser
      };
    }
    try {
      return await request('user_auth.php?action=register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const users = getLocalUsers();
        const existing = users.find((u) => u.email.toLowerCase() === (userData.email || '').toLowerCase());
        if (existing) {
          throw new Error('An account with this email already exists.');
        }
        const newUser = {
          _id: 'user_' + Date.now(),
          name: userData.name || 'Student',
          email: userData.email,
          password: userData.password,
          age: userData.age || 21,
          std: userData.std || '12th Science (PCM)',
          department: userData.department || 'Science & Technology / Engineering',
          phone: userData.phone || '',
          created_at: new Date().toISOString()
        };
        users.push(newUser);
        saveLocalUsers(users);
        return {
          success: true,
          message: 'Registered successfully!',
          token: 'local_token_' + Date.now(),
          user: newUser
        };
      }
      throw err;
    }
  },

  userLogin: async (credentials) => {
    if (isStaticDeployment) {
      const users = getLocalUsers();
      const credEmail = (credentials.email || '').trim().toLowerCase();
      const user = users.find(
        (u) => (u.email.toLowerCase() === credEmail || u.phone === credEmail) && u.password === credentials.password
      );
      if (user) {
        return {
          success: true,
          token: 'local_token_' + Date.now(),
          user
        };
      }
      if (credEmail && credentials.password) {
        const quickUser = {
          _id: 'user_' + Date.now(),
          name: credEmail.includes('@') ? credEmail.split('@')[0] : 'Student',
          email: credEmail,
          age: 21,
          std: '12th Science (PCM)',
          department: 'Science & Technology / Engineering'
        };
        return {
          success: true,
          token: 'local_token_' + Date.now(),
          user: quickUser
        };
      }
      throw new Error('Please enter valid email and password.');
    }
    try {
      return await request('user_auth.php?action=login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const users = getLocalUsers();
        const credEmail = (credentials.email || '').trim().toLowerCase();
        const user = users.find(
          (u) => (u.email.toLowerCase() === credEmail || u.phone === credEmail) && u.password === credentials.password
        );
        if (user) {
          return {
            success: true,
            token: 'local_token_' + Date.now(),
            user
          };
        }
        if (credEmail && credentials.password) {
          const quickUser = {
            _id: 'user_' + Date.now(),
            name: credEmail.includes('@') ? credEmail.split('@')[0] : 'Student',
            email: credEmail,
            age: 21,
            std: '12th Science (PCM)',
            department: 'Science & Technology / Engineering'
          };
          return {
            success: true,
            token: 'local_token_' + Date.now(),
            user: quickUser
          };
        }
      }
      throw err;
    }
  },

  resetPassword: async (payload) => {
    if (isStaticDeployment) {
      const users = getLocalUsers();
      const idf = (payload.identifier || '').trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === idf || u.phone === idf);
      if (user) {
        user.password = payload.newPassword;
        saveLocalUsers(users);
        return {
          success: true,
          message: 'Password updated successfully!',
          token: 'local_token_' + Date.now(),
          user
        };
      }
      const demoUser = {
        _id: 'user_' + Date.now(),
        name: idf.includes('@') ? idf.split('@')[0] : 'Student',
        email: idf,
        age: 21,
        std: '12th Science (PCM)',
        department: 'Science & Technology / Engineering',
        phone: ''
      };
      return {
        success: true,
        message: 'Password updated successfully!',
        token: 'local_token_' + Date.now(),
        user: demoUser
      };
    }
    try {
      return await request('user_auth.php?action=reset_password', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const users = getLocalUsers();
        const idf = (payload.identifier || '').trim().toLowerCase();
        const user = users.find((u) => u.email.toLowerCase() === idf || u.phone === idf);
        if (user) {
          user.password = payload.newPassword;
          saveLocalUsers(users);
          return {
            success: true,
            message: 'Password updated successfully!',
            token: 'local_token_' + Date.now(),
            user
          };
        }
        const demoUser = {
          _id: 'user_' + Date.now(),
          name: idf.includes('@') ? idf.split('@')[0] : 'Student',
          email: idf,
          age: 21,
          std: '12th Science (PCM)',
          department: 'Science & Technology / Engineering',
          phone: ''
        };
        return {
          success: true,
          message: 'Password updated successfully!',
          token: 'local_token_' + Date.now(),
          user: demoUser
        };
      }
      throw err;
    }
  },

  getUserProfile: async () => {
    if (isStaticDeployment) {
      const u = getUserInfo();
      return { success: true, user: u };
    }
    try {
      return await request('user_auth.php?action=me');
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const u = getUserInfo();
        return { success: true, user: u };
      }
      throw err;
    }
  },

  updateUserProfile: async (profileData) => {
    if (isStaticDeployment) {
      const current = getUserInfo() || {};
      const updated = {
        ...current,
        ...profileData
      };
      setUserSession(getUserToken() || 'local_token_' + Date.now(), updated);
      const users = getLocalUsers();
      const idx = users.findIndex((u) => u.email === updated.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updated };
        saveLocalUsers(users);
      }
      return {
        success: true,
        message: 'Profile updated successfully!',
        user: updated
      };
    }
    try {
      return await request('user_auth.php?action=update', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const current = getUserInfo() || {};
        const updated = {
          ...current,
          ...profileData
        };
        setUserSession(getUserToken() || 'local_token_' + Date.now(), updated);
        const users = getLocalUsers();
        const idx = users.findIndex((u) => u.email === updated.email);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updated };
          saveLocalUsers(users);
        }
        return {
          success: true,
          message: 'Profile updated successfully!',
          user: updated
        };
      }
      throw err;
    }
  },

  // Admin Auth & Control Center
  loginAdmin: async (credentials) => {
    if (isStaticDeployment) {
      const isPinMatch = credentials.pin === '123456';
      const isPassMatch = credentials.email === 'admin@kyedu.in' && credentials.password === 'KYEDU@2026';
      if (isPinMatch || isPassMatch) {
        return {
          success: true,
          token: 'demo_admin_token_' + Date.now(),
          admin: {
            name: 'Super Administrator',
            email: 'admin@kyedu.in',
            role: 'SuperAdmin'
          }
        };
      }
      throw new Error('Invalid PIN or credentials (Default PIN: 123456)');
    }
    try {
      return await request('login.php', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const isPinMatch = credentials.pin === '123456';
        const isPassMatch = credentials.email === 'admin@kyedu.in' && credentials.password === 'KYEDU@2026';
        if (isPinMatch || isPassMatch) {
          return {
            success: true,
            token: 'demo_admin_token_' + Date.now(),
            admin: {
              name: 'Super Administrator',
              email: 'admin@kyedu.in',
              role: 'SuperAdmin'
            }
          };
        }
        throw new Error('Invalid PIN or credentials (Default PIN: 123456)');
      }
      throw err;
    }
  },

  getAdminStats: async () => {
    if (isStaticDeployment) {
      const exams = getLocalExams();
      const careers = fallbackData.careers || [];
      const updates = fallbackData.updates || [];
      const users = getLocalUsers();
      return {
        success: true,
        stats: {
          totalExams: exams.length,
          totalCareers: careers.length,
          totalUpdates: updates.length,
          registeredStudents: users.length,
          activeAlerts: updates.filter((u) => u.priority === 'High' || u.important).length
        }
      };
    }
    try {
      return await request('admin_users.php?action=stats');
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const exams = getLocalExams();
        const careers = fallbackData.careers || [];
        const updates = fallbackData.updates || [];
        const users = getLocalUsers();
        return {
          success: true,
          stats: {
            totalExams: exams.length,
            totalCareers: careers.length,
            totalUpdates: updates.length,
            registeredStudents: users.length,
            activeAlerts: updates.filter((u) => u.priority === 'High' || u.important).length
          }
        };
      }
      throw err;
    }
  },

  getAdminDashboardStats: async () => api.getAdminStats(),

  getAdminStudents: async (params = {}) => {
    if (isStaticDeployment) {
      const users = getLocalUsers();
      return {
        success: true,
        count: users.length,
        data: users
      };
    }
    try {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.department && params.department !== 'All') query.set('department', params.department);
      if (params.std && params.std !== 'All') query.set('std', params.std);
      if (params.limit) query.set('limit', params.limit);
      if (params.skip) query.set('skip', params.skip);
      const qs = query.toString();
      return await request(`admin_users.php${qs ? '?' + qs : ''}`);
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const users = getLocalUsers();
        return {
          success: true,
          count: users.length,
          data: users
        };
      }
      throw err;
    }
  },

  deleteAdminStudent: async (id) => {
    if (isStaticDeployment) {
      let users = getLocalUsers();
      users = users.filter(u => u._id !== id);
      saveLocalUsers(users);
      return { success: true, message: 'Student deleted successfully.' };
    }
    return request(`admin_users.php?id=${id}`, {
      method: 'DELETE'
    });
  },

  updateAdminPassword: async (passwords) => {
    if (isStaticDeployment) {
      return { success: true, message: 'Password updated successfully.' };
    }
    return request('admin_profile.php', {
      method: 'POST',
      body: JSON.stringify(passwords)
    });
  },

  // Stats
  getStats: async () => {
    if (isStaticDeployment) {
      const exams = getLocalExams();
      const careers = fallbackData.careers || [];
      const updates = fallbackData.updates || [];
      return {
        success: true,
        stats: {
          totalExams: exams.length,
          totalCareers: careers.length,
          totalUpdates: updates.length,
          activeAlerts: updates.filter((u) => u.priority === 'High' || u.important).length
        }
      };
    }
    try {
      return await request('stats.php');
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        const exams = getLocalExams();
        const careers = fallbackData.careers || [];
        const updates = fallbackData.updates || [];
        return {
          success: true,
          stats: {
            totalExams: exams.length,
            totalCareers: careers.length,
            totalUpdates: updates.length,
            activeAlerts: updates.filter((u) => u.priority === 'High' || u.important).length
          }
        };
      }
      throw err;
    }
  },

  // Exams CRUD
  getExams: async (params = {}) => {
    if (isStaticDeployment) {
      let list = getLocalExams();
      if (params.category && params.category !== 'All') {
        list = list.filter(e => e.category === params.category);
      }
      if (params.educationLevel && params.educationLevel !== 'All') {
        list = list.filter(e => (e.eligibility?.educationLevel || '').includes(params.educationLevel));
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(e => (e.title + ' ' + (e.shortName || '')).toLowerCase().includes(q));
      }
      return {
        success: true,
        count: list.length,
        data: list
      };
    }
    try {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.category && params.category !== 'All') query.set('category', params.category);
      if (params.educationLevel && params.educationLevel !== 'All') query.set('educationLevel', params.educationLevel);
      if (params.status && params.status !== 'All') query.set('status', params.status);
      if (params.age) query.set('age', params.age);
      if (params.limit) query.set('limit', params.limit);
      const qs = query.toString();
      return await request(`exams.php${qs ? '?' + qs : ''}`);
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        return {
          success: true,
          count: (fallbackData.exams || []).length,
          data: fallbackData.exams || []
        };
      }
      throw err;
    }
  },

  getExamById: async (id) => {
    if (isStaticDeployment) {
      const exams = getLocalExams();
      const exam = exams.find(e => e._id === id || e.id === id);
      return { success: !!exam, data: exam };
    }
    return request(`exams.php?id=${id}`);
  },

  createExam: async (examData) => {
    if (isStaticDeployment) {
      const exams = getLocalExams();
      const newExam = {
        _id: 'exam_' + Date.now(),
        ...examData,
        created_at: new Date().toISOString()
      };
      exams.unshift(newExam);
      saveLocalExams(exams);
      return { success: true, message: 'Exam created successfully!', data: newExam };
    }
    return request('exams.php', {
      method: 'POST',
      body: JSON.stringify(examData)
    });
  },

  updateExam: async (id, examData) => {
    if (isStaticDeployment) {
      const exams = getLocalExams();
      const idx = exams.findIndex(e => e._id === id || e.id === id);
      if (idx !== -1) {
        exams[idx] = { ...exams[idx], ...examData, updated_at: new Date().toISOString() };
        saveLocalExams(exams);
        return { success: true, message: 'Exam updated successfully!', data: exams[idx] };
      }
      return { success: true, message: 'Exam updated!' };
    }
    return request(`exams.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(examData)
    });
  },

  applyExamUpdate: async (id, updatePayload) => {
    if (isStaticDeployment) {
      const exams = getLocalExams();
      const idx = exams.findIndex(e => e._id === id || e.id === id);
      if (idx !== -1) {
        if (!Array.isArray(exams[idx].updates)) exams[idx].updates = [];
        exams[idx].updates.push({
          ...updatePayload,
          date: new Date().toISOString().split('T')[0]
        });
        saveLocalExams(exams);
      }
      return { success: true, message: 'Update circular applied!' };
    }
    return request(`exams.php?id=${id}&action=apply_update`, {
      method: 'PUT',
      body: JSON.stringify({ updateItem: updatePayload })
    });
  },

  deleteExam: async (id) => {
    if (isStaticDeployment) {
      let exams = getLocalExams();
      exams = exams.filter(e => e._id !== id && e.id !== id);
      saveLocalExams(exams);
      return { success: true, message: 'Exam deleted successfully!' };
    }
    return request(`exams.php?id=${id}`, {
      method: 'DELETE'
    });
  },

  // Careers CRUD
  getCareers: async (params = {}) => {
    if (isStaticDeployment) {
      let list = [...(fallbackData.careers || [])];
      if (params.stream && params.stream !== 'All') list = list.filter(c => c.stream === params.stream);
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(c => (c.title + ' ' + (c.stream || '')).toLowerCase().includes(q));
      }
      return {
        success: true,
        count: list.length,
        data: list
      };
    }
    try {
      const query = new URLSearchParams();
      if (params.stream && params.stream !== 'All') query.set('stream', params.stream);
      if (params.search) query.set('search', params.search);
      const qs = query.toString();
      return await request(`careers.php${qs ? '?' + qs : ''}`);
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        return {
          success: true,
          count: (fallbackData.careers || []).length,
          data: fallbackData.careers || []
        };
      }
      throw err;
    }
  },

  getCareerById: async (id) => {
    if (isStaticDeployment) {
      const career = (fallbackData.careers || []).find(c => c._id === id || c.id === id);
      return { success: !!career, data: career };
    }
    return request(`careers.php?id=${id}`);
  },

  createCareer: (careerData) => request('careers.php', {
    method: 'POST',
    body: JSON.stringify(careerData)
  }),

  // Updates / Notices
  getUpdates: async (params = {}) => {
    if (isStaticDeployment) {
      let list = [...(fallbackData.updates || [])];
      if (params.category && params.category !== 'All') list = list.filter(u => u.category === params.category);
      if (params.priority && params.priority !== 'All') list = list.filter(u => u.priority === params.priority);
      return {
        success: true,
        count: list.length,
        data: list
      };
    }
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.set('category', params.category);
      if (params.priority && params.priority !== 'All') query.set('priority', params.priority);
      if (params.limit) query.set('limit', params.limit);
      const qs = query.toString();
      return await request(`updates.php${qs ? '?' + qs : ''}`);
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        return {
          success: true,
          count: (fallbackData.updates || []).length,
          data: fallbackData.updates || []
        };
      }
      throw err;
    }
  },

  createUpdate: (updateData) => request('updates.php', {
    method: 'POST',
    body: JSON.stringify(updateData)
  }),

  // Smart Eligibility Engine
  checkEligibility: async (profileData) => {
    if (isStaticDeployment) {
      return localCheckEligibility(profileData);
    }
    try {
      return await request('eligibility.php', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });
    } catch (err) {
      if (err.name === 'TypeError' || !err.status) {
        return localCheckEligibility(profileData);
      }
      throw err;
    }
  },

  // Seed DB
  seedDatabase: () => request('seed.php')
};
