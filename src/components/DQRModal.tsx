import React, { useEffect, useState } from 'react';
import { X, QrCode, Printer, Download, Share2, Sparkles, CheckCircle2, MapPin, Store, Shield } from 'lucide-react';
import QRCode from 'qrcode';
import { Business } from '../types';

interface DQRModalProps {
  business: Business | null;
  onClose: () => void;
}

export const DQRModal: React.FC<DQRModalProps> = ({ business, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!business) return;

    // Build unique URL for D-QR scanning
    const currentAppUrl = window.location.origin + window.location.pathname;
    const shopScanUrl = `${currentAppUrl}?shop=${business.id}`;

    QRCode.toDataURL(shopScanUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, [business]);

  if (!business) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `D-QR_${business.name.replace(/\s+/g, '_')}_Mehkar.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8 print:shadow-none print:border-none print:m-0 print:max-w-none print:w-full">
        
        {/* Close Button (Hidden during print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header Controls (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold tracking-tight">Counter D-QR Standee</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
              title="Download QR Image"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
              title="Print Counter Poster"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Poster</span>
            </button>
          </div>
        </div>

        {/* Printable Standee Card */}
        <div className="p-6 space-y-5 text-center bg-gradient-to-b from-amber-500/10 via-white to-emerald-50/20 print:p-8">
          
          {/* Header Branding */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              D Company Maha Business Hub
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {business.name}
            </h2>
            <p className="text-xs text-slate-600 font-medium flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {business.region} Region · {business.category}
            </p>
          </div>

          {/* Offer Highlight Standee Banner */}
          {business.todaysOffer.isActive && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-2xl shadow-md space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider bg-slate-950/30 px-2 py-0.5 rounded-md inline-block">
                ⚡ TODAY'S SPECIAL OFFER
              </div>
              <h3 className="text-sm font-black tracking-tight text-amber-100">
                {business.todaysOffer.discountTag}: {business.todaysOffer.title}
              </h3>
            </div>
          )}

          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-3xl border-2 border-slate-900 inline-block shadow-lg relative my-2">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`D-QR code for ${business.name}`}
                className="w-52 h-52 mx-auto object-contain"
              />
            ) : (
              <div className="w-52 h-52 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}

            <div className="mt-2 bg-slate-900 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              SCAN WITH ANY CAMERA
            </div>
          </div>

          {/* Scan Instruction */}
          <div className="space-y-1">
            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
              📲 SCAN QR TO CLAIM DISCOUNT COUPON INSTANTLY!
            </p>
            <p className="text-[11px] text-slate-600">
              Get direct offer details, WhatsApp chat link & Google Map directions
            </p>
          </div>

          {/* Footer Contact Details */}
          <div className="pt-3 border-t border-slate-200 text-left flex items-center justify-between text-[11px] text-slate-600">
            <div>
              <span className="font-bold text-slate-900">Phone / WhatsApp:</span>
              <p className="font-mono text-slate-800 font-bold">{business.ownerPhone}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900">Address:</span>
              <p className="text-[10px] max-w-[180px] line-clamp-1">{business.address}</p>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 tracking-widest uppercase font-bold pt-1">
            Powered by D Company Digital Network · Mehkar - Lonar
          </p>

        </div>

      </div>
    </div>
  );
};
