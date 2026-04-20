import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Loader2, Eye, EyeOff, Check, X as XIcon } from 'lucide-react';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    await register({ name: formData.name, email: formData.email, password: formData.password });
  };

  const displayError = validationError || error;

  const passwordChecks = [
    { label: 'At least 6 characters', valid: formData.password.length >= 6 },
    { label: 'Passwords match', valid: formData.password && formData.confirmPassword && formData.password === formData.confirmPassword },
  ];

  return (
    <div className="cube-login-page">
      {/* Floating particles */}
      <div className="cube-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="cube-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
          }} />
        ))}
      </div>

      <div className="cube-form-wrapper">
        {/* Logo */}
        <div className="cube-logo">
          <img src="/teamsync-logo.png" alt="TeamSync" className="cube-logo-img" />
        </div>

        <h2 className="cube-title">Create Account</h2>

        {displayError && (
          <div className="cube-error">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cube-form">
          {/* Name */}
          <div className="block-cube block-input">
            <input type="text" name="name" placeholder="Full name" required value={formData.name} onChange={handleChange} autoComplete="name" />
            <div className="bg-top"><div className="bg-inner" /></div>
            <div className="bg-right"><div className="bg-inner" /></div>
            <div className="bg"><div className="bg-inner" /></div>
          </div>

          {/* Email */}
          <div className="block-cube block-input">
            <input type="email" name="email" placeholder="Email address" required value={formData.email} onChange={handleChange} autoComplete="email" />
            <div className="bg-top"><div className="bg-inner" /></div>
            <div className="bg-right"><div className="bg-inner" /></div>
            <div className="bg"><div className="bg-inner" /></div>
          </div>

          {/* Password */}
          <div className="block-cube block-input block-input-password">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password" placeholder="Password" required value={formData.password} onChange={handleChange} autoComplete="new-password"
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <div className="bg-top"><div className="bg-inner" /></div>
            <div className="bg-right"><div className="bg-inner" /></div>
            <div className="bg"><div className="bg-inner" /></div>
          </div>

          {/* Confirm Password */}
          <div className="block-cube block-input block-input-password">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword" placeholder="Confirm password" required value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password"
            />
            <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <div className="bg-top"><div className="bg-inner" /></div>
            <div className="bg-right"><div className="bg-inner" /></div>
            <div className="bg"><div className="bg-inner" /></div>
          </div>

          {/* Password Strength */}
          {(formData.password || formData.confirmPassword) && (
            <div className="cube-pw-checks">
              {passwordChecks.map((check, i) => (
                <div key={i} className={`cube-pw-check ${check.valid ? 'valid' : ''}`}>
                  {check.valid ? <Check size={13} /> : <XIcon size={13} />}
                  {check.label}
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="block-cube block-cube-hover" disabled={loading}>
            <div className="bg-top"><div className="bg-inner" /></div>
            <div className="bg-right"><div className="bg-inner" /></div>
            <div className="bg"><div className="bg-inner" /></div>
            <div className="cube-btn-text">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </div>
          </button>
        </form>

        <div className="cube-footer">
          <p>
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="cube-link">Sign in</button>
          </p>
        </div>
      </div>

      <style>{`
        .cube-login-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a2e;
          position: relative;
          overflow: hidden;
          font-family: 'Geist', 'Inter', monospace, sans-serif;
        }
        .cube-particles { position: absolute; inset: 0; pointer-events: none; }
        .cube-particle {
          position: absolute; width: 3px; height: 3px;
          background: rgba(168, 85, 247, 0.4);
          border-radius: 50%; bottom: -10px;
          animation: particleFloat linear infinite;
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        .cube-login-page::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cube-form-wrapper { width: 340px; position: relative; z-index: 1; }
        .cube-logo { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 28px; }
        .cube-logo-img {
          height: 120px; width: auto;
          filter: brightness(1.8) drop-shadow(0 8px 24px rgba(168, 85, 247, 0.35));
          transition: transform 0.3s ease;
        }
        .cube-logo-img:hover { transform: scale(1.05); }
        .cube-title {
          color: #fff; font-family: monospace, serif; font-size: 20px;
          font-weight: 700; letter-spacing: 0.05em; margin: 0 0 20px 0;
        }
        .cube-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px;
          color: #f87171; font-size: 13px; margin-bottom: 16px;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cube-form { display: flex; flex-direction: column; gap: 16px; }

        .block-cube { position: relative; }
        .block-cube .bg-top {
          position: absolute; height: 10px; background: #20203a;
          bottom: 100%; left: 5px; right: -5px;
          transform: skew(-45deg, 0); transition: all 0.2s ease-in-out;
          border: 1px solid rgba(255,255,255,0.08); border-bottom: none;
        }
        .block-cube .bg-top .bg-inner { bottom: 0; }
        .block-cube .bg-right {
          position: absolute; background: #20203a;
          top: -5px; z-index: 0; bottom: 5px; width: 10px; left: 100%;
          transform: skew(0, -45deg); transition: all 0.2s ease-in-out;
          border: 1px solid rgba(255,255,255,0.08); border-left: none;
        }
        .block-cube .bg-right .bg-inner { left: 0; }
        .block-cube .bg {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: #20203a; transition: all 0.2s ease-in-out;
          border: 1px solid rgba(255,255,255,0.08); z-index: 1;
        }
        .block-cube .bg .bg-inner { top: 0; }
        .block-cube .bg-inner {
          background: #1a1a2e; position: absolute;
          left: 2px; right: 2px; top: 2px; bottom: 2px;
          transition: top 0.2s ease-in-out, bottom 0.2s ease-in-out, left 0.2s ease-in-out;
        }

        .block-input input {
          position: relative; z-index: 2; width: 100%; box-sizing: border-box;
          padding: 12px 16px; border: none; background: transparent;
          color: #fff; font-size: 13px; font-family: monospace, serif;
          letter-spacing: 0.05em; outline: none;
        }
        .block-input input::placeholder { color: rgba(255,255,255,0.3); }
        .block-input-password input { padding-right: 44px; }
        .password-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          z-index: 3; background: none; border: none;
          color: rgba(255,255,255,0.3); cursor: pointer; padding: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s; border-radius: 4px;
        }
        .password-toggle:hover { color: rgba(168, 85, 247, 0.8); }

        .block-input input:focus ~ .bg-top,
        .block-input input:focus ~ .bg-right,
        .block-input input:focus ~ .bg { border-color: rgba(168, 85, 247, 0.25); }
        .block-input input:focus ~ .bg-top .bg-inner,
        .block-input input:focus ~ .bg-right .bg-inner,
        .block-input input:focus ~ .bg .bg-inner { top: 100%; }
        .block-input input:focus ~ .bg-right .bg-inner { top: auto; left: 100%; }

        .block-cube-hover {
          width: 100%; cursor: pointer; position: relative; margin-top: 4px;
        }
        .block-cube-hover .cube-btn-text {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 16px; color: #fff;
          font-family: monospace, serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.08em; border: none; background: transparent;
        }
        .block-cube-hover .bg,
        .block-cube-hover .bg-top,
        .block-cube-hover .bg-right {
          background: linear-gradient(90deg, rgba(168,85,247,1) 0%, rgba(236,72,153,1) 100%);
          transition: all 0.2s ease-in-out;
        }
        .block-cube-hover .bg-inner { background: #1a1a2e; transition: top 0.2s ease-in-out, bottom 0.2s ease-in-out, left 0.2s ease-in-out; }
        .block-cube-hover:hover .bg .bg-inner,
        .block-cube-hover:hover .bg-top .bg-inner { top: 100%; }
        .block-cube-hover:hover .bg-right .bg-inner { left: 100%; }
        .block-cube-hover:hover .bg,
        .block-cube-hover:hover .bg-right,
        .block-cube-hover:hover .bg-top { border-color: rgba(236,72,153, 0.4); }
        .block-cube-hover:disabled { opacity: 0.6; cursor: not-allowed; }

        .cube-pw-checks {
          display: flex; flex-direction: column; gap: 6px;
          padding: 10px 12px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .cube-pw-check {
          display: flex; align-items: center; gap: 6px;
          font-family: monospace, serif; font-size: 11px;
          color: rgba(255,255,255,0.25); transition: color 0.3s;
        }
        .cube-pw-check.valid { color: #34d399; }

        .cube-footer { margin-top: 24px; text-align: center; }
        .cube-footer p { color: rgba(255,255,255,0.4); font-size: 13px; font-family: monospace, serif; letter-spacing: 0.03em; }
        .cube-link {
          background: none; border: none; color: rgba(168, 85, 247, 0.8);
          cursor: pointer; font-family: monospace, serif; font-size: 13px;
          font-weight: 600; transition: color 0.2s;
        }
        .cube-link:hover { color: rgba(168, 85, 247, 1); text-decoration: underline; text-underline-offset: 3px; }
      `}</style>
    </div>
  );
};

export default Register;
