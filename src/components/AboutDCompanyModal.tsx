import React from 'react';
import { X, Building2, Phone, Mail, MapPin, Award, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';
import { AdminSettings } from '../types';

interface AboutDCompanyModalProps {
  settings: AdminSettings;
  onClose: () => void;
}

export const AboutDCompanyModal: React.FC<AboutDCompanyModalProps> = ({ settings, onClose }) => {
  const handleWhatsAppContact = () => {
    const cleanNum = settings.companyPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${settings.companyName}! I would like to inquire about onboarding my shop or placing an advertisement on Maha Business Hub.`
    );
    window.open(`https://wa.me/91${cleanNum}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg border border-amber-300">
              D
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-md border border-amber-400/30">
                Official Company Details
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                {settings.companyName}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {settings.companyAbout}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              Contact & Location Information
            </h3>

            <div className="space-y-2 text-slate-700">
              <div className="flex items-center gap-2.5 font-medium">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong className="text-slate-900">Mobile Number: </strong>
                  <a href={`tel:${settings.companyPhone}`} className="font-mono font-bold text-amber-800 hover:underline">
                    {settings.companyPhone}
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-2.5 font-medium">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong className="text-slate-900">Official Email: </strong>
                  <a href={`mailto:${settings.companyEmail}`} className="font-bold text-blue-800 hover:underline">
                    {settings.companyEmail}
                  </a>
                </span>
              </div>

              <div className="flex items-start gap-2.5 font-medium">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Office Address: </strong>
                  <span>{settings.companyAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* D Company Services Badge */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                Digital Storefronts
              </div>
              <p className="text-[11px] text-slate-600">Onboarding shop listings with WhatsApp lead generation</p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <div className="font-bold text-emerald-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Acrylic D-QR Standees
              </div>
              <p className="text-[11px] text-slate-600">Printed counter standees for instant in-shop scanning</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleWhatsAppContact}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact D Company WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
