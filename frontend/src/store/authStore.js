// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Zustand store for authentication

import { create } from 'zustand';
import { authAPI } from '../utils/api';

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  // Actions
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      set({ user, token, loading: false, error: null });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      set({ user, token, loading: false, error: null });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    set({ loading: true });
    try {
      const response = await authAPI.getMe();
      set({ 
        user: response.data.data.user, 
        loading: false,
        error: null 
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        loading: false,
        error: null 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
