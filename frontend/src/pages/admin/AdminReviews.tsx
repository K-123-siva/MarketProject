import { useEffect, useState } from 'react';
import { Trash2, Star } from 'lucide-react';
import api from '../../api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    api.get('/admin/reviews', { headers }).then(({ data }) => setReviews(data)).finally(() => setLoading(false));
  }, []);

  const deleteReview = async (id: number) => {
    if (!confirm('Delete this review?')) return;
    await api.delete(`/admin/reviews/${id}`, { headers });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Reviews</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>{reviews.length} total reviews</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} style={{ height: 80, background: '#1e293b', borderRadius: 12 }} />)
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <Star size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p>No reviews yet</p>
          </div>
        ) : reviews.map(r => (
          <div key={r.id} style={{ background: '#1e293b', borderRadius: 12, padding: '16px 20px', border: '1px solid #334155', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {r.reviewer?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{r.reviewer?.name || 'Unknown'}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < r.rating ? '#fbbf24' : 'none'} color={i < r.rating ? '#fbbf24' : '#334155'} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: '#64748b' }}>Listing #{r.listingId}</span>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{r.comment || 'No comment'}</p>
            </div>
            <button onClick={() => deleteReview(r.id)}
              style={{ padding: '7px 10px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', flexShrink: 0 }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
