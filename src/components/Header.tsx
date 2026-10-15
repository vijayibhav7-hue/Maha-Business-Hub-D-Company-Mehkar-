import React from 'react';
import { Store, QrCode, Shield, UserCheck, Search, Sparkles, MapPin, Share2, Building2 } from 'lucide-react';
import { ViewMode, Region } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  broadcastMessage?: string;
  isBroadcastActive?: boolean;
  onOpenAdPopup?: () => void;
  onOpenAboutModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  selectedRegion,
  setSelectedRegion,
  broadcastMessage,
  isBroadcastActive,
  onOpenAdPopup,
  onOpenAboutModal,
}) => {
  const { t } = useLanguage();

  const handleShareAppWhatsApp = () => {
    const appUrl = window.location.origin + window.location.pathname;
    const msg = encodeURIComponent(
      `🚩 *महकर व लोणारच्या सर्व दुकानांच्या ऑफर्स आता एकाच जागेवर!* 🚩\n\n` +
      `नमस्कार! *महा बिझनेस हब (D COMPANY)* वरून मोबाईल, कपडे, खते व दवाखान्यांचे डिस्काउंट कूपन मोफत मिळवा!\n\n` +
      `📲 आताच ॲप उघडा आणि कूपन क्लेम करा:\n${appUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs pt-safe">
      {/* Broadcast Announcement Bar */}
      {isBroadcastActive && broadcastMessage && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-white text-xs py-1.5 px-4 text-center font-semibold flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200 shrink-0" />
          <span className="truncate max-w-4xl">{broadcastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => setCurrentView('directory')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-amber-500/20 border border-amber-400/30 shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 whitespace-nowrap">
                  {t('appName', 'Maha Business Hub')}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-300">
                  {t('subBrand', 'D Company')}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{t('regionTag', 'Mehkar & Lonar')}</span>
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentView('directory')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'directory'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4 text-amber-600" />
              {t('shopsDirectory', 'Shops Directory')}
            </button>

            <button
              onClick={() => setCurrentView('d-qr')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'd-qr'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              {t('counterDQR', 'Counter D-QR')}
            </button>

            {onOpenAdPopup && (
              <button
                onClick={onOpenAdPopup}
                className="px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100/60 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Hot Deals</span>
              </button>
            )}

            {onOpenAboutModal && (
              <button
                onClick={onOpenAboutModal}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>About D Company</span>
              </button>
            )}
          </nav>

          {/* Search Bar (Desktop Viewport) */}
          {currentView === 'directory' && (
            <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('searchPlaceholder', 'Search shop, phone...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all font-medium"
              />
            </div>
          )}

          {/* Zone 3: Primary Action Buttons, Viral Share & Language Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Share App on WhatsApp Button */}
            <button
              onClick={handleShareAppWhatsApp}
              className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title="Share App on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Share App</span>
            </button>

            {/* Language Selector Toggle */}
            <LanguageSelector />

            {/* Region Selector Pills */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 mr-1">
              {(['All', 'Mehkar', 'Lonar'] as Region[]).map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                    selectedRegion === reg
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {reg === 'All' ? t('allAreas', 'All') : reg}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('shop-owner')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                currentView === 'shop-owner'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">{t('shopLogin', 'Shop Login')}</span>
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-amber-500 text-slate-950 border-amber-600 hover:bg-amber-600 hover:text-white shadow-xs'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">{t('adminLogin', 'Admin')}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
