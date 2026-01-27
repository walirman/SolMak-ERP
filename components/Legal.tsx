
import React from 'react';
import { Shield, FileText, Lock, Calendar, AlertCircle, Download, Plus, Search } from 'lucide-react';
import { LegalDoc, Language } from '../types';

interface LegalProps {
  t: any;
  docs: LegalDoc[];
  setDocs: React.Dispatch<React.SetStateAction<LegalDoc[]>>;
  themeColor: string;
  darkMode: boolean;
  lang: Language;
}

const Legal: React.FC<LegalProps> = ({ t, docs, themeColor, darkMode, lang }) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
          <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
          {t.modules.LEGAL}
        </h2>
        <button className="text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all" style={{ backgroundColor: themeColor }}>
          <Plus size={18} className="inline mr-2" /> {lang === 'bn' ? 'নতুন চুক্তি' : 'Add Document'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map(doc => (
          <div key={doc.id} className={`p-8 rounded-[3rem] border flex items-center gap-6 group hover:translate-x-2 transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
            <div className={`p-5 rounded-[2rem] border transition-colors ${darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500 group-hover:text-emerald-500' : 'bg-zinc-50 border-white text-zinc-400 group-hover:text-emerald-600'}`}>
              <Shield size={36} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{doc.type}</span>
                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${
                  doc.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>{doc.status}</span>
              </div>
              <h4 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{doc.title}</h4>
              <div className="flex items-center gap-2 mt-2 text-zinc-500">
                <Calendar size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Expires: {doc.expiryDate}</span>
              </div>
            </div>
            <button className="p-3 rounded-xl bg-zinc-800/50 text-zinc-500 hover:text-white transition-colors">
              <Download size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legal;
