import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const LANGS: { id: Language; label: string; short: string; mini: string }[] = [
    { id: 'mr', label: 'मराठी', short: 'मराठी', mini: 'म' },
    { id: 'hi', label: 'हिंदी', short: 'हिंदी', mini: 'हि' },
    { id: 'en', label: 'English', short: 'EN', mini: 'EN' },
  ];

  return (
    <div className="flex items-center bg-slate-900 p-0.5 sm:p-1 rounded-xl border border-amber-500/30 shadow-xs shrink-0">
      <div className="hidden sm:block pl-1 pr-0.5 text-amber-400">
        <Languages className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center gap-0.5">
        {LANGS.map((item) => {
          const isSelected = language === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id)}
              className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-black rounded-lg transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="hidden sm:inline">{item.short}</span>
              <span className="sm:hidden">{item.mini}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
