import { 
  Business, 
  Lead, 
  AdminSettings, 
  Category, 
  AdRequest, 
  StandeeOrder, 
  AuditLog, 
  PendingUpdate, 
  SocialLinks,
  Customer,
  CustomerConsent,
  ShoppingPass,
  Coupon,
  CouponRedemption,
  Referral,
  SupportRequest,
  MerchantInquiry,
  CampaignStats,
  PlanType
} from '../types';
import { 
  INITIAL_BUSINESSES, 
  INITIAL_LEADS, 
  INITIAL_ADMIN_SETTINGS, 
  INITIAL_AD_REQUESTS, 
  INITIAL_STANDEE_ORDERS, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';

const STORAGE_KEYS = {
  BUSINESSES: 'maha_hub_businesses_v3',
  LEADS: 'maha_hub_leads_v3',
  ADMIN_SETTINGS: 'maha_hub_admin_settings_v3',
  AD_REQUESTS: 'maha_hub_ad_requests_v3',
  STANDEE_ORDERS: 'maha_hub_standee_orders_v3',
  AUDIT_LOGS: 'maha_hub_audit_logs_v3',
  OTP_STORE: 'maha_hub_otp_store_v3',
  CUSTOMERS: 'maha_hub_customers_v3',
  CURRENT_CUSTOMER: 'maha_hub_current_customer_v3',
  CUSTOMER_CONSENTS: 'maha_hub_consents_v3',
  COUPONS: 'maha_hub_coupons_v3',
  COUPON_REDEMPTIONS: 'maha_hub_redemptions_v3',
  REFERRALS: 'maha_hub_referrals_v3',
  SUPPORT_REQUESTS: 'maha_hub_support_requests_v3',
};

// Initial Sample Coupons (Empty for live)
const INITIAL_COUPONS: Coupon[] = [];

// Clear All Demo Data Helper
export const clearAllDemoData = (): void => {
  try {
    // Remove all cached keys starting with maha_hub
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('maha_hub')) {
        localStorage.removeItem(key);
      }
    });
  } catch {}

  // Explicitly set empty arrays for all business/lead keys
  localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.AD_REQUESTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.STANDEE_ORDERS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_CONSENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.COUPON_REDEMPTIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SUPPORT_REQUESTS, JSON.stringify([]));
  localStorage.setItem('maha_hub_merchant_inquiries_v3', JSON.stringify([]));
  localStorage.setItem('maha_hub_campaign_stats_v3', JSON.stringify({
    qrScansCount: 0,
    websiteVisitsCount: 0,
    merchantInquiriesCount: 0,
    customerRegistrationsCount: 0
  }));
};

// Initialize Storage if empty
export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BUSINESSES)) {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(INITIAL_ADMIN_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AD_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.AD_REQUESTS, JSON.stringify(INITIAL_AD_REQUESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STANDEE_ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.STANDEE_ORDERS, JSON.stringify(INITIAL_STANDEE_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMER_CONSENTS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_CONSENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPON_REDEMPTIONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPON_REDEMPTIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REFERRALS)) {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUPPORT_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_REQUESTS, JSON.stringify([]));
  }
};

// OTP SIMULATION ENGINE
export const sendSimulatedOTP = (mobileOrEmail: string): string => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.OTP_STORE) || '{}');
  store[mobileOrEmail.trim()] = {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  localStorage.setItem(STORAGE_KEYS.OTP_STORE, JSON.stringify(store));
  return code;
};

export const verifySimulatedOTP = (mobileOrEmail: string, inputCode: string): boolean => {
  const store = JSON.parse(localStorage.getItem(STORAGE_KEYS.OTP_STORE) || '{}');
  const entry = store[mobileOrEmail.trim()];
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) return false;
  return entry.code.trim() === inputCode.trim();
};

// CUSTOMER MANAGEMENT
export const getCustomers = (): Customer[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getCurrentCustomer = (): Customer | null => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_CUSTOMER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentCustomer = (customer: Customer | null): void => {
  if (customer) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CUSTOMER, JSON.stringify(customer));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CUSTOMER);
  }
};

