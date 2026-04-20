import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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

        <h2 className="cube-title">Sign In</h2>

        {error && (
          <div className="cube-error">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cube-form">
          {/* Email Field */}
          <div className="block-cube block-input">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <div className="bg-top"><div className="bg-inner" /></div>
            <div className="bg-right"><div className="bg-inner" /></div>
            <div className="bg"><div className="bg-inner" /></div>
          </div>

          {/* Password Field */}
          <div className="block-cube block-input block-input-password">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <div className="bg-top"><div className="bg-inner" /></div>
            <div className="bg-right"><div className="bg-inner" /></div>
            <div className="bg"><div className="bg-inner" /></div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="block-cube block-cube-hover" disabled={loading}>
            <div className="bg-top"><div className="bg-inner" /></div>
            <div className="bg-right"><div className="bg-inner" /></div>
            <div className="bg">
              <div className="bg-inner" />
            </div>
            <div className="cube-btn-text">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                'Log In'
              )}
            </div>
          </button>
        </form>

        <div className="cube-footer">
          <p>
            Don&apos;t have an account?{' '}
            <button onClick={onSwitchToRegister} className="cube-link">
              Create one
            </button>
          </p>
        </div>

        {/* Feature badges */}
        <div className="cube-features">
          <span>⚡ Real-time</span>
          <span>👥 Teams</span>
          <span>📊 Kanban</span>
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

        /* Animated particles */
        .cube-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .cube-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(0, 212, 255, 0.4);
          border-radius: 50%;
          bottom: -10px;
          animation: particleFloat linear infinite;
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }

        /* Subtle radial glow behind form */
        .cube-login-page::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(52, 9, 121, 0.15) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .cube-form-wrapper {
          width: 340px;
          position: relative;
          z-index: 1;
        }

        /* Logo */
        .cube-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .cube-logo-img {
          height: 120px;
          width: auto;
          filter: brightness(1.8) drop-shadow(0 8px 24px rgba(99, 102, 241, 0.35));
          transition: transform 0.3s ease;
        }
        .cube-logo-img:hover {
          transform: scale(1.05);
        }

        /* Title */
        .cube-title {
          color: #ffffff;
          font-family: monospace, serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin: 0 0 24px 0;
        }

        /* Error */
        .cube-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 8px;
          color: #f87171;
          font-size: 13px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Form */
        .cube-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ========== 3D CUBE BLOCKS ========== */
        .block-cube {
          position: relative;
          /* transition: transform 0.1s; */
        }

        .block-cube .bg-top {
          position: absolute;
          height: 10px;
          background: #20203a;
          bottom: 100%;
          left: 5px;
          right: -5px;
          transform: skew(-45deg, 0);
          transition: all 0.2s ease-in-out;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: none;
        }
        .block-cube .bg-top .bg-inner {
          bottom: 0;
        }

        .block-cube .bg-right {
          position: absolute;
          background: #20203a;
          top: -5px;
          z-index: 0;
          bottom: 5px;
          width: 10px;
          left: 100%;
          transform: skew(0, -45deg);
          transition: all 0.2s ease-in-out;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-left: none;
        }
        .block-cube .bg-right .bg-inner {
          left: 0;
        }

        .block-cube .bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #20203a;
          transition: all 0.2s ease-in-out;
          border: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 1;
        }
        .block-cube .bg .bg-inner {
          top: 0;
        }

        .block-cube .bg-inner {
          background: #1a1a2e;
          position: absolute;
          left: 2px; right: 2px; top: 2px; bottom: 2px;
          transition: top 0.2s ease-in-out, bottom 0.2s ease-in-out, left 0.2s ease-in-out;
        }

        /* ========== INPUT CUBES ========== */
        .block-input {
          position: relative;
        }
        .block-input input {
          position: relative;
          z-index: 2;
          width: 100%;
          box-sizing: border-box;
          padding: 14px 16px;
          border: none;
          background: transparent;
          color: #ffffff;
          font-size: 14px;
          font-family: monospace, serif;
          letter-spacing: 0.05em;
          outline: none;
        }
        .block-input input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        /* Password toggle */
        .block-input-password {
          position: relative;
        }
        .block-input-password input {
          padding-right: 44px;
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          border-radius: 4px;
        }
        .password-toggle:hover {
          color: rgba(0, 212, 255, 0.8);
        }

        /* Input focus → fill the cube faces */
        .block-input input:focus ~ .bg-top,
        .block-input input:focus ~ .bg-right,
        .block-input input:focus ~ .bg {
          border-color: rgba(0, 212, 255, 0.25);
        }
        .block-input input:focus ~ .bg-top .bg-inner,
        .block-input input:focus ~ .bg-right .bg-inner,
        .block-input input:focus ~ .bg .bg-inner {
          top: 100%;
        }
        .block-input input:focus ~ .bg-right .bg-inner {
          top: auto;
          left: 100%;
        }

        /* ========== BUTTON CUBE ========== */
        .block-cube-hover {
          width: 100%;
          cursor: pointer;
          position: relative;
          margin-top: 8px;
        }
        .block-cube-hover .cube-btn-text {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          color: #ffffff;
          font-family: monospace, serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.08em;
          border: none;
          background: transparent;
        }

        .block-cube-hover .bg,
        .block-cube-hover .bg-top,
        .block-cube-hover .bg-right {
          background: linear-gradient(90deg, rgba(52,9,121,1) 0%, rgba(0,212,255,1) 100%);
          transition: all 0.2s ease-in-out;
        }
        .block-cube-hover .bg-inner {
          background: #1a1a2e;
          transition: top 0.2s ease-in-out, bottom 0.2s ease-in-out, left 0.2s ease-in-out;
        }

        /* Button hover → fill the cube */
        .block-cube-hover:hover .bg .bg-inner,
        .block-cube-hover:hover .bg-top .bg-inner {
          top: 100%;
        }
        .block-cube-hover:hover .bg-right .bg-inner {
          left: 100%;
        }
        .block-cube-hover:hover .bg,
        .block-cube-hover:hover .bg-right,
        .block-cube-hover:hover .bg-top {
          border-color: rgba(0, 212, 255, 0.4);
        }

        .block-cube-hover:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ========== FOOTER ========== */
        .cube-footer {
          margin-top: 28px;
          text-align: center;
        }
        .cube-footer p {
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
          font-family: monospace, serif;
          letter-spacing: 0.03em;
        }
        .cube-link {
          background: none;
          border: none;
          color: rgba(0, 212, 255, 0.8);
          cursor: pointer;
          font-family: monospace, serif;
          font-size: 13px;
          font-weight: 600;
          transition: color 0.2s;
          text-decoration: none;
        }
        .cube-link:hover {
          color: rgba(0, 212, 255, 1);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* Features */
        .cube-features {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .cube-features span {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.25);
          font-family: monospace, serif;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 100px;
        }
      `}</style>
    </div>
  );
};

export default Login;
