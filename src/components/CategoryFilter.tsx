import React from 'react';
import { 
  Sprout, 
  Smartphone, 
  Shirt, 
  HeartPulse, 
  GraduationCap, 
  Utensils, 
  Wrench, 
  LayoutGrid,
  MapPin,
  ShoppingBag,
  Gem,
  Sparkles,
  Car,
  Armchair,
  Footprints,
  Tv,
  BookOpen,
  Building
} from 'lucide-react';
import { Category, Region } from '../types';
import { MAHARASHTRA_DISTRICTS_DATA } from '../data/maharashtraData';
import { useLanguage } from '../context/LanguageContext';

interface CategoryFilterProps {
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  categoryCounts,
}) => {
  const { t } = useLanguage();

  const CATEGORY_ITEMS: { label: Category | 'All'; i18nKey: string; defaultName: string; icon: React.FC<{ className?: string }> }[] = [
    { label: 'All', i18nKey: 'catAll', defaultName: 'सर्व (All)', icon: LayoutGrid },
    { label: 'Agri', i18nKey: 'catAgri', defaultName: 'कृषी व बियाणे', icon: Sprout },
    { label: 'Mobile', i18nKey: 'catMobile', defaultName: 'मोबाईल व रीपेअर', icon: Smartphone },
    { label: 'Garments', i18nKey: 'catGarments', defaultName: 'कपडे व साडी', icon: Shirt },
    { label: 'Grocery', i18nKey: 'catGrocery', defaultName: 'किराणा व मॉल', icon: ShoppingBag },
    { label: 'Food', i18nKey: 'catFood', defaultName: 'हॉटेल व फूड', icon: Utensils },
    { label: 'Hospitals', i18nKey: 'catHospitals', defaultName: 'दवाखाने व मेडिकल', icon: HeartPulse },
    { label: 'Hardware', i18nKey: 'catHardware', defaultName: 'हार्डवेअर व पेंट्स', icon: Wrench },
    { label: 'Jewellery', i18nKey: 'catJewellery', defaultName: 'ज्वेलर्स व सोनार', icon: Gem },
    { label: 'Beauty', i18nKey: 'catBeauty', defaultName: 'ब्युटी व सलून', icon: Sparkles },
    { label: 'Auto', i18nKey: 'catAuto', defaultName: 'ऑटो व गॅरेज', icon: Car },
    { label: 'Coaching', i18nKey: 'catCoaching', defaultName: 'क्लासेस व शाळा', icon: GraduationCap },
    { label: 'Furniture', i18nKey: 'catFurniture', defaultName: 'फर्निचर व सोफा', icon: Armchair },
    { label: 'Footwear', i18nKey: 'catFootwear', defaultName: 'फूटवेअर व चप्पल', icon: Footprints },
    { label: 'Electronics', i18nKey: 'catElectronics', defaultName: 'होम अप्लायन्सेस', icon: Tv },
    { label: 'Stationery', i18nKey: 'catStationery', defaultName: 'स्टेशनरी व झेरॉक्स', icon: BookOpen },
    { label: 'RealEstate', i18nKey: 'catRealEstate', defaultName: 'रिअल इस्टेट', icon: Building },
    { label: 'Services', i18nKey: 'catServices', defaultName: 'सेवा व इतर', icon: Wrench },
  ];

  return (
    <div className="space-y-3">
      {/* Mobile Location Selector Bar */}
      <div className="flex sm:hidden items-center justify-between bg-slate-200/80 p-1.5 rounded-2xl gap-2">
        <span className="text-[11px] font-extrabold text-slate-800 pl-1 flex items-center gap-1 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>लोकेशन:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full text-xs font-black bg-white text-slate-900 px-2 py-1 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">📍 सर्व महाराष्ट्र (All Districts)</option>
            <optgroup label="प्रमुख तालुके (Key Talukas)">
              <option value="Mehkar">Mehkar (मेहकर)</option>
              <option value="Lonar">Lonar (लोणार)</option>
              <option value="Chikhli">Chikhli (चिखली)</option>
              <option value="Khamgaon">Khamgaon (खामगाव)</option>
            </optgroup>
            <optgroup label="सर्व ३६ जिल्हे (All 36 Districts)">
              {MAHARASHTRA_DISTRICTS_DATA.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.nameMr} ({d.name})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Category Pills Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
        {CATEGORY_ITEMS.map(({ label, i18nKey, defaultName, icon: Icon }) => {
          const count = categoryCounts[label] || 0;
          const isSelected = selectedCategory === label;
          const localizedName = t(i18nKey, defaultName);

          return (
            <button
              key={label}
              onClick={() => setSelectedCategory(label)}
              className={`snap-start px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{localizedName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
