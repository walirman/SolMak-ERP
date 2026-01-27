
import React from 'react';
import { Tags, Plus, Box, Shield, Briefcase, ChevronRight, Search, Settings } from 'lucide-react';
import { Language } from '../types';

interface CategoriesProps {
  t: any;
  themeColor: string;
  darkMode: boolean;
  lang: Language;
}

const CAT_DATA = [
  { name: 'Pharmaceuticals', items: 125, icon: Shield, color: '#10b981' },
  { name: 'Surgical Equipment', items: 45, icon: Box, color: '#3b82f6' },
  { name: 'General Supplies', items: 230, icon: Tags, color: '#f59e0b' },
  { name: 'Professional Services', items: 12, icon: Briefcase, color: '#7c3aed' },
  { name: 'Office Essentials', items: 89, icon: Settings, color: '#ec4899' },
];

const Categories: React.FC<CategoriesProps> = ({ t, themeColor, darkMode, lang }) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
          <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
          {t.modules.CATEGORIES}
        </h2>
        <button className="text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all" style={{ backgroundColor: themeColor }}>
          <Plus size={18} className="inline mr-2" /> {lang === 'bn' ? 'নতুন ক্যাটাগরি' : 'Define Category'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CAT_DATA.map(cat => (
          <div key={cat.name} className={`p-10 rounded-[3.5rem] border flex flex-col items-center text-center group transition-all hover:scale-105 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
            <div className={`p-8 rounded-[2.5rem] mb-6 transition-transform group-hover:rotate-6`} style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
              <cat.icon size={48} />
            </div>
            <h3 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{cat.name}</h3>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">{cat.items} Total Entities</p>
            <button className={`mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all`} style={{ color: cat.color }}>
              View Catalog <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
