import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const cities = ['Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Hyderabad', 'Delhi', 'Noida', 'Gurgaon', 'Kolkata', 'Ahmedabad', 'Lucknow'];

const propertyTabs = [
  { label: 'Residential\nProperties', icon: '🏠', value: 'property_sell', sub: 'Apartment' },
  { label: 'Commercial\nProperties', icon: '🏢', value: 'property_sell', sub: 'Office' },
  { label: 'Under\nConstruction', icon: '🏗️', value: 'property_sell', sub: 'New Project' },
  { label: 'Ready\nto Move', icon: '🔑', value: 'property_sell', sub: 'Apartment' },
];

const popularCities = ['Navi Mumbai', 'Thane', 'Andheri', 'Baner Pune', 'Whitefield', 'Gachibowli'];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Mumbai');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('category', propertyTabs[activeTab].value);
    if (propertyTabs[activeTab].sub) params.set('subCategory', propertyTabs[activeTab].sub);
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', padding: '56px 24px 64px', width: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(139,92,246,0.10)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <span style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: 12, fontWeight: 600, padding: '5px 16px', borderRadius: 20, border: '1px solid rgba(99,102,241,0.3)', letterSpacing: '0.5px' }}>
            🇮🇳 INDIA'S TRUSTED MARKETPLACE
          </span>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#f1f5f9', textAlign: 'center', marginBottom: 8, lineHeight: 1.15, letterSpacing: '-0.5px' }}>
          Find Your Perfect Property
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', textAlign: 'center', marginBottom: 36 }}>
          Buy • Sell • Rent • Furniture • Services • Materials in <span style={{ color: '#818cf8', fontWeight: 600 }}>{city}</span>
        </p>

        {/* Property Type Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          {propertyTabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '16px 10px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                border: activeTab === i ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.1)',
                background: activeTab === i ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                boxShadow: activeTab === i ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
              }}>
              <span style={{ fontSize: 26 }}>{tab.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: activeTab === i ? '#a5b4fc' : '#94a3b8', textAlign: 'center', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderRight: '1px solid #e2e8f0', minWidth: 170 }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <select value={city} onChange={(e) => setCity(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 16, fontWeight: 700, color: '#0f172a', background: 'transparent', cursor: 'pointer', width: '100%' }}>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} color="#94a3b8" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, padding: '0 20px' }}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search location, project, builder..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#0f172a', background: 'transparent', padding: '18px 0' }} />
          </div>
          <button onClick={handleSearch}
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', padding: '0 40px', height: 58, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px' }}>
            Search
          </button>
        </div>

        {/* Popular Cities */}
        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          <span style={{ color: '#64748b', fontSize: 13 }}>Popular:</span>
          {popularCities.map(c => (
            <button key={c} onClick={() => setSearch(c)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
              <MapPin size={10} color="#818cf8" /> {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
