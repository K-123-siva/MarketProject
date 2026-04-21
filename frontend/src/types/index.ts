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
  category: 'property_sell' | 'property_rent' | 'furniture' | 'services' | 'materials' | 'electronics' | 'vehicles';
  subCategory?: string;
  price?: number;
  priceType?: string;
  location?: string;
  city?: string;
  state?: string;
  pincode?: string;
  images: string[];
  
  // Property specific
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  propertyAge?: string;
  facing?: string;
  floor?: number;
  totalFloors?: number;
  parking?: string;
  furnishing?: string;
  
  // Materials/Furniture/Electronics/Vehicles specific
  brand?: string;
  model?: string;
  condition?: string;
  warranty?: string;
  quantity?: number;
  unit?: string;
  year?: string;
  
  // Services specific
  serviceType?: string;
  experience?: string;
  availability?: string;
  serviceArea?: string;
  certifications?: string;
  languages?: string;
  minPrice?: number;
  maxPrice?: number;
  
  // Vehicle specific
  kmDriven?: number;
  fuelType?: string;
  transmission?: string;
  owners?: string;
  
  amenities?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
  status?: string;
  views?: number;
  seller?: User;
  sellerId?: number;
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
