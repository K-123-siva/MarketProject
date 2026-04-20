export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVerified?: boolean;
  role: 'user' | 'seller' | 'admin';
}

export interface Listing {
  id: number;
  title: string;
  description?: string;
  category: 'property_sell' | 'property_rent' | 'furniture' | 'services' | 'materials';
  subCategory?: string;
  price?: number;
  priceType?: string;
  location?: string;
  city?: string;
  state?: string;
  pincode?: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  amenities?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
  status?: string;
  views?: number;
  seller?: User;
  createdAt?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  reviewer?: User;
  createdAt?: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  listingId?: number;
  message: string;
  isRead: boolean;
  sender?: User;
  receiver?: User;
  createdAt?: string;
}