export const registerCustomer = (
  name: string,
  mobile: string,
  village: string,
  acceptedPrivacy: boolean,
  marketingConsent: boolean
): Customer => {
  const customers = getCustomers();
  const cleanMobile = mobile.trim();
  const existing = customers.find((c) => c.mobile === cleanMobile);

  const passCode = `PASS-MBH-${Math.floor(100000 + Math.random() * 900000)}`;

  if (existing) {
    const updatedCustomer: Customer = {
      ...existing,
      name: name.trim() || existing.name,
      village: village.trim() || existing.village,
      acceptedPrivacy: acceptedPrivacy || existing.acceptedPrivacy,
      marketingConsent: marketingConsent,
    };
    const list = customers.map((c) => (c.id === existing.id ? updatedCustomer : c));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
    setCurrentCustomer(updatedCustomer);
    
    addConsentLog(existing.id, 'PRIVACY_POLICY', acceptedPrivacy, 'Updated privacy acceptance during login');
    addConsentLog(existing.id, 'MARKETING_PROMO', marketingConsent, 'Updated marketing preferences during login');

    return updatedCustomer;
  }

  const newCustomer: Customer = {
    id: `cust-${Date.now()}`,
    name: name.trim(),
    mobile: cleanMobile,
    village: village.trim() || 'Mehkar',
    createdAt: new Date().toISOString(),
    acceptedPrivacy,
    marketingConsent,
    favorites: [],
    passCode,
  };

  const updatedList = [newCustomer, ...customers];
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updatedList));
  setCurrentCustomer(newCustomer);

  addConsentLog(newCustomer.id, 'PRIVACY_POLICY', acceptedPrivacy, 'Initial registration consent');
  addConsentLog(newCustomer.id, 'MARKETING_PROMO', marketingConsent, 'Initial registration marketing consent');
  addAuditLog('CUSTOMER_REGISTERED', newCustomer.name, `New customer registered from ${newCustomer.village}`);

  return newCustomer;
};

export const updateCustomerMarketingConsent = (customerId: string, consent: boolean): Customer | null => {
  const customers = getCustomers();
  const idx = customers.findIndex((c) => c.id === customerId);
  if (idx === -1) return null;

  customers[idx].marketingConsent = consent;
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));

  const current = getCurrentCustomer();
  if (current && current.id === customerId) {
    setCurrentCustomer(customers[idx]);
  }

  addConsentLog(customerId, 'MARKETING_PROMO', consent, consent ? 'Opted in to marketing updates' : 'Withdrew marketing consent');
  return customers[idx];
};

export const deleteCustomerAccount = (customerId: string): void => {
  const customers = getCustomers();
  const filtered = customers.filter((c) => c.id !== customerId);
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(filtered));

  const current = getCurrentCustomer();
  if (current && current.id === customerId) {
    setCurrentCustomer(null);
  }

  addConsentLog(customerId, 'PRIVACY_POLICY', false, 'Account deletion request completed');
  addAuditLog('CUSTOMER_DELETED', customerId, 'Customer requested account and data deletion');
};

