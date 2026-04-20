import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Heart, Phone, MessageCircle, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';
import { Listing, Review } from '../types';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const { items, toggle } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, [id]);

  const submitReview = async () => {
    if (!user) return alert('Please login to review');
    await api.post('/reviews', { listingId: id, rating: reviewRating, comment: reviewText });
    const { data } = await api.get(`/reviews/${id}`);
    setReviews(data);
    setReviewText('');
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse"><div className="h-80 bg-gray-200 rounded-xl mb-4" /></div>;
  if (!listing) return <div className="text-center py-20 text-gray-400">Listing not found</div>;

  const images = listing.images?.length > 0 ? listing.images : ['https://placehold.co/800x500?text=No+Image'];
  const isSaved = items.includes(listing.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 mb-4 bg-gray-100 group">
            <img src={images[imgIndex]} alt={listing.title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex((imgIndex - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setImgIndex((imgIndex + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`} />)}
                </div>
              </>
            )}
          </div>
          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {images.map((img, i) => (
                <img key={i} src={img} onClick={() => setImgIndex(i)} className={`w-16 h-12 object-cover rounded-lg cursor-pointer border-2 ${i === imgIndex ? 'border-red-500' : 'border-transparent'}`} />
              ))}
            </div>
          )}

          {/* Details */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 text-gray-500 mb-3">
            <MapPin size={16} />
            <span>{listing.location}, {listing.city}, {listing.state}</span>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-4">{formatPrice(listing.price)}</div>

          {/* Specs */}
          {(listing.area || listing.bedrooms || listing.bathrooms) && (
            <div className="flex gap-6 bg-gray-50 rounded-xl p-4 mb-6">
              {listing.bedrooms && <div className="text-center"><p className="font-bold text-gray-800">{listing.bedrooms} BHK</p><p className="text-xs text-gray-500">Bedrooms</p></div>}
              {listing.bathrooms && <div className="text-center"><p className="font-bold text-gray-800">{listing.bathrooms}</p><p className="text-xs text-gray-500">Bathrooms</p></div>}
              {listing.area && <div className="text-center"><p className="font-bold text-gray-800">{listing.area} {listing.areaUnit}</p><p className="text-xs text-gray-500">Area</p></div>}
              <div className="text-center"><p className="font-bold text-gray-800 flex items-center gap-1"><Eye size={14} />{listing.views}</p><p className="text-xs text-gray-500">Views</p></div>
            </div>
          )}

          {listing.description && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
            </div>
          )}

          {listing.amenities && listing.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a, i) => <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{a}</span>)}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Reviews ({reviews.length})</h3>
            {user && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map((r) => (
                    <button key={r} onClick={() => setReviewRating(r)}>
                      <Star size={20} className={r <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write your review..." className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-red-400 resize-none" rows={3} />
                <button onClick={submitReview} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700">Submit Review</button>
              </div>
            )}
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">{r.reviewer?.name[0]}</div>
                    <span className="font-medium text-sm">{r.reviewer?.name}</span>
                    <div className="flex gap-0.5 ml-auto">
                      {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Seller Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-20">
            <button onClick={() => user ? toggle(listing.id) : alert('Please login')} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 mb-4 font-semibold text-sm transition ${isSaved ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-600 hover:border-red-400'}`}>
              <Heart size={16} className={isSaved ? 'fill-red-500' : ''} />
              {isSaved ? 'Saved' : 'Save to Wishlist'}
            </button>

            {listing.seller && (
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl mx-auto mb-2">
                  {listing.seller.avatar ? <img src={listing.seller.avatar} className="w-full h-full rounded-full object-cover" /> : listing.seller.name[0]}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <p className="font-semibold text-gray-800">{listing.seller.name}</p>
                  {listing.seller.isVerified && <BadgeCheck size={16} className="text-blue-500" />}
                </div>
                {listing.seller.isVerified && <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Verified Seller</span>}
              </div>
            )}

            {listing.seller?.phone && (
              <a href={`tel:${listing.seller.phone}`} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition mb-3">
                <Phone size={16} /> Call Seller
              </a>
            )}
            <Link to={`/chat?sellerId=${listing.seller?.id}&listingId=${listing.id}`} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-red-700 transition">
              <MessageCircle size={16} /> Chat with Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
