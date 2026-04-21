import { useEffect, useState } from 'react';
import { Search, BadgeCheck, Trash2, ShieldOff } from 'lucide-react';
import api from '../../api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/users', { params: { search }, headers });
    setUsers(data.users);
    setTotal(data.total);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const verifyUser = async (id: number, isVerified: boolean) => {
    await api.put(`/admin/users/${id}`, { isVerified }, { headers });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified } : u));
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`, { headers });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Users</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{total} total users</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '10px 16px' }}>
          <Search size={16} color="#64748b" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: 14, width: 200 }} />
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['User', 'Email', 'Phone', 'Role', 'Verified', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={6} style={{ padding: 16 }}><div style={{ height: 20, background: '#334155', borderRadius: 4 }} /></td></tr>
              ))
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                      {u.name[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8' }}>{u.email}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8' }}>{u.phone || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: u.role === 'admin' ? 'rgba(99,102,241,0.2)' : 'rgba(100,116,139,0.2)', color: u.role === 'admin' ? '#818cf8' : '#94a3b8', fontWeight: 600 }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: u.isVerified ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)', color: u.isVerified ? '#10b981' : '#f87171', fontWeight: 600 }}>
                    {u.isVerified ? '✓ Verified' : 'Unverified'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => verifyUser(u.id, !u.isVerified)}
                      style={{ padding: '6px 10px', borderRadius: 7, border: 'none', background: u.isVerified ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: u.isVerified ? '#f87171' : '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                      {u.isVerified ? <><ShieldOff size={13} /> Unverify</> : <><BadgeCheck size={13} /> Verify</>}
                    </button>
                    <button onClick={() => deleteUser(u.id)}
                      style={{ padding: '6px 10px', borderRadius: 7, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
