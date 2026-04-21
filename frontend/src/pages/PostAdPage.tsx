import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Wrench, Home, Package, Car, Smartphone } from 'lucide-react';
import api from '../api';
import { useAuthStore } from '../store/authStore';

const categories = [
  { value: 'property_sell', label: '🏢 Property for Sale', icon: Home },
  { value: 'property_rent', label: '🔑 Property for Rent', icon: Home },
  { value: 'furniture', label: '🛋️ Furniture & Decor', icon: Package },
  { value: 'materials', label: '🧱 Building Materials', icon: Package },
  { value: 'services', label: '🔧 Home Services', icon: Wrench },
  { value: 'electronics', label: '📱 Electronics', icon: Smartphone },
  { value: 'vehicles', label: '🚗 Vehicles', icon: Car },
];

// Property subcategories
const propertySubCategories = {
  property_sell: ['Apartment', 'Villa', 'Plot', 'Office', 'Shop', 'Warehouse', 'New Project'],
  property_rent: ['House', 'Apartment', 'PG/Hostel', 'Office Space', 'Shop', 'Warehouse', 'Short-Term']
};

// Furniture subcategories
const furnitureSubCategories = [
  'Sofa & Seating', 'Beds & Mattresses', 'Dining Table & Chairs', 'Wardrobes & Storage', 
  'Office Furniture', 'Kitchen Furniture', 'Outdoor Furniture', 'Decor & Lighting', 
  'Mirrors & Frames', 'Curtains & Blinds'
];

// Materials subcategories
const materialsSubCategories = [
  'Cement & Concrete', 'Steel & Iron', 'Bricks & Blocks', 'Tiles & Flooring', 
  'Paints & Coatings', 'Plumbing Materials', 'Electrical Materials', 'Wood & Timber', 
  'Glass & Mirrors', 'Hardware & Tools', 'Roofing Materials', 'Insulation Materials'
];

// Services subcategories with detailed options
const servicesSubCategories = {
  'Interior Design': ['Complete Home Design', 'Room Design', '3D Visualization', 'Consultation', 'Furniture Selection'],
  'Painting & Renovation': ['Wall Painting', 'Exterior Painting', 'Texture Painting', 'Wallpaper Installation', 'Complete Renovation'],
  'Plumbing': ['Pipe Installation', 'Leak Repair', 'Bathroom Fitting', 'Kitchen Plumbing', 'Water Tank Installation'],
  'Electrical Work': ['Wiring Installation', 'Switch & Socket Fitting', 'Fan Installation', 'Light Fitting', 'Electrical Repair'],
  'Cleaning Services': ['Deep Cleaning', 'Regular Cleaning', 'Carpet Cleaning', 'Sofa Cleaning', 'Kitchen Cleaning'],
  'Pest Control': ['Termite Control', 'Cockroach Control', 'Rodent Control', 'Mosquito Control', 'General Pest Control'],
  'Moving & Packing': ['Local Shifting', 'Intercity Moving', 'Office Relocation', 'Packing Services', 'Vehicle Transportation'],
  'Carpentry': ['Furniture Making', 'Furniture Repair', 'Door & Window Installation', 'Kitchen Cabinets', 'Custom Furniture'],
  'AC & Appliance Repair': ['AC Installation', 'AC Repair', 'Refrigerator Repair', 'Washing Machine Repair', 'Microwave Repair'],
  'Security Services': ['CCTV Installation', 'Security Guard', 'Alarm System', 'Access Control', 'Security Consultation'],
  'Landscaping': ['Garden Design', 'Lawn Maintenance', 'Plant Installation', 'Irrigation System', 'Tree Cutting']
};

// Electronics subcategories
const electronicsSubCategories = [
  'Mobile Phones', 'Laptops & Computers', 'TVs & Audio', 'Home Appliances', 
  'Gaming Equipment', 'Cameras & Photography', 'Smart Home Devices', 'Tablets & E-readers'
];

// Vehicle subcategories
const vehicleSubCategories = [
  'Cars', 'Motorcycles', 'Bicycles', 'Commercial Vehicles', 'Auto Parts & Accessories', 'Boats & Marine'
];

const inputStyle = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', fontSize: 14, outline: 'none', color: '#0f172a', background: '#f8fafc', fontFamily: 'inherit' };
const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' as const };

