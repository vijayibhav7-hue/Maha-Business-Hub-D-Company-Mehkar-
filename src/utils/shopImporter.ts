import { Category, PlanType } from '../types';
import { autoDetectLocation } from '../data/maharashtraData';

export interface ParsedShopData {
  name: string;
  category: Category;
  region: string;
  district?: string;
  taluka?: string;
  village?: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  whatsappNumber: string;
  googleMapUrl: string;
  image: string;
  tagline: string;
  offerTitle: string;
  offerTag: string;
  offerDesc: string;
  rating?: number;
  totalReviews?: number;
  extractedSource?: string;
}

const CATEGORY_KEYWORDS: { [key in Category]: string[] } = {
  Agri: ['agri', 'krushi', 'seed', 'fertilizer', 'kisan', 'pesticide', 'irrigation', 'शेती', 'कृषी', 'खते', 'बियाणे', 'औषधे', 'किसान', 'ठिबक', 'अ‍ॅग्री'],
  Mobile: ['mobile', 'cell', 'phone', 'recharge', 'electronics', 'repair', 'sim', 'मोबाईल', 'फोन', 'रिचार्ज', 'इलेक्ट्रॉनिक्स', 'टॅब्लेट'],
  Garments: ['garment', 'cloth', 'saree', 'fashion', 'wear', 'dress', 'suiting', 'shirting', 'कपडे', 'साडी', 'रेडीमेड', 'गारमेंट्स', 'ड्रेस', 'कापड', 'क्लॉथ'],
  Hospitals: ['hospital', 'clinic', 'doctor', 'pharma', 'medical', 'dentist', 'eye', 'दवाखाना', 'हॉस्पिटल', 'क्लिनिक', 'डॉक्टर', 'मेडिकल', 'औषध'],
  Coaching: ['class', 'coaching', 'school', 'academy', 'education', 'college', 'tuition', 'क्लास', 'कोचिंग', 'अकॅडमी', 'शिक्षण', 'शाळा', 'कॉलेज'],
  Food: ['hotel', 'restaurant', 'dhaba', 'cafe', 'bakers', 'food', 'sweets', 'snack', 'ताजी', 'स्वीट्स', 'हॉटेल', 'रेस्टॉरंट', 'ढाबा', 'कॅफे', 'बेकरी', 'खाद्य', 'भोजनालय'],
  Services: ['service', 'garage', 'auto', 'beauty', 'saloon', 'hardware', 'electric', 'plumber', 'jewel', 'गॅरेज', 'सर्व्हिस', 'ब्युटी', 'सलून', 'हार्डवेअर', 'प्लंबर', 'ज्वेलर्स', 'सोनार']
};

const CATEGORY_PRESET_IMAGES: { [key in Category]: string } = {
  Agri: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
  Mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  Garments: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  Hospitals: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  Coaching: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  Food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  Services: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80'
};

// Convert Devanagari numerals to ASCII (e.g., ९६०७६३६४४४ -> 9607636444)
export const convertDevanagariDigits = (str: string): string => {
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(devanagariDigits[i], 'g'), i.toString());
  }
  return result;
};

// Extract 10-digit mobile number from text or URL parameters
export const extractMobileNumber = (text: string): string => {
  const normalized = convertDevanagariDigits(text);
  const match = normalized.match(/(?:\+91[\s-]?)?([6-9]\d{9})/);
  return match ? match[1] : '';
};

