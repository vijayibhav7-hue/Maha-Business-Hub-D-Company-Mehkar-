import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  Users, 
  QrCode, 
  Search, 
  Save, 
  LogOut, 
  MessageSquare,
  Megaphone,
  ShoppingBag,
  Upload,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Business, Lead, SocialLinks, CouponRedemption, Referral } from '../types';
import { 
  getShopByPinOrPhone, 
  getLeads, 
  addAdRequest, 
  addStandeeOrder, 
  submitShopPendingUpdate,
  getCouponRedemptions,
  verifyCouponRedemptionByStaff,
  getReferrals,
  confirmReferralPurchaseByMerchant
} from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { compressImageFile } from '../utils/imageCompressor';
import { AIMarketingGeneratorModal } from './AIMarketingGeneratorModal';
import { PrintableStandeeModal } from './PrintableStandeeModal';

interface ShopOwnerPortalProps {
  onBackToDirectory: () => void;
  onViewDQR: (b: Business) => void;
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

export const ShopOwnerPortal: React.FC<ShopOwnerPortalProps> = ({
  onBackToDirectory,
  onViewDQR,
}) => {
  const { t } = useLanguage();

  const [loginInput, setLoginInput] = useState('');
  const [loggedShop, setLoggedShop] = useState<Business | null>(null);
  const [loginError, setLoginError] = useState('');

  // Offer State
  const [offerTitle, setOfferTitle] = useState('');
  const [offerTag, setOfferTag] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerTill, setOfferTill] = useState('');
  const [offerActive, setOfferActive] = useState(true);

  // Shop Photo & Tagline
  const [shopImage, setShopImage] = useState('');
  const [shopTagline, setShopTagline] = useState('');

  // Social Media Links
  const [fbUrl, setFbUrl] = useState('');
  const [instaUrl, setInstaUrl] = useState('');
  const [twUrl, setTwUrl] = useState('');
  const [ytUrl, setYtUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [gmapUrl, setGmapUrl] = useState('');

  const [shopLeads, setShopLeads] = useState<Lead[]>([]);
  const [leadQuery, setLeadQuery] = useState('');
  const [savePendingMsg, setSavePendingMsg] = useState('');

  // Coupon Staff Verification State
  const [verifyCouponCode, setVerifyCouponCode] = useState('');
  const [verifyPinInput, setVerifyPinInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string } | null>(null);

  // Shop Redemptions & Referrals
  const [shopRedemptions, setShopRedemptions] = useState<CouponRedemption[]>([]);
  const [shopReferrals, setShopReferrals] = useState<Referral[]>([]);

  // Ad Boost Modal
  const [showAdModal, setShowAdModal] = useState(false);
  const [adAdType, setAdAdType] = useState<'Homepage Hero Banner (₹199/3 Days)' | 'Top Category Spotlight (₹299/Week)' | 'Push Notification Broadcast (₹499)'>('Homepage Hero Banner (₹199/3 Days)');
  const [adSuccess, setAdSuccess] = useState('');

  // Standee Modal
  const [showStandeeModal, setShowStandeeModal] = useState(false);
  const [standeeMaterial, setStandeeMaterial] = useState<'Premium Acrylic Board (₹299)' | 'Wooden Counter Standee (₹499)' | 'Heavy Duty Vinyl Sticker (₹149)'>('Premium Acrylic Board (₹299)');
  const [standeeAddress, setStandeeAddress] = useState('');
  const [standeeSuccess, setStandeeSuccess] = useState('');

  // AI & Print Standee Modals
  const [showAiGen, setShowAiGen] = useState(false);
  const [showPrintStandee, setShowPrintStandee] = useState(false);

  const refreshShopData = () => {
    if (!loggedShop) return;
    const allLeads = getLeads();
    setShopLeads(allLeads.filter((l) => l.businessId === loggedShop.id));

    const redemptions = getCouponRedemptions();
    setShopRedemptions(redemptions.filter((r) => r.businessId === loggedShop.id));

    const refs = getReferrals();
    setShopReferrals(refs.filter((r) => r.businessId === loggedShop.id || !r.businessId));
  };

  useEffect(() => {
    if (loggedShop) {
      refreshShopData();

      setOfferTitle(loggedShop.todaysOffer.title);
      setOfferTag(loggedShop.todaysOffer.discountTag);
      setOfferDesc(loggedShop.todaysOffer.description);
      setOfferTill(loggedShop.todaysOffer.validTill);
      setOfferActive(loggedShop.todaysOffer.isActive);

      setShopImage(loggedShop.image);
      setShopTagline(loggedShop.tagline);

      const soc = loggedShop.socialLinks || {};
      setFbUrl(soc.facebook || '');
      setInstaUrl(soc.instagram || '');
      setTwUrl(soc.twitter || '');
      setYtUrl(soc.youtube || '');
      setWebUrl(soc.website || '');
      setGmapUrl(soc.googleBusiness || '');

      setStandeeAddress(loggedShop.address);
    }
  }, [loggedShop]);

  const handleStaffVerifyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedShop || !verifyCouponCode.trim() || !verifyPinInput.trim()) return;

