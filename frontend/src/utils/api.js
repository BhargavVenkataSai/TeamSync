// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Axios API configuration with interceptors

import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
  getUsers: () => API.get('/auth/users'),
};

// Tasks API methods
export const tasksAPI = {
  getAll: (params) => API.get('/tasks', { params }),
  getById: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
  getStats: () => API.get('/tasks/stats'),
  // Comments
  addComment: (taskId, data) => API.post(`/tasks/${taskId}/comments`, data),
  deleteComment: (taskId, commentId) => API.delete(`/tasks/${taskId}/comments/${commentId}`),
  // Attachments
  addAttachment: (taskId, formData) => API.post(`/tasks/${taskId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteAttachment: (taskId, attachmentId) => API.delete(`/tasks/${taskId}/attachments/${attachmentId}`),
  // Timer
  startTimer: (taskId) => API.post(`/tasks/${taskId}/timer/start`),
  stopTimer: (taskId) => API.post(`/tasks/${taskId}/timer/stop`),
};

// Activities API methods
export const activitiesAPI = {
  getAll: (params) => API.get('/activities', { params }),
  getByTask: (taskId, params) => API.get(`/activities/task/${taskId}`, { params }),
};

// Users API methods
export const usersAPI = {
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/password', data),
  getById: (id) => API.get(`/users/${id}`),
};

// Time Logs API methods
export const timelogsAPI = {
  getAll: (params) => API.get('/timelogs', { params }),
  getSummary: (params) => API.get('/timelogs/summary', { params }),
  delete: (id) => API.delete(`/timelogs/${id}`),
};

export default API;
