import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  KeyRound, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Search, 
  Store, 
  Phone, 
  Lock, 
  Image as ImageIcon,
  Megaphone,
  ShoppingBag,
  Send,
  History,
  Mail,
  Check,
  X,
  Clock,
  Building2,
  AlertCircle,
  Upload,
  Sparkles,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  QrCode,
  Eye,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { Business, Lead, AdminSettings, Category, PlanType, BannerSlide, AdRequest, StandeeOrder, AuditLog, SocialLinks, MerchantInquiry, CampaignStats } from '../types';
import { 
  verifyAdminPin, 
  getBusinesses, 
  addBusiness, 
  updateBusiness, 
  deleteBusiness, 
  getLeads, 
  getAdminSettings, 
  updateAdminSettings, 
  getAdRequests,
  updateAdRequestStatus,
  getStandeeOrders,
  updateStandeeOrderStatus,
  getAuditLogs,
  sendSimulatedOTP,
  verifySimulatedOTP,
  approveShopPendingUpdate,
  rejectShopPendingUpdate,
  getMerchantInquiries,
  updateMerchantInquiryStatus,
  getCampaignStats,
  extendShopSubscription,
  getCustomers,
  updateShopPin,
  updateShopCredentials,
  clearAllDemoData
} from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { compressImageFile } from '../utils/imageCompressor';
import { ShopImporterModal } from './ShopImporterModal';
import { AIMarketingGeneratorModal } from './AIMarketingGeneratorModal';
import { PrintableStandeeModal } from './PrintableStandeeModal';
import { WhatsAppCampaignCenterModal } from './WhatsAppCampaignCenterModal';

interface AdminDashboardProps {
  onBackToDirectory: () => void;
}

