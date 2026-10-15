import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  Tag, 
  ExternalLink, 
  CheckCircle2, 
  Ticket, 
  QrCode,
  Sparkles,
  ShieldCheck,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe
} from 'lucide-react';
import { Business } from '../types';

interface BusinessDetailModalProps {
  business: Business | null;
  onClose: () => void;
  onClaimCoupon: (b: Business) => void;
  onViewDQR: (b: Business) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
  onClaimCoupon,
  onViewDQR,
}) => {
  if (!business) return null;

  const getWhatsAppUrl = () => {
    const cleanNum = business.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${business.name}! I am contacting you from Maha Business Hub (D Company). I would like to know more about your shop offerings and discounts.`
    );
    return `https://wa.me/${cleanNum}?text=${message}`;
  };

  const social = business.socialLinks;
  // Show social links if approved (or directly created by admin)
  const isApproved = business.isSocialApproved !== false;
  const hasSocial = isApproved && social && (social.facebook || social.instagram || social.twitter || social.youtube || social.website || social.googleBusiness);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Photo */}
        <div className="relative h-60 w-full bg-slate-100">
          <img
            src={business.image}
            alt={business.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Verified D-Company Listing
            </span>
            <span className="bg-amber-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
              {business.region} Region
            </span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <span>{business.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white text-sm">{business.rating}</span>
                <span className="text-slate-300">({business.totalReviews} verified reviews)</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {business.name}
            </h2>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          
          {/* Tagline & Address */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-800 italic">
              "{business.tagline}"
            </p>
            <div className="flex items-start gap-2 text-xs text-slate-600 pt-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Address: </span>
                {business.address}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong className="text-slate-900">Owner Contact: </strong>
                {business.ownerName} ({business.ownerPhone})
              </span>
            </div>
          </div>

          {/* Social Media Links Section (Admin Approved) */}
          {hasSocial && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Social Media & Web Connects (सोशल मीडिया जोडणी)</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Admin Verified
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                )}

                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                )}

                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span>Twitter / X</span>
                  </a>
                )}

                {social.youtube && (
                  <a
                    href={social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>YouTube</span>
                  </a>
                )}

                {(social.website || social.googleBusiness) && (
                  <a
                    href={social.website || social.googleBusiness}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website / Google</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Today's Special Offer Section */}
          {business.todaysOffer.isActive && (
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-emerald-50 rounded-2xl p-5 border-2 border-amber-400/50 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Tag className="w-4 h-4" />
                  {business.todaysOffer.discountTag}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                  Valid: {business.todaysOffer.validTill}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  {business.todaysOffer.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">
                  {business.todaysOffer.description}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onClaimCoupon(business);
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <Ticket className="w-4 h-4 text-amber-200" />
                  Claim Instant Discount Coupon
                </button>
              </div>
            </div>
          )}

          {/* Direct Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>

            <a
              href={business.googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Review & Map</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onViewDQR(business);
              }}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Shop D-QR Standee</span>
            </button>

          </div>

          {/* Subscription & D Company Trust Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              D Company Verified Partner
            </span>
            <span className="font-semibold text-slate-700">
              Plan: {business.subscription.planName}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
