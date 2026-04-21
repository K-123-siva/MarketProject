import { useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, List, Star, LogOut, Shield, Home, MessageSquare, Settings, BarChart3, Plus, Package } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) navigate('/admin');
  }, [token]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: List, label: 'Listings', path: '/admin/listings' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Listing', path: '/admin/listings/new' },
    { icon: Package, label: 'Add Material', path: '/admin/materials/new' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh' }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>NestBazaar</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Admin Control Panel</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '16px 12px', borderBottom: '1px solid #334155' }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Actions</div>
          {quickActions.map(item => (
            <Link key={item.path} to={item.path}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, marginBottom: 4, textDecoration: 'none', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 13, fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)', transition: 'all 0.15s' }}>
              <item.icon size={14} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Management</div>
          {navItems.map(item => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link key={item.path} to={item.path}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, marginBottom: 4, textDecoration: 'none', background: active ? 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))' : 'transparent', color: active ? '#a5b4fc' : '#64748b', fontWeight: active ? 700 : 500, fontSize: 14, border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent', transition: 'all 0.15s' }}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #334155' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, textDecoration: 'none', color: '#64748b', fontSize: 14, marginBottom: 4 }}>
            <Home size={16} /> View Site
          </Link>
          <button onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: 260, flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