// CONSENT LOGS
export const getConsentLogs = (): CustomerConsent[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_CONSENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addConsentLog = (
  customerId: string,
  consentType: 'PRIVACY_POLICY' | 'MARKETING_PROMO',
  granted: boolean,
  notes?: string
): CustomerConsent => {
  const logs = getConsentLogs();
  const entry: CustomerConsent = {
    id: `cst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerId,
    consentType,
    granted,
    timestamp: new Date().toISOString(),
    notes,
  };
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_CONSENTS, JSON.stringify([entry, ...logs]));
  return entry;
};

// FAVORITES
export const toggleFavoriteShop = (customerId: string, businessId: string): string[] => {
  const customers = getCustomers();
  const idx = customers.findIndex((c) => c.id === customerId);
  if (idx === -1) return [];

  const currentFavs = customers[idx].favorites || [];
  const exists = currentFavs.includes(businessId);
  const updatedFavs = exists
    ? currentFavs.filter((id) => id !== businessId)
    : [...currentFavs, businessId];

  customers[idx].favorites = updatedFavs;
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));

  const current = getCurrentCustomer();
  if (current && current.id === customerId) {
    setCurrentCustomer(customers[idx]);
  }

  return updatedFavs;
};

// COUPON LIFECYCLE & REDEMPTION
export const getCoupons = (): Coupon[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return raw ? JSON.parse(raw) : INITIAL_COUPONS;
  } catch {
    return INITIAL_COUPONS;
  }
};

export const getPublishedCoupons = (): Coupon[] => {
  const all = getCoupons();
  const today = new Date().toISOString().split('T')[0];
  return all.filter((c) => c.status === 'PUBLISHED' && c.validTill >= today);
};

export const addCoupon = (
  businessId: string,
  businessName: string,
  category: Category,
  region: 'Mehkar' | 'Lonar',
  title: string,
  description: string,
  discountTag: string,
  validFrom: string,
  validTill: string,
  minPurchase: number,
  terms: string,
  status: Coupon['status'] = 'PENDING_APPROVAL'
): Coupon => {
  const list = getCoupons();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const regionCode = region.substring(0, 3).toUpperCase();
  const code = `MAHA-${regionCode}-${randomNum}`;

  const coupon: Coupon = {
    id: `cpn-${Date.now()}`,
    businessId,
    businessName,
    category,
    region,
    title,
    description,
    discountTag,
    validFrom,
    validTill,
    minPurchase,
    terms,
    code,
    status,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify([coupon, ...list]));
  addAuditLog('COUPON_CREATED', businessName, `Created coupon: ${title} (${status})`);
  return coupon;
};

export const updateCouponStatus = (couponId: string, status: Coupon['status']): Coupon | null => {
  const list = getCoupons();
  const idx = list.findIndex((c) => c.id === couponId);
  if (idx === -1) return null;

  list[idx].status = status;
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(list));
  addAuditLog('COUPON_STATUS_CHANGED', list[idx].businessName, `Coupon ${list[idx].code} status changed to ${status}`);
  return list[idx];
};

export const getCouponRedemptions = (): CouponRedemption[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUPON_REDEMPTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const redeemCoupon = (
  couponId: string,
  couponCode: string,
  customerId: string,
  customerName: string,
  customerPhone: string,
  businessId: string,
  businessName: string
): { success: boolean; message: string; redemption?: CouponRedemption } => {
  const redemptions = getCouponRedemptions();

  // Prevent duplicate redemption by same customer for same coupon
  const existing = redemptions.find(
    (r) => r.couponCode === couponCode && r.customerId === customerId && r.status === 'REDEEMED'
  );

  if (existing) {
    return {
      success: false,
      message: 'तुम्ही हे कूपन आधीच वापरले (Redeem) केले आहे.',
    };
  }

  const redemption: CouponRedemption = {
    id: `red-${Date.now()}`,
    couponId,
    couponCode,
    customerId,
    customerName,
    customerPhone,
    businessId,
    businessName,
    redeemedAt: new Date().toISOString(),
    status: 'REDEEMED',
    verifiedByStaff: 'Shop Staff Verified',
  };

  localStorage.setItem(STORAGE_KEYS.COUPON_REDEMPTIONS, JSON.stringify([redemption, ...redemptions]));
  
  // Also add to leads for shop visibility
  addLead(businessId, businessName, 'Services', 'Mehkar', customerName, customerPhone);
  addAuditLog('COUPON_REDEEMED', customerName, `Redeemed coupon ${couponCode} at ${businessName}`);

  return {
    success: true,
    message: 'कूपन यशस्वीरित्या रिडीम झाले!',
    redemption,
  };
};

export const verifyCouponRedemptionByStaff = (
  couponCode: string,
  businessId: string,
  staffPin: string
): { success: boolean; message: string; redemption?: CouponRedemption } => {
  const shop = getBusinessById(businessId);
  if (!shop || shop.shopPin.trim() !== staffPin.trim()) {
    return { success: false, message: 'अवैध दुकान पिन (Invalid Shop PIN)' };
  }

  const redemptions = getCouponRedemptions();
  const target = redemptions.find((r) => r.couponCode.trim() === couponCode.trim() && r.businessId === businessId);

  if (!target) {
    return { success: false, message: 'कूपन कोड आढळला नाही किंवा हे कूपन या दुकानाचे नाही.' };
  }

  target.status = 'REDEEMED';
  target.verifiedByStaff = `Verified by ${shop.ownerName} (PIN: ${staffPin})`;
  localStorage.setItem(STORAGE_KEYS.COUPON_REDEMPTIONS, JSON.stringify(redemptions));

  addAuditLog('STAFF_VERIFIED_REDEMPTION', shop.name, `Verified coupon ${couponCode} for customer ${target.customerName}`);

  return {
    success: true,
    message: `कूपन पुष्टी पूर्ण! ग्राहकाचे नाव: ${target.customerName}`,
    redemption: target,
  };
};

// REFERRAL ENGINE
export const getReferrals = (): Referral[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const trackReferralClick = (referralCode: string, businessId?: string, businessName?: string): Referral => {
  const list = getReferrals();
  const session = `sess-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const ref: Referral = {
    id: `ref-${Date.now()}`,
    referrerCustomerId: referralCode,
    referralCode,
    businessId,
    businessName,
    visitorSession: session,
    clickedAt: new Date().toISOString(),
    status: 'CLICKED',
  };

  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify([ref, ...list]));
  return ref;
};

export const markReferralInquiry = (referralId: string): void => {
  const list = getReferrals();
  const idx = list.findIndex((r) => r.id === referralId);
  if (idx !== -1) {
    list[idx].purchaseInquiryAt = new Date().toISOString();
    list[idx].status = 'INQUIRED';
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(list));
  }
};

