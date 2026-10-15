import React, { useState } from 'react';
import { X, Sparkles, Tag, ArrowRight, Store, ShieldCheck } from 'lucide-react';
import { BannerSlide } from '../types';

interface AdPopupModalProps {
  banners: BannerSlide[];
  onClose: () => void;
  onSelectShop?: (shopId: string) => void;
}

export const AdPopupModal: React.FC<AdPopupModalProps> = ({ banners, onClose, onSelectShop }) => {
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-400/50 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Container */}
        <div className="relative h-56 w-full bg-slate-900">
          <img
            src={current.imageUrl}
            alt={current.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          <div className="absolute top-3 left-3">
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {current.discountBadge}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-xl font-black text-white tracking-tight drop-shadow-sm">
              {current.title}
            </h3>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-center">
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {current.subtitle}
          </p>

          <div className="space-y-2 pt-1">
            {current.targetShopId && onSelectShop && (
              <button
                onClick={() => {
                  onClose();
                  onSelectShop(current.targetShopId!);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Store className="w-4 h-4" />
                <span>View Shop & Get Discount Coupon</span>
              </button>
            )}

            {activeBanners.length > 1 && (
              <button
                onClick={handleNext}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
              >
                <span>Next Special Deal ({currentIndex + 1}/{activeBanners.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified D Company Featured Promotion
          </p>
        </div>

      </div>
    </div>
  );
};
