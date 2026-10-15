import { Business, Lead, AdminSettings, Category, AdRequest, StandeeOrder, AuditLog, PendingUpdate, SocialLinks } from '../types';
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

export const updateAdRequestStatus = (id: string, status: 'Approved' | 'Rejected'): void => {
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
    todaysOffer: pending.todaysOffer || shop.todaysOffer,
    image: pending.image || shop.image,
    socialLinks: pending.socialLinks || shop.socialLinks,
    tagline: pending.tagline || shop.tagline,
    isSocialApproved: true,
    isPendingApproval: false,
    pendingUpdate: undefined,
  };

  list[index] = merged;
  saveBusinesses(list);
  addAuditLog('UPDATE_APPROVED', 'D Company Admin', `Approved pending changes for ${shop.name}`);
  return merged;
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