export const confirmReferralPurchaseByMerchant = (
  referralId: string,
  businessId: string
): { success: boolean; message: string } => {
  const list = getReferrals();
  const idx = list.findIndex((r) => r.id === referralId);
  if (idx === -1) return { success: false, message: 'रेफरल रेकॉर्ड सापडला नाही.' };

  const shop = getBusinessById(businessId);
  list[idx].confirmedPurchaseAt = new Date().toISOString();
  list[idx].verifiedByBusinessId = businessId;
  list[idx].status = 'VERIFIED';

  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(list));
  addAuditLog('REFERRAL_CONFIRMED', shop?.name || businessId, `Confirmed purchase for referral ${referralId}`);

  return { success: true, message: 'रेफरल खरेदीची यशस्वीरित्या पुष्टी केली!' };
};

// SUPPORT REQUESTS
export const getSupportRequests = (): SupportRequest[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPORT_REQUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addSupportRequest = (
  customerId: string | undefined,
  customerName: string,
  mobile: string,
  category: SupportRequest['category'],
  message: string
): SupportRequest => {
  const list = getSupportRequests();
  const req: SupportRequest = {
    id: `supp-${Date.now()}`,
    customerId,
    customerName: customerName.trim(),
    mobile: mobile.trim(),
    category,
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'NEW',
  };

  localStorage.setItem(STORAGE_KEYS.SUPPORT_REQUESTS, JSON.stringify([req, ...list]));
  addAuditLog('SUPPORT_REQUEST_SUBMITTED', customerName, `Submitted support query (${category})`);
  return req;
};

// AUDIT LOGS
export const getAuditLogs = (): AuditLog[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
};

export const addAuditLog = (action: string, performedBy: string, details: string): void => {
  const logs = getAuditLogs();
  const log: AuditLog = {
    id: `log-${Date.now()}`,
    action,
    performedBy,
    timestamp: new Date().toISOString(),
    details,
  };
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([log, ...logs]));
};

// AD REQUESTS
export const getAdRequests = (): AdRequest[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AD_REQUESTS);
    return raw ? JSON.parse(raw) : INITIAL_AD_REQUESTS;
  } catch {
    return INITIAL_AD_REQUESTS;
  }
};

export const addAdRequest = (
  shopId: string,
  shopName: string,
  ownerPhone: string,
  type: AdRequest['type'],
  amount: number
): AdRequest => {
  const list = getAdRequests();
  const req: AdRequest = {
    id: `ad-req-${Date.now()}`,
    shopId,
    shopName,
    ownerPhone,
    type,
    amount,
    requestedAt: new Date().toISOString(),
    status: 'Pending',
  };
  const updated = [req, ...list];
  localStorage.setItem(STORAGE_KEYS.AD_REQUESTS, JSON.stringify(updated));
  addAuditLog('AD_REQUESTED', shopName, `Requested ad boost: ${type} for ₹${amount}`);
  return req;
};

