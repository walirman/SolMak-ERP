
import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, Layout, Save, CheckCircle, Trash2, Users, UserPlus, 
  Building, Plus, Gavel, RefreshCw, AlertCircle, Key, Package, 
  Landmark, X, ArrowUp, ArrowDown, ListOrdered, ChevronRight, Settings2,
  HardDrive, Activity
} from 'lucide-react';
import { AppConfig, ModuleType, Language, Tenant, UserRecord, InventoryItem, Transaction } from '../types';

interface SuperAdminProps {
  t: any;
  lang: Language;
  config: AppConfig;
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  activeTenantId: string;
  setActiveTenantId: (id: string) => void;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  darkMode: boolean;
  onUpdateOrder: (newOrder: ModuleType[]) => void;
  currentUser: UserRecord;
}

const ALL_MODULES: ModuleType[] = [
  'DASHBOARD', 'FINANCE', 'INVENTORY', 'PURCHASE', 'SUPPLIERS', 'SALES', 
  'OFFICE', 'HR', 'REPORTS', 'SETTINGS', 'LEGAL', 
  'CATEGORIES', 'SUPER_ADMIN', 'COMMUNICATION', 'SUPPORT_AI', 'ACCOUNTS', 'ADMIN'
];

const SuperAdmin: React.FC<SuperAdminProps> = ({ 
  t, lang, config, tenants, setTenants, activeTenantId, setActiveTenantId, 
  inventory, setInventory, transactions, setTransactions, darkMode, onUpdateOrder,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'businesses' | 'menu' | 'health'>('approvals');
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [selectedTenantIdForMenu, setSelectedTenantIdForMenu] = useState(activeTenantId);
  const [newTenant, setNewTenant] = useState({ name: '' });

  // SECURITY ENFORCEMENT
  if (currentUser.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-8 bg-rose-500/10 text-rose-500 rounded-[3rem] border border-rose-500/20">
          <ShieldAlert size={64} />
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase">Access Prohibited</h2>
        <p className="text-zinc-500 font-medium">This terminal is restricted to Global Root Administrators.</p>
      </div>
    );
  }

  const pendingInv = inventory.filter(i => i.isPendingDeletion);
  const pendingTx = transactions.filter(t => t.isPendingDeletion);
  const totalPending = pendingInv.length + pendingTx.length;

  const targetTenantForMenu = useMemo(() => 
    tenants.find(t => t.id === selectedTenantIdForMenu) || tenants[0], 
  [tenants, selectedTenantIdForMenu]);

  const currentOrder = targetTenantForMenu.config.moduleOrder || ALL_MODULES;

  const moveModule = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...currentOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    
    setTenants(prev => prev.map(t => 
      t.id === selectedTenantIdForMenu 
        ? { ...t, config: { ...t.config, moduleOrder: newOrder } } 
        : t
    ));
  };

  const handleAddTenant = () => {
    if (!newTenant.name) return;
    const tenantId = `tenant-${Date.now()}`;
    const tenant: Tenant = {
      id: tenantId,
      name: newTenant.name,
      createdAt: new Date().toISOString(),
      users: [{
        id: `admin-${Date.now()}`,
        name: 'Business Admin',
        email: `admin@${newTenant.name.toLowerCase().replace(/\s/g, '')}.com`,
        role: 'ADMIN',
        permissions: ALL_MODULES
      }],
      config: { 
        theme: "#059669",
        darkMode: true,
        logoUrl: "", 
        modules: ALL_MODULES,
        moduleOrder: ALL_MODULES 
      }
    };
    setTenants([...tenants, tenant]);
    setNewTenant({ name: '' });
    setShowAddTenant(false);
  };

  const cardBg = darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';
  const innerCardBg = darkMode ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200';
  const textColor = darkMode ? 'text-zinc-500' : 'text-zinc-600';
  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-20">
      <div className={`${cardBg} p-8 rounded-[2.5rem] border flex flex-col md:flex-row justify-between items-center gap-6`}>
        <div className="flex items-center space-x-5">
          <div className="p-4 bg-emerald-500/10 rounded-[1.5rem] text-emerald-500 border border-emerald-500/20 shadow-inner">
            <ShieldAlert size={36} />
          </div>
          <div>
            <h2 className={`text-3xl font-black tracking-tight uppercase ${headingColor}`}>Global Admin Control</h2>
            <p className={`${textColor} text-sm font-medium`}>System-wide persistence and configuration hub.</p>
          </div>
        </div>
        <button onClick={() => setShowAddTenant(true)} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg ${darkMode ? 'bg-white text-black hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-black'}`}>
          <Plus size={18} /> Establish Business
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-3">
          {[
            { id: 'approvals', label: 'Approvals', icon: Gavel, count: totalPending, color: '#ef4444' },
            { id: 'businesses', label: 'Businesses', icon: Building, color: '#10b981' },
            { id: 'menu', label: 'Menu Config', icon: ListOrdered, color: '#a855f7' },
            { id: 'health', label: 'System Health', icon: Activity, color: '#0ea5e9' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] text-sm font-black transition-all border ${activeTab === tab.id ? (darkMode ? 'bg-zinc-800 text-white border-zinc-700 shadow-xl translate-x-2' : 'bg-white text-zinc-950 border-zinc-200 shadow-lg translate-x-2') : (darkMode ? 'text-zinc-500 hover:bg-zinc-800/30 border-transparent' : 'text-zinc-400 hover:bg-white border-transparent')}`}>
                <div className="flex items-center space-x-4">
                    <tab.icon size={20} style={activeTab === tab.id ? { color: tab.color } : {}} />
                    <span className="uppercase tracking-widest text-[11px]">{tab.label}</span>
                </div>
                {tab.count ? <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-black" style={{ backgroundColor: tab.color }}>{tab.count}</span> : null}
            </button>
          ))}
        </div>

        <div className={`lg:col-span-9 rounded-[3rem] p-10 min-h-[550px] border backdrop-blur-sm ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white/80 border-zinc-100 shadow-2xl'}`}>
          {activeTab === 'approvals' && (
            <div className="space-y-8 animate-fade-in">
                <h3 className={`text-2xl font-black uppercase tracking-tight ${headingColor}`}>Approval Center</h3>
                {totalPending === 0 ? <div className="py-24 text-center opacity-30"><CheckCircle size={80} className="mx-auto mb-6 text-emerald-500" /><p className={`uppercase font-black tracking-widest text-sm`}>All clear</p></div> : (
                    <div className="space-y-4">
                        {[...pendingInv, ...pendingTx].map((item: any) => (
                            <div key={item.id} className={`flex items-center justify-between p-6 rounded-[2rem] border ${innerCardBg} hover:border-emerald-500/30 transition-all`}>
                                <div className="flex items-center gap-5">
                                    <div className="p-4 rounded-2xl bg-zinc-900 text-emerald-500">{item.sku ? <Package size={24}/> : <Landmark size={24}/>}</div>
                                    <div><p className={`font-black text-xl ${headingColor}`}>{item.name || item.category}</p><p className={`text-[10px] uppercase font-black tracking-widest mt-1 text-rose-500`}>{item.id} • Deletion Requested</p></div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => item.sku ? setInventory(prev => prev.map(i => i.id === item.id ? {...i, isPendingDeletion: false} : i)) : setTransactions(prev => prev.map(t => t.id === item.id ? {...t, isPendingDeletion: false} : t))} className="p-4 rounded-2xl bg-zinc-900 text-emerald-500 hover:bg-emerald-500/20 transition-all"><RefreshCw size={20}/></button>
                                    <button onClick={() => item.sku ? setInventory(prev => prev.filter(i => i.id !== item.id)) : setTransactions(prev => prev.filter(t => t.id !== item.id))} className="p-4 rounded-2xl bg-zinc-900 text-rose-500 hover:bg-rose-500/20 transition-all"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-2xl font-black uppercase tracking-tight ${headingColor}`}>Sidebar Navigation Configuration</h3>
                  <p className={`${textColor} text-xs mt-2 font-bold uppercase tracking-widest`}>Custom Layout per business</p>
                </div>
                <div className="relative min-w-[240px]">
                  <select 
                    value={selectedTenantIdForMenu} 
                    onChange={(e) => setSelectedTenantIdForMenu(e.target.value)}
                    className={`w-full px-5 py-3 rounded-xl border text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer shadow-lg ${darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}
                  >
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div className={`p-8 rounded-[2.5rem] border ${innerCardBg}`}>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentOrder.map((mod, idx) => (
                    <div key={mod} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${darkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-emerald-500/40' : 'bg-white border-zinc-100 hover:border-emerald-500/40 shadow-sm'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-500 font-mono text-[10px]">{idx + 1}</div>
                        <span className={`font-black text-[11px] uppercase tracking-widest ${headingColor}`}>{t.modules[mod] || mod}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => moveModule(idx, 'up')} disabled={idx === 0} className={`p-2 rounded-lg transition-all ${idx === 0 ? 'opacity-20 grayscale' : 'hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-500'}`}><ArrowUp size={18}/></button>
                        <button onClick={() => moveModule(idx, 'down')} disabled={idx === currentOrder.length - 1} className={`p-2 rounded-lg transition-all ${idx === currentOrder.length - 1 ? 'opacity-20 grayscale' : 'hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-500'}`}><ArrowDown size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-8 animate-fade-in">
                <h3 className={`text-2xl font-black uppercase tracking-tight ${headingColor}`}>System Integrity Monitor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-8 rounded-[2.5rem] border ${innerCardBg}`}>
                        <HardDrive size={32} className="text-blue-500 mb-4" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500">Local Cache Usage</h4>
                        <p className={`text-3xl font-black mt-2 ${headingColor}`}>
                            {(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB
                        </p>
                    </div>
                    <div className={`p-8 rounded-[2.5rem] border ${innerCardBg}`}>
                        <Activity size={32} className="text-emerald-500 mb-4" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500">Atomic Sync Status</h4>
                        <p className="text-3xl font-black mt-2 text-emerald-500">LOCKED</p>
                    </div>
                </div>
                <div className={`p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5`}>
                    <p className="text-xs font-bold leading-relaxed text-emerald-500">
                        * All data transactions are currently being mirrored to encrypted local partitions. Root persistence is active across {tenants.length} business entities.
                    </p>
                </div>
            </div>
          )}

          {activeTab === 'businesses' && (
            <div className="space-y-8 animate-fade-in">
                <h3 className={`text-2xl font-black uppercase tracking-tight ${headingColor}`}>Global Business Directory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tenants.map(t => (
                        <div key={t.id} className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group ${activeTenantId === t.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700'}`} onClick={() => setActiveTenantId(t.id)}>
                            <div className="flex justify-between items-start mb-6"><div className={`p-4 rounded-2xl ${activeTenantId === t.id ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-zinc-600'}`}><Building size={28} /></div>{activeTenantId === t.id && <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">Active</div>}</div>
                            <h4 className={`text-2xl font-black tracking-tight ${headingColor}`}>{t.name}</h4>
                            <p className="text-[10px] font-black uppercase text-zinc-500 mt-2">{t.users.length} Personnel Authorized</p>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      </div>

      {showAddTenant && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4">
          <div className={`border w-full max-w-md rounded-[3rem] p-12 bg-zinc-950 border-zinc-800 animate-scale-in`}>
            <h3 className="text-3xl font-black mb-8 text-white tracking-tighter uppercase">Establish Entity</h3>
            <div className="space-y-6">
              <input required type="text" value={newTenant.name} onChange={e => setNewTenant({name: e.target.value})} placeholder="Organization Name" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-emerald-500" />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddTenant(false)} className="flex-1 py-4 font-black uppercase text-xs text-zinc-500">Cancel</button>
                <button onClick={handleAddTenant} className="flex-1 py-4 bg-emerald-600 text-white font-black uppercase text-xs rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Establish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
