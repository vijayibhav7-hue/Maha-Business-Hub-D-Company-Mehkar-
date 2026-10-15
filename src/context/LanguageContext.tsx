import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  mr: {
    // Header & Brand
    appName: 'महा बिझनेस हब',
    subBrand: 'डी कंपनी',
    regionTag: 'महकर व लोणार भाग',
    shopsDirectory: 'दुकाने डिरेक्टरी',
    counterDQR: 'काउंटर D-QR',
    shopLogin: 'दुकानदार लॉगिन',
    adminLogin: 'डी कंपनी ॲडमिन',
    searchPlaceholder: 'दुकान, ऑफर, मोबाईल शोधा...',
    allAreas: 'सर्व भाग',
    shareApp: 'ॲप शेअर करा',
    hotDeals: 'आजच्या खास ऑफर्स',
    aboutDCompany: 'डी कंपनीबद्दल',

    // Categories
    catAll: 'सर्व प्रकार',
    catAgri: 'कृषी व खते',
    catMobile: 'मोबाईल व इलेक्ट्रॉनिक्स',
    catGarments: 'कपडे व गारमेंट्स',
    catHospitals: 'हॉस्पिटल व क्लिनिक',
    catCoaching: 'कोचिंग क्लासेस',
    catFood: 'हॉटेल व रेस्टॉरंट',
    catServices: 'सेवा व गॅरेज',

    // Directory & Cards
    showingShops: 'एकूण दुकाने',
    verifiedShop: 'प्रमाणित दुकान',
    getCoupon: 'डिस्काउंट कूपन मिळवा',
    whatsAppChat: 'व्हॉट्सॲप संवाद',
    mapReview: 'मॅप रिव्ह्यू',
    viewDQR: 'D-QR कोड',
    todaysOffer: 'आजची खास ऑफर',
    validTill: 'वैधता',
    noShopsFound: 'कोणतेही दुकान सापडले नाही',
    resetFilters: 'फिल्टर रिसेट करा',
    refresh: 'ताजे करा',

    // Coupon Modal
    couponTitle: 'इन्स्टंट डिस्काउंट कूपन पास',
    couponSub: 'खालील माहिती भरून आपला कूपन कोड मोफत मिळवा',
    fullName: 'तुमचे पूर्ण नाव',
    mobileNumber: 'व्हॉट्सॲप / मोबाईल नंबर',
    generateCoupon: 'कूपन कोड जनरेट करा',
    couponSuccess: 'कूपन यशस्वीरीत्या जनरेट झाले!',
    yourCouponCode: 'तुमचा अधिकृत डिस्काउंट कोड',
    sendWhatsApp: 'दुकानाच्या व्हॉट्सॲपवर पाठवा',
    copyCode: 'कोड कॉपी करा',

    // D-QR Standee Modal
    dqrTitle: 'काउंटर D-QR कोड',
    dqrSub: 'ग्राहकांनी दुकानात आल्यावर स्कॅन करून कूपन मिळवावे',
    downloadQR: 'QR डाउनलोड करा',
    printPoster: 'पोस्टर प्रिंट करा',
    scanToClaim: '📲 दुकानात आल्यावर कूपनसाठी स्कॅन करा!',

    // Admin Dashboard
    adminTitle: 'डी कंपनी ॲडमिन मास्टर डॅशबोर्ड',
    totalShops: 'एकूण दुकाने',
    activePaid: 'पेईड सबस्क्रिप्शन',
    totalLeads: 'एकूण ग्राहक कूपन',
    totalRevenue: 'एकूण नेटवर्क उत्पन्न',
    addShop: 'नवीन दुकान जोडा',
    editShop: 'दुकान संपादित करा',
    deleteShop: 'दुकान हटवा',
    pendingApprovals: 'प्रलंबित मंजुरी',
    manageBanners: 'कॅरोसेल बॅनर जाहिराती',
    manageTicker: 'स्क्रोलिंग घोषणा पट्टी',
    managePackages: 'सबस्क्रिप्शन प्लॅन्स',
    companyDetails: 'डी कंपनी माहिती',
    leadsReport: 'ग्राहक डेटाबेस (CSV)',
    adminSettings: 'सुरक्षा PIN सेटिंग्ज',
    approveChanges: 'बदल मंजूर करा',
    rejectChanges: 'नाकारायचे',

    // Shop Owner Portal
    shopPortalTitle: 'दुकानदार पोर्टल',
    updateOffer: 'आजची ऑफर व फोटो अपडेट करा',
    offerHeadline: 'ऑफर हेडलाईन',
    discountTag: 'डिस्काउंट टॅग (उदा. 15% सूट)',
    offerDescription: 'ऑफरची सविस्तर माहिती',
    shopPhotoUpload: 'दुकानाचा फोटो बदला (Upload Photo)',
    choosePhotoFile: 'गॅलरीतून फोटो निवडा',
    socialLinksTitle: 'सोशल मीडिया लिंक्स',
    submitForApproval: 'डी कंपनी कडे मंजुरीसाठी पाठवा',
    customerLeads: 'ग्राहक कूपन लिस्ट',
    replyWhatsApp: 'व्हॉट्सॲपवर उत्तर द्या',
    boostAd: 'जाहिरात बूस्ट (₹199)',
    orderStandee: 'D-QR काउंटर बोर्ड मागवा',
  },

  hi: {
    // Header & Brand
    appName: 'महा बिजनेस हब',
    subBrand: 'डी कंपनी',
    regionTag: 'मेहकर और लोणार क्षेत्र',
    shopsDirectory: 'दुकान निर्देशिका',
    counterDQR: 'काउंटर D-QR',
    shopLogin: 'दुकानदार लॉगिन',
    adminLogin: 'डी कंपनी एडमिन',
    searchPlaceholder: 'दुकान, ऑफर, मोबाइल खोजें...',
    allAreas: 'सभी क्षेत्र',
    shareApp: 'ऐप शेयर करें',
    hotDeals: 'आज के विशेष ऑफर',
    aboutDCompany: 'डी कंपनी के बारे में',

    // Categories
    catAll: 'सभी श्रेणियां',
    catAgri: 'कृषि और खाद',
    catMobile: 'मोबाइल और इलेक्ट्रॉनिक्स',
    catGarments: 'कपड़े और गारमेंट्स',
    catHospitals: 'अस्पताल और क्लिनिक',
    catCoaching: 'कोचिंग संस्थान',
    catFood: 'होटल और रेस्तरां',
    catServices: 'सेवाएं और गैरेज',

    // Directory & Cards
    showingShops: 'कुल दुकानें',
    verifiedShop: 'सत्यापित दुकान',
    getCoupon: 'छूट कूपन प्राप्त करें',
    whatsAppChat: 'व्हाट्सएप चैट',
    mapReview: 'मैप समीक्षा',
    viewDQR: 'D-QR कोड',
    todaysOffer: 'आज का विशेष ऑफर',
    validTill: 'वैधता',
    noShopsFound: 'कोई दुकान नहीं मिली',
    resetFilters: 'फ़िल्टर रीसेट करें',
    refresh: 'ताज़ा करें',

    // Coupon Modal
    couponTitle: 'त्वरित छूट कूपन पास',
    couponSub: 'विवरण भरकर अपना कूपन कोड मुफ़्त प्राप्त करें',
    fullName: 'आपका पूरा नाम',
    mobileNumber: 'व्हाट्सएप / मोबाइल नंबर',
    generateCoupon: 'कूपन कोड जनरेट करें',
    couponSuccess: 'कूपन सफलतापूर्वक जनरेट हुआ!',
    yourCouponCode: 'आपका आधिकारिक डिस्काउंट कोड',
    sendWhatsApp: 'दुकान के व्हाट्सएप पर भेजें',
    copyCode: 'कोड कॉपी करें',

    // D-QR Standee Modal
    dqrTitle: 'काउंटर D-QR कोड',
    dqrSub: 'ग्राहक दुकान पर स्कैन करके कूपन प्राप्त करें',
    downloadQR: 'QR डाउनलोड करें',
    printPoster: 'पोस्टर प्रिंट करें',
    scanToClaim: '📲 छूट के लिए दुकान पर स्कैन करें!',

    // Admin Dashboard
    adminTitle: 'डी कंपनी एडमिन मास्टर डैशबोर्ड',
    totalShops: 'कुल दुकानें',
    activePaid: 'सक्रिय पैकेजेस',
    totalLeads: 'कुल कूपन लीड्स',
    totalRevenue: 'कुल नेटवर्क आय',
    addShop: 'नई दुकान जोड़ें',
    editShop: 'दुकान संपादित करें',
    deleteShop: 'दुकान हटाएं',
    pendingApprovals: 'लंबित अनुमोदन',
    manageBanners: 'बैनर और विज्ञापन',
    manageTicker: 'स्क्रॉलिंग पट्टी',
    managePackages: 'सब्सक्रिप्शन प्लान्स',
    companyDetails: 'डी कंपनी विवरण',
    leadsReport: 'ग्राहक डेटाबेस (CSV)',
    adminSettings: 'सुरक्षा PIN सेटिंग्स',
    approveChanges: 'बदलाव मंजूर करें',
    rejectChanges: 'अस्वीकार करें',

    // Shop Owner Portal
    shopPortalTitle: 'दुकानदार पोर्टल',
    updateOffer: 'आज का ऑफर और फोटो अपडेट करें',
    offerHeadline: 'ऑफर शीर्षक',
    discountTag: 'डिस्काउंट टैग (जैसे 15% छूट)',
    offerDescription: 'ऑफर का विवरण',
    shopPhotoUpload: 'दुकान की फोटो अपलोड करें',
    choosePhotoFile: 'गैलरी से फोटो चुनें',
    socialLinksTitle: 'सोशल मीडिया लिंक्स',
    submitForApproval: 'डी कंपनी अनुमोदन के लिए भेजें',
    customerLeads: 'ग्राहक कूपन सूची',
    replyWhatsApp: 'व्हाट्सएप पर जवाब दें',
    boostAd: 'विज्ञापन बूस्ट (₹199)',
    orderStandee: 'D-QR काउंटर बोर्ड ऑर्डर करें',
  },

  en: {
    // Header & Brand
    appName: 'Maha Business Hub',
    subBrand: 'D Company',
    regionTag: 'Mehkar & Lonar Region',
    shopsDirectory: 'Shops Directory',
    counterDQR: 'Counter D-QR',
    shopLogin: 'Shop Login',
    adminLogin: 'D Company Admin',
    searchPlaceholder: 'Search shop, offer, phone...',
    allAreas: 'All Areas',
    shareApp: 'Share App',
    hotDeals: "Today's Hot Deals",
    aboutDCompany: 'About D Company',

    // Categories
    catAll: 'All Categories',
    catAgri: 'Agri & Fertilizers',
    catMobile: 'Mobile & Electronics',
    catGarments: 'Garments & Fashion',
    catHospitals: 'Hospitals & Clinics',
    catCoaching: 'Coaching Classes',
    catFood: 'Hotel & Restaurant',
    catServices: 'Services & Garage',

    // Directory & Cards
    showingShops: 'Total Shops',
    verifiedShop: 'Verified Shop',
    getCoupon: 'Get Discount Coupon',
    whatsAppChat: 'WhatsApp Chat',
    mapReview: 'Map Review',
    viewDQR: 'D-QR Code',
    todaysOffer: "Today's Special Offer",
    validTill: 'Valid',
    noShopsFound: 'No Shops Found',
    resetFilters: 'Reset Filters',
    refresh: 'Refresh',

    // Coupon Modal
    couponTitle: 'Instant Discount Pass',
    couponSub: 'Fill details to generate your free discount code',
    fullName: 'Your Full Name',
    mobileNumber: 'WhatsApp / Mobile Number',
    generateCoupon: 'Generate Coupon Code',
    couponSuccess: 'Coupon Issued Successfully!',
    yourCouponCode: 'Your Official Discount Code',
    sendWhatsApp: 'Send to Shop WhatsApp',
    copyCode: 'Copy Code',

    // D-QR Standee Modal
    dqrTitle: 'Counter D-QR Code',
    dqrSub: 'Customers scan at physical counter to claim instant discount coupons',
    downloadQR: 'Download QR',
    printPoster: 'Print Poster',
    scanToClaim: '📲 Scan QR at shop counter for instant discounts!',

    // Admin Dashboard
    adminTitle: 'D Company Admin Master Dashboard',
    totalShops: 'Total Shops',
    activePaid: 'Paid Subscriptions',
    totalLeads: 'Total Customer Leads',
    totalRevenue: 'Total Network Revenue',
    addShop: 'Add New Shop',
    editShop: 'Edit Shop',
    deleteShop: 'Delete Shop',
    pendingApprovals: 'Pending Approvals',
    manageBanners: 'Carousel Banners',
    manageTicker: 'Announcement Ticker',
    managePackages: 'Subscription Plans',
    companyDetails: 'D Company Info',
    leadsReport: 'Leads Database (CSV)',
    adminSettings: 'Security PIN Settings',
    approveChanges: 'Approve Changes',
    rejectChanges: 'Reject Changes',

    // Shop Owner Portal
    shopPortalTitle: 'Shopkeeper Portal',
    updateOffer: "Update Offer & Shop Photo",
    offerHeadline: 'Offer Headline',
    discountTag: 'Discount Tag (e.g. 15% OFF)',
    offerDescription: 'Full Offer Description',
    shopPhotoUpload: 'Upload Shop Photo',
    choosePhotoFile: 'Choose Photo File',
    socialLinksTitle: 'Social Media Links',
    submitForApproval: 'Submit for D Company Approval',
    customerLeads: 'Customer Coupon Leads',
    replyWhatsApp: 'Reply via WhatsApp',
    boostAd: 'Boost Ad (₹199)',
    orderStandee: 'Order D-QR Counter Board',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'mr',
  setLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('maha_hub_language');
    return (saved as Language) || 'mr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('maha_hub_language', lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    return defaultText || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
