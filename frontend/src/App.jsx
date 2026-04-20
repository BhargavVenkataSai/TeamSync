// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Main App component with routing

import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [view, setView] = useState('login'); // 'login', 'register', 'dashboard'
  const { user, loading, checkAuth } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on app load
    initTheme();
    checkAuth();
  }, [checkAuth, initTheme]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/teamsync-logo.png" 
            alt="TeamSync" 
            style={{
              height: '80px',
              width: 'auto',
              marginBottom: '24px',
              animation: 'pulse 2s ease-in-out infinite',
              filter: 'drop-shadow(0 20px 40px rgba(99, 102, 241, 0.4))',
            }}
          />
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: 0 }}>Loading TeamSync...</p>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.85; }
          }
        `}</style>
      </div>
    );
  }

  // Protected dashboard view
  if (user) {
    return <Dashboard />;
  }

  // Show auth views
  if (view === 'register') {
    return <Register onSwitchToLogin={() => setView('login')} />;
  }

  return <Login onSwitchToRegister={() => setView('register')} />;
}

export default App;
