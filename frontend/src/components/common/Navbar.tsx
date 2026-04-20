import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Menu, X, Plus, ChevronDown, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Buy Property', path: '/listings?category=property_sell' },
    { label: 'Rent Property', path: '/listings?category=property_rent' },
    { label: 'Furniture', path: '/listings?category=furniture' },
    { label: 'Services', path: '/listings?category=services' },
    { label: 'Materials', path: '/listings?category=materials' },
  ];

  return (
    <nav style={{ background: '#0f172a', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏠</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Nest<span style={{ color: '#818cf8' }}>Bazaar</span></span>
            <span style={{ fontSize: 9, color: '#64748b', letterSpacing: '0.5px' }}>INDIA'S MARKETPLACE</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="hidden lg:flex">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8, transition: 'all 0.15s', textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/wishlist" style={{ color: '#94a3b8', display: 'flex', position: 'relative' }}>
            <Heart size={20} />
          </Link>
          <Link to="/chat" style={{ color: '#94a3b8', display: 'flex' }}>
            <Bell size={20} />
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                <ChevronDown size={12} color="#94a3b8" />
              </button>
              {dropOpen && (
                <div style={{ position: 'absolute', right: 0, top: 46, background: '#1e293b', border: '1px solid #334155', borderRadius: 12, width: 200, boxShadow: '0 16px 40px rgba(0,0,0,0.4)', zIndex: 999 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{user.email}</div>
                  </div>
                  {[{ l: 'My Listings', p: '/my-listings' }, { l: 'Wishlist', p: '/wishlist' }, { l: 'Messages', p: '/chat' }].map(i => (
                    <Link key={i.p} to={i.p} onClick={() => setDropOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#cbd5e1', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      {i.l}
                    </Link>
                  ))}
                  <button onClick={() => { logout(); setDropOpen(false); navigate('/'); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid #334155' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e2e8f0', fontSize: 14, fontWeight: 500, border: '1px solid rgba(255,255,255,0.15)', padding: '7px 16px', borderRadius: 8, textDecoration: 'none' }}>
              <User size={16} /> Login
            </Link>
          )}

          <Link to="/post-ad"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}
            className="hidden md:flex">
            <Plus size={15} /> Post Ad
          </Link>

          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background: '#1e293b', borderTop: '1px solid #334155', padding: '12px 24px 20px' }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '12px 0', fontSize: 15, color: '#cbd5e1', textDecoration: 'none', borderBottom: '1px solid #334155' }}>
              {link.label}
            </Link>
          ))}
          <Link to="/post-ad" onClick={() => setMenuOpen(false)}
            style={{ display: 'block', marginTop: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', textAlign: 'center', padding: 12, borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
            + Post Free Ad
          </Link>
        </div>
      )}
    </nav>
  );
}
