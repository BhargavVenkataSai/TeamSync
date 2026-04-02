// Project: TeamSync - Real-time Task Management
// File: Register component with modern glassmorphism design

import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { UserPlus, Mail, Lock, User, Loader2, Sparkles, Check, X } from 'lucide-react';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [focused, setFocused] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, loading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    clearError();
    setValidationError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };
    await register(registerData);
  };

  const displayError = validationError || error;
  
  // Password strength indicators
  const passwordChecks = [
    { label: 'At least 6 characters', valid: formData.password.length >= 6 },
    { label: 'Passwords match', valid: formData.password && formData.confirmPassword && formData.password === formData.confirmPassword },
  ];

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: Lock, placeholder: '••••••••' },
  ];

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
          <h1 style={styles.title}>Join TeamSync</h1>
          <p style={styles.subtitle}>Create your account to get started</p>
        </div>

        {/* Register Card */}
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            {displayError && (
              <div style={styles.errorBox}>
                <svg style={{ width: '18px', height: '18px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {displayError}
              </div>
            )}

            {fields.map((field) => (
              <div key={field.name} style={styles.fieldGroup}>
                <label style={styles.label}>{field.label}</label>
                <div style={styles.inputWrapper}>
                  <field.icon style={{
                    ...styles.inputIcon,
                    color: focused === field.name ? '#c084fc' : 'rgba(255,255,255,0.4)',
                  }} />
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onFocus={() => setFocused(field.name)}
                    onBlur={() => setFocused('')}
                    required
                    placeholder={field.placeholder}
                    style={{
                      ...styles.input,
                      border: `2px solid ${focused === field.name ? 'rgba(168, 85, 247, 0.8)' : 'rgba(255, 255, 255, 0.1)'}`,
                      boxShadow: focused === field.name ? '0 0 0 4px rgba(168, 85, 247, 0.15), 0 8px 20px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Password Strength Indicators */}
            {(formData.password || formData.confirmPassword) && (
              <div style={styles.passwordChecks}>
                {passwordChecks.map((check, i) => (
                  <div key={i} style={{
                    ...styles.checkItem,
                    color: check.valid ? 'rgba(134, 239, 172, 0.9)' : 'rgba(255,255,255,0.4)',
                  }}>
                    {check.valid ? (
                      <Check style={{ width: '16px', height: '16px', color: '#86efac' }} />
                    ) : (
                      <X style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.3)' }} />
                    )}
                    {check.label}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                background: loading ? 'rgba(168, 85, 247, 0.5)' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 10px 30px rgba(168, 85, 247, 0.4)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus style={{ width: '20px', height: '20px' }} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} style={styles.switchButton}>
              Sign in
            </button>
          </p>
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
    top: '-15%',
    right: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 8s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-15%',
    left: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  bgOrb3: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
  },
  wrapper: {
    width: '100%',
    maxWidth: '460px',
    position: 'relative',
    zIndex: 10,
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '76px',
    height: '76px',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    borderRadius: '22px',
    marginBottom: '18px',
    boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4)',
    position: 'relative',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    color: 'white',
  },
  sparkle: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '22px',
    height: '22px',
    color: '#fbbf24',
    filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, #e9d5ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.95rem',
    margin: 0,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '36px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    padding: '12px 14px',
    borderRadius: '12px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '8px',
    letterSpacing: '0.01em',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    transition: 'color 0.3s ease',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 48px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    fontSize: '0.95rem',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  passwordChecks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '-8px',
    marginBottom: '20px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    transition: 'color 0.3s ease',
  },
  button: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: 'white',
    padding: '15px 26px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    transition: 'all 0.3s ease',
    marginTop: '6px',
  },
  switchText: {
    marginTop: '24px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.9rem',
  },
  switchButton: {
    color: '#c084fc',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.2s',
  },
};

export default Register;