export default function PostAdPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState({ 
    // Common fields
    title: '', 
    description: '', 
    category: '', 
    subCategory: '', 
    price: '', 
    priceType: 'fixed', 
    location: '', 
    city: '', 
    state: '', 
    pincode: '',
    
    // Property specific
    bedrooms: '', 
    bathrooms: '', 
    area: '', 
    areaUnit: 'sqft',
    propertyAge: '',
    facing: '',
    floor: '',
    totalFloors: '',
    parking: '',
    furnishing: '',
    
    // Materials/Furniture/Electronics specific
    condition: 'new',
    brand: '',
    model: '',
    warranty: '',
    quantity: '',
    unit: '',
    
    // Services specific
    serviceType: '',
    experience: '',
    availability: 'available',
    serviceArea: '',
    certifications: '',
    languages: '',
    minPrice: '',
    maxPrice: '',
    
    // Vehicle specific
    year: '',
    kmDriven: '',
    fuelType: '',
    transmission: '',
    owners: '1'
  });

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
  const isMaterial = form.category === 'materials';
  const isService = form.category === 'services';
  const isFurniture = form.category === 'furniture';
  const isElectronics = form.category === 'electronics';
  const isVehicle = form.category === 'vehicles';

  const getSubCategories = () => {
    if (isProperty) return propertySubCategories[form.category as keyof typeof propertySubCategories] || [];
    if (isFurniture) return furnitureSubCategories;
    if (isMaterial) return materialsSubCategories;
    if (isService) return Object.keys(servicesSubCategories);
    if (isElectronics) return electronicsSubCategories;
    if (isVehicle) return vehicleSubCategories;
    return [];
  };

  const getServiceTypes = () => {
    if (isService && form.subCategory) {
      return servicesSubCategories[form.subCategory as keyof typeof servicesSubCategories] || [];
    }
    return [];
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', padding: '32px 32px 28px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Post Your Ad</h1>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>Sell properties, furniture, materials, services & more — Reach thousands of buyers across India for free</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px' }}>
        {/* Quick Guide */}
        <div style={{ background: 'linear-gradient(135deg, #eef2ff, #f0f9ff)', borderRadius: 14, padding: '20px', marginBottom: 24, border: '1px solid #c7d2fe' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e40af', marginBottom: 12 }}>💡 What can you post?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: 13, color: '#1e40af' }}>
            <div>🏢 <strong>Properties:</strong> Houses, apartments, plots, commercial spaces</div>
            <div>🧱 <strong>Materials:</strong> Cement, steel, tiles, paints, hardware</div>
            <div>🛋️ <strong>Furniture:</strong> Sofas, beds, tables, decor items</div>
            <div>🔧 <strong>Services:</strong> Plumbing, painting, cleaning, repairs</div>
            <div>📱 <strong>Electronics:</strong> Phones, laptops, appliances, gadgets</div>
            <div>🚗 <strong>Vehicles:</strong> Cars, bikes, commercial vehicles</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>📋 Select Category</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: form.category ? 20 : 0 }}>
              {categories.map(c => (
                <button key={c.value} type="button" onClick={() => setForm({ ...form, category: c.value, subCategory: '', serviceType: '' })}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    padding: '16px', 
                    borderRadius: 12, 
                    border: form.category === c.value ? '2px solid #6366f1' : '2px solid #e2e8f0', 
                    background: form.category === c.value ? '#eef2ff' : '#f8fafc', 
                    cursor: 'pointer', 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: form.category === c.value ? '#4f46e5' : '#475569',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}>
                  <c.icon size={20} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
            
            {form.category && (
              <div>
                <label style={labelStyle}>Sub Category *</label>
                <select value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value, serviceType: '' })} required style={inputStyle}>
                  <option value="">Select Sub Category</option>
                  {getSubCategories().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {/* Service Type Selection */}
            {isService && form.subCategory && (
              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Specific Service Type *</label>
                <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} required style={inputStyle}>
                  <option value="">Select Service Type</option>
                  {getServiceTypes().map(s => <option key={s} value={s}>{s}</option>)}
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
                  {isProperty && <option value="per_month">Per Month</option>}
                  {(isProperty || isMaterial) && <option value="per_sqft">Per Sqft</option>}
                  {isMaterial && <option value="per_unit">Per Unit</option>}
                  {isMaterial && <option value="per_kg">Per Kg</option>}
                  {isService && <option value="hourly">Per Hour</option>}
                  {isService && <option value="project_based">Project Based</option>}
                </select>
              </div>
            </div>
          </div>

          {/* MATERIALS SPECIFIC DETAILS */}
          {isMaterial && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                🧱 Material Specifications
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Brand *</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} 
                    placeholder="e.g. ACC, Ultratech, Asian Paints" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Condition *</label>
                  <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} required style={inputStyle}>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Quantity *</label>
                  <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} 
                    placeholder="e.g. 100" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Unit *</label>
                  <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} required style={inputStyle}>
                    <option value="">Select Unit</option>
                    <option value="bags">Bags</option>
                    <option value="tons">Tons</option>
                    <option value="kg">Kg</option>
                    <option value="pieces">Pieces</option>
                    <option value="sqft">Sq Ft</option>
                    <option value="sqm">Sq Meter</option>
                    <option value="liters">Liters</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Model/Grade</label>
                  <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} 
                    placeholder="e.g. Grade 53, OPC 43" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Manufacturing Date</label>
                  <input type="date" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* SERVICES SPECIFIC DETAILS */}
          {isService && (
            <>
              {/* Service Provider Details */}
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🔧 Service Provider Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Experience (Years) *</label>
                    <select value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} required style={inputStyle}>
                      <option value="">Select Experience</option>
                      <option value="0-1">0-1 Years</option>
                      <option value="1-3">1-3 Years</option>
                      <option value="3-5">3-5 Years</option>
                      <option value="5-10">5-10 Years</option>
                      <option value="10+">10+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Service Area (km) *</label>
                    <select value={form.serviceArea} onChange={e => setForm({ ...form, serviceArea: e.target.value })} required style={inputStyle}>
                      <option value="">Select Area</option>
                      <option value="5">Within 5 km</option>
                      <option value="10">Within 10 km</option>
                      <option value="15">Within 15 km</option>
                      <option value="25">Within 25 km</option>
                      <option value="50">Within 50 km</option>
                      <option value="city">Entire City</option>
                      <option value="state">Entire State</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Availability *</label>
                    <select value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} required style={inputStyle}>
                      <option value="available">Available Now</option>
                      <option value="weekdays">Weekdays Only</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="by_appointment">By Appointment</option>
                      <option value="emergency">24/7 Emergency</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Certifications/Licenses</label>
                    <input value={form.certifications} onChange={e => setForm({ ...form, certifications: e.target.value })} 
                      placeholder="e.g. Licensed Electrician, Certified Plumber" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Languages Spoken</label>
                    <input value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} 
                      placeholder="e.g. Hindi, English, Marathi" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Service Pricing */}
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>💰 Service Pricing</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Minimum Price (₹)</label>
                    <input type="number" value={form.minPrice} onChange={e => setForm({ ...form, minPrice: e.target.value })} 
                      placeholder="e.g. 500" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Maximum Price (₹)</label>
                    <input type="number" value={form.maxPrice} onChange={e => setForm({ ...form, maxPrice: e.target.value })} 
                      placeholder="e.g. 2000" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Warranty/Guarantee</label>
                    <input value={form.warranty} onChange={e => setForm({ ...form, warranty: e.target.value })} 
                      placeholder="e.g. 1 year warranty, 30 days guarantee" style={inputStyle} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* FURNITURE SPECIFIC DETAILS */}
          {isFurniture && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                🛋️ Furniture Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Brand</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} 
                    placeholder="e.g. IKEA, Godrej, Durian" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Condition *</label>
                  <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} required style={inputStyle}>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs_repair">Needs Repair</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Age (Years)</label>
                  <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={inputStyle}>
                    <option value="">Select</option>
                    <option value="0">Brand New</option>
                    <option value="1">Less than 1 year</option>
                    <option value="2">1-2 years</option>
                    <option value="3">2-3 years</option>
                    <option value="5">3-5 years</option>
                    <option value="10">5+ years</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Material</label>
                  <select value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} style={inputStyle}>
                    <option value="">Select</option>
                    <option value="wood">Wood</option>
                    <option value="metal">Metal</option>
                    <option value="plastic">Plastic</option>
                    <option value="glass">Glass</option>
                    <option value="fabric">Fabric</option>
                    <option value="leather">Leather</option>
                    <option value="mixed">Mixed Materials</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Dimensions (L x W x H)</label>
                <input value={form.warranty} onChange={e => setForm({ ...form, warranty: e.target.value })} 
                  placeholder="e.g. 180cm x 90cm x 75cm" style={inputStyle} />
              </div>
            </div>
          )}

          {/* ELECTRONICS SPECIFIC DETAILS */}
          {isElectronics && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                📱 Electronics Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Brand *</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} 
                    placeholder="e.g. Samsung, Apple, Sony" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Model *</label>
                  <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} 
                    placeholder="e.g. iPhone 14, Galaxy S23" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Purchase Year</label>
                  <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} style={inputStyle}>
                    <option value="">Select</option>
                    {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Condition *</label>
                  <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} required style={inputStyle}>
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="needs_repair">Needs Repair</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Warranty Status</label>
                <input value={form.warranty} onChange={e => setForm({ ...form, warranty: e.target.value })} 
                  placeholder="e.g. 6 months remaining, No warranty, Under warranty till Dec 2024" style={inputStyle} />
              </div>
            </div>
          )}

          {/* VEHICLE SPECIFIC DETAILS */}
          {isVehicle && (
            <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                🚗 Vehicle Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Brand *</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} 
                    placeholder="e.g. Maruti, Honda, Bajaj" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Model *</label>
                  <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} 
                    placeholder="e.g. Swift, City, Pulsar" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Year *</label>
                  <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required style={inputStyle}>
                    <option value="">Select Year</option>
                    {Array.from({length: 25}, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>KM Driven</label>
                  <input type="number" value={form.kmDriven} onChange={e => setForm({ ...form, kmDriven: e.target.value })} 
                    placeholder="e.g. 25000" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Fuel Type</label>
                  <select value={form.fuelType} onChange={e => setForm({ ...form, fuelType: e.target.value })} style={inputStyle}>
                    <option value="">Select</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Transmission</label>
                  <select value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })} style={inputStyle}>
                    <option value="">Select</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                    <option value="cvt">CVT</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>No. of Owners</label>
                  <select value={form.owners} onChange={e => setForm({ ...form, owners: e.target.value })} style={inputStyle}>
                    <option value="1">1st Owner</option>
                    <option value="2">2nd Owner</option>
                    <option value="3">3rd Owner</option>
                    <option value="4">4+ Owners</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PROPERTY SPECIFIC DETAILS */}
          {isProperty && (
            <>
              {/* Property Details */}
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🏠 Property Specifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Bedrooms (BHK)</label>
                    <select value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                      <option value="5">5+ BHK</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Bathrooms</label>
                    <select value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Area *</label>
                    <input type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g. 1200" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Area Unit</label>
                    <select value={form.areaUnit} onChange={e => setForm({ ...form, areaUnit: e.target.value })} style={inputStyle}>
                      <option value="sqft">Sq Ft</option>
                      <option value="sqm">Sq Meter</option>
                      <option value="acre">Acre</option>
                      <option value="bigha">Bigha</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Property Age</label>
                    <select value={form.propertyAge} onChange={e => setForm({ ...form, propertyAge: e.target.value })} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="under_construction">Under Construction</option>
                      <option value="0-1">0-1 Years</option>
                      <option value="1-5">1-5 Years</option>
                      <option value="5-10">5-10 Years</option>
                      <option value="10+">10+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Facing</label>
                    <select value={form.facing} onChange={e => setForm({ ...form, facing: e.target.value })} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="north">North</option>
                      <option value="south">South</option>
                      <option value="east">East</option>
                      <option value="west">West</option>
                      <option value="north-east">North-East</option>
                      <option value="north-west">North-West</option>
                      <option value="south-east">South-East</option>
                      <option value="south-west">South-West</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Floor</label>
                    <input type="number" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} placeholder="e.g. 3" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Total Floors</label>
                    <input type="number" value={form.totalFloors} onChange={e => setForm({ ...form, totalFloors: e.target.value })} placeholder="e.g. 10" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Property Features */}
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>🏠 Property Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Parking</label>
                    <select value={form.parking} onChange={e => setForm({ ...form, parking: e.target.value })} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="none">No Parking</option>
                      <option value="bike">Bike Parking</option>
                      <option value="car">Car Parking</option>
                      <option value="both">Both Car & Bike</option>
                      <option value="covered">Covered Parking</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Furnishing</label>
                    <select value={form.furnishing} onChange={e => setForm({ ...form, furnishing: e.target.value })} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="fully-furnished">Fully Furnished</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
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
