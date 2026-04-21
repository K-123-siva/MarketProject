import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield } from 'lucide-react';
import api from '../../api';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', form);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
            <Shield size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', marginBottom: 4 }}>Admin Panel</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>NestBazaar Administration</p>
        </div>

        {/* Card */}
        <div style={{ background: '#1e293b', borderRadius: 20, padding: '36px 32px', border: '1px solid #334155', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 24, textAlign: 'center' }}>Secure Login</h2>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Admin Email" required
                style={{ width: '100%', background: '#0f172a', border: '1.5px solid #334155', borderRadius: 10, padding: '13px 14px 13px 42px', fontSize: 14, outline: 'none', color: '#f1f5f9' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Admin Password" required
                style={{ width: '100%', background: '#0f172a', border: '1.5px solid #334155', borderRadius: 10, padding: '13px 14px 13px 42px', fontSize: 14, outline: 'none', color: '#f1f5f9' }} />
            </div>

            <button type="submit" disabled={loading}
              style={{ background: loading ? '#4338ca' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, boxShadow: '0 4px 16px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Shield size={16} /> {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#475569' }}>
            🔒 Restricted access — authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