// Intelligently parse raw text or URL copied from Google Maps, Justdial, Facebook, WhatsApp etc.
export const parseShopFromLinkOrText = (input: string): ParsedShopData => {
  const cleanInput = convertDevanagariDigits(input.trim());
  let source = 'ऑटो फेच माहिती';

  let extractedName = '';
  let extractedAddress = '';
  let extractedPhone = extractMobileNumber(cleanInput);

  // SCENARIO 1: Justdial URL Format
  if (cleanInput.includes('justdial.com')) {
    source = 'जस्टडायल लिंक';
    try {
      const urlObj = new URL(cleanInput.startsWith('http') ? cleanInput : `https://${cleanInput}`);
      const pathParts = urlObj.pathname.split('/').filter(p => p.trim().length > 0);
      if (pathParts.length >= 2) {
        const slug = decodeURIComponent(pathParts[1]);
        const words = slug.split('-').filter(w => !/^\d+$/.test(w));
        let nameWords: string[] = [];
        let addrWords: string[] = [];
        let isAddrPart = false;

        for (const w of words) {
          if (['near', 'opp', 'opposite', 'bus', 'stand', 'road', 'chowk', 'mehkar', 'lonar', 'buldhana'].includes(w.toLowerCase())) {
            isAddrPart = true;
          }
          if (isAddrPart) {
            addrWords.push(w);
          } else {
            nameWords.push(w);
          }
        }

        if (nameWords.length > 0) {
          extractedName = nameWords.join(' ');
        } else if (words.length > 0) {
          extractedName = words.slice(0, 3).join(' ');
        }

        if (addrWords.length > 0) {
          extractedAddress = addrWords.join(' ');
        }
      }
    } catch {
      const match = cleanInput.match(/justdial\.com\/[^\/]+\/([^\/]+)/i);
      if (match) {
        extractedName = match[1].replace(/-/g, ' ').replace(/\d+/g, '').trim();
      }
    }
  }

  // SCENARIO 2: Google Maps Place / Search URL
  else if (cleanInput.includes('google.com/maps') || cleanInput.includes('maps.google.com')) {
    source = 'गूगल मॅप प्रोफाईल';
    if (cleanInput.includes('/maps/place/')) {
      const rawSlug = cleanInput.split('/maps/place/')[1]?.split('/')[0] || '';
      if (rawSlug) {
        const decoded = decodeURIComponent(rawSlug.replace(/\+/g, ' '));
        extractedName = decoded.split(',')[0].split('@')[0].trim();
      }
    } else if (cleanInput.includes('/maps/search/')) {
      const rawSlug = cleanInput.split('/maps/search/')[1]?.split('/')[0] || '';
      if (rawSlug) {
        extractedName = decodeURIComponent(rawSlug.replace(/\+/g, ' ')).split(',')[0].split('@')[0].trim();
      }
    } else if (cleanInput.includes('q=')) {
      const qVal = cleanInput.split('q=')[1]?.split('&')[0];
      if (qVal) {
        extractedName = decodeURIComponent(qVal.replace(/\+/g, ' '));
      }
    }
  }

  // SCENARIO 3: Google Maps Shortened Link
  else if (cleanInput.includes('maps.app.goo.gl') || cleanInput.includes('goo.gl')) {
    source = 'गूगल मॅप शॉर्ट लिंक';
    const qMatch = cleanInput.match(/[?&]q=([^&]+)/);
    if (qMatch) {
      extractedName = decodeURIComponent(qMatch[1].replace(/\+/g, ' '));
    }
  }

  // SCENARIO 4: Raw Text or Multi-line Copied Details
  if (!extractedName) {
    const lines = cleanInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    for (const line of lines) {
      if (line.startsWith('http://') || line.startsWith('https://')) continue;
      if (line.length >= 2) {
        extractedName = line;
        break;
      }
    }
  }

  // Clean up extracted name
  if (extractedName) {
    extractedName = extractedName
      .replace(/[-|_].*/, '')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // High Quality Default Fill - NEVER LEAVE BLANK!
  if (!extractedName || extractedName.startsWith('http')) {
    extractedName = 'डिजिटल सुपर शॉप (मेहकर)';
  }

  if (!extractedPhone) {
    extractedPhone = '9607636444';
  }

  // 3. Category Auto-Detection
  let detectedCategory: Category = 'Services';
  const lowerInput = cleanInput.toLowerCase() + ' ' + extractedName.toLowerCase();

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lowerInput.includes(kw))) {
      detectedCategory = cat as Category;
      break;
    }
  }

  // 4. Region, District & Village Auto Detection (All Maharashtra!)
  const loc = autoDetectLocation(lowerInput + ' ' + extractedAddress);
  const district = loc.district;
  const taluka = loc.taluka;
  const village = loc.village;
  const region = taluka || district || 'Mehkar';

  // 5. Address Formatting
  let address = extractedAddress;
  if (!address) {
    address = `मुख्य बाजार पेठ, ${village}, ता. ${taluka}, जि. ${district}`;
  } else if (!address.includes(district)) {
    address = `${address}, ता. ${taluka}, जि. ${district}`;
  }

  // 6. Google Map URL Construction
  let googleMapUrl = 'https://maps.google.com';
  const urlMatch = cleanInput.match(/(https?:\/\/[^\s]+)/);
  if (urlMatch) {
    googleMapUrl = urlMatch[1];
  } else {
    googleMapUrl = `https://www.google.com/maps/search/${encodeURIComponent(extractedName + ' ' + village + ' ' + district)}`;
  }

  const image = CATEGORY_PRESET_IMAGES[detectedCategory];

  return {
    name: extractedName,
    category: detectedCategory,
    region,
    district,
    taluka,
    village,
    address,
    ownerName: 'दुकानदार',
    ownerPhone: extractedPhone,
    whatsappNumber: extractedPhone,
    googleMapUrl,
    image,
    tagline: `${detectedCategory} क्षेत्रातील विश्वसनीय दुकान`,
    offerTitle: `विशेष १०% सवलत ऑफर`,
    offerTag: `10% OFF`,
    offerDesc: `D Company द्वारे खरेदीवर १०% सवलत उपलब्ध.`,
    rating: 4.9,
    totalReviews: 32,
    extractedSource: source,
  };
};
