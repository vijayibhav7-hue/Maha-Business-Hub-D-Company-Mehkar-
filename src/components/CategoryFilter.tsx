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
  MapPin
} from 'lucide-react';
import { Category, Region } from '../types';
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
    { label: 'All', i18nKey: 'catAll', defaultName: 'All Categories', icon: LayoutGrid },
    { label: 'Agri', i18nKey: 'catAgri', defaultName: 'Agri & Fertilizers', icon: Sprout },
    { label: 'Mobile', i18nKey: 'catMobile', defaultName: 'Mobile & Electronics', icon: Smartphone },
    { label: 'Garments', i18nKey: 'catGarments', defaultName: 'Garments & Fashion', icon: Shirt },
    { label: 'Hospitals', i18nKey: 'catHospitals', defaultName: 'Hospitals & Clinics', icon: HeartPulse },
    { label: 'Coaching', i18nKey: 'catCoaching', defaultName: 'Coaching Classes', icon: GraduationCap },
    { label: 'Food', i18nKey: 'catFood', defaultName: 'Hotel & Restaurant', icon: Utensils },
    { label: 'Services', i18nKey: 'catServices', defaultName: 'Services & Garage', icon: Wrench },
  ];

  return (
    <div className="space-y-3">
      {/* Mobile Region Toggle Bar */}
      <div className="flex sm:hidden items-center justify-between bg-slate-200/80 p-1 rounded-xl">
        <span className="text-xs font-bold text-slate-700 pl-2 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          Location:
        </span>
        <div className="flex items-center gap-1">
          {(['All', 'Mehkar', 'Lonar'] as Region[]).map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedRegion === reg
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {reg === 'All' ? t('allAreas', 'All') : reg}
            </button>
          ))}
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
