import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { BannerSlide } from '../types';

interface BannerSliderProps {
  banners: BannerSlide[];
  onSelectShop?: (shopId: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ banners, onSelectShop }) => {
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-amber-500/20 group my-4 bg-slate-900 min-h-[220px] sm:min-h-[260px] flex items-center">
      {/* Background Image with Scrim */}
      <img
        src={current.imageUrl}
        alt={current.title}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-700 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

      {/* Slide Content */}
      <div className="relative z-10 p-6 sm:p-8 max-w-xl space-y-2 text-white">
        <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          <Tag className="w-3.5 h-3.5" />
          {current.discountBadge}
        </span>

        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm leading-snug">
          {current.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed font-medium">
          {current.subtitle}
        </p>

        {current.targetShopId && onSelectShop && (
          <div className="pt-2">
            <button
              onClick={() => onSelectShop(current.targetShopId!)}
              className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-transform"
            >
              <span>View Special Offer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-slate-950 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/60 text-white flex items-center justify-center hover:bg-slate-950 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
