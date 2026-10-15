import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const LANGS: { id: Language; label: string; short: string }[] = [
    { id: 'mr', label: 'मराठी', short: 'मराठी' },
    { id: 'hi', label: 'हिंदी', short: 'हिंदी' },
    { id: 'en', label: 'English', short: 'EN' },
  ];

  return (
    <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-amber-500/30 shadow-sm">
      <div className="pl-1.5 pr-1 text-amber-400">
        <Languages className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center gap-0.5">
        {LANGS.map((item) => {
          const isSelected = language === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id)}
              className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.short}
            </button>
          );
        })}
      </div>
    </div>
  );
};
