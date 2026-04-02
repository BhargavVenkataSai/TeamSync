// Project: TeamSync - Real-time Task Management
// File: Zustand store for theme management (Dark Mode)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to apply theme to DOM
const applyThemeToDOM = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      theme: 'light', // 'light' or 'dark'

      // Actions
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        applyThemeToDOM(newTheme);
      },

      setTheme: (theme) => {
        set({ theme });
        applyThemeToDOM(theme);
      },

      // Initialize theme on app load
      initTheme: () => {
        const savedTheme = get().theme;
        applyThemeToDOM(savedTheme);
      },
    }),
    {
      name: 'teamsync-theme',
    }
  )
);

// Theme colors for components using inline styles
export const getThemeColors = (theme) => ({
  // Backgrounds
  bgPrimary: theme === 'dark' ? '#0f172a' : '#f8fafc',
  bgSecondary: theme === 'dark' ? '#1e293b' : '#ffffff',
  bgTertiary: theme === 'dark' ? '#334155' : '#f1f5f9',
  bgHover: theme === 'dark' ? '#475569' : '#e2e8f0',
  
  // Text colors
  textPrimary: theme === 'dark' ? '#f1f5f9' : '#1e293b',
  textSecondary: theme === 'dark' ? '#94a3b8' : '#64748b',
  textMuted: theme === 'dark' ? '#64748b' : '#94a3b8',
  
  // Border colors
  border: theme === 'dark' ? '#334155' : '#e2e8f0',
  borderLight: theme === 'dark' ? '#475569' : '#f1f5f9',
  
  // Brand colors (stay consistent)
  primary: '#6366f1',
  primaryLight: theme === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
  primaryGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  
  // Status colors
  success: '#22c55e',
  successBg: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
  warning: '#f59e0b',
  warningBg: theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
  error: '#ef4444',
  errorBg: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
  
  // Card styles
  cardBg: theme === 'dark' ? '#1e293b' : '#ffffff',
  cardShadow: theme === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
    : '0 2px 12px rgba(0, 0, 0, 0.06)',
  cardBorder: theme === 'dark' ? '1px solid #334155' : '1px solid rgba(0, 0, 0, 0.06)',
  
  // Modal overlay
  modalOverlay: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
});
