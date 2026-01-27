
import React, { useState, useRef } from 'react';
import { User, Bell, Shield, Palette, Globe, Save, CheckCircle, ArrowRight, Image as ImageIcon, Upload, Camera, Check, Type, X, Layout, Maximize2, Square, Boxes, Ghost } from 'lucide-react';
import { Language, UserRecord, AppLayout } from '../types';

interface SettingsProps {
  t: any;
  lang: Language;
  setLang: (l: Language) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  currentUser: UserRecord;
  onUserUpdate: (user: UserRecord) => void;
  darkMode: boolean;
}

const THEME_PRESETS = [
  { name: 'Emerald', color: '#059669' },
  { name: 'Indigo', color: '#4f46e5' },
  { name: 'Rose', color: '#e11d48' },
  { name: 'Amber', color: '#d97706' },
  { name: 'Violet', color: '#7c3aed' },
  { name: 'Sky', color: '#0284c7' },
  { name: 'Slate', color: '#475569' },
  { name: 'Teal', color: '#0d9488' },
];

const LAYOUT_PRESETS: { id: AppLayout; name: string; nameBn: string; desc: string; descBn: string; icon: any }[] = [
  { 
    id: 'standard', 
    name: 'Standard Layout', 
    nameBn: 'স্ট্যান্ডার্ড লেআউট',
    desc: 'Balanced padding and modern rounded corners.', 
    descBn: 'আধুনিক রাউন্ডেড ডিজাইন এবং ভারসাম্যপূর্ণ স্পেসিং।',
    icon: Boxes 
  },
  { 
    id: 'compact', 
    name: 'Data Focused', 
    nameBn: 'কম্প্যাক্ট মোড',
    desc: 'High density view for experts. Reduced white space.', 
    descBn: 'ডেটা এক্সপার্টদের জন্য ঘন এবং গোছানো ভিউ।',
    icon: Maximize2 
  },
  { 
    id: 'glass', 
    name: 'Glass Flow', 
    nameBn: 'গ্লাস ইফেক্ট',
    desc: 'Translucent elements with deep backdrop blurring.', 
    descBn: 'ট্রান্সলুসেন্ট গ্লাস এবং ব্লার ইফেক্টের লাক্সারি লুক।',
    icon: Ghost 
  },
  { 
    id: 'corporate', 
    name: 'Executive Sharp', 
    nameBn: 'কর্পোরেট শার্প',
    desc: 'Zero border radius. Classic high-contrast structure.', 
    descBn: 'শার্প কর্নার এবং হাই-কন্ট্রাস্ট কর্পোরেট ডিজাইন।',
    icon: Square 
  },
  { 
    id: 'minimal', 
    name: 'Ultra Minimal', 
    nameBn: 'মিনিমালিস্টিক',
    desc: 'Borderless design. Cleanest possible interface.', 
    descBn: 'বর্ডারহীন একদম ক্লিন এবং সিম্পল ইন্টারফেস।',
    icon: Layout 
  },
];

