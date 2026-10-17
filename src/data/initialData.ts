import { Business, AdminSettings, AdRequest, StandeeOrder, AuditLog, Lead } from '../types';

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  pinHash: '7777',
  adminEmail: 'dcompany1410@gmail.com',
  broadcastMessage: '🚩 D COMPANY MAHA BUSINESS HUB — डिजिटल ग्रोथ पार्टनर (Mehkar & Lonar)',
  isBroadcastActive: true,
  tickerText: '🚩 स्वागत आहे! D COMPANY डिजिटल हब - मेहकर व लोणारच्या सर्व दुकानांच्या ऑफर्स एकाच ठिकाणी! · संपर्क: 9607636444',
  isTickerActive: true,
  companyName: 'D Company Digital Hub',
  companyPhone: '9607636444',
  companyEmail: 'dcompany1410@gmail.com',
  companyAddress: 'मेन मार्केट रोड, जुन्या बस स्टँडजवळ, मेहकर, जि. बुलढाणा - ४४३३०१',
  companyAbout: 'D Company Digital Hub हा बुलढाणा जिल्ह्यातील स्थानिक दुकानांना डिजिटल करणारा अग्रणी प्लॅटफॉर्म आहे.',
  banners: [
    {
      id: 'banner-live-1',
      title: 'आपला बाजार, आपले दुकानदार, आता डिजिटल!',
      subtitle: 'महाराष्ट्रातील सर्व स्थानिक दुकानांच्या ऑफर्स आणि मोफत कूपन्स एकाच ठिकाणी.',
      discountBadge: 'D COMPANY LIVE DIGITAL',
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      active: true,
    },
  ],
  subscriptionPlans: [
    {
      id: 'plan-free',
      name: 'Free Plan',
      price: 0,
      durationMonths: 12,
      features: ['Basic Business Directory Listing', 'Verified Shop Tag', 'Customer Phone Number View'],
      isActive: true,
    },
    {
      id: 'plan-silver',
      name: 'Silver ₹499',
      price: 499,
      durationMonths: 12,
      features: ['Digital Discount Coupon Pass', 'Verified Blue Tick Badge', 'Counter D-QR Pass', 'WhatsApp Support'],
      isActive: true,
    },
    {
      id: 'plan-gold',
      name: 'Gold ₹999',
      price: 999,
      durationMonths: 12,
      features: ['Top Category Search Priority', 'Physical Counter D-QR Standee Board', 'Unlimited Customer Leads', 'Social Media Links Approval'],
      popular: true,
      isActive: true,
    },
    {
      id: 'plan-platinum',
      name: 'Platinum ₹2999',
      price: 2999,
      durationMonths: 12,
      features: ['Homepage Hero Carousel Ad Banner', 'Featured Business Gold Badge', 'Push Broadcast Promotions', 'Dedicated Account Manager'],
      isActive: true,
    },
  ],
};

export const INITIAL_AD_REQUESTS: AdRequest[] = [];
export const INITIAL_STANDEE_ORDERS: StandeeOrder[] = [];
export const INITIAL_LEADS: Lead[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_BUSINESSES: Business[] = [];
