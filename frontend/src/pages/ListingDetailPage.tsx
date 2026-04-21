import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Heart, Phone, MessageCircle, Star, Eye, ChevronLeft, ChevronRight, Share2, ArrowLeft } from 'lucide-react';
import api from '../api';
import { Listing, Review } from '../types';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';

const formatPrice = (price?: number) => {
  if (!price) return 'Price on Request';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString()}`;
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { items, toggle } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, reviewsRes] = await Promise.all([
          api.get(`/listings/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setListing(listingRes.data);
        setReviews(reviewsRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const submitReview = async () => {
    if (!user) return alert('Please login to review');
    if (!reviewText.trim()) return alert('Please write a review');
    setSubmitting(true);
    try {
      await api.post('/reviews', { listingId: id, rating: reviewRating, comment: reviewText });
      const { data } = await api.get(`/reviews/${id}`);
      setReviews(data);
      setReviewText('');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
      <div style={{ height: 480, background: '#e2e8f0', borderRadius: 16, marginBottom: 24, animation: 'pulse 1.5s infinite' }} />
    </div>
  );

  if (!listing) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Listing not found</h2>
    </div>
  );

  const images = listing.images?.length > 0 ? listing.images : ['https://placehold.co/800x500/1e1b4b/818cf8?text=NestBazaar'];
  const isSaved = items.includes(listing.id);

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Back bar */}
      <div style={{ background: '#0f172a', padding: '12px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Link to="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
            <ArrowLeft size={16} /> Back to Listings
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Image Gallery */}
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 460, background: '#1e293b', marginBottom: 20 }}>
              <img src={images[imgIndex]} alt={listing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIndex((imgIndex - 1 + images.length) % images.length)}
                    style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setImgIndex((imgIndex + 1) % images.length)}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    <ChevronRight size={20} />
                  </button>
                  <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIndex(i)}
                        style={{ width: i === imgIndex ? 24 : 8, height: 8, borderRadius: 4, background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} />
                    ))}
                  </div>
                </>
              )}

              <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
                <button style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Share2 size={16} color="#374151" />
                </button>
              </div>

              <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 8 }}>
                📷 {images.length} Photos
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto' }}>
                {images.map((img, i) => (
                  <img key={i} src={img} onClick={() => setImgIndex(i)}
                    style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: i === imgIndex ? '3px solid #6366f1' : '3px solid transparent', flexShrink: 0 }} />
                ))}
              </div>
            )}

            {/* Title & Location */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '28px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, flex: 1, marginRight: 16 }}>
                  {listing.title}
                </h1>
                {listing.isFeatured && (
                  <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    ⭐ Featured
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <MapPin size={16} color="#6366f1" />
                <span style={{ fontSize: 15, color: '#475569' }}>
                  {[listing.location, listing.city, listing.state].filter(Boolean).join(', ')}
                </span>
              </div>

              <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', marginBottom: 16 }}>
                {formatPrice(listing.price)}
                {listing.priceType === 'per_month' && <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>/month</span>}
                {listing.priceType === 'negotiable' && <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600, marginLeft: 10, background: '#d1fae5', padding: '3px 10px', borderRadius: 6 }}>Negotiable</span>}
              </div>

              {/* Category-Specific Specs */}
              <div style={{ display: 'flex', gap: 24, padding: '16px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: 16, flexWrap: 'wrap' }}>
                {/* Property specs */}
                {(listing.category === 'property_sell' || listing.category === 'property_rent') && (
                  <>
                    {listing.bedrooms && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{listing.bedrooms}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Bedrooms</div>
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{listing.bathrooms}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Bathrooms</div>
                      </div>
                    )}
                    {listing.area && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{listing.area}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{listing.areaUnit || 'sqft'}</div>
                      </div>
                    )}
                  </>
                )}

                {/* Materials/Furniture/Electronics specs */}
                {(listing.category === 'materials' || listing.category === 'furniture' || listing.category === 'electronics') && (
                  <>
                    {listing.brand && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{listing.brand}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Brand</div>
                      </div>
                    )}
                    {listing.condition && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', textTransform: 'capitalize' }}>{listing.condition.replace('_', ' ')}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Condition</div>
                      </div>
                    )}
                    {listing.quantity && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{listing.quantity}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{listing.unit || 'Units'}</div>
                      </div>
                    )}
                  </>
                )}

                {/* Services specs */}
                {listing.category === 'services' && (
                  <>
                    {listing.experience && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{listing.experience}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Experience</div>
                      </div>
                    )}
                    {listing.serviceArea && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{listing.serviceArea}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Service Area</div>
                      </div>
                    )}
                    {listing.availability && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{listing.availability}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Availability</div>
                      </div>
                    )}
                  </>
                )}

                {/* Vehicles specs */}
                {listing.category === 'vehicles' && (
                  <>
                    {listing.year && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{listing.year}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Year</div>
                      </div>
                    )}
                    {listing.kmDriven && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{listing.kmDriven.toLocaleString()}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>KM Driven</div>
                      </div>
                    )}
                    {listing.fuelType && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', textTransform: 'capitalize' }}>{listing.fuelType}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Fuel Type</div>
                      </div>
                    )}
                  </>
                )}

                {/* Views - always show */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={18} color="#6366f1" /> {listing.views || 0}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Views</div>
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Description</h3>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>{listing.description}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Amenities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {listing.amenities.map((a, i) => (
                    <span key={i} style={{ background: '#eef2ff', color: '#4f46e5', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            {(listing.category === 'property_sell' || listing.category === 'property_rent') && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Property Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {listing.propertyAge && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Property Age</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.propertyAge}</span>
                    </div>
                  )}
                  {listing.facing && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Facing</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.facing}</span>
                    </div>
                  )}
                  {listing.floor && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Floor</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.floor}{listing.totalFloors ? ` of ${listing.totalFloors}` : ''}</span>
                    </div>
                  )}
                  {listing.parking && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Parking</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.parking}</span>
                    </div>
                  )}
                  {listing.furnishing && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Furnishing</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{listing.furnishing}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Service Details */}
            {listing.category === 'services' && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Service Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {listing.serviceType && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Service Type</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.serviceType}</span>
                    </div>
                  )}
                  {listing.languages && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Languages</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.languages}</span>
                    </div>
                  )}
                  {(listing.minPrice || listing.maxPrice) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Price Range</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                        {listing.minPrice ? `₹${listing.minPrice}` : ''}
                        {listing.minPrice && listing.maxPrice ? ' - ' : ''}
                        {listing.maxPrice ? `₹${listing.maxPrice}` : ''}
                      </span>
                    </div>
                  )}
                </div>
                {listing.certifications && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Certifications</h4>
                    <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{listing.certifications}</p>
                  </div>
                )}
              </div>
            )}

            {/* Product Details (Materials/Furniture/Electronics) */}
            {(listing.category === 'materials' || listing.category === 'furniture' || listing.category === 'electronics') && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Product Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {listing.model && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Model</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.model}</span>
                    </div>
                  )}
                  {listing.year && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Year</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.year}</span>
                    </div>
                  )}
                  {listing.warranty && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Warranty</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vehicle Details */}
            {listing.category === 'vehicles' && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Vehicle Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {listing.model && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Model</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.model}</span>
                    </div>
                  )}
                  {listing.transmission && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Transmission</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{listing.transmission}</span>
                    </div>
                  )}
                  {listing.owners && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 14, color: '#64748b' }}>Owners</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{listing.owners}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>
                Reviews ({reviews.length})
              </h3>

              {/* Write Review */}
              {user && (
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px', marginBottom: 20, border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Write a Review</p>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} onClick={() => setReviewRating(r)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24 }}>
                        <Star size={24} fill={r <= reviewRating ? '#fbbf24' : 'none'} color={r <= reviewRating ? '#fbbf24' : '#d1d5db'} />
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', color: '#0f172a', background: '#fff' }} />
                  <button onClick={submitReview} disabled={submitting}
                    style={{ marginTop: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}

              {/* Review List */}
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>⭐</div>
                  <p style={{ fontSize: 14 }}>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                          {r.reviewer?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.reviewer?.name || 'User'}</p>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />)}
                          </div>
                        </div>
                      </div>
                      {r.comment && <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Seller Card */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', border: '1px solid #f1f5f9' }}>

              {/* Save */}
              <button onClick={() => user ? toggle(listing.id) : alert('Please login')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 10, border: isSaved ? '2px solid #e53e3e' : '2px solid #e2e8f0', background: isSaved ? '#fef2f2' : '#fff', color: isSaved ? '#e53e3e' : '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 16, transition: 'all 0.2s' }}>
                <Heart size={16} fill={isSaved ? '#e53e3e' : 'none'} />
                {isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>

              {/* Seller Info */}
              {listing.seller && (
                <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, margin: '0 auto 12px' }}>
                    {listing.seller.avatar
                      ? <img src={listing.seller.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : listing.seller.name[0].toUpperCase()}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>{listing.seller.name}</p>
                  {listing.seller.isVerified && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#d1fae5', color: '#065f46', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                      <BadgeCheck size={12} /> Verified Seller
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {listing.seller?.phone && (
                  <a href={`tel:${listing.seller.phone}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#16a34a', color: '#fff', padding: '13px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                    <Phone size={16} /> Call Seller
                  </a>
                )}
                <Link to={`/chat?sellerId=${listing.seller?.id}&listingId=${listing.id}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', padding: '13px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                  <MessageCircle size={16} /> Chat with Seller
                </Link>
              </div>

              {/* Price Summary */}
              <div style={{ marginTop: 20, padding: '16px', background: '#f8fafc', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>Price</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{formatPrice(listing.price)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>Category</span>
                  <span style={{ fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>{listing.category?.replace('_', ' ')}</span>
                </div>
                {listing.subCategory && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Type</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>{listing.subCategory}</span>
                  </div>
                )}
                {listing.condition && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Condition</span>
                    <span style={{ fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>{listing.condition.replace('_', ' ')}</span>
                  </div>
                )}
                {listing.brand && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Brand</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>{listing.brand}</span>
                  </div>
                )}
                {listing.city && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Location</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>{listing.city}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
