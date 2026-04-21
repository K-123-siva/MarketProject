import { useEffect, useState } from 'react';
import { Users, List, Star, TrendingUp, Eye, CheckCircle, MessageSquare, Settings, Plus, BarChart3 } from 'lucide-react';
import api from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    api.get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
    { label: 'Total Listings', value: stats.totalListings, icon: List, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'Active Listings', value: stats.activeListings, icon: CheckCircle, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: Star, color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
    { label: 'Messages', value: stats.totalMessages || 0, icon: MessageSquare, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  ] : [];

  const quickActions = [
    { label: 'Add New Listing', icon: Plus, color: '#10b981', action: () => window.location.href = '/admin/listings/new' },
    { label: 'Create User', icon: Users, color: '#6366f1', action: () => window.location.href = '/admin/users/new' },
    { label: 'View Analytics', icon: BarChart3, color: '#f59e0b', action: () => window.location.href = '/admin/analytics' },
    { label: 'System Settings', icon: Settings, color: '#ec4899', action: () => window.location.href = '/admin/settings' },
  ];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Complete control over your NestBazaar platform</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ height: 100, background: '#1e293b', borderRadius: 14 }} />)}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 28 }}>
            {cards.map((card, i) => (
              <div key={i} style={{ background: '#1e293b', borderRadius: 14, padding: '20px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{card.label}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <card.icon size={18} color={card.color} />
                  </div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#f1f5f9' }}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#1e293b', borderRadius: 14, padding: '24px', border: '1px solid #334155', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  style={{
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 10,
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = action.color}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}
                >
                  <action.icon size={24} color={action.color} />
                  <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Stats */}
          {stats?.categoryStats?.length > 0 && (
            <div style={{ background: '#1e293b', borderRadius: 14, padding: '24px', border: '1px solid #334155', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Listings by Category</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {stats.categoryStats.map((c: any, i: number) => (
                  <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: '12px 20px', border: '1px solid #334155' }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{c.category?.replace('_', ' ')}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#818cf8' }}>{c.dataValues?.count || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Recent Listings */}
            <div style={{ background: '#1e293b', borderRadius: 14, padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Recent Listings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stats?.recentListings?.slice(0, 5).map((l: any) => (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #334155' }}>
                    <img src={l.images?.[0] || 'https://placehold.co/48x36/1e1b4b/818cf8?text=NB'} style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{l.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{l.city} • {l.seller?.name}</div>
                    </div>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: l.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: l.status === 'active' ? '#10b981' : '#f87171', fontWeight: 600 }}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div style={{ background: '#1e293b', borderRadius: 14, padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Recent Users</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stats?.recentUsers?.slice(0, 5).map((u: any) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #334155' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                      {u.name[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{u.email}</div>
                    </div>
                    {u.isVerified && <span style={{ fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Verified</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