export const updateAdRequestStatus = (id: string, status: AdRequest['status']): void => {
  const list = getAdRequests();
  const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
  localStorage.setItem(STORAGE_KEYS.AD_REQUESTS, JSON.stringify(updated));
};

// STANDEE ORDERS
export const getStandeeOrders = (): StandeeOrder[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STANDEE_ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_STANDEE_ORDERS;
  } catch {
    return INITIAL_STANDEE_ORDERS;
  }
};

export const addStandeeOrder = (
  shopId: string,
  shopName: string,
  ownerName: string,
  ownerPhone: string,
  deliveryAddress: string,
  material: StandeeOrder['material'],
  amount: number
): StandeeOrder => {
  const list = getStandeeOrders();
  const order: StandeeOrder = {
    id: `ord-${Date.now()}`,
    shopId,
    shopName,
    ownerName,
    ownerPhone,
    deliveryAddress,
    material,
    amount,
    orderedAt: new Date().toISOString(),
    status: 'Ordered',
  };
  const updated = [order, ...list];
  localStorage.setItem(STORAGE_KEYS.STANDEE_ORDERS, JSON.stringify(updated));
  addAuditLog('STANDEE_ORDERED', shopName, `Ordered D-QR Standee (${material}) for ₹${amount}`);
  return order;
};

export const updateStandeeOrderStatus = (id: string, status: StandeeOrder['status']): void => {
  const list = getStandeeOrders();
  const updated = list.map((o) => (o.id === id ? { ...o, status } : o));
  localStorage.setItem(STORAGE_KEYS.STANDEE_ORDERS, JSON.stringify(updated));
};

// Get all businesses
export const getBusinesses = (): Business[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return raw ? JSON.parse(raw) : INITIAL_BUSINESSES;
  } catch (e) {
    return INITIAL_BUSINESSES;
  }
};

// Save businesses
export const saveBusinesses = (businesses: Business[]): void => {
  localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
};

// Get single business
export const getBusinessById = (id: string): Business | undefined => {
  const list = getBusinesses();
  return list.find((b) => b.id === id);
};

// Add new business (Direct Admin addition is approved immediately)
export const addBusiness = (
  newBiz: Omit<Business, 'id' | 'createdAt' | 'rating' | 'totalReviews' | 'featured'>
): Business => {
  const list = getBusinesses();
  const id = `biz-${Date.now()}`;
  const business: Business = {
    ...newBiz,
    id,
    rating: 5.0,
    totalReviews: 1,
    featured: newBiz.subscription.status === 'Paid',
    createdAt: new Date().toISOString().split('T')[0],
    isSocialApproved: true,
    isPendingApproval: false,
  };

  const updated = [business, ...list];
  saveBusinesses(updated);
  addAuditLog('SHOP_ADDED', 'D Company Admin', `Added shop: ${newBiz.name} (${newBiz.region})`);
  return business;
};

// Admin direct update
export const updateBusiness = (id: string, updates: Partial<Business>): Business | null => {
  const list = getBusinesses();
  const index = list.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const updatedBiz = { ...list[index], ...updates };
  list[index] = updatedBiz;
  saveBusinesses(list);
  addAuditLog('SHOP_UPDATED', updatedBiz.name, `Updated shop profile / offer`);
  return updatedBiz;
};

// Shopkeeper submits pending update (Requires Admin Approval)
export const submitShopPendingUpdate = (
  id: string,
  update: {
    todaysOffer?: Business['todaysOffer'];
    image?: string;
    socialLinks?: SocialLinks;
    tagline?: string;
  }
): Business | null => {
  const list = getBusinesses();
  const index = list.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const shop = list[index];
  const pending: PendingUpdate = {
    ...update,
    updatedAt: new Date().toISOString(),
  };

  const updatedBiz: Business = {
    ...shop,
    pendingUpdate: pending,
    isPendingApproval: true,
  };

  list[index] = updatedBiz;
  saveBusinesses(list);
  addAuditLog('SHOP_UPDATE_SUBMITTED', shop.name, 'Submitted profile/social/offer changes for Admin approval');
  return updatedBiz;
};

