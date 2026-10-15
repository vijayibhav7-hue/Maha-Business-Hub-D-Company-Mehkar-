import React from 'react';
import { Store, ShoppingBag, Sparkles, Phone, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { ViewMode } from '../types';

interface CampaignBannerHeroProps {
  onSelectMerchant: () => void;
  onSelectCustomer: () => void;
  onOpenAssets: () => void;
}

export const CampaignBannerHero: React.FC<CampaignBannerHeroProps> = ({
  onSelectMerchant,
  onSelectCustomer,
  onOpenAssets,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-amber-950 text-white rounded-3xl p-5 sm:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden my-3">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-5 text-center sm:text-left">
        
        {/* Campaign Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-extrabold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>D COMPANY, MEHKAR — डिजिटल ग्रोथ पार्टनर</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            “आपला बाजार, आपले दुकानदार, <span className="text-amber-400 underline decoration-amber-500 decoration-wavy decoration-2">आता डिजिटल!</span>”
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            मेहकर आणि लोणार परिसरातील दुकानांच्या दैनिक ऑफर्स, डिस्काउंट कूपन्स आणि डिजिटल शॉपिंग पास एकाच ठिकाणी.
          </p>
        </div>

        {/* Two Main Big CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
          
          {/* Option A: Merchant CTA */}
          <button
            onClick={onSelectMerchant}
            className="group p-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-2xl font-black text-left shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 border border-amber-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-950/20 text-slate-950 flex items-center justify-center font-black shrink-0">
                <Store className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-900 bg-amber-200/60 px-2 py-0.5 rounded-md">
                  पर्याय A
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                  मी दुकानदार आहे
                </h3>
                <p className="text-[11px] text-slate-900/80 font-medium">
                  व्यवसाय नोंदवा व AI रील्स/पोस्टर्स मिळवा
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
          </button>

          {/* Option B: Customer CTA */}
          <button
            onClick={onSelectCustomer}
            className="group p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-black text-left shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 border border-emerald-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center font-black shrink-0">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 bg-emerald-800/40 px-2 py-0.5 rounded-md">
                  पर्याय B
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  मी ग्राहक आहे
                </h3>
                <p className="text-[11px] text-emerald-100 font-medium">
                  ऑफर्स शोधा व शॉपिंग पास मिळवा
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
          </button>

        </div>

        {/* Quick Highlights Bar */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300 font-medium">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>१००% पडताळणीकृत स्थानिक दुकाने</span>
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <button
              onClick={onOpenAssets}
              className="flex items-center gap-1 text-amber-400 hover:underline font-bold"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>प्रचार साहित्य व अॅसेट्स</span>
            </button>
          </div>

          <a
            href="https://wa.me/919607636444?text=Hello%20D%20COMPANY!%20I%20want%20information%20about%20Mehkar%20Digital%20Campaign."
            target="_blank"
            rel="noreferrer"
            className="text-amber-300 font-bold hover:underline flex items-center gap-1"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>WhatsApp: 9607636444</span>
          </a>
        </div>

      </div>
    </div>
  );
};
