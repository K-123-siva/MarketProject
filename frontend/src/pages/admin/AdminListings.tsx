import { useEffect, useState } from 'react';
import { Search, Star, Trash2, Eye, CheckCircle } from 'lucide-react';
import api from '../../api';

const formatPrice = (price?: number) => {
  if (!price) return '—';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString()}`;
};

export default function AdminListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/listings', { params: { search, category }, headers });
    setListings(data.listings);
    setTotal(data.total);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, category]);

  const toggleFeatured = async (id: number, isFeatured: boolean) => {
    await api.put(`/admin/listings/${id}`, { isFeatured }, { headers });
    setListings(prev => prev.map(l => l.id === id ? { ...l, isFeatured } : l));
  };

  const toggleVerified = async (id: number, isVerified: boolean) => {
    await api.put(`/admin/listings/${id}`, { isVerified }, { headers });
    setListings(prev => prev.map(l => l.id === id ? { ...l, isVerified } : l));
  };

  const deleteListing = async (id: number) => {
    if (!confirm('Delete this listing?')) return;
    await api.delete(`/admin/listings/${id}`, { headers });
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const categories = ['', 'property_sell', 'property_rent', 'furniture', 'services', 'materials'];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Listings</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{total} total listings</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '10px 16px' }}>
            <Search size={16} color="#64748b" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: 14, width: 180 }} />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, outline: 'none' }}>
            {categories.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Listing', 'Category', 'Price', 'City', 'Seller', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={7} style={{ padding: 16 }}><div style={{ height: 20, background: '#334155', borderRadius: 4 }} /></td></tr>
              ))
            ) : listings.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={l.images?.[0] || 'https://placehold.co/44x32/1e1b4b/818cf8?text=NB'} style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 6 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 600 }}>
                    {l.category?.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#a5b4fc' }}>{formatPrice(l.price)}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>{l.city || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>{l.seller?.name || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {l.isFeatured && <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 10, background: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontWeight: 600 }}>⭐ Featured</span>}
                    {l.isVerified && <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600 }}>✓ Verified</span>}
                    {!l.isFeatured && !l.isVerified && <span style={{ fontSize: 11, color: '#64748b' }}>Normal</span>}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => toggleFeatured(l.id, !l.isFeatured)} title={l.isFeatured ? 'Unfeature' : 'Feature'}
                      style={{ padding: '5px 8px', borderRadius: 6, border: 'none', background: l.isFeatured ? 'rgba(245,158,11,0.2)' : 'rgba(100,116,139,0.15)', color: l.isFeatured ? '#fbbf24' : '#64748b', cursor: 'pointer' }}>
                      <Star size={13} fill={l.isFeatured ? '#fbbf24' : 'none'} />
                    </button>
                    <button onClick={() => toggleVerified(l.id, !l.isVerified)} title={l.isVerified ? 'Unverify' : 'Verify'}
                      style={{ padding: '5px 8px', borderRadius: 6, border: 'none', background: l.isVerified ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)', color: l.isVerified ? '#10b981' : '#64748b', cursor: 'pointer' }}>
                      <CheckCircle size={13} />
                    </button>
                    <button onClick={() => deleteListing(l.id)}
                      style={{ padding: '5px 8px', borderRadius: 6, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer' }}>
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