// Admin approves shop pending update
export const approveShopPendingUpdate = (id: string): Business | null => {
  const list = getBusinesses();
  const index = list.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const shop = list[index];
  if (!shop.pendingUpdate) return shop;

  const pending = shop.pendingUpdate;
  const merged: Business = {
    ...shop,
    todaysOffer: pending.todaysOffer ? { ...pending.todaysOffer } : shop.todaysOffer,
    image: (pending.image && pending.image.trim().length > 0) ? pending.image : shop.image,
    socialLinks: pending.socialLinks ? { ...pending.socialLinks } : shop.socialLinks,
    tagline: (pending.tagline && pending.tagline.trim().length > 0) ? pending.tagline : shop.tagline,
    isSocialApproved: true,
    isPendingApproval: false,
    pendingUpdate: undefined,
  };

  list[index] = merged;
  saveBusinesses(list);
  addAuditLog('UPDATE_APPROVED', 'D Company Admin', `Approved pending changes for ${shop.name}`);
  return merged;
};

// Admin extends shop subscription validity
export const extendShopSubscription = (id: string, months: number = 1): Business | null => {
  const list = getBusinesses();
  const index = list.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const shop = list[index];
  const currentExpiry = new Date(shop.subscription.expiryDate || Date.now());
  const newDate = new Date(currentExpiry.setMonth(currentExpiry.getMonth() + months));
  const newExpiryStr = newDate.toISOString().split('T')[0];

  const updated: Business = {
    ...shop,
    subscription: {
      ...shop.subscription,
      status: 'Paid',
      expiryDate: newExpiryStr,
    },
  };

  list[index] = updated;
  saveBusinesses(list);
  addAuditLog('SUBSCRIPTION_EXTENDED', 'D Company Admin', `Extended validity for ${shop.name} until ${newExpiryStr}`);
  return updated;
};

// Admin rejects pending update
export const rejectShopPendingUpdate = (id: string): Business | null => {
  const list = getBusinesses();
  const index = list.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const shop = list[index];
  const merged: Business = {
    ...shop,
    isPendingApproval: false,
    pendingUpdate: undefined,
  };

  list[index] = merged;
  saveBusinesses(list);
  addAuditLog('UPDATE_REJECTED', 'D Company Admin', `Rejected pending changes for ${shop.name}`);
  return merged;
};

// Delete business
export const deleteBusiness = (id: string): void => {
  const list = getBusinesses();
  const target = list.find((b) => b.id === id);
  const filtered = list.filter((b) => b.id !== id);
  saveBusinesses(filtered);
  if (target) addAuditLog('SHOP_DELETED', 'D Company Admin', `Deleted shop: ${target.name}`);
};

// Get all leads
export const getLeads = (): Lead[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    return raw ? JSON.parse(raw) : INITIAL_LEADS;
  } catch (e) {
    return INITIAL_LEADS;
  }
};

// Add lead (coupon claimed)
export const addLead = (
  businessId: string,
  businessName: string,
  category: Category,
  region: 'Mehkar' | 'Lonar',
  customerName: string,
  customerPhone: string
): Lead => {
  const leads = getLeads();
  const randomCode = Math.floor(100 + Math.random() * 900);
  const regionPrefix = region.substring(0, 3).toUpperCase();
  const categoryPrefix = category.substring(0, 3).toUpperCase();
  const couponCode = `MAHA-${regionPrefix}-${categoryPrefix}-${randomCode}`;

  const lead: Lead = {
    id: `lead-${Date.now()}`,
    businessId,
    businessName,
    category,
    region,
    customerName,
    customerPhone,
    couponCode,
    claimedAt: new Date().toISOString(),
    status: 'Claimed',
  };

  const updated = [lead, ...leads];
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
  return lead;
};

// Admin Settings
export const getAdminSettings = (): AdminSettings => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
    return raw ? JSON.parse(raw) : INITIAL_ADMIN_SETTINGS;
  } catch (e) {
    return INITIAL_ADMIN_SETTINGS;
  }
};

export const updateAdminSettings = (updates: Partial<AdminSettings>): AdminSettings => {
  const current = getAdminSettings();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(updated));
  return updated;
};

export const verifyAdminPin = (inputPin: string): boolean => {
  const settings = getAdminSettings();
  return settings.pinHash.trim() === inputPin.trim();
};

