
import React from 'react';
import { ModuleType, UserRecord } from '../types';
import { 
  LayoutDashboard, Banknote, Package, Users, ShoppingCart, 
  Building2, UserSquare2, BarChart3, Settings, Scale, 
  Tags, ShieldAlert, MessageSquare, Bot, Landmark, 
  ShoppingBag, UserCog
} from 'lucide-react';

interface SidebarProps {
  appName: string;
  modules: ModuleType[];
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  themeColor: string;
  logoUrl?: string;
  t: any;
  currentUser: UserRecord;
  darkMode: boolean;
}

const moduleIconMap: Record<ModuleType, React.ElementType> = {
  DASHBOARD: LayoutDashboard,
  FINANCE: Banknote,
  INVENTORY: Package,
  SUPPLIERS: Users,
  SALES: ShoppingCart,
  OFFICE: Building2,
  HR: UserSquare2,
  REPORTS: BarChart3,
  SETTINGS: Settings,
  LEGAL: Scale,
  CATEGORIES: Tags,
  SUPER_ADMIN: ShieldAlert,
  COMMUNICATION: MessageSquare,
  SUPPORT_AI: Bot,
  ACCOUNTS: Landmark,
  PURCHASE: ShoppingBag,
  ADMIN: UserCog
};

const Sidebar: React.FC<SidebarProps> = ({ appName, modules, activeModule, setActiveModule, themeColor, logoUrl, t, currentUser, darkMode }) => {
  return (
    <aside className={`w-64 flex-shrink-0 border-r flex flex-col hidden md:flex transition-all duration-300 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 group cursor-default">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg overflow-hidden border" style={{ backgroundColor: themeColor, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1.5" />
            ) : (
              <Building2 className="text-white w-6 h-6" />
            )}
          </div>
          <span className={`text-lg font-bold tracking-tight truncate ${darkMode ? 'bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent' : 'text-zinc-900'}`} title={appName}>{appName}</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
        {modules.map((mod) => {
          const Icon = moduleIconMap[mod];
          const isActive = activeModule === mod;
          return (
            <button
              key={mod}
              onClick={() => setActiveModule(mod)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform border ${
                isActive 
                  ? (darkMode ? 'bg-zinc-800 text-white shadow-inner translate-x-1 border-zinc-700/50' : 'bg-zinc-100 text-zinc-900 shadow-sm translate-x-1 border-zinc-200') 
                  : (darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/40 hover:translate-x-1 border-transparent' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 hover:translate-x-1 border-transparent')
              }`}
            >
              <Icon 
                size={20} 
                className={`transition-all duration-300 ${isActive ? 'scale-110' : (darkMode ? 'text-zinc-500' : 'text-zinc-400')}`} 
                style={isActive ? { color: themeColor } : {}} 
              />
              <span className="truncate">{t.modules[mod]}</span>
              {isActive && (
                <div 
                  className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(5,150,105,0.6)]" 
                  style={{ backgroundColor: themeColor }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className={`p-4 border-t ${darkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
        <div className={`flex items-center space-x-3 p-3 rounded-2xl border transition-colors duration-300 cursor-pointer group ${darkMode ? 'bg-zinc-800/20 hover:bg-zinc-800/40 border-zinc-800' : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-100'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 border ${darkMode ? 'bg-zinc-700 border-zinc-700' : 'bg-zinc-200 border-zinc-200 shadow-sm'}`}>
            <img src={currentUser.avatarUrl || `https://picsum.photos/seed/${currentUser.id}/40/40`} alt="Avatar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate transition-colors ${darkMode ? 'group-hover:text-emerald-400 text-white' : 'group-hover:text-emerald-600 text-zinc-900'}`}>{currentUser.name}</p>
            <p className="text-[10px] text-zinc-500 truncate uppercase font-bold tracking-widest">{currentUser.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
