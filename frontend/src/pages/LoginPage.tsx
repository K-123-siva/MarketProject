import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password, form.phone);
      else await login(form.email, form.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Decorative */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative' }}>
        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 40px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏠</div>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>Nest<span style={{ color: '#6366f1' }}>Bazaar</span></span>
          </Link>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 6 }}>
            {isRegister ? 'Create Account' : 'Welcome Back!'}
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 28 }}>
            {isRegister ? 'Join thousands of users on NestBazaar' : 'Login to your NestBazaar account'}
          </p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isRegister && (
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name" required
                  style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '13px 14px 13px 42px', fontSize: 14, outline: 'none', color: '#0f172a', background: '#f8fafc' }} />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email Address" required
                style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '13px 14px 13px 42px', fontSize: 14, outline: 'none', color: '#0f172a', background: '#f8fafc' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password" required
                style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '13px 42px 13px 42px', fontSize: 14, outline: 'none', color: '#0f172a', background: '#f8fafc' }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {isRegister && (
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone Number (optional)"
                  style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '13px 14px 13px 42px', fontSize: 14, outline: 'none', color: '#0f172a', background: '#f8fafc' }} />
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', marginLeft: 6, fontSize: 14 }}>
              {isRegister ? 'Login' : 'Sign Up'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/" style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
