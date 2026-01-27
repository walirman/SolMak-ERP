
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ModuleType, Language, UserRecord } from '../types';
import { Bell, Search, Menu, User, Settings as SettingsIcon, LogOut, ChevronDown, Building, Users, Zap, TrendingUp, CreditCard, ShoppingCart, Activity, Sun, Moon, Clock } from 'lucide-react';

interface HeaderProps {
  appName: string;
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  themeColor: string;
  lang: Language;
  setLang: (l: Language) => void;
  t: any;
  currentUser: UserRecord;
  allUsers: UserRecord[];
  setCurrentUserId: (id: string) => void;
  transactions: any[];
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  appName, 
  activeModule, 
  setActiveModule, 
  themeColor, 
  lang, 
  setLang, 
  t, 
  currentUser, 
  allUsers, 
  setCurrentUserId,
  transactions,
  darkMode,
  toggleDarkMode
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSwitchUser, setShowSwitchUser] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setShowSwitchUser(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে আপনি লগ আউট করতে চান?' : 'Are you sure you want to log out?')) {
      window.location.reload();
    }
  };

  const liveStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayPurchases = transactions
      .filter(tx => tx.date === today && tx.type === 'debit')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const supplierPayments = transactions
      .filter(tx => tx.type === 'debit' && tx.category.toLowerCase().includes('supplier'))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return [
      { label: lang === 'bn' ? 'আজকের পারচেজ' : "Today's Purchase", value: todayPurchases, color: themeColor },
      { label: lang === 'bn' ? 'সাপ্লায়ার পেমেন্ট' : 'Supplier Payment', value: supplierPayments, color: '#0ea5e9' },
    ];
  }, [transactions, lang, themeColor]);

  const formattedTime = currentTime.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className={`h-16 border-b px-6 flex items-center justify-between z-30 sticky top-0 transition-all overflow-hidden ${darkMode ? 'border-zinc-800 bg-zinc-950/50 backdrop-blur-md' : 'border-zinc-200 bg-white/80 backdrop-blur-md'}`}>
      <div className="flex items-center space-x-4">
        <button className={`md:hidden transition-colors ${darkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
          <Menu size={24} />
        </button>
        <div className="flex items-center space-x-2 text-sm overflow-hidden whitespace-nowrap">
          <Building size={16} className={darkMode ? 'text-zinc-500' : 'text-zinc-400'} />
          <span className={`font-bold max-w-[120px] truncate ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{appName}</span>
          <span className={darkMode ? 'text-zinc-700' : 'text-zinc-300'}>/</span>
          <span className={`font-medium animate-fade-in ${darkMode ? 'text-white' : 'text-zinc-900'}`} key={activeModule}>{t.modules[activeModule]}</span>
        </div>
      </div>

      {/* Live Data Scroller & Clock */}
      <div className="flex-1 flex justify-center items-center space-x-6 overflow-hidden hidden lg:flex">
        <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-emerald-50 border-emerald-100 shadow-sm'}`}>
          <Clock size={14} className="text-emerald-500" />
          <span className={`text-[11px] font-black font-mono tracking-tighter ${darkMode ? 'text-white' : 'text-emerald-900'}`}>
            {formattedDate} • {formattedTime}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {liveStats.map((item, idx) => (
            <div key={idx} className={`flex items-center space-x-3 px-4 py-1.5 rounded-full border shadow-sm transition-all ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-100/50 border-zinc-200'}`}>
              <span className={`text-[9px] font-black uppercase tracking-widest ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {item.label}:
              </span>
              <span className={`text-xs font-mono font-black ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                ৳{item.value.toLocaleString()}
              </span>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.color }}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-6">
        <button 
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-xl border transition-all active:scale-90 group ${darkMode ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:text-amber-300 hover:border-zinc-700' : 'bg-zinc-100 border-zinc-200 text-indigo-600 hover:text-indigo-800 hover:border-zinc-300'}`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={`flex border rounded-xl p-1 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            style={lang === 'en' ? { backgroundColor: themeColor } : {}}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('bn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'bn' ? 'text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            style={lang === 'bn' ? { backgroundColor: themeColor } : {}}
          >
            বাংলা
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center space-x-2 group p-1 pr-2 rounded-xl transition-all active:scale-95 ${darkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-200/50'}`}
            >
              <div className={`w-8 h-8 rounded-full overflow-hidden ring-2 ${darkMode ? 'ring-zinc-800 group-hover:ring-emerald-500/50' : 'ring-zinc-200 group-hover:ring-emerald-600/30'}`}>
                <img src={currentUser.avatarUrl || `https://picsum.photos/seed/${currentUser.id}/32/32`} alt="Profile" />
              </div>
              <ChevronDown size={14} className="text-zinc-400" />
            </button>

            {isProfileOpen && (
              <div className={`absolute right-0 mt-2 w-64 border rounded-2xl shadow-2xl animate-scale-in py-2 overflow-hidden z-50 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                {!showSwitchUser ? (
                  <>
                    <div className={`px-4 py-3 border-b mb-1 ${darkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                      <p className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{currentUser.name}</p>
                      <p className="text-xs text-zinc-500 truncate lowercase">{currentUser.role.replace('_', ' ')}</p>
                    </div>
                    
                    <button 
                      onClick={() => { setActiveModule('SETTINGS'); setIsProfileOpen(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${darkMode ? 'text-zinc-300 hover:bg-zinc-800 hover:text-white' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
                    >
                      <User size={16} style={{ color: themeColor }} />
                      <span>{t.settings.profile}</span>
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>{lang === 'bn' ? 'লগ আউট' : 'Log Out'}</span>
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
