import React, { useState } from 'react';
import { 
  X, 
  Ticket, 
  CheckCircle2, 
  Copy, 
  MessageSquare, 
  Sparkles, 
  Phone, 
  User, 
  Store,
  ShieldCheck,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Business, Lead } from '../types';
import { addLead } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';

interface CouponClaimModalProps {
  business: Business | null;
  onClose: () => void;
  onLeadClaimed?: (lead: Lead) => void;
}

export const CouponClaimModal: React.FC<CouponClaimModalProps> = ({
  business,
  onClose,
  onLeadClaimed,
}) => {
  const { t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [claimedLead, setClaimedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  if (!business) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      const lead = addLead(
        business.id,
        business.name,
        business.category,
        business.region,
        customerName.trim(),
        cleanPhone
      );

      setClaimedLead(lead);
      if (onLeadClaimed) onLeadClaimed(lead);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d97706', '#059669', '#f59e0b', '#10b981'],
      });
    } catch (err) {
      setErrorMsg('Failed to save coupon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCouponCode = () => {
    if (!claimedLead) return;
    navigator.clipboard.writeText(claimedLead.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendToWhatsApp = () => {
    if (!claimedLead) return;
    const cleanNum = business.whatsappNumber.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${business.name}! I claimed my Discount Coupon on Maha Business Hub!\n\n` +
      `🎟️ Coupon Code: ${claimedLead.couponCode}\n` +
      `👤 Name: ${claimedLead.customerName}\n` +
      `📱 Phone: ${claimedLead.customerPhone}\n` +
      `🏷️ Offer: ${business.todaysOffer.title}\n\n` +
      `I am visiting your shop soon to redeem this!`
    );
    window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
  };

  const shareReferralToFriends = () => {
    if (!claimedLead) return;
    const appUrl = window.location.origin + window.location.pathname;
    const msg = encodeURIComponent(
      `🎉 *मी ${business.name} (${business.region}) दुकानाचे कूपन मिळवले!*\n\n` +
      `ऑफर: *${business.todaysOffer.title}*\n\n` +
      `तुम्हीही महा बिझनेस हब (D COMPANY) वरून मोफत डिस्काउंट कूपन मिळवा:\n${appUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!claimedLead ? (
          /* Form View */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/20">
                <Ticket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {t('couponTitle', 'Get Discount Coupon')}
              </h3>
              <p className="text-xs text-slate-600">
                {t('couponSub', 'Claim instant discount coupon for')} <strong className="text-slate-900">{business.name}</strong> ({business.region})
              </p>
            </div>

            {/* Offer Summary Box */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-black flex items-center gap-1.5 text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Offer: {business.todaysOffer.title}</span>
              </div>
              <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                {business.todaysOffer.description}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('fullName', 'Your Full Name')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Deshmukh"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('mobileNumber', 'WhatsApp / Mobile Number')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9822112233"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 font-mono font-bold tracking-wider"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  🔒 Saved securely in D Company Database for shop verification.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? 'Generating Coupon...' : t('generateCoupon', 'Generate Coupon Code Now')}
              </button>
            </form>
          </div>
        ) : (
          /* Success Coupon Pass View */
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {t('couponSuccess', 'Coupon Issued Successfully!')}
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                Congratulations, {claimedLead.customerName}!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Show this code at <strong className="text-slate-900">{business.name}</strong> counter in {business.region}.
              </p>
            </div>

            {/* Coupon Pass Card */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 p-5 rounded-2xl shadow-lg relative overflow-hidden border border-amber-400/40">
              <div className="absolute top-2 right-2 text-amber-950/20 font-mono text-4xl font-black select-none pointer-events-none">
                MAHA
              </div>

              <div className="text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-950">
                  <Store className="w-3.5 h-3.5" />
                  <span>{business.name} ({business.region})</span>
                </div>

                <div className="bg-slate-950 text-amber-400 p-3 rounded-xl border border-amber-300/30 text-center my-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300 block">
                    {t('yourCouponCode', 'Your Official Coupon Code')}
                  </span>
                  <span className="text-2xl font-black font-mono tracking-widest block my-1">
                    {claimedLead.couponCode}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-950 font-bold pt-1">
                  <span>Offer: {business.todaysOffer.discountTag}</span>
                  <span>Issued: {new Date(claimedLead.claimedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={sendToWhatsApp}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {t('sendWhatsApp', 'Send to Shop WhatsApp')}
              </button>

              <button
                onClick={shareReferralToFriends}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Offer with Friends on WhatsApp
              </button>

              <button
                onClick={copyCouponCode}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Code Copied!' : t('copyCode', 'Copy Code')}
              </button>
            </div>

            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified by D Company Maha Business Hub
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
