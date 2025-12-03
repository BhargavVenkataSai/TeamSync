// Project: TeamSync - Real-time Task Management
// File: Login component with modern glassmorphism design

import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogIn, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focused, setFocused] = useState('');
  const { login, loading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    clearError();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div style={styles.container}>
      {/* Animated background orbs */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.bgOrb3} />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        input::placeholder { color: rgba(255,255,255,0.35); }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <div style={styles.logoBox}>
            <svg style={styles.logoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <Sparkles style={styles.sparkle} />
          </div>
          <h1 style={styles.title}>TeamSync</h1>
          <p style={styles.subtitle}>Welcome back! Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={styles.errorBox}>
                <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail style={{
                  ...styles.inputIcon,
                  color: focused === 'email' ? '#818cf8' : 'rgba(255,255,255,0.4)',
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  required
                  placeholder="Enter your email"
                  style={{
                    ...styles.input,
                    border: `2px solid ${focused === 'email' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)'}`,
                    boxShadow: focused === 'email' ? '0 0 0 4px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock style={{
                  ...styles.inputIcon,
                  color: focused === 'password' ? '#818cf8' : 'rgba(255,255,255,0.4)',
                }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  required
                  placeholder="Enter your password"
                  style={{
                    ...styles.input,
                    border: `2px solid ${focused === 'password' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)'}`,
                    boxShadow: focused === 'password' ? '0 0 0 4px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                background: loading ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 10px 30px rgba(99, 102, 241, 0.4)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '22px', height: '22px', animation: 'spin 1s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn style={{ width: '22px', height: '22px' }} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} style={styles.switchButton}>
              Create one
            </button>
          </p>
        </div>

        {/* Features */}
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>⚡</span>
            <span>Real-time sync</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>👥</span>
            <span>Team collaboration</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📊</span>
            <span>Kanban boards</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bgOrb1: {
    position: 'absolute',
    top: '-20%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 8s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-20%',
    right: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  bgOrb3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
  },
  wrapper: {
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 10,
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '24px',
    marginBottom: '20px',
    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
    position: 'relative',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    color: 'white',
  },
  sparkle: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '24px',
    height: '24px',
    color: '#fbbf24',
    filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '1rem',
    margin: 0,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '40px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    padding: '14px 16px',
    borderRadius: '12px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  fieldGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '10px',
    letterSpacing: '0.01em',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '22px',
    height: '22px',
    transition: 'color 0.3s ease',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 52px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
    fontSize: '1rem',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: 'white',
    padding: '16px 28px',
    borderRadius: '14px',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    transition: 'all 0.3s ease',
    marginTop: '8px',
  },
  switchText: {
    marginTop: '28px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.95rem',
  },
  switchButton: {
    color: '#818cf8',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.2s',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '32px',
    flexWrap: 'wrap',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.875rem',
  },
  featureIcon: {
    fontSize: '1.1rem',
  },
};

export default Login;
