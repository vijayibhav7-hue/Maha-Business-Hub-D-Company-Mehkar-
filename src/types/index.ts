export type Category = 
  | 'Agri' 
  | 'Mobile' 
  | 'Garments' 
  | 'Hospitals' 
  | 'Coaching' 
  | 'Food' 
  | 'Grocery'
  | 'Hardware'
  | 'Jewellery'
  | 'Beauty'
  | 'Auto'
  | 'Furniture'
  | 'Footwear'
  | 'Electronics'
  | 'Stationery'
  | 'RealEstate'
  | 'Services';

export interface CategoryInfo {
  id: Category;
  labelMr: string;
  labelEn: string;
  iconName: string;
}

export const ALL_CATEGORIES: CategoryInfo[] = [
  { id: 'Agri', labelMr: 'कृषी व बियाणे (Agri)', labelEn: 'Agri & Seeds', iconName: 'Sprout' },
  { id: 'Mobile', labelMr: 'मोबाईल व रीपेअरिंग (Mobile)', labelEn: 'Mobile & Repair', iconName: 'Smartphone' },
  { id: 'Garments', labelMr: 'कपडे व साडी सेंटर (Garments)', labelEn: 'Garments & Sarees', iconName: 'Shirt' },
  { id: 'Hospitals', labelMr: 'दवाखाने व मेडिकल (Hospitals)', labelEn: 'Hospitals & Medical', iconName: 'Stethoscope' },
  { id: 'Coaching', labelMr: 'क्लासेस व एज्युकेशन (Coaching)', labelEn: 'Coaching & Education', iconName: 'GraduationCap' },
  { id: 'Food', labelMr: 'हॉटेल, बेकरी व फूड (Food)', labelEn: 'Food, Hotel & Bakery', iconName: 'Utensils' },
  { id: 'Grocery', labelMr: 'किराणा व जनरल स्टोअर (Grocery)', labelEn: 'Grocery & General Store', iconName: 'ShoppingBag' },
  { id: 'Hardware', labelMr: 'हार्डवेअर व इलेक्ट्रिकल (Hardware)', labelEn: 'Hardware & Electrical', iconName: 'Wrench' },
  { id: 'Jewellery', labelMr: 'ज्वेलर्स व सुवर्णकार (Jewellery)', labelEn: 'Jewellery & Gold', iconName: 'Gem' },
  { id: 'Beauty', labelMr: 'ब्युटी पार्लर व सलून (Beauty)', labelEn: 'Beauty Parlour & Salon', iconName: 'Sparkles' },
  { id: 'Auto', labelMr: 'ऑटोमोबाईल व गॅरेज (Auto)', labelEn: 'Auto & Garage', iconName: 'Car' },
  { id: 'Furniture', labelMr: 'फर्निचर व होम डेकोर (Furniture)', labelEn: 'Furniture & Decor', iconName: 'Armchair' },
  { id: 'Footwear', labelMr: 'फूटवेअर व चप्पल (Footwear)', labelEn: 'Footwear & Shoes', iconName: 'Footprints' },
  { id: 'Electronics', labelMr: 'होम अप्लायन्सेस (Electronics)', labelEn: 'Electronics & Appliances', iconName: 'Tv' },
  { id: 'Stationery', labelMr: 'स्टेशनरी व प्रिंटिंग (Stationery)', labelEn: 'Stationery & Printing', iconName: 'BookOpen' },
  { id: 'RealEstate', labelMr: 'प्रॉपर्टी व रिअल इस्टेट (Real Estate)', labelEn: 'Real Estate & Property', iconName: 'Building' },
  { id: 'Services', labelMr: 'सेवा व इतर व्यवसाय (Services)', labelEn: 'Services & Others', iconName: 'Briefcase' },
];

export type Region = string;

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
  id?: string;
  title: string;
  description: string;
  discountTag: string; // e.g., "15% OFF", "FREE GIFT", "₹200 FLAT"
  validTill: string;
  validFrom?: string;
  minPurchase?: number;
  terms?: string;
  isActive: boolean;
  status?: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'EXPIRED' | 'CANCELLED';
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
  region: string;
  district?: string;
  taluka?: string;
  village?: string;
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

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  village: string;
  createdAt: string;
  acceptedPrivacy: boolean;
  marketingConsent: boolean;
  favorites?: string[]; // array of businessIds
  passCode: string;
}

export interface CustomerConsent {
  id: string;
  customerId: string;
  consentType: 'PRIVACY_POLICY' | 'MARKETING_PROMO';
  granted: boolean;
  timestamp: string;
  notes?: string;
}

export interface ShoppingPass {
  id: string;
  customerId: string;
  passCode: string; // non-guessable, e.g. PASS-MBH-918231
  qrDataRef: string; // secure pass URL or token without raw phone
  createdAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface Coupon {
  id: string;
  businessId: string;
  businessName: string;
  category: Category;
  region: string;
  title: string;
  description: string;
  discountTag: string;
  validFrom: string;
  validTill: string;
  minPurchase: number;
  terms: string;
  code: string; // e.g. CPN-MEH-8921
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
}

export interface CouponRedemption {
  id: string;
  couponId: string;
  couponCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  businessId: string;
  businessName: string;
  redeemedAt: string;
  status: 'REDEEMED' | 'REJECTED' | 'PENDING';
  verifiedByStaff?: string;
  notes?: string;
}

export interface Referral {
  id: string;
  referrerCustomerId: string;
  referralCode: string; // CUST-XXXXXX
  businessId?: string;
  businessName?: string;
  visitorSession: string;
  clickedAt: string;
  purchaseInquiryAt?: string;
  confirmedPurchaseAt?: string;
  verifiedByBusinessId?: string;
  status: 'CLICKED' | 'INQUIRED' | 'VERIFIED' | 'REJECTED';
}

export interface SupportRequest {
  id: string;
  customerId?: string;
  customerName: string;
  mobile: string;
  category: 'COUPON_ISSUE' | 'SHOP_QUERY' | 'TECHNICAL' | 'OTHER';
  message: string;
  createdAt: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
}

export interface Lead {
  id: string;
  businessId: string;
  businessName: string;
  category: Category;
  region: string;
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

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  features: string[];
  popular?: boolean;
  isActive: boolean;
}

export interface AdminSettings {
  pinHash: string;
  adminEmail: string;
  broadcastMessage: string;
  isBroadcastActive: boolean;
  tickerText: string;
  isTickerActive: boolean;
  banners: BannerSlide[];
  subscriptionPlans?: SubscriptionPlan[];
  // D Company Info
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyAbout: string;
}

export interface MerchantInquiry {
  id: string;
  merchantName: string;
  shopName: string;
  category: Category;
  region: string;
  mobile: string;
  serviceInterested: string;
  packageChoice: PlanType;
  message?: string;
  createdAt: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';
}

export interface CampaignStats {
  qrScansCount: number;
  websiteVisitsCount: number;
  merchantInquiriesCount: number;
  customerRegistrationsCount: number;
}

export type ViewMode = 
  | 'directory' 
  | 'd-qr' 
  | 'admin' 
  | 'shop-owner' 
  | 'about-dcompany' 
  | 'customer-portal'
  | 'campaign-merchant'
  | 'campaign-assets';
