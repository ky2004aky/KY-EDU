// API Service for KY EDU PHP Backend
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
  } catch (e) {
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
  } catch (e) {
    return null;
  }
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

  try {
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
  } catch (err) {
    if (err.name === 'TypeError' || (err.status && err.status >= 500)) {
      console.error(`API Request failed on ${endpoint}:`, err);
    } else {
      console.warn(`API ${endpoint}:`, err.message);
    }
    throw err;
  }
}

export const api = {
  // Student User Auth
  userRegister: (userData) => request('user_auth.php?action=register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  userLogin: (credentials) => request('user_auth.php?action=login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  sendOtp: (payload) => request('user_auth.php?action=send_otp', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  verifyOtpLogin: (payload) => request('user_auth.php?action=verify_otp_login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  resetPassword: (payload) => request('user_auth.php?action=reset_password', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getUserProfile: () => request('user_auth.php?action=me'),

  updateUserProfile: (profileData) => request('user_auth.php?action=update', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  // Admin Auth & Control Center
  loginAdmin: (credentials) => request('login.php', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  getAdminDashboardStats: () => request('admin_dashboard.php'),

  getAdminStudents: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.department && params.department !== 'All') query.set('department', params.department);
    if (params.std && params.std !== 'All') query.set('std', params.std);
    if (params.limit) query.set('limit', params.limit);
    if (params.skip) query.set('skip', params.skip);
    const qs = query.toString();
    return request(`admin_users.php${qs ? '?' + qs : ''}`);
  },

  deleteAdminStudent: (id) => request(`admin_users.php?id=${id}`, {
    method: 'DELETE'
  }),

  updateAdminPassword: (passwords) => request('admin_profile.php', {
    method: 'POST',
    body: JSON.stringify(passwords)
  }),

  // Stats
  getStats: () => request('stats.php'),

  // Exams CRUD
  getExams: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.educationLevel && params.educationLevel !== 'All') query.set('educationLevel', params.educationLevel);
    if (params.status && params.status !== 'All') query.set('status', params.status);
    if (params.age) query.set('age', params.age);
    if (params.limit) query.set('limit', params.limit);
    const qs = query.toString();
    return request(`exams.php${qs ? '?' + qs : ''}`);
  },

  getExamById: (id) => request(`exams.php?id=${id}`),

  createExam: (examData) => request('exams.php', {
    method: 'POST',
    body: JSON.stringify(examData)
  }),

  updateExam: (id, examData) => request(`exams.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(examData)
  }),

  // Fulfills "crud rules applay the update"
  applyExamUpdate: (id, updatePayload) => request(`exams.php?id=${id}&action=apply_update`, {
    method: 'PUT',
    body: JSON.stringify({ updateItem: updatePayload })
  }),

  deleteExam: (id) => request(`exams.php?id=${id}`, {
    method: 'DELETE'
  }),

  // Careers CRUD
  getCareers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.stream && params.stream !== 'All') query.set('stream', params.stream);
    if (params.search) query.set('search', params.search);
    const qs = query.toString();
    return request(`careers.php${qs ? '?' + qs : ''}`);
  },

  getCareerById: (id) => request(`careers.php?id=${id}`),

  createCareer: (careerData) => request('careers.php', {
    method: 'POST',
    body: JSON.stringify(careerData)
  }),

  // Updates / Notices
  getUpdates: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.priority && params.priority !== 'All') query.set('priority', params.priority);
    if (params.limit) query.set('limit', params.limit);
    const qs = query.toString();
    return request(`updates.php${qs ? '?' + qs : ''}`);
  },

  createUpdate: (updateData) => request('updates.php', {
    method: 'POST',
    body: JSON.stringify(updateData)
  }),

  // Smart Eligibility Engine
  checkEligibility: (profileData) => request('eligibility.php', {
    method: 'POST',
    body: JSON.stringify(profileData)
  }),

  // Seed DB
  seedDatabase: () => request('seed.php')
};
