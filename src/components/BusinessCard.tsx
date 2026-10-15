import React from 'react';
import { 
  MapPin, 
  MessageSquare, 
  Star, 
  Tag, 
  Ticket, 
  QrCode, 
  ExternalLink, 
  CheckCircle2,
  Sparkles,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe
} from 'lucide-react';
import { Business } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BusinessCardProps {
  business: Business;
  onOpenDetails: (b: Business) => void;
  onClaimCoupon: (b: Business) => void;
  onViewDQR: (b: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onOpenDetails,
  onClaimCoupon,
  onViewDQR,
}) => {
  const { t } = useLanguage();

  const getWhatsAppUrl = () => {
    const cleanNum = business.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${business.name}! I found your business on Maha Business Hub (D Company, Mehkar). I'd like to inquire about your offer: "${business.todaysOffer.title}".`
    );
    return `https://wa.me/${cleanNum}?text=${message}`;
  };

  const social = business.socialLinks;
  const isApproved = business.isSocialApproved !== false;
  const showSocial = isApproved && social;

  const getCategoryI18nKey = (cat: string) => {
    switch (cat) {
      case 'Agri': return 'catAgri';
      case 'Mobile': return 'catMobile';
      case 'Garments': return 'catGarments';
      case 'Hospitals': return 'catHospitals';
      case 'Coaching': return 'catCoaching';
      case 'Food': return 'catFood';
      case 'Services': return 'catServices';
      default: return 'catAll';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Card Header Media */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onOpenDetails(business)}>
          <img
            src={business.image}
            alt={business.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="bg-slate-900/90 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {t('verifiedShop', 'Verified Shop')}
            </span>

            <span className="bg-amber-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {business.district ? `${business.taluka || business.region}, जि. ${business.district}` : business.region}
            </span>
          </div>

          {/* Category & Shop Name Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-0.5">
              <span>{t(getCategoryI18nKey(business.category), business.category)}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">{business.rating}</span>
                <span className="text-[10px] text-slate-300">({business.totalReviews})</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-sm truncate">
              {business.name}
            </h3>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600 line-clamp-1 italic font-medium">
            "{business.tagline}"
          </p>

          <p className="text-xs text-slate-500 flex items-start gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{business.address}</span>
          </p>

          {/* Approved Social Links Icons */}
          {showSocial && (
            <div className="flex items-center gap-2 pt-1">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Facebook">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100" title="Instagram">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100" title="Twitter / X">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="YouTube">
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
              {social.website && (
                <a href={social.website} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100" title="Website">
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Today's Offer Box */}
          {business.todaysOffer.isActive && (
            <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-emerald-50 rounded-xl p-3 border border-amber-200/80 space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {business.todaysOffer.discountTag}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  {business.todaysOffer.validTill}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1 pt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{business.todaysOffer.title}</span>
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {business.todaysOffer.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 pt-0 space-y-2">
        <button
          onClick={() => onClaimCoupon(business)}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Ticket className="w-4 h-4 text-slate-900" />
          <span>{t('getCoupon', 'Get Discount Coupon')}</span>
        </button>

        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{t('whatsAppChat', 'WhatsApp')}</span>
          </a>

          <a
            href={business.googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{t('mapReview', 'Map Review')}</span>
          </a>

          <button
            onClick={() => onViewDQR(business)}
            className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="truncate">{t('viewDQR', 'D-QR')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
