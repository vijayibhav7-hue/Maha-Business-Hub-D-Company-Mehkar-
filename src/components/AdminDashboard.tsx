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
  Youtube
} from 'lucide-react';
import { Business, Lead, AdminSettings, Category, PlanType, BannerSlide, AdRequest, StandeeOrder, AuditLog, SocialLinks } from '../types';
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
  rejectShopPendingUpdate
} from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { compressImageFile } from '../utils/imageCompressor';

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

  // Security Settings
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

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
      alert('PIN must be at least 4 digits');
      return;
    }
    updateAdminSettings({ pinHash: newPin.trim() });
    setSettings(getAdminSettings());
    setNewPin('');
    setPinSuccess('Admin Security PIN updated successfully!');
    setTimeout(() => setPinSuccess(''), 3000);
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
              <span>System locked! Try again in {lockoutTime}s</span>
            </div>
          )}

          {authMode === 'pin' ? (
            <form onSubmit={handlePinLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  disabled={lockoutTime > 0}
                  placeholder="Enter Security PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-center text-lg font-mono font-black tracking-widest rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={lockoutTime > 0}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-md"
              >
                {lockoutTime > 0 ? `Locked (${lockoutTime}s)` : 'Unlock Admin Dashboard'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Admin Email / Mobile Number"
                      value={adminContact}
                      onChange={(e) => setAdminContact(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs font-bold rounded-xl border border-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Send Verification Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200 text-xs">
                    <span className="font-bold">Verification Code Sent: </span>
                    <strong className="font-mono text-emerald-700 font-extrabold text-sm">{simulatedCode}</strong>
                  </div>

                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit Code"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full py-3 text-center text-lg font-mono font-bold rounded-xl border border-slate-300"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Verify & Access Dashboard
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Dashboard Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/30 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{t('adminTitle', 'D Company Master Revenue Dashboard')}</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Full Control
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mehkar & Lonar Commercial Network CRM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                        <Check className="w-4 h-4" /> Approve & Publish Links
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

      {/* TAB: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-md space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Encrypted Security Settings</span>
          </div>

          {pinSuccess && (
            <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-200 font-medium">
              {pinSuccess}
            </div>
          )}

          <form onSubmit={handleChangePin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Set New Master Security PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter New PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Update Security PIN
            </button>
          </form>
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

    </div>
  );
};
