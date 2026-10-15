import React from 'react';
import { Megaphone, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TickerMarqueeProps {
  text: string;
  isActive: boolean;
}

export const TickerMarquee: React.FC<TickerMarqueeProps> = ({ text, isActive }) => {
  const { t } = useLanguage();

  if (!isActive || !text) return null;

  return (
    <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-950 text-amber-300 py-1.5 px-3 text-xs border-b border-amber-500/20 overflow-hidden flex items-center shadow-xs">
      {/* Fixed Tag */}
      <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 z-10 shadow-xs mr-2">
        <Megaphone className="w-3.5 h-3.5" />
        <span>महत्त्वाचे / NOTICE</span>
      </div>

      {/* Smooth Continuous Right-to-Left Marquee */}
      <div className="overflow-hidden whitespace-nowrap relative flex-1">
        <div className="inline-block animate-marquee font-bold tracking-wide text-white text-xs">
          <span className="inline-flex items-center gap-2 mr-12">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline shrink-0 animate-spin" />
            {text}
          </span>
          <span className="inline-flex items-center gap-2 mr-12">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline shrink-0 animate-spin" />
            {text}
          </span>
          <span className="inline-flex items-center gap-2 mr-12">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline shrink-0 animate-spin" />
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};
