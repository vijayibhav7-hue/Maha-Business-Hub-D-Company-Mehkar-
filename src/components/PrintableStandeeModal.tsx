import React, { useRef } from 'react';
import { QrCode, Printer, X, Download, ShieldCheck, MapPin, Phone, Sparkles } from 'lucide-react';
import { Business } from '../types';

interface PrintableStandeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Business | null;
}

export const PrintableStandeeModal: React.FC<PrintableStandeeModalProps> = ({
  isOpen,
  onClose,
  shop,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !shop) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrRefUrl = `https://maha-business-hub-d-company-mehkar.vercel.app/?shopId=${shop.id}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrRefUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 relative font-marathi">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            डिजिटल क्यूआर स्टँडी बोर्ड (Print Ready Poster)
          </h2>
          <p className="text-xs text-gray-500">
            हा क्यूआर कोड दुकानात लावण्यासाठी प्रिंट करा. ग्राहक स्कॅन करून सवलत मिळवतील.
          </p>
        </div>

        {/* PRINTABLE STANDEE POSTER CONTAINER */}
        <div 
          ref={printRef}
          className="bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 text-white rounded-3xl p-6 shadow-xl border-4 border-emerald-400 relative overflow-hidden space-y-5 print:m-0 print:border-none print:shadow-none"
        >
          {/* Header Banner */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-emerald-950 rounded-full font-extrabold text-xs tracking-wide uppercase shadow">
              <Sparkles className="w-3.5 h-3.5" />
              MAHA BUSINESS HUB — VERIFIED SHOP
            </div>
            <h1 className="text-2xl font-black text-white pt-2 leading-tight">
              {shop.name}
            </h1>
            <p className="text-xs text-emerald-200 font-medium">
              {shop.tagline || `${shop.category} श्रेणीतील अधिकृत डिजिटल दुकान`}
            </p>
          </div>

          {/* Offer Highlight Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center space-y-1">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
              आजची विशेष सवलत ऑफर
            </span>
            <div className="text-lg font-black text-amber-400">
              {shop.todaysOffer.discountTag || '10% OFF'} — {shop.todaysOffer.title}
            </div>
            <p className="text-xs text-emerald-100">
              {shop.todaysOffer.description}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-5 rounded-2xl shadow-inner text-center space-y-2">
            <p className="text-xs font-bold text-emerald-950 uppercase">
              📲 मोबाईल कॅमेऱ्याने क्यूआर कोड स्कॅन करा
            </p>
            <div className="flex justify-center">
              <img 
                src={qrImageUrl} 
                alt={`QR Code for ${shop.name}`}
                className="w-48 h-48 rounded-xl border-2 border-emerald-200 shadow-md p-1 bg-white"
              />
            </div>
            <p className="text-[11px] font-semibold text-gray-600">
              कूपन कोड / शॉपिंग पास मिळवा व थेट सवलत दावा
            </p>
          </div>

          {/* Store Info Footer */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-emerald-600/50 text-emerald-100">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{shop.address}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{shop.ownerPhone}</span>
            </div>
          </div>

          {/* D Company Branding Footer */}
          <div className="bg-emerald-950/80 rounded-xl p-2.5 text-center border border-emerald-500/30">
            <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
              POWERED BY D COMPANY, MEHKAR DIGITAL GROWTH PARTNER
            </p>
            <p className="text-[9px] text-emerald-400">
              हेल्पलाईन: ९६०७६३६४४४ | www.maha-business-hub.com
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            रद्द करा
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            स्टँडी पोस्ट प्रिंट करा (Print HD Poster)
          </button>
        </div>
      </div>
    </div>
  );
};
