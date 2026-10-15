import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  Check, 
  MapPin, 
  Phone, 
  Building2, 
  Tag, 
  X, 
  AlertCircle,
  Plus,
  Loader2,
  Search
} from 'lucide-react';
import { Category, Business, PlanType } from '../types';
import { parseShopFromLinkOrText } from '../utils/shopImporter';
import { addBusiness, addAuditLog } from '../services/storage';
import { MAHARASHTRA_DISTRICTS_DATA, getTalukasByDistrict } from '../data/maharashtraData';

interface ShopImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newShop: Business) => void;
}

export const ShopImporterModal: React.FC<ShopImporterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rawLinkOrText, setRawLinkOrText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Editable State (Direct Pre-filled Defaults!)
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Mobile');
  const [district, setDistrict] = useState('Buldhana');
  const [taluka, setTaluka] = useState('Mehkar');
  const [region, setRegion] = useState('Mehkar');
  const [village, setVillage] = useState('Mehkar');
  const [address, setAddress] = useState('मुख्य बाजार पेठ, मेहकर');
  const [ownerName, setOwnerName] = useState('दुकानदार');
  const [ownerPhone, setOwnerPhone] = useState('9607636444');
  const [mapUrl, setMapUrl] = useState('');
  const [offerTitle, setOfferTitle] = useState('विशेष १०% सवलत कूपन ऑफर');
  const [offerTag, setOfferTag] = useState('10% OFF');
  const [plan, setPlan] = useState<PlanType>('Gold ₹999');
  const [errorMsg, setErrorMsg] = useState('');
  const [autoFetchNotice, setAutoFetchNotice] = useState('');

  if (!isOpen) return null;

  // Real-time backend Google Maps short link expansion & parsing
  const handleFetchLinkDetails = async (inputStr?: string) => {
    const textToParse = inputStr !== undefined ? inputStr : rawLinkOrText;
    if (!textToParse.trim()) {
      setErrorMsg('कृपया दुकानाचे नाव, मेसेज किंवा गूगल मॅप लिंक पेस्ट करा.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      // 1. Initial Local Parsing
      const localParsed = parseShopFromLinkOrText(textToParse);

      // Populate local parsed info first
      if (localParsed.name && localParsed.name !== 'डिजिटल सुपर शॉप (मेहकर)') {
        setName(localParsed.name);
      }
      if (localParsed.ownerPhone && localParsed.ownerPhone !== '9607636444') {
        setOwnerPhone(localParsed.ownerPhone);
      }
      setCategory(localParsed.category);
      if (localParsed.district) setDistrict(localParsed.district);
      if (localParsed.taluka) setTaluka(localParsed.taluka);
      setRegion(localParsed.region || localParsed.taluka || 'Mehkar');
      setVillage(localParsed.village || localParsed.taluka || 'Mehkar');
      setAddress(localParsed.address);
      setMapUrl(localParsed.googleMapUrl);

      // 2. Check if URL contains short link like maps.app.goo.gl or goo.gl
      const urlMatch = textToParse.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        const urlToExpand = urlMatch[1];
        setMapUrl(urlToExpand);

        // Call backend expander proxy
        const res = await fetch(`/api/expand-maps-link?url=${encodeURIComponent(urlToExpand)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            if (data.title) {
              setName(data.title);
            }
            if (data.phone) {
              setOwnerPhone(data.phone);
            }
            if (data.address) {
              setAddress(data.address);
            }
            if (data.finalUrl) {
              setMapUrl(data.finalUrl);
            }
            setAutoFetchNotice(`✅ गूगल मॅपवरून दुकानाची मूळ माहिती (Name: ${data.title || 'फेच झाले'}) अचूक प्राप्त झाली!`);
          } else {
            setAutoFetchNotice(`गूगल मॅप लिंक जोडली गेली आहे! दुकानाचे नाव खाली तपासू शकता.`);
          }
        }
      } else {
        setAutoFetchNotice(`पेस्ट केलेल्या मेसेजवरून माहिती अचूक ऑटो-फेच झाली!`);
      }
    } catch (err) {
      setAutoFetchNotice(`गूगल मॅप माहिती लोड झाली. आवश्यक असल्यास नाव एडिट करू शकता.`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setAutoFetchNotice(''), 6000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('कृपया दुकानाचे नाव टाईप किंवा फेच करा.');
      return;
    }
    if (!ownerPhone.trim()) {
      setErrorMsg('कृपया दुकानदाराचा मोबाईल नंबर एंटर करा.');
      return;
    }

    const shopPin = Math.floor(1000 + Math.random() * 9000).toString();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const categoryImages: Record<Category, string> = {
      Agri: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      Mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      Garments: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      Hospitals: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      Coaching: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      Food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      Services: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    };

    const newShop = addBusiness({
      name: name.trim(),
      tagline: `${category} क्षेत्रातील उत्कृष्ट दुकान`,
      category,
      region: taluka || district || region,
      district,
      taluka,
      village,
      address: address.trim() || `मुख्य बाजार पेठ, ${village}, ता. ${taluka}, जि. ${district}`,
      ownerName: ownerName.trim() || 'दुकानदार',
      ownerPhone: ownerPhone.trim(),
      whatsappNumber: ownerPhone.trim(),
      googleMapUrl: mapUrl.trim() || `https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + village)}`,
      image: categoryImages[category],
      subscription: {
        status: 'Paid',
        planName: plan,
        expiryDate: expiryDate.toISOString().split('T')[0],
        amountPaid: plan.includes('499') ? 499 : plan.includes('999') ? 999 : 2999,
      },
      todaysOffer: {
        title: offerTitle.trim() || 'विशेष १०% सवलत ऑफर',
        description: 'D Company ग्राहकांसाठी खरेदीवर १०% सवलत उपलब्ध.',
        discountTag: offerTag.trim() || '10% OFF',
        validTill: '2026-12-31',
        isActive: true,
        status: 'PUBLISHED',
      },
      shopPin,
      socialLinks: {},
      isSocialApproved: true,
      isPendingApproval: false,
    });

    addAuditLog(
      'SHOP_ADDED',
      'D Company Admin',
      `Added shop '${newShop.name}' (${newShop.ownerPhone}) to ${newShop.region}`
    );

    onSuccess(newShop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto font-marathi">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 relative border border-slate-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shadow-xs">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              गूगल मॅप / वेबवरून दुकान फेच व ॲड करा
            </h2>
            <p className="text-xs text-slate-500">
              गूगल मॅपची लिंक पेस्ट करा आणि 'फेच करा' बटनावर दाबा; नाव, पत्ता व मॅप आपोआप लोड होईल.
            </p>
          </div>
        </div>

        {/* Auto Fetch Notice */}
        {autoFetchNotice && (
          <div className="mb-3 bg-emerald-50 text-emerald-900 text-xs p-3.5 rounded-2xl border border-emerald-300 font-bold flex items-center gap-2 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{autoFetchNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Quick Paste Link Field with Fetch Button */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>गूगल मॅपची लिंक पेस्ट करा (Paste Google Maps Link):</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md">
                1-Click Auto Expansion
              </span>
            </label>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="https://maps.app.goo.gl/tvzsjrEmNc1HZZJ17"
                value={rawLinkOrText}
                onChange={(e) => {
                  setRawLinkOrText(e.target.value);
                  if (e.target.value.includes('http')) {
                    handleFetchLinkDetails(e.target.value);
                  }
                }}
                className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-emerald-500 text-slate-900 font-bold"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleFetchLinkDetails()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>फेच होत आहे...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>माहिती फेच करा</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              लिंक पेस्ट करताच किंवा 'माहिती फेच करा' वर दाबल्यास नाव, पत्ता व माहिती ऑटो-लोड होईल.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-slate-900 mb-1 text-xs">
                १. दुकानाचे नाव (Shop Name) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. साई मोबाईल शोपी / किसान कृषी केंद्र"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border-2 border-emerald-500 focus:border-emerald-600 rounded-xl font-black text-slate-900 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1 text-xs">
                २. मोबाईल नंबर (Login Phone) *
              </label>
              <input
                type="tel"
                required
                placeholder="उदा. ९८२२४४५५६६"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full p-2.5 border-2 border-emerald-500 focus:border-emerald-600 rounded-xl font-mono font-black text-emerald-800 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                ३. कॅटेगरी (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Agri">Agri (कृषी व बियाणे)</option>
                <option value="Mobile">Mobile (मोबाईल व इलेक्ट्रॉनिक्स)</option>
                <option value="Garments">Garments (कपडे व साडी सेंटर)</option>
                <option value="Hospitals">Hospitals (दवाखाने व मेडिकल)</option>
                <option value="Coaching">Coaching (क्लासेस व एज्युकेशन)</option>
                <option value="Food">Food (हॉटेल व रेस्टॉरंट)</option>
                <option value="Services">Services (सेवा व गॅरेज)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                ४. जिल्हा (District - महाराष्ट्र) *
              </label>
              <select
                value={district}
                onChange={(e) => {
                  const d = e.target.value;
                  setDistrict(d);
                  const talukas = getTalukasByDistrict(d);
                  if (talukas.length > 0) {
                    setTaluka(talukas[0].name);
                    setRegion(talukas[0].name);
                    setVillage(talukas[0].name);
                  }
                }}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {MAHARASHTRA_DISTRICTS_DATA.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.nameMr} ({d.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                ५. तालुका (Taluka) *
              </label>
              <select
                value={taluka}
                onChange={(e) => {
                  const t = e.target.value;
                  setTaluka(t);
                  setRegion(t);
                  setVillage(t);
                }}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {getTalukasByDistrict(district).map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.nameMr} ({t.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">६. गाव / शहर (Village/City)</label>
              <input
                type="text"
                placeholder="उदा. मेहकर / लोणार / सुपे / जानेफळ"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">७. पत्ता (Address)</label>
              <input
                type="text"
                placeholder="उदा. जुन्या बस स्टँडजवळ, मेन रोड"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">६. गूगल मॅप लिंक (Google Maps Link)</label>
              <input
                type="text"
                placeholder="https://maps.google.com/..."
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">ऑफर शीर्षक (Discount Offer Title)</label>
              <input
                type="text"
                value={offerTitle}
                onChange={(e) => setOfferTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">ऑफर टॅग (Discount Badge)</label>
              <input
                type="text"
                value={offerTag}
                onChange={(e) => setOfferTag(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-extrabold text-amber-700"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 text-rose-800 rounded-2xl text-xs border border-rose-200 font-extrabold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
            >
              रद्द करा
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              दुकान प्रसिद्ध करा (1-Click Publish Shop)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
