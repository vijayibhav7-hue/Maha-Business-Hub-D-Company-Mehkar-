import React from 'react';
import { Store, QrCode, Shield, UserCheck, Search, Sparkles, MapPin, Share2, Building2, Ticket } from 'lucide-react';
import { ViewMode, Region } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { MAHARASHTRA_DISTRICTS_DATA } from '../data/maharashtraData';

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs pt-safe w-full overflow-hidden">
      {/* Broadcast Announcement Bar */}
      {isBroadcastActive && broadcastMessage && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-white text-[11px] sm:text-xs py-1 px-3 sm:px-4 text-center font-semibold flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200 shrink-0" />
          <span className="truncate max-w-4xl">{broadcastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-3">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink min-w-0 cursor-pointer" onClick={() => setCurrentView('directory')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-extrabold text-base sm:text-xl shadow-md shadow-amber-500/20 border border-amber-400/30 shrink-0">
              M
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-base lg:text-lg font-black tracking-tight text-slate-900 truncate">
                  {t('appName', 'Maha Business Hub')}
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded-md border border-amber-300 shrink-0">
                  {t('subBrand', 'D Company')}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 flex items-center gap-0.5 sm:gap-1">
                <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                <span className="truncate">{t('regionTag', 'महाराष्ट्र (सर्व जिल्हे व तालुके)')}</span>
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
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

          {/* Search Bar (Large Screens) */}
          {currentView === 'directory' && (
            <div className="hidden xl:flex items-center flex-1 max-w-xs relative">
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

          {/* Zone 3: Action Buttons & Language Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Share App Button */}
            <button
              onClick={handleShareAppWhatsApp}
              className="p-1.5 sm:py-1.5 sm:px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all shrink-0"
              title="Share App on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Share App</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Maharashtra District / Location Selector */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedRegion('All')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  selectedRegion === 'All'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('allAreas', 'सर्व महाराष्ट्र (All)')}
              </button>

              <select
                value={['All', 'Mehkar', 'Lonar'].includes(selectedRegion) ? selectedRegion : selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-2 py-1 text-[11px] font-extrabold bg-white text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-sans"
              >
                <option value="All">📍 जिल्हा निवडा (Select District)</option>
                <optgroup label="प्रमुख तालुके (Key Talukas)">
                  <option value="Mehkar">Mehkar (मेहकर)</option>
                  <option value="Lonar">Lonar (लोणार)</option>
                  <option value="Chikhli">Chikhli (चिखली)</option>
                  <option value="Khamgaon">Khamgaon (खामगाव)</option>
                </optgroup>
                <optgroup label="महाराष्ट्रातील सर्व ३६ जिल्हे (All Districts)">
                  {MAHARASHTRA_DISTRICTS_DATA.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.nameMr} ({d.name})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Customer Portal Button */}
            <button
              onClick={() => setCurrentView('customer-portal')}
              className={`px-2 sm:px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                currentView === 'customer-portal'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              <span className="hidden xl:inline">ग्राहकांसाठी (Customer Portal)</span>
              <span className="hidden sm:inline xl:hidden">ग्राहकांसाठी</span>
              <span className="sm:hidden text-[10px] font-bold">ग्राहक</span>
            </button>

            {/* Shop Login Button */}
            <button
              onClick={() => setCurrentView('shop-owner')}
              className={`px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1 shrink-0 ${
                currentView === 'shop-owner'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('shopLogin', 'Shop Login')}</span>
              <span className="sm:hidden text-[10px]">Shop</span>
            </button>

            {/* Admin Login Button */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1 shrink-0 ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-amber-500 text-slate-950 border-amber-600 hover:bg-amber-600 hover:text-white shadow-xs'
              }`}
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('adminLogin', 'Admin')}</span>
              <span className="sm:hidden text-[10px]">Admin</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