const PRESET_PHOTOS = [
  { name: 'Mobile Shop', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Agri & Seeds', url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Garments & Sarees', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Hospital / Clinic', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Coaching Classes', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80' },
  { name: 'Restaurant & Dhaba', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Auto Garage', url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToDirectory }) => {
  const { t } = useLanguage();

  // Login State
  const [authMode, setAuthMode] = useState<'pin' | 'otp'>('pin');
  const [pinInput, setPinInput] = useState('');
  const [adminContact, setAdminContact] = useState('dcompany1410@gmail.com');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState('');

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data State
  const [businesses, setBusinesses] = useState<Business[]>(getBusinesses());
  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [adRequests, setAdRequests] = useState<AdRequest[]>(getAdRequests());
  const [standeeOrders, setStandeeOrders] = useState<StandeeOrder[]>(getStandeeOrders());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getAuditLogs());
  const [merchantInquiries, setMerchantInquiries] = useState<MerchantInquiry[]>(getMerchantInquiries());
  const [campaignStats, setCampaignStats] = useState<CampaignStats>(getCampaignStats());

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'shops' | 'ads' | 'orders' | 'banners' | 'ticker' | 'subscriptions' | 'leads' | 'logs' | 'company' | 'settings'>('overview');

  // Search
  const [shopSearch, setShopSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');

  // Shop Form Modal
  const [editingShop, setEditingShop] = useState<Business | null>(null);
  const [isAddingShop, setIsAddingShop] = useState(false);

  // Shop Form
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('Mobile');
  const [formRegion, setFormRegion] = useState<'Mehkar' | 'Lonar'>('Mehkar');
  const [formAddress, setFormAddress] = useState('');
  const [formOwnerName, setFormOwnerName] = useState('');
  const [formOwnerPhone, setFormOwnerPhone] = useState('');
  const [formMapUrl, setFormMapUrl] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formPlanName, setFormPlanName] = useState<PlanType>('Gold ₹999');
  const [formExpiryDate, setFormExpiryDate] = useState('2026-11-30');
  const [formOfferTitle, setFormOfferTitle] = useState('10% OFF Special Discount');
  const [formOfferTag, setFormOfferTag] = useState('10% OFF');
  const [formOfferDesc, setFormOfferDesc] = useState('Get instant discount on your visit.');
  const [formShopPin, setFormShopPin] = useState('1234');

  // Social Links Form
  const [formFbUrl, setFormFbUrl] = useState('');
  const [formInstaUrl, setFormInstaUrl] = useState('');
  const [formTwUrl, setFormTwUrl] = useState('');
  const [formYtUrl, setFormYtUrl] = useState('');
  const [formWebUrl, setFormWebUrl] = useState('');

  // Banner Modal
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSub, setBannerSub] = useState('');
  const [bannerBadge, setBannerBadge] = useState('SPECIAL DEAL');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerShopId, setBannerShopId] = useState('');

  // Ticker State
  const [tickerTextState, setTickerTextState] = useState(settings.tickerText || '');
  const [tickerActiveState, setTickerActiveState] = useState(settings.isTickerActive);

  // Company Info Form
  const [compName, setCompName] = useState(settings.companyName || 'D Company Digital Hub');
  const [compPhone, setCompPhone] = useState(settings.companyPhone || '9607636444');
  const [compEmail, setCompEmail] = useState(settings.companyEmail || 'dcompany1410@gmail.com');
  const [compAddr, setCompAddr] = useState(settings.companyAddress || 'Mehkar, Dist. Buldhana');
  const [compAbout, setCompAbout] = useState(settings.companyAbout || '');

  // Security & Credentials Control State
  const [newPin, setNewPin] = useState('');
  const [adminEmailAcc, setAdminEmailAcc] = useState(settings.adminEmail || 'dcompany1410@gmail.com');
  const [pinSuccess, setPinSuccess] = useState('');
  const [credSearch, setCredSearch] = useState('');
  const [editingCredShop, setEditingCredShop] = useState<Business | null>(null);
  const [credPhoneInput, setCredPhoneInput] = useState('');
  const [credPinInput, setCredPinInput] = useState('');
  const [credOwnerNameInput, setCredOwnerNameInput] = useState('');
  const [credSuccessMsg, setCredSuccessMsg] = useState('');

  // New Feature Modals
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isAiGenOpen, setIsAiGenOpen] = useState(false);
  const [aiGenShop, setAiGenShop] = useState<Business | null>(null);
  const [isStandeeModalOpen, setIsStandeeModalOpen] = useState(false);
  const [standeeShop, setStandeeShop] = useState<Business | null>(null);
  const [isWhatsAppCampaignOpen, setIsWhatsAppCampaignOpen] = useState(false);

  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => setLockoutTime((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  const refreshData = () => {
    setBusinesses(getBusinesses());
    setLeads(getLeads());
    setSettings(getAdminSettings());
    setAdRequests(getAdRequests());
    setStandeeOrders(getStandeeOrders());
    setAuditLogs(getAuditLogs());
    setMerchantInquiries(getMerchantInquiries());
    setCampaignStats(getCampaignStats());
  };

  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    if (verifyAdminPin(pinInput)) {
      setIsAuthenticated(true);
      setAuthError('');
      setFailedAttempts(0);
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      if (nextFail >= 3) {
        setLockoutTime(30);
        setAuthError('Security lockout active for 30 seconds.');
      } else {
        setAuthError(`Invalid PIN credentials. (${3 - nextFail} attempts remaining)`);
      }
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = sendSimulatedOTP(adminContact);
    setSimulatedCode(code);
    setOtpSent(true);
    setAuthError('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifySimulatedOTP(adminContact, otpInput)) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid OTP code.');
    }
  };

  // Image File Upload for Shop
  const handleShopPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file, 800, 600, 0.75);
      setFormImage(base64);
    } catch {
      alert('Photo compression failed. Please try another image.');
    }
  };

  // Image File Upload for Banner
  const handleBannerPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file, 1200, 600, 0.75);
      setBannerImg(base64);
    } catch {
      alert('Banner compression failed. Please try another image.');
    }
  };

  const openEditForm = (shop: Business) => {
    setEditingShop(shop);
    setFormName(shop.name);
    setFormTagline(shop.tagline);
    setFormCategory(shop.category);
    setFormRegion(shop.region);
    setFormAddress(shop.address);
    setFormOwnerName(shop.ownerName);
    setFormOwnerPhone(shop.ownerPhone);
    setFormMapUrl(shop.googleMapUrl);
    setFormImage(shop.image);
    setFormPlanName(shop.subscription.planName);
    setFormExpiryDate(shop.subscription.expiryDate);
    setFormOfferTitle(shop.todaysOffer.title);
    setFormOfferTag(shop.todaysOffer.discountTag);
    setFormOfferDesc(shop.todaysOffer.description);
    setFormShopPin(shop.shopPin);

    const soc = shop.socialLinks || {};
    setFormFbUrl(soc.facebook || '');
    setFormInstaUrl(soc.instagram || '');
    setFormTwUrl(soc.twitter || '');
    setFormYtUrl(soc.youtube || '');
    setFormWebUrl(soc.website || soc.googleBusiness || '');

    setIsAddingShop(true);
  };

  const resetForm = () => {
    setEditingShop(null);
    setFormName('');
    setFormTagline('');
    setFormCategory('Mobile');
    setFormRegion('Mehkar');
    setFormAddress('');
    setFormOwnerName('');
    setFormOwnerPhone('');
    setFormMapUrl('');
    setFormImage('');
    setFormPlanName('Gold ₹999');
    setFormExpiryDate('2026-11-30');
    setFormOfferTitle('10% OFF Special Discount');
    setFormOfferTag('10% OFF');
    setFormOfferDesc('Get instant discount on your visit.');
    setFormShopPin('1234');
    setFormFbUrl('');
    setFormInstaUrl('');
    setFormTwUrl('');
    setFormYtUrl('');
    setFormWebUrl('');
    setIsAddingShop(false);
  };

  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault();

    const planAmount =
      formPlanName === 'Silver ₹499'
        ? 499
        : formPlanName === 'Gold ₹999'
        ? 999
        : formPlanName === 'Platinum ₹2999'
        ? 2999
        : 0;

    const isPaid = formPlanName !== 'Free';

    const social: SocialLinks = {
      facebook: formFbUrl.trim(),
      instagram: formInstaUrl.trim(),
      twitter: formTwUrl.trim(),
      youtube: formYtUrl.trim(),
      website: formWebUrl.trim(),
      googleBusiness: formMapUrl.trim(),
    };

    if (editingShop) {
      updateBusiness(editingShop.id, {
        name: formName,
        tagline: formTagline,
        category: formCategory,
        region: formRegion,
        address: formAddress,
        ownerName: formOwnerName,
        ownerPhone: formOwnerPhone,
        whatsappNumber: `91${formOwnerPhone.replace(/[^0-9]/g, '')}`,
        googleMapUrl: formMapUrl || `https://maps.google.com/?q=${encodeURIComponent(formName + ' ' + formRegion)}`,
        image: formImage || 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80',
        subscription: {
          status: isPaid ? 'Paid' : 'Free',
          planName: formPlanName,
          expiryDate: formExpiryDate,
          amountPaid: planAmount,
        },
        todaysOffer: {
          title: formOfferTitle,
          description: formOfferDesc,
          discountTag: formOfferTag,
          validTill: 'Valid Today',
          isActive: true,
        },
        shopPin: formShopPin || '1234',
        socialLinks: social,
        isSocialApproved: true,
      });
    } else {
      addBusiness({
        name: formName,
        tagline: formTagline || 'Quality Products & Services in ' + formRegion,
        category: formCategory,
        region: formRegion,
        address: formAddress,
        ownerName: formOwnerName,
        ownerPhone: formOwnerPhone,
        whatsappNumber: `91${formOwnerPhone.replace(/[^0-9]/g, '')}`,
        googleMapUrl: formMapUrl || `https://maps.google.com/?q=${encodeURIComponent(formName + ' ' + formRegion)}`,
        image: formImage || 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80',
        subscription: {
          status: isPaid ? 'Paid' : 'Free',
          planName: formPlanName,
          expiryDate: formExpiryDate,
          amountPaid: planAmount,
        },
        todaysOffer: {
          title: formOfferTitle,
          description: formOfferDesc,
          discountTag: formOfferTag,
          validTill: 'Valid Today',
          isActive: true,
        },
        shopPin: formShopPin || '1234',
        socialLinks: social,
        isSocialApproved: true,
      });
    }

    refreshData();
    resetForm();
  };

  const handleDeleteShop = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteBusiness(id);
      refreshData();
    }
  };

  const handleApprovePendingUpdate = (shopId: string) => {
    approveShopPendingUpdate(shopId);
    refreshData();
  };

  const handleRejectPendingUpdate = (shopId: string) => {
    rejectShopPendingUpdate(shopId);
    refreshData();
  };

  const handleUpdateAdStatus = (id: string, status: AdRequest['status']) => {
    updateAdRequestStatus(id, status);
    refreshData();
  };

  const handleUpdateStandeeStatus = (id: string, status: StandeeOrder['status']) => {
    updateStandeeOrderStatus(id, status);
    refreshData();
  };

  const handleUpdateInquiryStatus = (id: string, status: MerchantInquiry['status']) => {
    updateMerchantInquiryStatus(id, status);
    refreshData();
  };

  const handleExtendShopValidity = (shopId: string) => {
    extendShopSubscription(shopId, 1);
    refreshData();
    alert('Subscription extended by 1 Month!');
  };

  const sendWhatsAppRenewalReminder = (shop: Business) => {
    const cleanNum = shop.ownerPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `🚩 *नमस्कार ${shop.ownerName} जी! (D COMPANY MAHA BUSINESS HUB)*\n\n` +
      `आपल्या *${shop.name}* दुकानाची पॅकेज व्हॅलिडिटी लवकरच संपत आहे (${shop.subscription.expiryDate}).\n\n` +
      `अधिक ग्राहक कूपन व D-QR चालू ठेवण्यासाठी आजच आपले *${shop.subscription.planName}* रिन्यू करा.\n\n` +
      `💳 Contact D Company: ${settings.companyPhone}`
    );
    window.open(`https://wa.me/91${cleanNum}?text=${msg}`, '_blank');
  };

  const handleSaveCompanyDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({
      companyName: compName,
      companyPhone: compPhone,
      companyEmail: compEmail,
      companyAddress: compAddr,
      companyAbout: compAbout,
    });
    setSettings(getAdminSettings());
    alert('D Company Contact & Info Updated Successfully!');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      alert('Security PIN/Password must be at least 4 characters');
      return;
    }
    updateAdminSettings({ 
      pinHash: newPin.trim(),
      adminEmail: adminEmailAcc.trim() || 'dcompany1410@gmail.com'
    });
    setSettings(getAdminSettings());
    setNewPin('');
    setPinSuccess('Admin Login Credentials & Security PIN updated successfully!');
    setTimeout(() => setPinSuccess(''), 4000);
  };

  const handleOpenEditCreds = (shop: Business) => {
    setEditingCredShop(shop);
    setCredPhoneInput(shop.ownerPhone);
    setCredPinInput(shop.shopPin);
    setCredOwnerNameInput(shop.ownerName);
  };

  const handleSaveShopCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCredShop) return;
    if (credPinInput.trim().length < 4) {
      alert('Shopkeeper PIN must be at least 4 digits');
      return;
    }
    updateShopCredentials(editingCredShop.id, {
      ownerPhone: credPhoneInput.trim(),
      shopPin: credPinInput.trim(),
      ownerName: credOwnerNameInput.trim(),
    });
    refreshData();
    setCredSuccessMsg(`Credentials for "${editingCredShop.name}" updated! Phone: ${credPhoneInput}, PIN: ${credPinInput}`);
    setEditingCredShop(null);
    setTimeout(() => setCredSuccessMsg(''), 5000);
  };

  const handleAutoGeneratePin = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setCredPinInput(randomPin);
  };

  const sendShopkeeperCredentialsWhatsApp = (shop: Business) => {
    const cleanNum = shop.ownerPhone.replace(/[^0-9]/g, '');
    const appUrl = window.location.origin + window.location.pathname;
    const msg = encodeURIComponent(
      `🚩 *MAHA BUSINESS HUB — D COMPANY* 🚩\n\n` +
      `नमस्कार *${shop.ownerName}* जी!\n` +
      `तुमच्या *${shop.name}* दुकानाचा शॉपकीपर लॉगिन तपशील खालीलप्रमाणे आहे:\n\n` +
      `📱 *लॉगिन ID / फोन नंबर:* ${shop.ownerPhone}\n` +
      `🔑 *शॉप PIN / पासवर्ड:* ${shop.shopPin}\n\n` +
      `पोर्टल उघडून कूपन आणि फोटो अपडेट करण्यासाठी येथे क्लिक करा:\n${appUrl}`
    );
    window.open(`https://wa.me/91${cleanNum}?text=${msg}`, '_blank');
  };

  const handleWipeDemoData = () => {
    if (window.confirm('तुम्हाला खात्री आहे का? सर्व सॅम्पल डेमो दुकाने व डेटा १-क्लिकमध्ये साफ होईल आणि ॲप पूर्णपणे नवीन आणि लाईव्ह (Fresh Live) होईल.')) {
      clearAllDemoData();
      alert('सर्व डेमो डेटा यशस्वीरीत्या साफ झाला आहे! ॲप आता थेट नवीन दुकानांसाठी रिफ्रेश होत आहे.');
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlide: BannerSlide = {
      id: `banner-${Date.now()}`,
      title: bannerTitle,
      subtitle: bannerSub,
      discountBadge: bannerBadge,
      imageUrl: bannerImg || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      targetShopId: bannerShopId || undefined,
      active: true,
    };

    const currentBanners = settings.banners || [];
    updateAdminSettings({ banners: [newSlide, ...currentBanners] });
    setSettings(getAdminSettings());
    setIsAddingBanner(false);
  };

  const handleDeleteBanner = (id: string) => {
    const updated = (settings.banners || []).filter((b) => b.id !== id);
    updateAdminSettings({ banners: updated });
    setSettings(getAdminSettings());
  };

  const handleSaveTicker = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({
      tickerText: tickerTextState,
      isTickerActive: tickerActiveState,
    });
    setSettings(getAdminSettings());
    alert('Ticker announcement saved!');
  };

  const pendingApprovalShops = businesses.filter((b) => b.isPendingApproval && b.pendingUpdate);

  const totalShops = businesses.length;
  const paidShops = businesses.filter((b) => b.subscription.status === 'Paid').length;
  const subRevenue = businesses.reduce((acc, b) => acc + (b.subscription.amountPaid || 0), 0);
  const adRevenue = adRequests.filter((a) => a.status === 'Approved').reduce((acc, a) => acc + a.amount, 0);
  const standeeRevenue = standeeOrders.reduce((acc, s) => acc + s.amount, 0);
  const grandTotalRevenue = subRevenue + adRevenue + standeeRevenue;
  const totalLeadsCount = leads.length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              D Company Protected Login
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Master Admin Control
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Confidential Admin Access for D Company Administrator.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setAuthMode('pin'); setAuthError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authMode === 'pin' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Security PIN
            </button>
            <button
              onClick={() => { setAuthMode('otp'); setAuthError(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authMode === 'otp' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Free Mobile/Email OTP
            </button>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-bold">
              {authError}
            </div>
          )}

          {lockoutTime > 0 && (
            <div className="bg-amber-50 text-amber-900 text-xs p-3 rounded-xl border border-amber-300 font-bold flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Lockout active ({lockoutTime}s)</span>
            </div>
          )}

          {authMode === 'pin' ? (
            <form onSubmit={handlePinLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-left">
                  Enter Admin PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Master PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={lockoutTime > 0}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-extrabold text-xs rounded-xl shadow-lg"
              >
                Verify PIN & Login
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-left">
                  Admin Email / Contact
                </label>
                <input
                  type="text"
                  required
                  value={adminContact}
                  onChange={(e) => setAdminContact(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 font-bold"
                />
              </div>

              {otpSent && (
                <div>
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-[11px] mb-2 font-mono font-bold border border-emerald-200">
                    [SIMULATED OTP CODE]: {simulatedCode}
                  </div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-left">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6-digit OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-300 text-center tracking-widest"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-lg"
              >
                {otpSent ? 'Verify OTP Code' : 'Send Free OTP'}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            D COMPANY, MEHKAR · Digital Business Partner
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-slate-950 font-black text-lg rounded-2xl flex items-center justify-center shadow-md">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">D COMPANY ADMIN CONTROL</h2>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-500/30">
                  MEHKAR & LONAR
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mehkar & Lonar Commercial Network CRM & Campaign Manager
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsImporterOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              title="गूगल मॅप लिंक वरून थेट दुकान जोडा"
            >
              <Globe className="w-4 h-4" />
              <span>गूगल मॅप इम्पोर्ट</span>
            </button>

            <button
              onClick={() => {
                setAiGenShop(businesses[0] || null);
                setIsAiGenOpen(true);
              }}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              title="AI १-क्लिक मराठी ऑफर जनरेटर"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI ऑफर जनरेटर</span>
            </button>

            <button
              onClick={() => {
                setStandeeShop(businesses[0] || null);
                setIsStandeeModalOpen(true);
              }}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              title="क्यूआर स्टँडी बोर्ड प्रिंटर"
            >
              <QrCode className="w-4 h-4" />
              <span>क्यूआर स्टँडी बोर्ड</span>
            </button>

            <button
              onClick={() => setIsWhatsAppCampaignOpen(true)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              title="व्हॉट्सॲप डिजिटल ब्रॉडकास्ट"
            >
              <Send className="w-4 h-4" />
              <span>व्हॉट्सॲप मोहीम</span>
            </button>

            <button
              onClick={() => setIsAddingShop(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addShop', 'Add New Shop')}</span>
            </button>

            <button
              onClick={onBackToDirectory}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
            >
              Public Directory
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-800 pt-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'approvals', label: `Pending (${pendingApprovalShops.length})`, icon: AlertCircle },
            { id: 'shops', label: `Shops (${totalShops})`, icon: Store },
            { id: 'ads', label: `Ad Boosts (${adRequests.filter(a => a.status === 'Pending').length})`, icon: Megaphone },
            { id: 'orders', label: `Standees (${standeeOrders.length})`, icon: ShoppingBag },
            { id: 'banners', label: `Carousel (${(settings.banners || []).length})`, icon: ImageIcon },
            { id: 'ticker', label: 'Ticker Bar', icon: Sparkles },
            { id: 'subscriptions', label: `Renewals (${paidShops})`, icon: CreditCard },
            { id: 'company', label: 'D Company Info', icon: Building2 },
            { id: 'leads', label: `Leads (${totalLeadsCount})`, icon: Users },
            { id: 'logs', label: 'Audit Trail', icon: History },
            { id: 'settings', label: 'Security PIN', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Total Net Revenue</span>
              <div className="text-3xl font-black text-amber-600 font-mono">₹{grandTotalRevenue.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-slate-500">Subscriptions + Ads + Standees</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Package Subscriptions</span>
              <div className="text-3xl font-black text-emerald-700 font-mono">₹{subRevenue.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-slate-500">{paidShops} Active Paid Shops</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Ad Booking Revenue</span>
              <div className="text-3xl font-black text-blue-700 font-mono">₹{adRevenue.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-slate-500">Homepage Banner Promotions</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Standee Hardware Sales</span>
              <div className="text-3xl font-black text-purple-700 font-mono">₹{standeeRevenue.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-slate-500">Physical Acrylic QR Boards</p>
            </div>
          </div>

          {/* Campaign Analytics Panel */}
          <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white rounded-3xl p-6 border border-amber-500/20 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <BarChart2 className="w-5 h-5" />
                <span>D COMPANY Campaign Performance Analytics</span>
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full font-mono font-bold">
                Live Campaign Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
                <QrCode className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="text-2xl font-black text-white font-mono">{campaignStats.qrScansCount}</div>
                <p className="text-xs text-slate-300">Total D-QR Code Scans</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
                <Eye className="w-6 h-6 text-sky-400 mx-auto" />
                <div className="text-2xl font-black text-white font-mono">{campaignStats.websiteVisitsCount}</div>
                <p className="text-xs text-slate-300">Total Portal Visits</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
                <Users className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="text-2xl font-black text-white font-mono">{merchantInquiries.length}</div>
                <p className="text-xs text-slate-300">Merchant Onboarding Inquiries</p>
              </div>
            </div>
          </div>

          {/* Merchant Inquiries CRM Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Merchant Leads & Campaign Inquiries</h3>
                <p className="text-xs text-slate-500">Shopkeepers who registered interest on "मी दुकानदार आहे" page</p>
              </div>
              <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-xl">
                {merchantInquiries.length} Leads
              </span>
            </div>

            {merchantInquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-slate-100 rounded-xl">
                No merchant inquiries submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Merchant / Shop</th>
                      <th className="p-3">Category & Region</th>
                      <th className="p-3">Mobile Number</th>
                      <th className="p-3">Service & Package</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {merchantInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{inq.shopName}</div>
                          <div className="text-[10px] text-slate-500">Owner: {inq.merchantName}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800">{inq.category}</span>
                          <span className="text-slate-400"> · </span>
                          <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px]">{inq.region}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-800">{inq.mobile}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{inq.serviceInterested}</div>
                          <div className="text-[10px] text-amber-800 font-bold">{inq.packageChoice}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                            inq.status === 'CONVERTED' ? 'bg-emerald-100 text-emerald-800' :
                            inq.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800' :
                            inq.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-900'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                            className="text-[11px] p-1.5 rounded-lg border border-slate-300 font-bold bg-white"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PENDING APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Pending Shop Updates & Social Media Approvals</h3>
            <p className="text-xs text-slate-500">D Company Admin verification required before shop profile, photo or social links appear publicly</p>
          </div>

          {pendingApprovalShops.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-xs border border-slate-200">
              No pending shop updates or social media links requiring verification right now!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingApprovalShops.map((shop) => {
                const pend = shop.pendingUpdate;
                if (!pend) return null;
                return (
                  <div key={shop.id} className="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{shop.name} ({shop.region})</h4>
                        <p className="text-xs text-slate-500 font-mono">Owner: {shop.ownerName} ({shop.ownerPhone})</p>
                      </div>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-md">
                        Pending Verification
                      </span>
                    </div>

                    {/* Pending Photo Comparison */}
                    {pend.image && pend.image !== shop.image && (
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-slate-700">Requested New Photo:</span>
                        <img src={pend.image} alt="Pending Preview" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                      </div>
                    )}

                    {/* Pending Offer Comparison */}
                    {pend.todaysOffer && (
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                        <span className="font-bold text-amber-900">Requested Today's Offer:</span>
                        <p className="font-bold text-slate-900">{pend.todaysOffer.title} ({pend.todaysOffer.discountTag})</p>
                        <p className="text-slate-600 line-clamp-2">{pend.todaysOffer.description}</p>
                      </div>
                    )}

                    {/* Pending Social Links */}
                    {pend.socialLinks && (
                      <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] space-y-1">
                        <span className="font-bold text-slate-800">Requested Social Media Links:</span>
                        {pend.socialLinks.facebook && <p className="truncate text-blue-700">FB: {pend.socialLinks.facebook}</p>}
                        {pend.socialLinks.instagram && <p className="truncate text-pink-700">Insta: {pend.socialLinks.instagram}</p>}
                        {pend.socialLinks.twitter && <p className="truncate text-sky-600">Twitter/X: {pend.socialLinks.twitter}</p>}
                        {pend.socialLinks.youtube && <p className="truncate text-red-700">YT: {pend.socialLinks.youtube}</p>}
                        {pend.socialLinks.website && <p className="truncate text-emerald-700">Web: {pend.socialLinks.website}</p>}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleApprovePendingUpdate(shop.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Approve & Publish Changes
                      </button>
                      <button
                        onClick={() => handleRejectPendingUpdate(shop.id)}
                        className="py-2 px-4 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold rounded-xl"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: SHOPS */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shop by name, category, phone..."
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <button
              onClick={() => setIsAddingShop(true)}
              className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Shop</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Shop Name</th>
                    <th className="p-3.5">Category & Region</th>
                    <th className="p-3.5">Owner Phone</th>
                    <th className="p-3.5">Package</th>
                    <th className="p-3.5">Renewal WhatsApp</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {businesses
                    .filter((b) =>
                      b.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
                      b.ownerPhone.includes(shopSearch) ||
                      b.category.toLowerCase().includes(shopSearch.toLowerCase())
                    )
                    .map((shop) => (
                      <tr key={shop.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={shop.image}
                              alt={shop.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{shop.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">ID: {shop.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-800">{shop.category}</span>
                          <span className="text-slate-400"> · </span>
                          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[10px]">
                            {shop.region}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-800 font-semibold">{shop.ownerPhone}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                            shop.subscription.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {shop.subscription.planName}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => sendWhatsAppRenewalReminder(shop)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold rounded-lg flex items-center gap-1"
                          >
                            <Send className="w-3 h-3 text-emerald-600" />
                            <span>Renewal WhatsApp</span>
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditForm(shop)}
                              className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit Shop"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteShop(shop.id, shop.name)}
                              className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Shop"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AD BOOSTS */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Ad Boost Requests & Homepage Banners</h3>
            <p className="text-xs text-slate-500">Manage paid promotional ad requests submitted by shop owners</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Shop / Owner</th>
                    <th className="p-3.5">Ad Package / Service</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Requested Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No ad boost requests submitted yet.
                      </td>
                    </tr>
                  ) : (
                    adRequests.map((ad) => (
                      <tr key={ad.id} className="hover:bg-slate-50">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{ad.shopName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Phone: {ad.ownerPhone}</div>
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">{ad.type}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700">₹{ad.amount}</td>
                        <td className="p-3.5 text-slate-500">{new Date(ad.requestedAt).toLocaleDateString()}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                            ad.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            ad.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-900'
                          }`}>
                            {ad.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateAdStatus(ad.id, 'Approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateAdStatus(ad.id, 'Rejected')}
                              className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold rounded-lg text-[10px]"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: STANDEES */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Physical Counter Standee Hardware Orders</h3>
            <p className="text-xs text-slate-500">Acrylic D-QR counter boards ordered by shopkeepers in Mehkar & Lonar</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Shop / Owner</th>
                    <th className="p-3.5">Delivery Address</th>
                    <th className="p-3.5">Material Option</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {standeeOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No standee hardware orders placed yet.
                      </td>
                    </tr>
                  ) : (
                    standeeOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{ord.shopName}</div>
                          <div className="text-[10px] text-slate-500">Owner: {ord.ownerName} ({ord.ownerPhone})</div>
                        </td>
                        <td className="p-3.5 text-slate-700 max-w-xs">{ord.deliveryAddress}</td>
                        <td className="p-3.5 font-bold text-slate-800">{ord.material}</td>
                        <td className="p-3.5 font-mono font-bold text-purple-700">₹{ord.amount}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                            ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-900'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateStandeeStatus(ord.id, 'Dispatched')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px]"
                            >
                              Dispatch
                            </button>
                            <button
                              onClick={() => handleUpdateStandeeStatus(ord.id, 'Delivered')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
                            >
                              Delivered
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Homepage Carousel Banners</h3>
              <p className="text-xs text-slate-500">Control promotional banners displayed at the top of the homepage</p>
            </div>

            <button
              onClick={() => setIsAddingBanner(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(settings.banners || []).map((slide) => (
              <div key={slide.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
                <img src={slide.imageUrl} alt={slide.title} className="w-full h-32 object-cover rounded-xl" />
                <div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {slide.discountBadge}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{slide.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{slide.subtitle}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-emerald-700 font-bold">● Active Banner</span>
                  <button
                    onClick={() => handleDeleteBanner(slide.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: TICKER MARQUEE */}
      {activeTab === 'ticker' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-xl">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Megaphone className="w-5 h-5 text-amber-600" />
            <span>Scrolling Ticker Announcement Bar</span>
          </div>

          <form onSubmit={handleSaveTicker} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marquee Ticker Text
              </label>
              <textarea
                rows={3}
                value={tickerTextState}
                onChange={(e) => setTickerTextState(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="tickerCheck"
                checked={tickerActiveState}
                onChange={(e) => setTickerActiveState(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <label htmlFor="tickerCheck" className="text-xs font-bold text-slate-800">
                Enable Scrolling Ticker on top header
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Save Ticker Announcement
            </button>
          </form>
        </div>
      )}

      {/* TAB: SUBSCRIPTIONS & RENEWALS */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Subscription Renewals & Merchant Packages</h3>
            <p className="text-xs text-slate-500">Track package validity dates, amounts paid, and extend subscriptions for shop owners</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Shop Name</th>
                    <th className="p-3.5">Owner Phone</th>
                    <th className="p-3.5">Package Plan</th>
                    <th className="p-3.5">Expiry Date</th>
                    <th className="p-3.5">Amount Paid</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {businesses.map((shop) => (
                    <tr key={shop.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{shop.name} ({shop.region})</td>
                      <td className="p-3.5 font-mono text-slate-800">{shop.ownerPhone}</td>
                      <td className="p-3.5">
                        <span className="font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
                          {shop.subscription.planName}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-700">{shop.subscription.expiryDate}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">₹{shop.subscription.amountPaid || 0}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleExtendShopValidity(shop.id)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px]"
                          >
                            +1 Month
                          </button>
                          <button
                            onClick={() => sendWhatsAppRenewalReminder(shop)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-lg text-[10px] flex items-center gap-1"
                          >
                            <Send className="w-3 h-3 text-emerald-600" />
                            WhatsApp
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: D COMPANY INFO MANAGEMENT */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-xl space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Building2 className="w-5 h-5 text-amber-600" />
            <span>Manage D Company Official Details</span>
          </div>

          <form onSubmit={handleSaveCompanyDetails} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Brand Name</label>
              <input
                type="text"
                required
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone Number *</label>
                <input
                  type="text"
                  required
                  value={compPhone}
                  onChange={(e) => setCompPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={compEmail}
                  onChange={(e) => setCompEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Office Address</label>
              <input
                type="text"
                required
                value={compAddr}
                onChange={(e) => setCompAddr(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">About D Company / Mission</label>
              <textarea
                rows={4}
                value={compAbout}
                onChange={(e) => setCompAbout(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md"
            >
              Update D Company Details
            </button>
          </form>
        </div>
      )}

      {/* TAB: LEADS */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customer leads..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Phone Number</th>
                    <th className="p-3.5">Target Shop</th>
                    <th className="p-3.5">Coupon Code</th>
                    <th className="p-3.5">Claimed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads
                    .filter((l) =>
                      l.customerName.toLowerCase().includes(leadSearch.toLowerCase()) ||
                      l.customerPhone.includes(leadSearch) ||
                      l.businessName.toLowerCase().includes(leadSearch.toLowerCase())
                    )
                    .map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">{lead.customerName}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-800">{lead.customerPhone}</td>
                        <td className="p-3.5 font-semibold text-slate-800">{lead.businessName}</td>
                        <td className="p-3.5 font-mono text-amber-800 font-extrabold">{lead.couponCode}</td>
                        <td className="p-3.5 text-slate-500">{new Date(lead.claimedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-600" />
            Security Audit Logs & Activity History
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <p className="text-slate-600">{log.details}</p>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SETTINGS & SECURITY CONTROL CENTER */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 shadow-xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>अ‍ॅडमिन व दुकानदारांचे लॉगिन/पासवर्ड व्यवस्थापन (Security Control Center)</span>
              </div>
              <p className="text-xs text-slate-300">
                येथून अ‍ॅडमिनचा पासवर्ड/मास्टर PIN बदलू शकता आणि सर्व दुकानदारांचे लॉगिन ID, फोन नंबर आणि शॉप PIN एडिट/रिसेट करू शकता.
              </p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-500/30">
              Encrypted Access Enabled
            </span>
          </div>

          {/* Success Banners */}
          {pinSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-xs p-4 rounded-2xl border border-emerald-300 font-bold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{pinSuccess}</span>
              </div>
            </div>
          )}

          {credSuccessMsg && (
            <div className="bg-amber-50 text-amber-900 text-xs p-4 rounded-2xl border border-amber-300 font-bold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{credSuccessMsg}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: ADMIN CREDENTIALS CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm pb-2 border-b border-slate-100">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>अ‍ॅडमिन लॉगिन व सिक्युरिटी PIN (Admin Credentials)</span>
              </div>

              <form onSubmit={handleChangePin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    अ‍ॅडमिन आयडी / ईमेल (Admin Email)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="dcompany1410@gmail.com"
                    value={adminEmailAcc}
                    onChange={(e) => setAdminEmailAcc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    नवीन मास्टर सिक्युरिटी PIN / पासवर्ड
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="उदा. 7777 किंवा नवीन PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    अ‍ॅडमिन पॅनेल उघडण्यासाठी हा पासवर्ड वापरला जातो.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                >
                  अ‍ॅडमिन पिन व आयडी अपडेट करा
                </button>
              </form>

              {/* Clear Demo Data Button */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-black text-rose-900 block">
                  🧹 लाईव्ह जाण्यापूर्वी सॅम्पल डेटा रिसेट करा (Reset Demo Data):
                </span>
                <p className="text-[10px] text-slate-500">
                  ॲप लाईव्ह करताना आधीचा सॅम्पल डेटा १-क्लिकमध्ये साफ करून ॲप नवीन (Fresh) करा.
                </p>
                <button
                  type="button"
                  onClick={handleWipeDemoData}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>सर्व सॅम्पल डेटा साफ करा (Clear Demo Data)</span>
                </button>
              </div>
            </div>

            {/* COLUMN 2 & 3: SHOPKEEPER CREDENTIALS MANAGEMENT */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>दुकानदारांचे लॉगिन आणि पासवर्ड लिस्ट ({businesses.length} Shops)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    कोणत्याही दुकानदाराचा लॉगिन मोबाईल नंबर किंवा ५-अंकी PIN येथून रिसेट व व्हॉट्सॲपवर पाठवू शकता.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="दुकान किंवा फोन नंबर शोधा..."
                    value={credSearch}
                    onChange={(e) => setCredSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Shopkeeper Logins Table */}
              <div className="overflow-x-auto max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] sticky top-0 z-10">
                    <tr>
                      <th className="p-3">दुकान व मालकाचे नाव</th>
                      <th className="p-3">लॉगिन आयडी (फोन)</th>
                      <th className="p-3">शॉप PIN / पासवर्ड</th>
                      <th className="p-3 text-right">कृती (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {businesses
                      .filter((b) =>
                        b.name.toLowerCase().includes(credSearch.toLowerCase()) ||
                        b.ownerName.toLowerCase().includes(credSearch.toLowerCase()) ||
                        b.ownerPhone.includes(credSearch) ||
                        b.shopPin.includes(credSearch)
                      )
                      .map((shop) => (
                        <tr key={shop.id} className="hover:bg-amber-50/50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{shop.name}</div>
                            <div className="text-[10px] text-slate-500">{shop.ownerName} ({shop.region})</div>
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-700">
                            {shop.ownerPhone}
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 text-xs">
                              🔑 {shop.shopPin}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditCreds(shop)}
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-[11px] inline-flex items-center gap-1 shadow-xs"
                            >
                              <Edit3 className="w-3 h-3" /> एडिट / रिसेट PIN
                            </button>
                            <button
                              onClick={() => sendShopkeeperCredentialsWhatsApp(shop)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] inline-flex items-center gap-1 shadow-xs"
                              title="Send Login credentials on WhatsApp"
                            >
                              <Send className="w-3 h-3" /> WhatsApp
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* EDIT SHOPKEEPER CREDENTIALS MODAL */}
          {editingCredShop && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      लॉगिन रिसेट: {editingCredShop.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {editingCredShop.ownerName} ({editingCredShop.region})
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingCredShop(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveShopCredentials} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      मालकाचे नाव (Owner Name)
                    </label>
                    <input
                      type="text"
                      required
                      value={credOwnerNameInput}
                      onChange={(e) => setCredOwnerNameInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      लॉगिन मोबाईल नंबर (Owner Phone / User ID)
                    </label>
                    <input
                      type="tel"
                      required
                      value={credPhoneInput}
                      onChange={(e) => setCredPhoneInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">
                        नवीन शॉप PIN / पासवर्ड (Shop Login PIN)
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGeneratePin}
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md"
                      >
                        ⚡ ऑटो-जनरेट करा
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={credPinInput}
                      onChange={(e) => setCredPinInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-extrabold text-slate-900 text-center tracking-widest text-base"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md"
                    >
                      लॉगिन सेव्ह करा
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCredShop(null)}
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      रद्द करा
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT SHOP MODAL */}
      {isAddingShop && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {editingShop ? 'Edit Business Listing' : 'Add New Local Business'}
              </h3>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShop} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balaji Mobiles"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Sales, Service & Accessories"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Category)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {['Agri', 'Mobile', 'Garments', 'Hospitals', 'Coaching', 'Food', 'Services'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Region *</label>
                  <select
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Mehkar">Mehkar</option>
                    <option value="Lonar">Lonar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shop PIN *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1234"
                    value={formShopPin}
                    onChange={(e) => setFormShopPin(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Social Media Links Inputs for Admin */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Social Media & Web Links (Directly Approved)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                    <input
                      type="url"
                      placeholder="Facebook Page URL"
                      value={formFbUrl}
                      onChange={(e) => setFormFbUrl(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                    <input
                      type="url"
                      placeholder="Instagram Profile URL"
                      value={formInstaUrl}
                      onChange={(e) => setFormInstaUrl(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-sky-500 shrink-0" />
                    <input
                      type="url"
                      placeholder="Twitter / X Profile URL"
                      value={formTwUrl}
                      onChange={(e) => setFormTwUrl(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                    <input
                      type="url"
                      placeholder="YouTube Channel URL"
                      value={formYtUrl}
                      onChange={(e) => setFormYtUrl(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="url"
                      placeholder="Website / Google Business URL"
                      value={formWebUrl}
                      onChange={(e) => setFormWebUrl(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload with Compression */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-800">Shop Photo Upload</label>
                <div className="flex items-center gap-3">
                  {formImage && (
                    <img src={formImage} alt="Preview" className="w-14 h-14 object-cover rounded-xl border shrink-0 bg-slate-200" />
                  )}
                  <label className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload Image File</span>
                    <input type="file" accept="image/*" onChange={handleShopPhotoUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pt-1 scrollbar-none">
                  {PRESET_PHOTOS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setFormImage(p.url)}
                      className="px-2 py-1 bg-white hover:bg-amber-100 text-slate-700 text-[10px] font-bold rounded-lg border shrink-0"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil"
                    value={formOwnerName}
                    onChange={(e) => setFormOwnerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner Phone (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822112233"
                    value={formOwnerPhone}
                    onChange={(e) => setFormOwnerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                {editingShop ? 'Update Business Listing' : 'Save & Publish Business'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ADD BANNER MODAL */}
      {isAddingBanner && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Carousel Banner Slide</h3>
              <button onClick={() => setIsAddingBanner(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">✕</button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navratri Special Mobile Fest"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle / Details</label>
                <input
                  type="text"
                  placeholder="e.g. Free tempered glass with all 5G phones"
                  value={bannerSub}
                  onChange={(e) => setBannerSub(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. 20% OFF / SPECIAL OFFER"
                  value={bannerBadge}
                  onChange={(e) => setBannerBadge(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Photo File</label>
                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload Banner Image</span>
                    <input type="file" accept="image/*" onChange={handleBannerPhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Or Direct Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={bannerImg}
                  onChange={(e) => setBannerImg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Add Banner Slide
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GOOGLE MAPS AUTO IMPORTER MODAL */}
      <ShopImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onSuccess={(newShop) => {
          refreshData();
          setIsImporterOpen(false);
        }}
      />

      {/* AI MARKETING GENERATOR MODAL */}
      <AIMarketingGeneratorModal
        isOpen={isAiGenOpen}
        onClose={() => setIsAiGenOpen(false)}
        shop={aiGenShop}
        onApplyOffer={(title, tag, desc) => {
          if (aiGenShop) {
            updateBusiness(aiGenShop.id, {
              todaysOffer: {
                ...aiGenShop.todaysOffer,
                title,
                discountTag: tag,
                description: desc,
              }
            });
            refreshData();
          }
        }}
      />

      {/* PRINTABLE QR STANDEE MODAL */}
      <PrintableStandeeModal
        isOpen={isStandeeModalOpen}
        onClose={() => setIsStandeeModalOpen(false)}
        shop={standeeShop}
      />

      {/* WHATSAPP CAMPAIGN BROADCAST MODAL */}
      <WhatsAppCampaignCenterModal
        isOpen={isWhatsAppCampaignOpen}
        onClose={() => setIsWhatsAppCampaignOpen(false)}
        shops={businesses}
        customers={getCustomers()}
        leads={leads}
      />

    </div>
  );
};