const Settings: React.FC<SettingsProps> = ({ t, lang, setLang, themeColor, setThemeColor, logoUrl, setLogoUrl, currentUser, onUserUpdate, darkMode }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [tempUser, setTempUser] = useState<UserRecord>({...currentUser});
  const [tempLogo, setTempLogo] = useState(logoUrl);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN';

  const handleSave = () => {
    setIsSaving(true);
    onUserUpdate(tempUser);
    if (isAdmin) {
        setLogoUrl(tempLogo);
    }
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(lang === 'bn' ? 'ফাইলটি অনেক বড়! ২ মেগাবাইটের কম সাইজের ছবি দিন।' : 'File too large! Max 2MB allowed.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'avatar') {
          setTempUser(prev => ({ ...prev, avatarUrl: base64String }));
        } else {
          setTempLogo(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';
  const textColor = darkMode ? 'text-zinc-400' : 'text-zinc-600';
  const inputBg = darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200';

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-black tracking-tight ${headingColor}`}>{t.settings.title}</h2>
          <p className={`${textColor} mt-1 font-medium`}>{t.settings.subtitle}</p>
        </div>
        {showSuccess && (
          <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 animate-scale-in">
            <CheckCircle size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">{lang === 'bn' ? 'আপডেট সম্পন্ন' : 'Update Successful'}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${activeTab === 'profile' ? (darkMode ? 'bg-zinc-800 text-white border-zinc-700 shadow-xl' : 'bg-white text-zinc-950 border-zinc-200 shadow-sm') : (darkMode ? 'text-zinc-500 hover:text-zinc-300 border-transparent' : 'text-zinc-400 hover:text-zinc-900 border-transparent')}`}
          >
            <User size={18} style={activeTab === 'profile' ? { color: themeColor } : {}} />
            <span>{lang === 'bn' ? 'ব্যক্তিগত প্রোফাইল' : 'Personal Profile'}</span>
          </button>

          {isAdmin && (
            <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${activeTab === 'preferences' ? (darkMode ? 'bg-zinc-800 text-white border-zinc-700 shadow-xl' : 'bg-white text-zinc-950 border-zinc-200 shadow-sm') : (darkMode ? 'text-zinc-500 hover:text-zinc-300 border-transparent' : 'text-zinc-400 hover:text-zinc-900 border-transparent')}`}
            >
                <Palette size={18} style={activeTab === 'preferences' ? { color: themeColor } : {}} />
                <span>{lang === 'bn' ? 'কোম্পানি ব্র্যান্ডিং' : 'Company Branding'}</span>
            </button>
          )}
        </div>

        <div className={`lg:col-span-3 border rounded-3xl p-8 backdrop-blur-md transition-all ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
            {activeTab === 'profile' && (
                <div className="space-y-10 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleFileChange(e, 'avatar')}
                            />
                            <div 
                              onClick={() => triggerUpload(fileInputRef)}
                              className={`w-32 h-32 rounded-[2.5rem] border-4 overflow-hidden shadow-2xl relative cursor-pointer group-hover:ring-4 transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 ring-white/10' : 'bg-zinc-100 border-white ring-zinc-100'}`}
                            >
                                <img 
                                  src={tempUser.avatarUrl || `https://picsum.photos/seed/${tempUser.id}/128/128`} 
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white gap-1">
                                    <Camera size={24} />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Change</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className={`text-[10px] font-black uppercase ml-1 ${textColor}`}>{lang === 'bn' ? 'পুরো নাম' : 'Full Name'}</label>
                                    <input type="text" value={tempUser.name} onChange={e => setTempUser({...tempUser, name: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm font-bold transition-all ${inputBg} ${headingColor}`} />
                                </div>
                                <div className="space-y-1">
                                    <label className={`text-[10px] font-black uppercase ml-1 ${textColor}`}>{lang === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}</label>
                                    <input type="email" value={tempUser.email} onChange={e => setTempUser({...tempUser, email: e.target.value})} className={`w-full border rounded-xl px-4 py-3 text-sm font-bold transition-all ${inputBg} ${headingColor}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* UI Layout Selection Hub */}
                    <div className={`p-8 rounded-[2.5rem] border shadow-inner ${darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                      <div className="flex items-center justify-between mb-8">
                        <h4 className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 ${textColor}`}>
                            <Layout size={20} style={{ color: themeColor }} />
                            {lang === 'bn' ? 'এ্যাপ লেআউট গ্যালারি (স্যাম্পল)' : 'App Layout Gallery (Samples)'}
                        </h4>
                        <span className="text-[10px] font-bold px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                            {lang === 'bn' ? 'শুধুমাত্র আপনার জন্য' : 'Personal Preference'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LAYOUT_PRESETS.map((layout) => (
                          <button
                            key={layout.id}
                            type="button"
                            onClick={() => setTempUser({...tempUser, layout: layout.id})}
                            className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all group ${tempUser.layout === layout.id ? (darkMode ? 'bg-zinc-800 border-emerald-500 shadow-xl scale-[1.02]' : 'bg-white border-emerald-600 shadow-lg scale-[1.02]') : (darkMode ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm')}`}
                          >
                            <div className={`p-4 rounded-xl transition-all ${tempUser.layout === layout.id ? 'bg-emerald-500 text-white rotate-6' : 'bg-zinc-800 text-zinc-600 group-hover:text-zinc-400 group-hover:rotate-6'}`}>
                              <layout.icon size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-black uppercase tracking-widest ${tempUser.layout === layout.id ? 'text-emerald-500' : headingColor}`}>{lang === 'bn' ? layout.nameBn : layout.name}</p>
                                <p className="text-[10px] font-medium text-zinc-500 mt-1.5 leading-relaxed">{lang === 'bn' ? layout.descBn : layout.desc}</p>
                            </div>
                            {tempUser.layout === layout.id && (
                                <div className="p-1 bg-emerald-500 rounded-full text-white">
                                    <Check size={12} />
                                </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Personal Theme Color */}
                    <div className={`p-8 rounded-[2.5rem] border shadow-inner ${darkMode ? 'bg-zinc-950/40 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                      <h4 className={`text-sm font-black uppercase tracking-widest flex items-center gap-3 mb-8 ${textColor}`}>
                        <Palette size={20} style={{ color: themeColor }} />
                        {lang === 'bn' ? 'ব্যক্তিগত থিম এক্সেন্ট' : 'Personal Theme Accent'}
                      </h4>

                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                        {THEME_PRESETS.map((preset) => (
                          <button
                            key={preset.color}
                            onClick={() => setTempUser({...tempUser, themeColor: preset.color})}
                            className={`group relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 border-4 ${tempUser.themeColor === preset.color ? (darkMode ? 'border-white ring-4 ring-white/10' : `border-zinc-950 ring-4 ring-zinc-200`) : 'border-transparent'}`}
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                          >
                            {tempUser.themeColor === preset.color && <Check size={24} className="text-white drop-shadow-lg" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-6">
                        <h4 className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest ${textColor}`}><Globe size={18}/> {lang === 'bn' ? 'আঞ্চলিক পছন্দসমূহ' : 'Regional Preferences'}</h4>
                        <div className={`flex p-2 rounded-2xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200 shadow-inner'}`}>
                            <button type="button" onClick={() => setLang('en')} className={`flex-1 py-3 text-xs font-black uppercase rounded-xl transition-all ${lang === 'en' ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900')}`} style={lang === 'en' ? {backgroundColor: themeColor} : {}}>English</button>
                            <button type="button" onClick={() => setLang('bn')} className={`flex-1 py-3 text-xs font-black uppercase rounded-xl transition-all ${lang === 'bn' ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900')}`} style={lang === 'bn' ? {backgroundColor: themeColor} : {}}>Bengali (বাংলা)</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'preferences' && isAdmin && (
                <div className="space-y-8 animate-fade-in">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest ${textColor}`}><ImageIcon size={18}/> {lang === 'bn' ? 'বিজনেস ব্র্যান্ডিং' : 'Business Branding'}</h4>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[2.5rem] border bg-zinc-950/20 border-zinc-800">
                            <div className="relative group flex-shrink-0">
                                <input 
                                  type="file" 
                                  ref={logoInputRef} 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={(e) => handleFileChange(e, 'logo')}
                                />
                                <div 
                                  onClick={() => triggerUpload(logoInputRef)}
                                  className={`w-[150px] h-[150px] rounded-3xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative cursor-pointer group-hover:border-emerald-500/50 ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-50 border-zinc-200 shadow-inner'}`}
                                >
                                    {tempLogo ? (
                                      <img src={tempLogo} className="w-full h-full object-contain p-2" alt="Corporate Logo" />
                                    ) : (
                                      <div className="flex flex-col items-center gap-2 text-zinc-500">
                                        <ImageIcon size={40} className="opacity-20" />
                                        <span className="text-[10px] font-black uppercase">No Logo</span>
                                      </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-4 w-full">
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${textColor}`}>Corporate Logo Source URL</label>
                                    <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        value={tempLogo} 
                                        onChange={e => setTempLogo(e.target.value)} 
                                        placeholder="https://..." 
                                        className={`flex-1 border rounded-xl px-4 py-3 text-xs font-mono outline-none transition-all ${inputBg} ${headingColor} focus:border-emerald-500`} 
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => triggerUpload(logoInputRef)}
                                        className={`px-4 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' : 'bg-white border-zinc-200 text-zinc-950 hover:bg-zinc-50'}`}
                                      >
                                        Browse
                                      </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-12 flex justify-end">
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 disabled:opacity-50 transition-all ${darkMode ? 'bg-white text-black hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-black'}`}
                    style={!darkMode ? { backgroundColor: themeColor } : {}}
                >
                    {isSaving ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Syncing...') : (lang === 'bn' ? 'পরিবর্তন সেভ করুন' : 'Apply Changes')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
