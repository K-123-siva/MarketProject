import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import api from '../api';
import { useAuthStore } from '../store/authStore';

const categories = [
  { value: 'property_sell', label: '🏢 Property for Sale' },
  { value: 'property_rent', label: '🔑 Property for Rent' },
  { value: 'furniture', label: '🛋️ Furniture' },
  { value: 'services', label: '🔧 Home Services' },
  { value: 'materials', label: '🧱 Building Materials' },
];

const subCategories: Record<string, string[]> = {
  property_sell: ['Apartment', 'Villa', 'Plot', 'Office', 'Shop', 'New Project'],
  property_rent: ['House', 'Apartment', 'PG/Hostel', 'Commercial', 'Short-Term'],
  furniture: ['Living Room', 'Bedroom', 'Kitchen & Dining', 'Office', 'Outdoor'],
  services: ['Interior Design', 'Painting', 'Plumbing', 'Electrical', 'Cleaning', 'Pest Control', 'Moving & Packing'],
  materials: ['Cement & Concrete', 'Steel & Iron', 'Bricks & Blocks', 'Tiles & Flooring', 'Paints', 'Plumbing Materials', 'Electrical Materials'],
};

const inputStyle = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', color: '#0f172a', background: '#f8fafc', fontFamily: 'inherit' };
const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' as const };

export default function PostAdPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', subCategory: '', price: '', priceType: 'fixed', location: '', city: '', state: '', pincode: '', bedrooms: '', bathrooms: '', area: '', areaUnit: 'sqft' });

  if (!user) { navigate('/login'); return null; }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      images.forEach(img => fd.append('images', img));
      const { data } = await api.post('/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/listing/${data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to post ad');
    } finally { setLoading(false); }
  };

  const isProperty = form.category === 'property_sell' || form.category === 'property_rent';

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', padding: '32px 32px 28px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Post Your Ad</h1>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>Reach thousands of buyers and renters across India — for free</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>📋 Category</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: form.category ? 16 : 0 }}>
              {categories.map(c => (
                <button key={c.value} type="button" onClick={() => setForm({ ...form, category: c.value, subCategory: '' })}
                  style={{ padding: '12px 8px', borderRadius: 10, border: form.category === c.value ? '2px solid #6366f1' : '2px solid #e2e8f0', background: form.category === c.value ? '#eef2ff' : '#f8fafc', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: form.category === c.value ? '#4f46e5' : '#475569', textAlign: 'center' }}>
                  {c.label}
                </button>
              ))}
            </div>
            {form.category && (
              <div>
                <label style={labelStyle}>Sub Category</label>
                <select value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })} style={inputStyle}>
                  <option value="">Select Sub Category</option>
                  {subCategories[form.category]?.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>📝 Basic Information</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. 2BHK Apartment in Andheri West" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your listing in detail..." rows={4} style={{ ...inputStyle, resize: 'none' }} />
            </div>
          </div>

          {/* Price */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>💰 Price</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Enter price" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Price Type</label>
                <select value={form.priceType} onChange={e => setForm({ ...form, priceType: e.target.value })} style={inputStyle}>
                  <option value="fixed">Fixed</option>
                  <option value="negotiable">Negotiable</option>
                  <option value="per_month">Per Month</option>
                  <option value="per_sqft">Per Sqft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Specs */}
          {isProperty && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>🏠 Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div><label style={labelStyle}>Bedrooms (BHK)</label><input type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} placeholder="e.g. 2" style={inputStyle} /></div>
                <div><label style={labelStyle}>Bathrooms</label><input type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} placeholder="e.g. 2" style={inputStyle} /></div>
                <div><label style={labelStyle}>Area (sqft)</label><input type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g. 1200" style={inputStyle} /></div>
              </div>
            </div>
          )}

          {/* Location */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>📍 Location</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><label style={labelStyle}>Area / Locality</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Andheri West" style={inputStyle} /></div>
              <div><label style={labelStyle}>City *</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="e.g. Mumbai" required style={inputStyle} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={labelStyle}>State</label><input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="e.g. Maharashtra" style={inputStyle} /></div>
              <div><label style={labelStyle}>Pincode</label><input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="e.g. 400001" style={inputStyle} /></div>
            </div>
          </div>

          {/* Images */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>📸 Images (up to 10)</h3>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #c7d2fe', borderRadius: 12, padding: '32px', cursor: 'pointer', background: '#f5f3ff', gap: 8 }}>
              <Upload size={28} color="#6366f1" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#4f46e5' }}>Click to upload images</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>JPG, PNG, WEBP up to 5MB each</span>
              <input type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
            </label>
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                {previews.map((p, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={p} style={{ width: 80, height: 64, objectFit: 'cover', borderRadius: 8, border: '2px solid #e2e8f0' }} />
                    <button type="button" onClick={() => removeImage(i)}
                      style={{ position: 'absolute', top: -6, right: -6, background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Plus size={18} /> {loading ? 'Posting...' : 'Post Ad for Free'}
          </button>
        </form>
      </div>
    </div>
  );
}
