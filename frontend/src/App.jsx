// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Main App component with routing

import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';
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
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '24px',
              marginBottom: '24px',
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Loader2 
              style={{ 
                width: '40px', 
                height: '40px', 
                color: 'white', 
                animation: 'spin 1s linear infinite',
              }} 
            />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: 0 }}>Loading TeamSync...</p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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
