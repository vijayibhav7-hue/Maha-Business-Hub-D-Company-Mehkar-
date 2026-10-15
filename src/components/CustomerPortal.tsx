import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  QrCode, 
  Ticket, 
  Share2, 
  ShieldCheck, 
  HelpCircle, 
  Store, 
  Search, 
  CheckCircle, 
  LogOut, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Sparkles, 
  Filter, 
  Heart,
  ChevronRight,
  Send,
  Building2,
  RefreshCw,
  Lock
} from 'lucide-react';
import { 
  Customer, 
  Coupon, 
  CouponRedemption, 
  Business, 
  Category, 
  Region, 
  CustomerConsent,
  SupportRequest
} from '../types';
import { 
  getCurrentCustomer, 
  registerCustomer, 
  setCurrentCustomer, 
  sendSimulatedOTP, 
  verifySimulatedOTP, 
  updateCustomerMarketingConsent, 
  deleteCustomerAccount, 
  getConsentLogs, 
  getPublishedCoupons, 
  getCouponRedemptions, 
  redeemCoupon, 
  getBusinesses, 
  getReferrals, 
  trackReferralClick, 
  addSupportRequest, 
  toggleFavoriteShop,
  getAdminSettings
} from '../services/storage';

export const CustomerPortal: React.FC<{
  onSelectShopDetail?: (shop: Business) => void;
}> = ({ onSelectShopDetail }) => {
  // Navigation active tab (8 Marathi menu items)
  const [activeTab, setActiveTab] = useState<
    | 'home'
    | 'shops'
    | 'offers'
    | 'pass'
    | 'referral'
    | 'account'
    | 'privacy'
    | 'help'
  >('home');

  // Customer Auth State
  const [customer, setCustomer] = useState<Customer | null>(getCurrentCustomer());
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regVillage, setRegVillage] = useState('मेहकर');
  const [regPrivacy, setRegPrivacy] = useState(true);
  const [regMarketing, setRegMarketing] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [simulatedOTPCode, setSimulatedOTPCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Portal Data States
  const [businesses, setBusinesses] = useState<Business[]>(getBusinesses());
  const [coupons, setCoupons] = useState<Coupon[]>(getPublishedCoupons());
  const [redemptions, setRedemptions] = useState<CouponRedemption[]>(getCouponRedemptions());
  const [consents, setConsents] = useState<CustomerConsent[]>(getConsentLogs());
  const [adminSettings] = useState(getAdminSettings());

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Support Form State
  const [supportCategory, setSupportCategory] = useState<SupportRequest['category']>('COUPON_ISSUE');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Referral State
  const [copiedLink, setCopiedLink] = useState(false);

  // Status Notice Toast
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadedCust = getCurrentCustomer();
    setCustomer(loadedCust);
    if (loadedCust) {
      setConsents(getConsentLogs().filter((c) => c.customerId === loadedCust.id));
    }
  }, []);

  const refreshData = () => {
    setBusinesses(getBusinesses());
    setCoupons(getPublishedCoupons());
    setRedemptions(getCouponRedemptions());
    if (customer) {
      setConsents(getConsentLogs().filter((c) => c.customerId === customer.id));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Auth Handlers
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!regName.trim()) {
      setAuthError('कृपया आपले पूर्ण नाव टाका.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(regMobile.trim())) {
      setAuthError('कृपया वैध १० अंकी मोबाईल नंबर टाका.');
      return;
    }
    if (!regPrivacy) {
      setAuthError('गोपनीयता धोरण (Privacy Policy) स्वीकारणे आवश्यक आहे.');
      return;
    }

    const code = sendSimulatedOTP(regMobile);
    setSimulatedOTPCode(code);
    setOtpSent(true);
    setAuthSuccess(`ओटीपी पाठवला आहे: ${code}`);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const isValid = verifySimulatedOTP(regMobile, otpInput);
    if (!isValid && otpInput !== simulatedOTPCode) {
      setAuthError('चुकीचा किंवा मुदत संपलेला ओटीपी.');
      return;
    }

    const created = registerCustomer(regName, regMobile, regVillage, regPrivacy, regMarketing);
    setCustomer(created);
    setOtpSent(false);
    setOtpInput('');
    showToast('लॉगिन / नोंदणी यशस्वी झाली!');
  };

  const handleLogout = () => {
    setCurrentCustomer(null);
    setCustomer(null);
    showToast('खाते यशस्वीरित्या लॉगआउट झाले.');
  };

  const handleDeleteAccount = () => {
    if (!customer) return;
    if (window.confirm('तुम्हाला खात्री आहे का? तुमचे खाते आणि माहिती डिलीट केली जाईल.')) {
      deleteCustomerAccount(customer.id);
      setCustomer(null);
      showToast('तुमचे खाते आणि माहिती डिलीट केली आहे.');
    }
  };

  const handleMarketingToggle = (val: boolean) => {
    if (!customer) return;
    const updated = updateCustomerMarketingConsent(customer.id, val);
    if (updated) {
      setCustomer(updated);
      setConsents(getConsentLogs().filter((c) => c.customerId === customer.id));
      showToast(val ? 'मार्केटिंग संमती चालू केली.' : 'मार्केटिंग संमती मागे घेतली.');
    }
  };

  const handleClaimCoupon = (coupon: Coupon) => {
    if (!customer) {
      setActiveTab('account');
      showToast('कूपन क्लेम करण्यासाठी प्रथम मोबाईल नोंदणी करा.');
      return;
    }

    const res = redeemCoupon(
      coupon.id,
      coupon.code,
      customer.id,
      customer.name,
      customer.mobile,
      coupon.businessId,
      coupon.businessName
    );

    showToast(res.message);
    refreshData();
  };

  const handleToggleFavorite = (bizId: string) => {
    if (!customer) {
      setActiveTab('account');
      showToast('पसंती जतन करण्यासाठी प्रथम नोंदणी करा.');
      return;
    }
    toggleFavoriteShop(customer.id, bizId);
    setCustomer(getCurrentCustomer());
    showToast('पसंती अद्ययावत केली.');
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    addSupportRequest(
      customer?.id,
      customer?.name || regName || 'अनामित ग्राहक',
      customer?.mobile || regMobile || 'N/A',
      supportCategory,
      supportMessage
    );
    setSupportSubmitted(true);
    setSupportMessage('');
    setTimeout(() => setSupportSubmitted(false), 5000);
  };

  // WhatsApp click generator
  const getWhatsAppLink = (shop: Business) => {
    const msg = encodeURIComponent(
      `नमस्कार *${shop.name}*, मला महा बिझनेस हब (D COMPANY) वर तुमची ही ऑफर आवडली आहे: *${shop.todaysOffer.title}* (${shop.todaysOffer.discountTag}). मला अधिक माहिती हवी आहे.`
    );
    return `https://wa.me/${shop.whatsappNumber.replace('+', '')}?text=${msg}`;
  };

  // Referral Link Generator
  const referralCode = customer?.passCode || 'PASS-MBH-GUEST';
  const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${referralCode}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Filtered Shops & Offers
  const filteredShops = businesses.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesRegion = selectedRegion === 'All' || b.region === selectedRegion;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.todaysOffer.title.toLowerCase().includes(q);
    return matchesCategory && matchesRegion && matchesSearch;
  });

  const myRedemptions = redemptions.filter((r) => r.customerId === customer?.id);
  const userReferrals = getReferrals().filter((r) => r.referralCode === referralCode);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-amber-400 font-bold px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-2 text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CUSTOMER PORTAL HEADER HERO */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-3xl p-5 sm:p-8 shadow-xl border border-emerald-600/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-700/60 text-emerald-200 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide">
              <Ticket className="w-4 h-4 text-amber-300" />
              <span>महा बिझनेस हब · ग्राहक पोर्टल (Customer Portal)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              महकर व लोणार ग्राहक डिजिटल खरेदी पास
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl font-medium">
              स्थानिक दुकानांचे मोफत डिस्काउंट कूपन्स मिळवा, कूपन रिडीम करा आणि आपल्या सर्व खरेदीवर भरघोस बचत करा!
            </p>
          </div>

          {/* User Status Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-auto shrink-0 flex items-center justify-between md:justify-start gap-4">
            {customer ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-black text-amber-300">{customer.name}</span>
                </div>
                <p className="text-[11px] text-emerald-100 font-mono">
                  पास ID: <strong className="text-white">{customer.passCode}</strong>
                </p>
                <p className="text-[10px] text-emerald-200">गाव/शहर: {customer.village}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-300">अतिथी (Guest)</p>
                <p className="text-[11px] text-emerald-100">डिजिटल पास व कूपनसाठी नोंदणी करा</p>
              </div>
            )}

            {!customer ? (
              <button
                onClick={() => setActiveTab('account')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all shrink-0"
              >
                नोंदणी करा
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="p-2 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all shrink-0"
                title="लॉगआउट"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* MARATHI MAIN NAVIGATION MENU (8 Items) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-6 pt-4 border-t border-emerald-700/50">
          {[
            { id: 'home', label: 'मुख्यपृष्ठ', icon: Store, desc: 'मुख्य' },
            { id: 'shops', label: 'दुकाने शोधा', icon: Search, desc: 'शोध' },
            { id: 'offers', label: 'ऑफर्स व कूपन्स', icon: Ticket, desc: 'कूपन' },
            { id: 'pass', label: 'माझा पास', icon: QrCode, desc: 'डिजिटल QR' },
            { id: 'referral', label: 'मित्रांना सुचवा', icon: Share2, desc: 'शेअर' },
            { id: 'account', label: 'माझे खाते', icon: User, desc: 'प्रोफाईल' },
            { id: 'privacy', label: 'गोपनीयता', icon: ShieldCheck, desc: 'संमती' },
            { id: 'help', label: 'मदत व संपर्क', icon: HelpCircle, desc: 'सपोर्ट' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`p-2.5 rounded-2xl transition-all text-center flex flex-col items-center justify-center gap-1.5 border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg scale-105'
                    : 'bg-emerald-950/40 hover:bg-emerald-800/60 text-emerald-100 border-emerald-700/40 font-semibold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-300'}`} />
                <span className="text-[11px] leading-tight font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: मुख्यपृष्ठ (HOME OVERVIEW) */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">एकूण मान्यताप्राप्त दुकाने</span>
              <p className="text-2xl font-black text-emerald-700">{businesses.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">उपलब्ध डिस्काउंट कूपन्स</span>
              <p className="text-2xl font-black text-amber-600">{coupons.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">माझे रिडीम कूपन्स</span>
              <p className="text-2xl font-black text-blue-600">{myRedemptions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">माझे रेफरल्स</span>
              <p className="text-2xl font-black text-purple-600">{userReferrals.length}</p>
            </div>
          </div>

          {/* Featured Offers Carousel / Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>आजच्या खास धमाकेदार ऑफर्स व कूपन्स</span>
                </h3>
                <p className="text-xs text-slate-500">स्थानिक दुकानांमध्ये थेट वापरा आणि विशेष सवलत मिळवा</p>
              </div>
              <button
                onClick={() => setActiveTab('offers')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>सर्व पहा</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.slice(0, 3).map((cpn) => (
                <div key={cpn.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                      {cpn.region} · {cpn.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{cpn.code}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{cpn.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{cpn.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="font-black text-amber-600">{cpn.discountTag}</span>
                    <button
                      onClick={() => handleClaimCoupon(cpn)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                    >
                      कूपन क्लेम करा
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D Company Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/30">
                D COMPANY OFFICIAL VERIFIED PORTAL
              </span>
              <h3 className="text-xl font-black text-white">
                {adminSettings.companyName} (मेहकर व लोणार)
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                {adminSettings.companyAbout}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-amber-400 font-bold pt-1">
                <span>मोबाईल: {adminSettings.companyPhone}</span>
                <span>·</span>
                <span>ईमेल: {adminSettings.companyEmail}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('shops')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs shadow-lg shrink-0 whitespace-nowrap"
            >
              दुकाने शोधा व ऑफर्स पहा
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: दुकाने शोधा (FIND SHOPS) */}
      {activeTab === 'shops' && (
        <div className="space-y-5">
          {/* Search & Filters Header */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="दुकानाचे नाव, क्षेत्र किंवा ऑफर शोधा..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              {/* Region Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                {(['All', 'Mehkar', 'Lonar'] as Region[]).map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      selectedRegion === reg
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {reg === 'All' ? 'सर्व भाग (Mehkar & Lonar)' : reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['All', 'Agri', 'Mobile', 'Garments', 'Hospitals', 'Coaching', 'Food', 'Services'] as (Category | 'All')[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'All' ? 'सर्व कॅटेगरी' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Shop List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100">
                    <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                      {shop.region} · {shop.category}
                    </div>
                    <button
                      onClick={() => handleToggleFavorite(shop.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md text-slate-700 hover:text-red-500 transition-colors"
                      title="पसंती सूचीत जोडा"
                    >
                      <Heart className={`w-4 h-4 ${customer?.favorites?.includes(shop.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{shop.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{shop.tagline}</p>
                    <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{shop.address}</span>
                    </p>
                  </div>

                  {/* Active Today's Offer Box */}
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-black text-amber-900">
                      <span>आजची विशेष ऑफर</span>
                      <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md text-[10px]">{shop.todaysOffer.discountTag}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{shop.todaysOffer.title}</p>
                    <p className="text-[11px] text-slate-600">{shop.todaysOffer.description}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={getWhatsAppLink(shop)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>व्हॉट्सॲप मेसेज</span>
                  </a>

                  {onSelectShopDetail && (
                    <button
                      onClick={() => onSelectShopDetail(shop)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                    >
                      तपशील
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ऑफर्स व कूपन्स (OFFERS & COUPONS) */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-emerald-600" />
              <span>मान्यताप्राप्त दुकानांचे अधिकृत सवलत कूपन्स</span>
            </h2>
            <p className="text-xs text-slate-600">
              खालील कूपन्स D COMPANY कडून सत्यापित आहेत. कूपन क्लेम करा आणि दुकानात खरेदी करताना कूपन कोड दाखवून सूट मिळवा.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((cpn) => (
              <div key={cpn.id} className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-4 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      {cpn.businessName} ({cpn.region})
                    </span>
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                      {cpn.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">{cpn.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{cpn.description}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>किमान खरेदी: ₹{cpn.minPurchase}</span>
                      <span>वैधता: {cpn.validTill} पर्यंत</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">अटी: {cpn.terms}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-black text-amber-600">{cpn.discountTag}</span>
                  <button
                    onClick={() => handleClaimCoupon(cpn)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>कूपन क्लेम करा</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: माझा शॉपिंग पास (DIGITAL SHOPPING PASS & QR) */}
      {activeTab === 'pass' && (
        <div className="space-y-6">
          {!customer ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
              <QrCode className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-slate-900">आपला डिजिटल शॉपिंग पास मिळवा</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                डिजिटल पासद्वारे तुमची वैयक्तिक माहिती सार्वजनिक न करता सुरक्षित कूपन कोड रिडीम करा.
              </p>
              <button
                onClick={() => setActiveTab('account')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-md"
              >
                आत्ताच मोबाईल नोंदणी करा
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Shopping Pass Card */}
              <div className="md:col-span-1 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-6 rounded-3xl border border-emerald-500/40 shadow-xl space-y-5 text-center relative">
                <div className="inline-flex items-center gap-1.5 text-amber-400 font-extrabold text-xs uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                  <ShieldCheck className="w-4 h-4" />
                  <span>D COMPANY VERIFIED PASS</span>
                </div>

                <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center border-4 border-amber-400 shadow-inner">
                  {/* Dynamic Pass QR Image Placeholder / Simulated QR */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `${window.location.origin}/?pass=${customer.passCode}`
                    )}`}
                    alt="Customer Pass QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase font-mono">ग्राहकाचा डिजिटल पास ID</span>
                  <p className="text-xl font-black text-amber-300 font-mono tracking-widest">{customer.passCode}</p>
                  <p className="text-xs font-bold text-white">{customer.name}</p>
                  <p className="text-[11px] text-emerald-200">{customer.village} · फोन: ******{customer.mobile.slice(-4)}</p>
                </div>

                <p className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-800">
                  हा पास दुकानात कूपन रिडीम करताना दाखवा. तुमचा मोबाईल नंबर क्यूआर कोडमध्ये थेट सेव्ह होत नाही.
                </p>
              </div>

              {/* My Claimed & Redeemed Coupons */}
              <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-500" />
                  <span>माझे क्लेम केलेले कूपन्स व रिडेम्प्शन इतिहास</span>
                </h3>

                {myRedemptions.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 space-y-2 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-xs font-bold">तुम्ही अद्याप कोणतेही कूपन रिडीम केलेले नाही.</p>
                    <button
                      onClick={() => setActiveTab('offers')}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                    >
                      ऑफर्स कूपन्स पहा
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myRedemptions.map((red) => (
                      <div key={red.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs">
                            {red.businessName}
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs mt-1">कूपन कोड: {red.couponCode}</h4>
                          <p className="text-[10px] text-slate-500">तारीख: {new Date(red.redeemedAt).toLocaleString('mr-IN')}</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full border border-emerald-300">
                          {red.status === 'REDEEMED' ? 'रिडीम झाले' : red.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 5: मित्रांना सुचवा (REFER FRIENDS) */}
      {activeTab === 'referral' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto font-black text-2xl">
              <Share2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">मित्रांना ॲप सुचवा आणि खरेदी कूपन मिळवा!</h2>
            <p className="text-xs text-slate-600">
              आपली वैयक्तिक माहिती न उघड करता आपल्या युनिक रेफरल लिंकद्वारे दुकानांच्या ऑफर्स मित्रांसोबत शेअर करा.
            </p>

            <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 focus:outline-none"
              />
              <button
                onClick={handleCopyReferral}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shrink-0 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'कॉपी झाले!' : 'कॉपी करा'}</span>
              </button>
            </div>

            {/* WhatsApp Share Direct Button */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `🚩 *महा बिझनेस हब (D COMPANY) - महकर व लोणार* 🚩\n\nस्थानिक दुकानांचे डिस्काउंट कूपन मोफत मिळवण्यासाठी माझी ही लिंक वापरा:\n${referralUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>व्हॉट्सॲपवर मित्रांना पाठवा</span>
            </a>
          </div>

          {/* Referral Stats */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-black text-slate-900">माझ्या रेफरल लिंकचा परफॉर्मन्स</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold">एकूण क्लिक्स</span>
                <p className="text-xl font-black text-slate-900">{userReferrals.length}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="text-[11px] text-amber-800 font-bold">चौकशी (Inquiries)</span>
                <p className="text-xl font-black text-amber-700">
                  {userReferrals.filter((r) => r.status === 'INQUIRED' || r.status === 'VERIFIED').length}
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-bold">पुष्टी झालेल्या खरेदी</span>
                <p className="text-xl font-black text-emerald-700">
                  {userReferrals.filter((r) => r.status === 'VERIFIED').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: माझे खाते (MY ACCOUNT & REGISTRATION) */}
      {activeTab === 'account' && (
        <div className="space-y-6 max-w-xl mx-auto">
          {!customer ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto font-black">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">ग्राहक नोंदणी / लॉगिन</h3>
                <p className="text-xs text-slate-500">आपले नाव व १० अंकी मोबाईल नंबर टाकून सत्यापित करा</p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">आपले पूर्ण नाव</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. राहुल उत्तमराव देशमुख"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">मोबाईल नंबर</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="१० अंकी मोबाईल नंबर"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">गाव / शहर</label>
                    <select
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-bold"
                    >
                      <option value="मेहकर">मेहकर (Mehkar)</option>
                      <option value="लोणार">लोणार (Lonar)</option>
                      <option value="डोणगाव">डोणगाव (Dongaon)</option>
                      <option value="जानेफळ">जानेफळ (Janephal)</option>
                      <option value="इतर">इतर ग्रामीण भाग</option>
                    </select>
                  </div>

                  {/* Consents Checkboxes */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={regPrivacy}
                        onChange={(e) => setRegPrivacy(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>मी गोपनीयतेच्या अटी व नियम स्वीकारतो. (Privacy Notice Accepted)</span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={regMarketing}
                        onChange={(e) => setRegMarketing(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>मला व्हॉट्सॲप व एसएमएस द्वारे नवीन ऑफर्सच्या सूचना मिळाव्यात. (Optional Marketing)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md"
                  >
                    ओटीपी (OTP) पाठवा
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                    <p className="text-xs text-amber-900 font-bold">
                      {regMobile} वर पाठवलेला ६ अंकी ओटीपी टाका.
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">सिम्युलेटेड कोड: {simulatedOTPCode}</p>
                  </div>

                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="६ अंकी ओटीपी"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full py-3 text-center text-lg font-black tracking-widest rounded-xl bg-slate-50 border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md"
                  >
                    ओटीपी व्हॅलिडेट करा व लॉगिन पूर्ण करा
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-slate-500 font-bold hover:underline"
                  >
                    मागे जा / नंबर बदला
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{customer.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{customer.mobile}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full">
                  सत्यापित ग्राहक
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700 font-semibold">
                  <span>पास ID:</span>
                  <strong className="font-mono text-slate-900">{customer.passCode}</strong>
                </div>
                <div className="flex justify-between text-slate-700 font-semibold">
                  <span>गाव/शहर:</span>
                  <strong>{customer.village}</strong>
                </div>
                <div className="flex justify-between text-slate-700 font-semibold">
                  <span>नोंदणी तारीख:</span>
                  <span>{new Date(customer.createdAt).toLocaleDateString('mr-IN')}</span>
                </div>
              </div>

              {/* Marketing Consent Toggle */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">मार्केटिंग व ऑफर अपडेट्स</h4>
                  <p className="text-[11px] text-slate-600">नवीन कूपन्स व डिस्काउंट ऑफर्सच्या सूचना</p>
                </div>
                <input
                  type="checkbox"
                  checked={customer.marketingConsent}
                  onChange={(e) => handleMarketingToggle(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {/* Delete Account */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>खाते डिलीट करा (Delete Account)</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
                >
                  लॉगआउट
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: गोपनीयता व संमती (PRIVACY & CONSENT) */}
      {activeTab === 'privacy' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-black text-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <span>गोपनीयता, डेटा संरक्षण आणि संमती धोरण</span>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>१. डेटा संग्रह आणि उद्देश:</strong> आम्ही फक्त तुमचे नाव, मोबाईल नंबर आणि गाव/शहर साठवतो. हा डेटा तुम्हाला डिजिटल शॉपिंग पास, डिस्काउंट कूपन्स आणि संबंधित दुकानांच्या ऑफर्स पुरवण्यासाठी वापरला जातो.
              </p>
              <p>
                <strong>२. क्यूआर कोड सुरक्षितता:</strong> तुमच्या पब्लिक क्यूआर कोड किंवा रेफरल लिंक मध्ये तुमचा मोबाईल नंबर थेट एनकोड केला जात नाही.
              </p>
              <p>
                <strong>३. मार्केटिंग संमती आणि अधिकार:</strong> अकाउंट तयार करण्यासाठी मार्केटिंग संमती अनिवार्य नाही. तुम्ही कोणत्याही वेळी मार्केटिंग संमती मागे घेऊ शकता किंवा तुमचे खाते डिलीट करू शकता.
              </p>
            </div>
          </div>

          {/* Audit Logs of Consent */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-black text-slate-900">संमती इतिहास (Consent History Trail)</h3>
            {consents.length === 0 ? (
              <p className="text-xs text-slate-500">कोणतीही नोंद उपलब्ध नाही.</p>
            ) : (
              <div className="space-y-2">
                {consents.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{c.consentType}</span>
                      <p className="text-[11px] text-slate-500">{c.notes}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${c.granted ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {c.granted ? 'स्वीकृत' : 'अस्वीकृत'}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {new Date(c.timestamp).toLocaleDateString('mr-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: मदत व संपर्क (HELP & SUPPORT) */}
      {activeTab === 'help' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="text-center space-y-1">
              <HelpCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-black text-slate-900">ग्राहक मदत व तक्रार निवारण केंद्र</h2>
              <p className="text-xs text-slate-500">कूपन, दुकान किंवा तांत्रिक अडचणीबाबत आम्हाला संदेश पाठवा</p>
            </div>

            {supportSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold text-center">
                तुमचा संदेश यशस्वीरित्या प्राप्त झाला आहे. D COMPANY टीम लवकरच तुमच्याशी संपर्क साधेल.
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">तक्रार / चौकशीचा प्रकार</label>
                  <select
                    value={supportCategory}
                    onChange={(e) => setSupportCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  >
                    <option value="COUPON_ISSUE">कूपन रिडीम होत नाही</option>
                    <option value="SHOP_QUERY">दुकानाची माहिती चुकीची आहे</option>
                    <option value="TECHNICAL">ॲप तांत्रिक अडचण</option>
                    <option value="OTHER">इतर प्रश्न</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">तुमचा संदेश / प्रश्न विस्कळीत सांगा</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="येथे आपला संदेश लिहा..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>संदेश पाठवा</span>
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-100 text-center text-xs space-y-1">
              <p className="font-bold text-slate-900">थेट संपर्क (D COMPANY Office)</p>
              <p className="text-emerald-700 font-bold font-mono">फोन: {adminSettings.companyPhone}</p>
              <p className="text-slate-500 font-mono">ईमेल: {adminSettings.companyEmail}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