export const getShopByPinOrPhone = (identifier: string): Business | undefined => {
  const list = getBusinesses();
  const clean = identifier.trim();
  return list.find(
    (b) =>
      b.shopPin.trim() === clean ||
      b.ownerPhone.trim() === clean ||
      b.whatsappNumber.includes(clean)
  );
};

export const updateShopPin = (shopId: string, newPin: string): Business | null => {
  const list = getBusinesses();
  const index = list.findIndex((b) => b.id === shopId);
  if (index === -1) return null;

  const shop = list[index];
  const updated: Business = {
    ...shop,
    shopPin: newPin.trim(),
  };

  list[index] = updated;
  saveBusinesses(list);
  addAuditLog('SHOP_PIN_RESET', 'D Company Admin', `Reset login PIN for shop: ${shop.name} (${shop.ownerPhone})`);
  return updated;
};

export const updateShopCredentials = (
  shopId: string,
  updates: { ownerPhone?: string; shopPin?: string; ownerName?: string }
): Business | null => {
  const list = getBusinesses();
  const index = list.findIndex((b) => b.id === shopId);
  if (index === -1) return null;

  const shop = list[index];
  const updated: Business = {
    ...shop,
    ownerPhone: updates.ownerPhone ? updates.ownerPhone.trim() : shop.ownerPhone,
    shopPin: updates.shopPin ? updates.shopPin.trim() : shop.shopPin,
    ownerName: updates.ownerName ? updates.ownerName.trim() : shop.ownerName,
    whatsappNumber: updates.ownerPhone ? `91${updates.ownerPhone.replace(/[^0-9]/g, '')}` : shop.whatsappNumber,
  };

  list[index] = updated;
  saveBusinesses(list);
  addAuditLog('SHOP_CREDENTIALS_UPDATED', 'D Company Admin', `Updated login credentials for ${shop.name}`);
  return updated;
};




// MERCHANT INQUIRIES & CAMPAIGN LEADS
export const getMerchantInquiries = (): MerchantInquiry[] => {
  initStorage();
  try {
    const raw = localStorage.getItem('maha_hub_merchant_inquiries_v3');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addMerchantInquiry = (
  merchantName: string,
  shopName: string,
  category: Category,
  region: 'Mehkar' | 'Lonar',
  mobile: string,
  serviceInterested: string,
  packageChoice: PlanType,
  message?: string
): MerchantInquiry => {
  const list = getMerchantInquiries();
  const inquiry: MerchantInquiry = {
    id: `m-inq-${Date.now()}`,
    merchantName: merchantName.trim(),
    shopName: shopName.trim(),
    category,
    region,
    mobile: mobile.trim(),
    serviceInterested: serviceInterested.trim(),
    packageChoice,
    message: message?.trim(),
    createdAt: new Date().toISOString(),
    status: 'NEW',
  };

  const updated = [inquiry, ...list];
  localStorage.setItem('maha_hub_merchant_inquiries_v3', JSON.stringify(updated));
  addAuditLog('MERCHANT_INQUIRY_SUBMITTED', merchantName, `Inquiry for ${shopName} (${packageChoice})`);
  return inquiry;
};

export const updateMerchantInquiryStatus = (
  id: string,
  status: MerchantInquiry['status']
): void => {
  const list = getMerchantInquiries();
  const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
  localStorage.setItem('maha_hub_merchant_inquiries_v3', JSON.stringify(updated));
};

// CAMPAIGN ANALYTICS
export const getCampaignStats = (): CampaignStats => {
  initStorage();
  try {
    const raw = localStorage.getItem('maha_hub_campaign_stats_v3');
    if (raw) return JSON.parse(raw);
  } catch {}

  const stats: CampaignStats = {
    qrScansCount: 342,
    websiteVisitsCount: 1890,
    merchantInquiriesCount: getMerchantInquiries().length + 18,
    customerRegistrationsCount: getCustomers().length + 124,
  };
  return stats;
};

export const recordCampaignQRScan = (): void => {
  const stats = getCampaignStats();
  stats.qrScansCount += 1;
  localStorage.setItem('maha_hub_campaign_stats_v3', JSON.stringify(stats));
};

export const recordWebsiteVisit = (): void => {
  const stats = getCampaignStats();
  stats.websiteVisitsCount += 1;
  localStorage.setItem('maha_hub_campaign_stats_v3', JSON.stringify(stats));
};
