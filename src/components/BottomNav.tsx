import React from 'react';
import { Store, QrCode, UserCheck, Shield } from 'lucide-react';
import { ViewMode } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const { t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1">
      <div className="grid grid-cols-4 items-center h-14">
        
        <button
          onClick={() => setCurrentView('directory')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentView === 'directory' ? 'text-amber-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <Store className={`w-5 h-5 ${currentView === 'directory' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] tracking-tight mt-1">{t('shopsDirectory', 'Shops')}</span>
        </button>

        <button
          onClick={() => setCurrentView('d-qr')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentView === 'd-qr' ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <QrCode className={`w-5 h-5 ${currentView === 'd-qr' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] tracking-tight mt-1">{t('counterDQR', 'D-QR Codes')}</span>
        </button>

        <button
          onClick={() => setCurrentView('shop-owner')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentView === 'shop-owner' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <UserCheck className={`w-5 h-5 ${currentView === 'shop-owner' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] tracking-tight mt-1">{t('shopLogin', 'Shop Login')}</span>
        </button>

        <button
          onClick={() => setCurrentView('admin')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentView === 'admin' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800 font-semibold'
          }`}
        >
          <Shield className={`w-5 h-5 ${currentView === 'admin' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] tracking-tight mt-1">{t('adminLogin', 'Admin')}</span>
        </button>

      </div>
    </div>
  );
};
