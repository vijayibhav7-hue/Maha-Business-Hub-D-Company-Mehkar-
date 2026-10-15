export type Category = 
  | 'Agri' 
  | 'Mobile' 
  | 'Garments' 
  | 'Hospitals' 
  | 'Coaching' 
  | 'Food' 
  | 'Services';

export type Region = 'Mehkar' | 'Lonar' | 'All';

export type PlanType = 'Free' | 'Silver ₹499' | 'Gold ₹999' | 'Platinum ₹2999';

export type Language = 'mr' | 'hi' | 'en';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
  googleBusiness?: string;
}

export interface TodaysOffer {
  title: string;
  description: string;
  discountTag: string; // e.g., "15% OFF", "FREE GIFT", "₹200 FLAT"
  validTill: string;
  isActive: boolean;
}

export interface PendingUpdate {
  todaysOffer?: TodaysOffer;
  image?: string;
  socialLinks?: SocialLinks;
  tagline?: string;
  updatedAt: string;
}

export interface BusinessSubscription {
  status: 'Free' | 'Paid';
  planName: PlanType;
  expiryDate: string; // YYYY-MM-DD
  amountPaid: number;
}

export interface Business {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  region: 'Mehkar' | 'Lonar';
  address: string;
  ownerName: string;
  ownerPhone: string;
  whatsappNumber: string;
  googleMapUrl: string;
  image: string;
  subscription: BusinessSubscription;
  todaysOffer: TodaysOffer;
  shopPin: string;
  rating: number;
  totalReviews: number;
  featured: boolean;
  createdAt: string;
  socialLinks?: SocialLinks;
  isSocialApproved?: boolean;
  pendingUpdate?: PendingUpdate;
  isPendingApproval?: boolean;
}

export interface Lead {
  id: string;
  businessId: string;
  businessName: string;
  category: Category;
  region: 'Mehkar' | 'Lonar';
  customerName: string;
  customerPhone: string;
  couponCode: string;
  claimedAt: string; // ISO string
  status: 'Claimed' | 'Redeemed';
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  imageUrl: string;
  targetShopId?: string;
  active: boolean;
}

export interface AdRequest {
  id: string;
  shopId: string;
  shopName: string;
  ownerPhone: string;
  type: 'Homepage Hero Banner (₹199/3 Days)' | 'Top Category Spotlight (₹299/Week)' | 'Push Notification Broadcast (₹499)';
  amount: number;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface StandeeOrder {
  id: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  deliveryAddress: string;
  material: 'Premium Acrylic Board (₹299)' | 'Wooden Counter Standee (₹499)' | 'Heavy Duty Vinyl Sticker (₹149)';
  amount: number;
  orderedAt: string;
  status: 'Ordered' | 'Dispatched' | 'Delivered';
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface AdminSettings {
  pinHash: string;
  adminEmail: string;
  broadcastMessage: string;
  isBroadcastActive: boolean;
  tickerText: string;
  isTickerActive: boolean;
  banners: BannerSlide[];
  // D Company Info
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyAbout: string;
}

export type ViewMode = 'directory' | 'd-qr' | 'admin' | 'shop-owner' | 'about-dcompany';