    const res = verifyCouponRedemptionByStaff(verifyCouponCode, loggedShop.id, verifyPinInput);
    setVerifyResult(res);
    if (res.success) {
      setVerifyCouponCode('');
      refreshShopData();
    }
  };

  const handleConfirmReferral = (referralId: string) => {
    if (!loggedShop) return;
    const res = confirmReferralPurchaseByMerchant(referralId, loggedShop.id);
    alert(res.message);
    refreshShopData();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const shop = getShopByPinOrPhone(loginInput);
    if (shop) {
      setLoggedShop(shop);
    } else {
      setLoginError('No shop found matching this Owner Phone or Shop PIN.');
    }
  };

  // Compressed Image FileReader Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImageFile(file, 800, 600, 0.75);
      setShopImage(compressedBase64);
    } catch (err) {
      alert('Failed to compress image file. Please try another photo.');
    }
  };

  // Submit Changes for Admin Approval
  const handleSubmitChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedShop) return;

    const newOffer = {
      title: offerTitle,
      description: offerDesc,
      discountTag: offerTag,
      validTill: offerTill,
      isActive: offerActive,
    };

    const newSocial: SocialLinks = {
      facebook: fbUrl.trim(),
      instagram: instaUrl.trim(),
      twitter: twUrl.trim(),
      youtube: ytUrl.trim(),
      website: webUrl.trim(),
      googleBusiness: gmapUrl.trim(),
    };

    const updated = submitShopPendingUpdate(loggedShop.id, {
      todaysOffer: newOffer,
      image: shopImage,
      tagline: shopTagline,
      socialLinks: newSocial,
    });

    if (updated) {
      setLoggedShop(updated);
      setSavePendingMsg('Social media links & profile changes submitted successfully! Awaiting D Company Admin verification before appearing publicly.');
      setTimeout(() => setSavePendingMsg(''), 6000);
    }
  };

  const handleRequestAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedShop) return;
    const amount = adAdType.includes('199') ? 199 : adAdType.includes('299') ? 299 : 499;
    addAdRequest(loggedShop.id, loggedShop.name, loggedShop.ownerPhone, adAdType, amount);
    setAdSuccess('Ad Request submitted to D Company Admin!');
    setTimeout(() => { setAdSuccess(''); setShowAdModal(false); }, 3000);
  };

  const handleOrderStandee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedShop) return;
    const amount = standeeMaterial.includes('299') ? 299 : standeeMaterial.includes('499') ? 499 : 149;
    addStandeeOrder(
      loggedShop.id,
      loggedShop.name,
      loggedShop.ownerName,
      loggedShop.ownerPhone,
      standeeAddress,
      standeeMaterial,
      amount
    );
    setStandeeSuccess('Physical D-QR Standee order placed!');
    setTimeout(() => { setStandeeSuccess(''); setShowStandeeModal(false); }, 3000);
  };

  const handleLogout = () => {
    setLoggedShop(null);
    setLoginInput('');
  };

  if (!loggedShop) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-slate-200 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <UserCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              {t('shopPortalTitle', 'Shopkeeper Self-Service Portal')}
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Shop Owner Login
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter registered Owner Phone Number or Shop PIN.
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-medium text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Registered Phone or Shop PIN"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full px-4 py-3 text-center text-sm font-mono font-bold tracking-wider rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Access Shop Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-600/30 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={shopImage || loggedShop.image}
              alt={loggedShop.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0 bg-slate-800"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{loggedShop.name}</h1>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md">
                  {loggedShop.region}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {loggedShop.category} · Owner: {loggedShop.ownerName} ({loggedShop.ownerPhone})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowAdModal(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Megaphone className="w-4 h-4" />
              <span>{t('boostAd', 'Boost Ad (₹199)')}</span>
            </button>

            <button
              onClick={() => setShowStandeeModal(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('orderStandee', 'Order D-QR Board')}</span>
            </button>

            <button
              onClick={() => onViewDQR(loggedShop)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1"
            >
              <QrCode className="w-4 h-4" />
              <span>Print D-QR</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pending Approval Notice */}
        {loggedShop.isPendingApproval && (
          <div className="bg-amber-500/20 border border-amber-400/50 p-3 rounded-2xl text-xs text-amber-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>Your social media links & offer updates have been submitted to <strong>D Company Admin</strong> for verification before going public.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* EDIT OFFER, PHOTO & SOCIAL LINKS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2 font-marathi">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                {t('updateOffer', "Update Offer & Shop Photo")}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAiGen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI १-क्लिक ऑफर आयडिया</span>
            </button>
          </div>

          {savePendingMsg && (
            <div className="bg-amber-50 text-amber-900 text-xs p-3.5 rounded-xl border border-amber-300 font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{savePendingMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitChanges} className="space-y-4 text-xs">
            
            {/* Shop Photo Upload & Presets */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="block font-bold text-slate-800">
                {t('shopPhotoUpload', 'Shop Photo Upload')}
              </label>
              
              <div className="flex items-center gap-3">
                <img
                  src={shopImage || 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80'}
                  alt="Shop Preview"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-300 shrink-0 shadow-sm bg-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                <div className="flex-1 space-y-1.5">
                  <label className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2 shadow-xs transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{t('choosePhotoFile', 'Choose Photo File')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-500">Auto-compressed for fast loading</p>
                </div>
              </div>

              {/* Preset Photo Chooser */}
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Or Select Sample Category Photo:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {PRESET_PHOTOS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setShopImage(p.url)}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 shrink-0 transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t('offerHeadline', 'Offer Headline')} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Free Tempered Glass with Mobile Purchase"
                value={offerTitle}
                onChange={(e) => setOfferTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('discountTag', 'Discount Tag')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% OFF"
                  value={offerTag}
                  onChange={(e) => setOfferTag(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Valid Till *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Today 8:00 PM"
                  value={offerTill}
                  onChange={(e) => setOfferTill(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {/* Social Media Links Section */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <label className="block font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{t('socialLinksTitle', 'Social Media Links (Requires Admin Approval)')}</span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                  <input
                    type="url"
                    placeholder="Facebook Page URL"
                    value={fbUrl}
                    onChange={(e) => setFbUrl(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                  <input
                    type="url"
                    placeholder="Instagram Profile URL"
                    value={instaUrl}
                    onChange={(e) => setInstaUrl(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-sky-500 shrink-0" />
                  <input
                    type="url"
                    placeholder="Twitter / X Profile URL"
                    value={twUrl}
                    onChange={(e) => setTwUrl(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                  <input
                    type="url"
                    placeholder="YouTube Channel URL"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="url"
                    placeholder="Website / Google Business URL"
                    value={webUrl}
                    onChange={(e) => setWebUrl(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-[11px]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t('submitForApproval', 'Submit Links for D Company Admin Verification')}</span>
            </button>
          </form>
        </div>

        {/* CUSTOMER LEADS INBOX */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                {t('customerLeads', 'Customer Coupon Leads')} ({shopLeads.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Auto-saved from D-QR
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by customer name or phone..."
              value={leadQuery}
              onChange={(e) => setLeadQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {shopLeads.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No customer coupon leads yet. Display your D-QR Counter Standee at your shop counter to generate leads!
              </div>
            ) : (
              shopLeads
                .filter((l) =>
                  l.customerName.toLowerCase().includes(leadQuery.toLowerCase()) ||
                  l.customerPhone.includes(leadQuery)
                )
                .map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 hover:bg-slate-100/80 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{lead.customerName}</h4>
                      <p className="font-mono text-xs font-bold text-emerald-700">{lead.customerPhone}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(lead.claimedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="bg-amber-100 text-amber-900 font-mono font-black text-[11px] px-2.5 py-1 rounded-lg border border-amber-300 block">
                        {lead.couponCode}
                      </span>
                      <a
                        href={`https://wa.me/91${lead.customerPhone}?text=${encodeURIComponent(`Hello ${lead.customerName}! Thank you for claiming your coupon (${lead.couponCode}) at ${loggedShop.name}. We look forward to serving you!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1 justify-end mt-1"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>{t('replyWhatsApp', 'Reply via WhatsApp')}</span>
                      </a>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

      </div>

      {/* STAFF COUPON VERIFICATION & REFERRAL CONFIRMATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* WIDGET 1: COUPON STAFF VALIDATOR */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              कूपन रिडेम्प्शन व्हॅलिडेटर (Coupon Staff Verification)
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            ग्राहकाने दुकानात दाखवलेला कूपन कोड आणि तुमचा दुकान पिन टाकून कूपनची पुष्टी करा.
          </p>

          {verifyResult && (
            <div className={`p-3 rounded-2xl text-xs font-bold ${verifyResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {verifyResult.message}
            </div>
          )}

          <form onSubmit={handleStaffVerifyCoupon} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ग्राहक कूपन कोड (e.g. MAHA-AGR-1001)</label>
              <input
                type="text"
                required
                placeholder="उदा. MAHA-MEH-8921"
                value={verifyCouponCode}
                onChange={(e) => setVerifyCouponCode(e.target.value.toUpperCase())}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">दुकान पिन (Shop PIN)</label>
              <input
                type="password"
                required
                placeholder="तुमचा ४ अंकी दुकान पिन"
                value={verifyPinInput}
                onChange={(e) => setVerifyPinInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              कूपन रिडेम्प्शन व्हेरीफाय व कन्फर्म करा
            </button>
          </form>
        </div>

        {/* WIDGET 2: REFERRAL PURCHASE CONFIRMATION */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              रेफरल खरेदी पुष्टी (Confirm Referral Purchases)
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            ग्राहकाने सुचवलेल्या खरेदीची (Referral Purchase) व्यापारी म्हणून पुष्टी करा.
          </p>

          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {shopReferrals.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                अद्याप कोणत्याही रेफरल खरेदीची नोंद नाही.
              </div>
            ) : (
              shopReferrals.map((ref) => (
                <div key={ref.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{ref.referralCode}</span>
                    <p className="text-[10px] text-slate-500">
                      तारीख: {new Date(ref.clickedAt).toLocaleDateString('mr-IN')}
                    </p>
                  </div>

                  {ref.status === 'VERIFIED' ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300">
                      पुष्टी झाली
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConfirmReferral(ref.id)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-lg shadow-xs"
                    >
                      खरेदी पुष्टी करा
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* REQUEST AD MODAL */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-slate-900">Request Homepage Ad Boost</h3>
            
            {adSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border font-bold">
                {adSuccess}
              </div>
            )}

            <form onSubmit={handleRequestAd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Promotional Boost Package</label>
                <select
                  value={adAdType}
                  onChange={(e) => setAdAdType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="Homepage Hero Banner (₹199/3 Days)">Homepage Hero Banner (₹199/3 Days)</option>
                  <option value="Top Category Spotlight (₹299/Week)">Top Category Spotlight (₹299/Week)</option>
                  <option value="Push Notification Broadcast (₹499)">Push Notification Broadcast (₹499)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
              >
                Submit Ad Request to D Company
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER STANDEE MODAL */}
      {showStandeeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-slate-900">Order Physical Acrylic D-QR Counter Board</h3>
            
            {standeeSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border font-bold">
                {standeeSuccess}
              </div>
            )}

            <form onSubmit={handleOrderStandee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Material Type</label>
                <select
                  value={standeeMaterial}
                  onChange={(e) => setStandeeMaterial(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="Premium Acrylic Board (₹299)">Premium Acrylic Board (₹299)</option>
                  <option value="Wooden Counter Standee (₹499)">Wooden Counter Standee (₹499)</option>
                  <option value="Heavy Duty Vinyl Sticker (₹149)">Heavy Duty Vinyl Sticker (₹149)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={standeeAddress}
                  onChange={(e) => setStandeeAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
              >
                Place Standee Order (D Company Direct)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI OFFER GENERATOR MODAL */}
      <AIMarketingGeneratorModal
        isOpen={showAiGen}
        onClose={() => setShowAiGen(false)}
        shop={loggedShop}
        onApplyOffer={(title, tag, desc) => {
          setOfferTitle(title);
          setOfferTag(tag);
          setOfferDesc(desc);
          setShowAiGen(false);
        }}
      />

      {/* PRINTABLE QR STANDEE MODAL */}
      <PrintableStandeeModal
        isOpen={showPrintStandee}
        onClose={() => setShowPrintStandee(false)}
        shop={loggedShop}
      />

    </div>
  );
};
