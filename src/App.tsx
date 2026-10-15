import React, { useState, useEffect } from 'react';
import { 
  Store, 
  QrCode, 
  Search, 
  Sparkles, 
  MapPin, 
  RefreshCw,
  Building2,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Business, ViewMode, Category, Region } from './types';
import { 
  getBusinesses, 
  getAdminSettings, 
  initStorage,
  trackReferralClick,
  recordWebsiteVisit,
  recordCampaignQRScan
} from './services/storage';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CategoryFilter } from './components/CategoryFilter';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { CouponClaimModal } from './components/CouponClaimModal';
import { DQRModal } from './components/DQRModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ShopOwnerPortal } from './components/ShopOwnerPortal';
import { CustomerPortal } from './components/CustomerPortal';
import { TickerMarquee } from './components/TickerMarquee';
import { BannerSlider } from './components/BannerSlider';
import { AdPopupModal } from './components/AdPopupModal';
import { AboutDCompanyModal } from './components/AboutDCompanyModal';
import { CampaignBannerHero } from './components/CampaignBannerHero';
import { MerchantLandingPage } from './components/MerchantLandingPage';
import { CampaignAssetsModal } from './components/CampaignAssetsModal';

function AppContent() {
  const { t, language } = useLanguage();

  const [currentView, setCurrentView] = useState<ViewMode>('directory');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [adminSettings, setAdminSettings] = useState(getAdminSettings());

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modal States
  const [selectedShopDetail, setSelectedShopDetail] = useState<Business | null>(null);
  const [selectedShopCoupon, setSelectedShopCoupon] = useState<Business | null>(null);
  const [selectedShopDQR, setSelectedShopDQR] = useState<Business | null>(null);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCampaignAssetsModal, setShowCampaignAssetsModal] = useState(false);

  // Initialize data on load
  useEffect(() => {
    initStorage();
    recordWebsiteVisit();
    const data = getBusinesses();
    setBusinesses(data);
    setAdminSettings(getAdminSettings());

    // Check if opened via D-QR scan link e.g., ?shop=biz-1 or ?ref=PASS-MBH-123
    const params = new URLSearchParams(window.location.search);
    const shopParam = params.get('shop');
    const refParam = params.get('ref');

    if (shopParam) {
      recordCampaignQRScan();
      const matched = data.find((b) => b.id === shopParam);
      if (matched) {
        setSelectedShopDetail(matched);
      }
    }

    if (refParam) {
      trackReferralClick(refParam, shopParam || undefined);
    }
  }, [language]);

  // Reload data helper
  const refreshBusinesses = () => {
    setBusinesses(getBusinesses());
    setAdminSettings(getAdminSettings());
  };

  // Filtered Business Listings
  const filteredBusinesses = businesses.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesRegion =
      selectedRegion === 'All' ||
      b.region === selectedRegion ||
      b.district === selectedRegion ||
      b.taluka === selectedRegion ||
      b.village === selectedRegion ||
      (b.address && b.address.toLowerCase().includes(selectedRegion.toLowerCase()));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.tagline.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      (b.district && b.district.toLowerCase().includes(q)) ||
      (b.taluka && b.taluka.toLowerCase().includes(q)) ||
      (b.village && b.village.toLowerCase().includes(q)) ||
      b.ownerName.toLowerCase().includes(q) ||
      b.ownerPhone.includes(q) ||
      b.todaysOffer.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);

    return matchesCategory && matchesRegion && matchesSearch;
  });

  // Calculate category counts
  const categoryCounts: Record<string, number> = {
    All: businesses.length,
  };
  businesses.forEach((b) => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });

  const handleSelectShopFromBanner = (shopId: string) => {
    const shop = businesses.find((b) => b.id === shopId);
    if (shop) {
      setSelectedShopDetail(shop);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-8 flex flex-col justify-between selection:bg-amber-100">
      
      <div>
        {/* Navigation Header */}
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          broadcastMessage={adminSettings.broadcastMessage}
          isBroadcastActive={adminSettings.isBroadcastActive}
          onOpenAdPopup={() => setShowAdPopup(true)}
          onOpenAboutModal={() => setShowAboutModal(true)}
        />

        {/* Marquee Ticker Announcement */}
        <TickerMarquee
          text={adminSettings.tickerText}
          isActive={adminSettings.isTickerActive}
        />

        {/* MAIN CONTENT VIEW CONTROLLER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          
          {/* VIEW 1: PUBLIC DIRECTORY - SHOPS, ADS & COUPONS FRONT & CENTER */}
          {currentView === 'directory' && (
            <div className="space-y-6">
              
              {/* Top Priority 1: Homepage Carousel Banner Slider (Hot Ads & Festival Offers) */}
              <BannerSlider
                banners={adminSettings.banners || []}
                onSelectShop={handleSelectShopFromBanner}
              />

              {/* Priority 2: Category & Region Filter */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                categoryCounts={categoryCounts}
              />

              {/* Priority 3: Results Summary Bar */}
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1">
                <span className="flex items-center gap-1.5 text-slate-900 font-black">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>{t('showingShops', 'Total Shops')}: <strong className="text-amber-700">{filteredBusinesses.length}</strong> ({selectedRegion === 'All' ? 'संपूर्ण महाराष्ट्र' : selectedRegion})</span>
                </span>

                <button
                  onClick={refreshBusinesses}
                  className="text-slate-500 hover:text-slate-900 flex items-center gap-1 font-bold text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Priority 4: Verified Local Business Cards Grid */}
              {filteredBusinesses.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200 shadow-xs">
                  <Store className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No Shops Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    No verified businesses matched your current search or category filter. Try resetting your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedRegion('All');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map((shop) => (
                    <BusinessCard
                      key={shop.id}
                      business={shop}
                      onOpenDetails={setSelectedShopDetail}
                      onClaimCoupon={setSelectedShopCoupon}
                      onViewDQR={setSelectedShopDQR}
                    />
                  ))}
                </div>
              )}

              {/* Priority 5: D COMPANY Campaign Onboarding Hero Banner (Placed below shop listings to avoid customer confusion) */}
              <div className="pt-4 border-t border-slate-200">
                <CampaignBannerHero
                  onSelectMerchant={() => setCurrentView('campaign-merchant')}
                  onSelectCustomer={() => setCurrentView('customer-portal')}
                  onOpenAssets={() => setShowCampaignAssetsModal(true)}
                />
              </div>

            </div>
          )}

          {/* VIEW 2: D-QR COUNTER STANDS DIRECTORY */}
          {currentView === 'd-qr' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-600/30 shadow-lg space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <QrCode className="w-5 h-5" />
                  <span>D Company Dynamic D-QR Network</span>
                </div>
                <h1 className="text-2xl font-black text-white">
                  Shop Counter D-QR Code Standees
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Every registered shop is assigned a dynamic counter D-QR code. Customers scanning this QR code at physical shop counters land on the shop's daily offers and instant coupon claim pass.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((shop) => (
                  <div
                    key={shop.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-xs">
                        {shop.region} · {shop.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{shop.name}</h4>
                      <p className="text-xs text-slate-500">Offer: {shop.todaysOffer.discountTag}</p>
                    </div>

                    <button
                      onClick={() => setSelectedShopDQR(shop)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
                    >
                      <QrCode className="w-4 h-4" />
                      View D-QR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: D COMPANY ADMIN DASHBOARD */}
          {currentView === 'admin' && (
            <AdminDashboard onBackToDirectory={() => setCurrentView('directory')} />
          )}

          {/* VIEW 4: SHOP OWNER PORTAL */}
          {currentView === 'shop-owner' && (
            <ShopOwnerPortal
              onBackToDirectory={() => setCurrentView('directory')}
              onViewDQR={setSelectedShopDQR}
            />
          )}

          {/* VIEW 5: MAHA BUSINESS HUB CUSTOMER PORTAL */}
          {currentView === 'customer-portal' && (
            <CustomerPortal
              onSelectShopDetail={setSelectedShopDetail}
            />
          )}

          {/* FEATURE 2 VIEW: MERCHANT LANDING PAGE ("मी दुकानदार आहे") */}
          {currentView === 'campaign-merchant' && (
            <MerchantLandingPage
              onBackToDirectory={() => setCurrentView('directory')}
              onOpenShopOwnerPortal={() => setCurrentView('shop-owner')}
            />
          )}

        </main>
      </div>

      {/* Footer Branding & D Company Official Details */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800 mt-12 pb-safe">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-white text-sm">
              <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                D
              </span>
              <span>{adminSettings.companyName} (Mehkar & Lonar)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Empowering local merchants in Mehkar & Lonar with digital listings, daily offers & leads.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-amber-400 font-mono mt-2 font-bold">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{adminSettings.companyPhone}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{adminSettings.companyEmail}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <button
              onClick={() => setCurrentView('campaign-merchant')}
              className="text-amber-400 hover:underline font-bold transition-colors flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>मी दुकानदार आहे</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setShowCampaignAssetsModal(true)}
              className="text-emerald-400 hover:underline font-bold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>प्रचार साहित्य</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setShowAboutModal(true)}
              className="text-slate-300 hover:underline font-bold transition-colors flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>About D Company</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentView('admin')}
              className="text-slate-300 hover:text-amber-400 font-semibold transition-colors"
            >
              {t('adminLogin', 'Admin Portal')}
            </button>
            <span>·</span>
            <button
              onClick={() => setCurrentView('shop-owner')}
              className="text-slate-300 hover:text-emerald-400 font-semibold transition-colors"
            >
              Shopkeeper Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Bottom Mobile Tab Bar */}
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />

      {/* MODALS */}
      {selectedShopDetail && (
        <BusinessDetailModal
          business={selectedShopDetail}
          onClose={() => setSelectedShopDetail(null)}
          onClaimCoupon={setSelectedShopCoupon}
          onViewDQR={setSelectedShopDQR}
        />
      )}

      {selectedShopCoupon && (
        <CouponClaimModal
          business={selectedShopCoupon}
          onClose={() => setSelectedShopCoupon(null)}
          onLeadClaimed={() => refreshBusinesses()}
        />
      )}

      {selectedShopDQR && (
        <DQRModal
          business={selectedShopDQR}
          onClose={() => setSelectedShopDQR(null)}
        />
      )}

      {showAdPopup && (
        <AdPopupModal
          banners={adminSettings.banners || []}
          onClose={() => setShowAdPopup(false)}
          onSelectShop={handleSelectShopFromBanner}
        />
      )}

      {showAboutModal && (
        <AboutDCompanyModal
          settings={adminSettings}
          onClose={() => setShowAboutModal(false)}
        />
      )}

      {showCampaignAssetsModal && (
        <CampaignAssetsModal
          onClose={() => setShowCampaignAssetsModal(false)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
