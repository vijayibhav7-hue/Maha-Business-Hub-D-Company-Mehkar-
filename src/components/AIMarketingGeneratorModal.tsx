import React, { useState } from 'react';
import { Sparkles, Copy, Check, MessageSquare, RefreshCw, X, Send } from 'lucide-react';
import { Business, Category } from '../types';

interface AIMarketingGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Business | null;
  onApplyOffer?: (offerTitle: string, offerTag: string, offerDesc: string) => void;
}

export const AIMarketingGeneratorModal: React.FC<AIMarketingGeneratorModalProps> = ({
  isOpen,
  onClose,
  shop,
  onApplyOffer,
}) => {
  const [occasion, setOccasion] = useState<'FESTIVAL' | 'OLD_STOCK' | 'NEW_ARRIVALS' | 'WEEKEND'>('FESTIVAL');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen || !shop) return null;

  // AI Generated Ideas
  const generatedIdeas = [
    {
      title: `${shop.category === 'Garments' ? 'लग्नसराई पैठणी व साडी धमाका' : shop.category === 'Agri' ? 'शेतकरी विशेष खत-बियाणे सवलत' : shop.category === 'Mobile' ? '५G मोबाईल खरेदीवर भारी भेटवस्तू' : 'विशेष महाबंपर डिस्काउंट ऑफर'}`,
      discountTag: '१५% फ्लॅट डिस्काउंट',
      description: `फक्त ${shop.name} (${shop.village || 'मेहकर'}) येथे! कोणत्याही रु. २००० वरील खरेदीवर १५% थेट सवलत आणि खात्रीशीर भेट.`,
      whatsappCopy: `🚩 *${shop.name}, ${shop.village || 'मेहकर'}* 🚩\n\n💥 *महाबंपर फेस्टिव्हल डिस्काउंट ऑफर!* 💥\n\nआता आपल्या लाडक्या दुकानात मिळवा सर्व नवीन स्टॉकवर १५% पर्यंत विशेष सवलत!\n\n📍 *पत्ता:* ${shop.address}\n📞 *संपर्क:* ${shop.whatsappNumber}\n\n👉 आजच D Company पास दाखवून ऑफर मिळवा!`,
    },
    {
      title: `जुना स्टॉक क्लिअरन्स - बाय १ गेट १ ऑफर`,
      discountTag: 'BUY 1 GET 1 FREE',
      description: `लिमिटेड स्टॉक! ${shop.name} येथे निवडक वस्तूंच्या खरेदीवर १ वस्तू मोफत. ऑफर मर्यादित कालावधीसाठी.`,
      whatsappCopy: `🔥 *धमाका स्टॉक क्लिअरन्स सेल!* 🔥\n\n*${shop.name} (${shop.village || 'मेहकर'})*\n\nआले आहे सर्वात मोठे डिस्काउंट! खरेदी करा १ आणि मिळवा १ मोफत!\n\nसविस्तर माहितीसाठी येथे मेसेज करा: https://wa.me/91${shop.whatsappNumber}`,
    },
    {
      title: `शनिवार-रविवार वीकेंड स्पेशल कॅशबॅक`,
      discountTag: '₹२०० कॅशबॅक',
      description: `वीकेंडला खरेदी करा आणि मिळवा रु. २०० ची इन्स्टंट कॅशबॅक सूट किंवा गिफ्ट कूपन.`,
      whatsappCopy: `🎉 *वीकेंड स्पेशल डिस्काउंट ऑफर!* 🎉\n\n*${shop.name}*\n\nया शनिवारी व रविवारी खरेदीवर मिळवा रु. २०० सूट! \n\nपत्ता: ${shop.address}\nमोबाईल: ${shop.ownerPhone}`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8 relative font-marathi">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              AI १-क्लिक ऑफर व मार्केटिंग कॉपी जनरेटर
            </h2>
            <p className="text-xs text-gray-500">
              {shop.name} ({shop.category}) साठी आकर्षक ऑफर आणि व्हॉट्सॲप पोस्ट तयार करा.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setOccasion('FESTIVAL')}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              occasion === 'FESTIVAL' 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            🎉 सण/उत्सव स्पेशल
          </button>
          <button
            onClick={() => setOccasion('OLD_STOCK')}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              occasion === 'OLD_STOCK' 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            🏷️ जुना स्टॉक क्लिअरन्स
          </button>
          <button
            onClick={() => setOccasion('NEW_ARRIVALS')}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              occasion === 'NEW_ARRIVALS' 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            ✨ नवीन स्टॉक आगमन
          </button>
        </div>

        {/* Generated Ideas List */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {generatedIdeas.map((idea, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 transition-colors space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-purple-600 text-white font-bold text-[10px] rounded-full mb-1">
                    {idea.discountTag}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm">{idea.title}</h3>
                </div>
                {onApplyOffer && (
                  <button
                    onClick={() => {
                      onApplyOffer(idea.title, idea.discountTag, idea.description);
                      setApplied(true);
                      setTimeout(() => setApplied(false), 2000);
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                  >
                    {applied ? 'ॲप्लाय झाले!' : 'ऑफर सेट करा'}
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">{idea.description}</p>

              {/* WhatsApp Broadcast Copy Box */}
              <div className="bg-white p-3 rounded-lg border border-purple-200 text-xs text-gray-800 space-y-2">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    व्हॉट्सॲप मेसेज कॉपी:
                  </span>
                  <button
                    onClick={() => handleCopy(idea.whatsappCopy, idx)}
                    className="flex items-center gap-1 text-[11px] text-purple-700 hover:text-purple-900 font-bold"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        कॉपी झाले!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        मेसेज कॉपी करा
                      </>
                    )}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-[11px] text-gray-700 bg-gray-50 p-2 rounded">
                  {idea.whatsappCopy}
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
};
