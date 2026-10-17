import React, { useState } from 'react';
import { 
  Store, 
  Sparkles, 
  Video, 
  Share2, 
  MapPin, 
  Tag, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  ShieldAlert, 
  ArrowLeft,
  QrCode,
  Search,
  Loader2
} from 'lucide-react';
import { Category, PlanType, ALL_CATEGORIES } from '../types';
import { addMerchantInquiry } from '../services/storage';
import { MAHARASHTRA_DISTRICTS_DATA, getTalukasByDistrict } from '../data/maharashtraData';
import { parseShopFromLinkOrText } from '../utils/shopImporter';

interface MerchantLandingPageProps {
  onBackToDirectory: () => void;
  onOpenShopOwnerPortal: () => void;
}

export const MerchantLandingPage: React.FC<MerchantLandingPageProps> = ({
  onBackToDirectory,
  onOpenShopOwnerPortal,
}) => {
  const [merchantName, setMerchantName] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState<Category>('Mobile');
  const [district, setDistrict] = useState('Buldhana');
  const [taluka, setTaluka] = useState('Mehkar');
  const [village, setVillage] = useState('Mehkar');
  const [region, setRegion] = useState<string>('Mehkar');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [gmapsUrl, setGmapsUrl] = useState('');
  const [packageChoice, setPackageChoice] = useState<PlanType>('Gold ₹999');
  const [serviceInterested, setServiceInterested] = useState('AI Reels + Google Maps + D-QR Standee');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Auto fetch from Google Maps URL / message
  const [isFetchingGmaps, setIsFetchingGmaps] = useState(false);
  const [fetchNotice, setFetchNotice] = useState('');

  const handleFetchGmapsInquiry = async (inputStr?: string) => {
    const textToParse = inputStr !== undefined ? inputStr : gmapsUrl;
    if (!textToParse.trim()) return;

    setIsFetchingGmaps(true);
    setFetchNotice('');

    try {
      const local = parseShopFromLinkOrText(textToParse);
      if (local.name && local.name !== 'डिजिटल सुपर शॉप (मेहकर)') {
        setShopName(local.name);
      }
      if (local.ownerPhone && local.ownerPhone !== '9607636444') {
        setMobile(local.ownerPhone);
      }
      if (local.category) setCategory(local.category);
      if (local.district) setDistrict(local.district);
      if (local.taluka) setTaluka(local.taluka);
      if (local.village) setVillage(local.village);
      if (local.region) setRegion(local.region || local.taluka || 'Mehkar');
      if (local.address) setAddress(local.address);
      if (local.googleMapUrl) setGmapsUrl(local.googleMapUrl);

      const match = textToParse.match(/(https?:\/\/[^\s]+)/);
      if (match) {
        const res = await fetch(`/api/expand-maps-link?url=${encodeURIComponent(match[1])}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            if (data.title) setShopName(data.title);
            if (data.phone) setMobile(data.phone);
            if (data.address) setAddress(data.address);
            if (data.finalUrl) setGmapsUrl(data.finalUrl);
            setFetchNotice(`✅ गूगल मॅपवरून दुकानाचे नाव व पत्ता आपोआप प्राप्त झाले!`);
          } else {
            setFetchNotice('गूगल मॅप लिंक सेट झाली!');
          }
        }
      } else {
        setFetchNotice('✅ मेसेजवरून दुकानाची माहिती प्राप्त झाली!');
      }
    } catch {
      setFetchNotice('गूगल मॅप लिंक जोडली गेली.');
    } finally {
      setIsFetchingGmaps(false);
      setTimeout(() => setFetchNotice(''), 6000);
    }
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantName.trim() || !shopName.trim() || !mobile.trim()) {
      alert('कृपया नाव, दुकानाचे नाव आणि मोबाईल नंबर भरा.');
      return;
    }

    addMerchantInquiry(
      merchantName,
      shopName,
      category,
      region,
      mobile,
      serviceInterested,
      packageChoice,
      message
    );

    setSubmitted(true);

    // Open WhatsApp prefilled message to D Company
    const text = encodeURIComponent(
      `नमस्कार D COMPANY (मेहकर)!\n\n` +
      `मी नवीन दुकानाची चौकशी करत आहे:\n` +
      `👤 नाव: ${merchantName}\n` +
      `🏪 दुकान: ${shopName}\n` +
      `📁 वर्ग: ${category} (${region})\n` +
      `📱 मोबाईल: ${mobile}\n` +
      `📦 निवडलेला प्लॅन: ${packageChoice}\n` +
      `💡 सेवा: ${serviceInterested}\n` +
      (message ? `📝 संदेश: ${message}` : '')
    );
    window.open(`https://wa.me/919607636444?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToDirectory}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य पृष्ठावर जा</span>
        </button>

        <button
          onClick={onOpenShopOwnerPortal}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
        >
          <Store className="w-4 h-4" />
          <span>दुकानदार लॉगिन (Shop Login)</span>
        </button>
      </div>

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-400/30 text-amber-300 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>D COMPANY, MEHKAR — Digital Growth Partner</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight max-w-3xl">
          आपल्या दुकानाला द्या डिजिटल ओळख आणि मिळवा <span className="text-amber-400 underline decoration-amber-500">स्थानिक ग्राहक!</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          D COMPANY मेहकर द्वारे आपल्या दुकानाचे Google Maps, AI Reels, सोशल मीडिया मार्केटिंग आणि काउंटर D-QR द्वारे प्रमोशन करा.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#inquiry-form"
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>मोफत नोंदणी / चौकशी करा</span>
          </a>

          <a
            href="https://wa.me/919607636444?text=Hello%20D%20Company!%20I%20want%20to%20digitalize%20my%20shop%20in%20Mehkar."
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp: 9607636444</span>
          </a>
        </div>
      </div>

      {/* Feature Services Grid */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
            D COMPANY सर्व्हिसेस
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            दुकानदारांसाठी काय काय सुविधा मिळतील?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI रील्स व पोस्टर्स</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              तुमच्या दुकानाचे आणि प्रॉडक्ट्सचे आकर्षक HD इंस्टाग्राम रील्स आणि व्हॉट्सॲप पोस्टर्स बनवून मिळतील.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Google Maps & Profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Maps वर दुकानाचे अचूक लोकेशन, फोटो आणि ५ स्टार रिव्ह्यूज मिळवण्यासाठी संपूर्ण मदत.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">कूपन्स व स्टॉक क्लिअरन्स</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              जुन्या स्टॉकच्या विक्रीसाठी किंवा सणासुदीच्या काळात ग्राहकांसाठी डिजिटल डिस्काउंट कूपन तयार करा.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">काउंटर D-QR स्टँडी</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              दुकानाच्या काउंटरवर ठेवायला D Company ची प्रीमियम D-QR अकॅक्रेलिक स्टँडी प्रिंट करून मिळेल.
            </p>
          </div>

        </div>
      </div>

      {/* Transparent Packages Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
            पारदर्शक पॅकेजेस
          </span>
          <h2 className="text-2xl font-black text-white">उपलब्ध डिजिटल मार्केटिंग प्लॅन्स</h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            कोणतेही छुपे शुल्क नाही. तुमच्या गरजेनुसार योग्य प्लॅन निवडा.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-900">
          
          {/* Free Plan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                बेसिक
              </span>
              <h3 className="text-lg font-black text-slate-900">फ्री प्लॅन</h3>
              <div className="text-2xl font-black text-slate-900">₹0</div>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> दुकानदाराचे मूळ नाव व लिस्टिंग</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> व्हॉट्सॲप संपर्क लिंक</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> १ दैनिक ऑफर जोडणे</li>
              </ul>
            </div>
            <button
              onClick={() => { setPackageChoice('Free'); setServiceInterested('Free Shop Listing'); }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
            >
              निवडा
            </button>
          </div>

          {/* Silver Plan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                स्टँडर्ड
              </span>
              <h3 className="text-lg font-black text-slate-900">सिल्व्हर ₹499</h3>
              <div className="text-2xl font-black text-slate-900">₹499 <span className="text-xs text-slate-500 font-normal">/ ६ महिने</span></div>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Google Maps पिन लोकेशन</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> १ डिजिटल पोस्टर डिझाइन</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> सोशल मीडिया लिंक्स (FB/Insta)</li>
              </ul>
            </div>
            <button
              onClick={() => { setPackageChoice('Silver ₹499'); setServiceInterested('Silver Plan - Google Maps + Poster'); }}
              className="w-full py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold"
            >
              निवडा
            </button>
          </div>

          {/* Gold Plan (Recommended) */}
          <div className="bg-amber-500/10 border-2 border-amber-500 p-5 rounded-2xl space-y-4 flex flex-col justify-between relative bg-white">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              सर्वात लोकप्रिय
            </div>
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                प्रीमियम
              </span>
              <h3 className="text-lg font-black text-slate-900">गोल्ड ₹999</h3>
              <div className="text-2xl font-black text-amber-900">₹999 <span className="text-xs text-slate-500 font-normal">/ वर्ष</span></div>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-2 font-medium">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> ४ HD AI रील्स + पोस्टर्स</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> १ काउंटर अकॅक्रेलिक D-QR स्टँडी</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> फीचर कार्ड हायलाइट</li>
              </ul>
            </div>
            <button
              onClick={() => { setPackageChoice('Gold ₹999'); setServiceInterested('Gold Plan - AI Reels + D-QR Standee'); }}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md"
            >
              निवडा
            </button>
          </div>

          {/* Platinum Plan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                व्हिआयपी
              </span>
              <h3 className="text-lg font-black text-slate-900">प्लॅटिनम ₹2999</h3>
              <div className="text-2xl font-black text-slate-900">₹2999 <span className="text-xs text-slate-500 font-normal">/ वर्ष</span></div>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> मुख्य बॅनर कॅरोसेल ॲड</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> व्हॉट्सॲप ब्रॉडकास्ट पुश संदेश</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> D Company चे खास सहकार्य</li>
              </ul>
            </div>
            <button
              onClick={() => { setPackageChoice('Platinum ₹2999'); setServiceInterested('Platinum VIP Partnership'); }}
              className="w-full py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold"
            >
              निवडा
            </button>
          </div>

        </div>
      </div>

      {/* Business Lead / Inquiry Form */}
      <div id="inquiry-form" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">व्यापारी चौकशी व ऑनबोर्डिंग फॉर्म</h3>
            <p className="text-xs text-slate-500">फॉर्म भरा, D COMPANY ची टीम तुमच्याशी लगेच संपर्क साधेल.</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-emerald-950 text-base">तुमची चौकशी यशस्वीपणे नोंदवली गेली आहे!</h4>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              D COMPANY मेहकर टीम ५ मिनिटांत तुमच्याशी व्हॉट्सॲपवरून संपर्क साधेल.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              दुसरी चौकशी करा
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Google Maps Auto Importer Box */}
            <div className="sm:col-span-2 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-2">
              <label className="block font-bold text-amber-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>गूगल मॅपची लिंक पेस्ट करा (Paste Google Maps Link):</span>
                </span>
                <span className="text-[10px] text-amber-800 font-extrabold bg-amber-200/80 px-2 py-0.5 rounded-md">
                  Auto-Fill Shop & Address
                </span>
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://maps.app.goo.gl/..."
                  value={gmapsUrl}
                  onChange={(e) => {
                    setGmapsUrl(e.target.value);
                    if (e.target.value.includes('http')) {
                      handleFetchGmapsInquiry(e.target.value);
                    }
                  }}
                  className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-amber-500 text-slate-900 font-bold"
                />
                <button
                  type="button"
                  disabled={isFetchingGmaps}
                  onClick={() => handleFetchGmapsInquiry()}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isFetchingGmaps ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
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

              {fetchNotice && (
                <div className="text-[11px] text-emerald-800 font-bold bg-emerald-100 p-2 rounded-xl border border-emerald-300">
                  {fetchNotice}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">तुमचे नाव (Merchant Name) *</label>
              <input
                type="text"
                required
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="उदा. राहुल देशपांडे"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">दुकानाचा नाव (Shop Name) *</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="उदा. साई मोबाईल सेन्टर"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">व्यवसाय वर्ग (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.labelMr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">जिल्हा (District - महाराष्ट्र) *</label>
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              >
                {MAHARASHTRA_DISTRICTS_DATA.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.nameMr} ({d.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">तालुका (Taluka) *</label>
              <select
                value={taluka}
                onChange={(e) => {
                  const t = e.target.value;
                  setTaluka(t);
                  setRegion(t);
                  setVillage(t);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              >
                {getTalukasByDistrict(district).map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.nameMr} ({t.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">गाव / शहर (Village/City) *</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="उदा. मेहकर / लोणार / सुपे"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">दुकानाचा पूर्ण पत्ता (Full Address / Landmark) *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="उदा. जुन्या बस स्टँडजवळ, मेन रोड, मेहकर"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">मोबाईल/व्हॉट्सॲप नंबर *</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="उदा. 9607636444"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">इच्छित प्लॅन (Package)</label>
              <select
                value={packageChoice}
                onChange={(e) => setPackageChoice(e.target.value as PlanType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-hidden"
              >
                <option value="Free">फ्री प्लॅन (₹0)</option>
                <option value="Silver ₹499">सिल्व्हर प्लॅन (₹499)</option>
                <option value="Gold ₹999">गोल्ड प्लॅन (₹999)</option>
                <option value="Platinum ₹2999">प्लॅटिनम प्लॅन (₹2999)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">अधिक माहिती / संदेश (Optional)</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="तुमच्या दुकानाबद्दल किंवा विशेष ऑफरबद्दल सांगा..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>चौकशी सबमिट करा आणि WhatsApp वर पाठवा</span>
              </button>
            </div>

          </form>
        )}
      </div>

      {/* Realistic Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">महत्त्वाची सूचना व स्पष्टता:</strong>
          <span>
            D COMPANY ही डिजिटल मार्केटिंग, ऑनलाईन ब्रँडिंग आणि कूपन व्यवस्थापनाची सेवा देते. विक्री किंवा ग्राहक वाढणे हे दुकानाच्या वस्तूंची गुणवत्ता, किंमत व बाजारपेठेच्या मागणीवर अवलंबून असते. D COMPANY कोणतीही चुकीची किंवा अतिशयोक्तीपूर्ण विक्रीची हमी देत नाही.
          </span>
        </div>
      </div>

    </div>
  );
};
