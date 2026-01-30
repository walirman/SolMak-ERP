
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, X, ShieldCheck, Building, 
  Globe, User, FileText, Briefcase, PhoneCall, MailCheck,
  ChevronDown, UserPlus, Save, Landmark, MapPin, Hash, Tag, Phone
} from 'lucide-react';
import { Supplier, Language, Transaction, UserRecord } from '../types';

interface SuppliersProps {
  t: any;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  transactions: Transaction[];
  themeColor: string;
  darkMode: boolean;
  lang: Language;
  currentUser: UserRecord;
}

const DEFAULT_CATEGORIES = ['Pharma', 'General', 'Surgical', 'Electronics', 'Logistics', 'Supplies', 'Wholesaler', 'Manufacturer', 'Service Provider'];

const Suppliers: React.FC<SuppliersProps> = ({ t, suppliers, setSuppliers, transactions, themeColor, darkMode, lang, currentUser }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const initialForm = {
    name: '',
    contact: '',
    email: '',
    category: 'General',
    address: '',
    tin: '',
    bin: '',
    contactPersonName: '',
    contactPersonNumber: '',
    contactPersonEmail: '',
    balance: '0'
  };

  const [formSupplier, setFormSupplier] = useState(initialForm);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      if (s.isPendingDeletion) return false;
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                           (s.contactPersonName && s.contactPersonName.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [suppliers, search, categoryFilter]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier: Supplier = {
      ...formSupplier,
      id: `SUP-${Date.now().toString().slice(-4)}`,
      balance: parseFloat(formSupplier.balance) || 0,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    setSuppliers(prev => [supplier, ...prev]);
    setShowAddModal(false);
    setFormSupplier(initialForm);
  };

  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl';
  const inputClass = `w-full border rounded-xl px-4 py-2 text-[13px] font-bold outline-none transition-all ${
    darkMode 
      ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500 placeholder-zinc-700' 
      : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-emerald-600 shadow-sm'
  }`;
  const labelClass = `text-[9px] font-black uppercase tracking-widest ml-1 mb-1 flex items-center gap-2 ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`;

  return (
    <div className="space-y-6 animate-fade-in w-full mx-auto pb-8 overflow-x-hidden">
      {/* Header Section */}
      <div className={`p-6 rounded-[2rem] border flex flex-col md:flex-row justify-between items-center gap-6 ${cardBg}`}>
        <div className="flex items-center gap-5">
          <div className="p-3.5 rounded-2xl shadow-xl border" style={{ backgroundColor: `${themeColor}15`, color: themeColor, borderColor: `${themeColor}30` }}>
            <Building size={28} />
          </div>
          <div>
            <h2 className={`text-xl md:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {lang === 'bn' ? 'সাপ্লায়ার তালিকা' : 'Supplier List'}
            </h2>
            <p className="text-zinc-500 font-medium text-[10px] mt-0.5 uppercase tracking-widest">{lang === 'bn' ? 'সাপ্লায়ার ডাটাবেস' : 'Manage your partners'}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all hover:scale-105 shadow-2xl w-full md:w-auto justify-center"
          style={{ backgroundColor: themeColor }}
        >
          <Plus size={18} /> {lang === 'bn' ? 'সাপ্লায়ার যোগ করুন' : 'Add Supplier'}
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder={lang === 'bn' ? 'নাম দিয়ে খুঁজুন...' : 'Search by name...'} 
            className={`w-full border rounded-2xl pl-12 pr-6 py-3 text-xs font-bold outline-none ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-700' : 'bg-white border-zinc-200 shadow-sm'}`}
          />
        </div>
        <div className="relative w-full md:w-[200px]">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`w-full px-6 py-3 rounded-2xl border font-black uppercase text-[9px] tracking-widest outline-none appearance-none cursor-pointer ${darkMode ? 'bg-zinc-900 border-zinc-300' : 'bg-white border-zinc-200'}`}
          >
            <option value="All">All Categories</option>
            {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(s => (
          <div key={s.id} className={`p-6 rounded-[2rem] border transition-all hover:translate-y-[-4px] cursor-pointer group ${cardBg}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/10"><Globe size={20}/></div>
                <div>
                  <h4 className={`text-sm font-black tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{s.name}</h4>
                  <p className="text-[8px] font-black uppercase text-emerald-500 tracking-widest mt-0.5">{s.category}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>{s.status}</span>
            </div>
            
            <div className={`grid grid-cols-1 gap-2 p-3 rounded-xl ${darkMode ? 'bg-zinc-950/40 border border-zinc-800/50' : 'bg-zinc-50 border border-zinc-100'}`}>
               <div className="flex items-center gap-2 text-zinc-500">
                 <User size={12} className="text-zinc-600" />
                 <span className="text-[10px] font-bold truncate text-zinc-400">{s.contactPersonName || 'No Contact Person'}</span>
               </div>
               <div className="flex items-center gap-2 text-zinc-500">
                 <PhoneCall size={12} className="text-zinc-600" />
                 <span className="text-[10px] font-bold truncate text-zinc-400">{s.contact}</span>
               </div>
            </div>

            <div className="mt-4 flex justify-between items-end border-t border-zinc-800/20 pt-4">
               <div>
                  <p className="text-[7px] font-black uppercase text-zinc-600 tracking-widest">Digital ID</p>
                  <p className="text-[9px] font-mono text-zinc-500 font-bold">{s.id}</p>
               </div>
               <div className="text-right">
                  <p className="text-[7px] font-black uppercase text-zinc-600 tracking-widest">Balance</p>
                  <p className={`text-xl font-black ${s.balance > 0 ? 'text-rose-500' : 'text-emerald-500'} tracking-tighter`}>৳{s.balance.toLocaleString()}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in my-auto">
            <header className="h-20 border-b border-zinc-800 px-8 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-5">
                <div className="p-2.5 rounded-xl border shadow-xl" style={{ backgroundColor: `${themeColor}20`, color: themeColor, borderColor: `${themeColor}30` }}>
                  <UserPlus size={24} />
                </div>
                <h3 className="text-xl font-black text-white tracking-tighter">
                  {lang === 'bn' ? 'নতুন সাপ্লায়ার যোগ' : 'Add New Supplier'}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-zinc-500 hover:text-rose-500 transition-all"><X size={28}/></button>
            </header>

            <main className="p-8">
              <form onSubmit={handleAdd} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border-b border-zinc-800 pb-2">Basic Information</h4>
                    <div>
                      <label className={labelClass}><Tag size={12} /> Category</label>
                      <select required value={formSupplier.category} onChange={e => setFormSupplier({...formSupplier, category: e.target.value})} className={inputClass}>
                        {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}><Building size={12} /> Company Name</label>
                      <input required type="text" value={formSupplier.name} onChange={e => setFormSupplier({...formSupplier, name: e.target.value})} className={inputClass} placeholder="PharmaCorp Ltd." />
                    </div>
                    <div>
                      {/* Added Phone icon to fix missing import error */}
                      <label className={labelClass}><Phone size={12} /> Contact No</label>
                      <input required type="tel" value={formSupplier.contact} onChange={e => setFormSupplier({...formSupplier, contact: e.target.value})} className={inputClass} placeholder="+880 1..." />
                    </div>
                  </div>

                  {/* Financial & Legal */}
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border-b border-zinc-800 pb-2">Liaison & Finance</h4>
                    <div>
                      <label className={labelClass}><User size={12} /> Contact Person</label>
                      <input required type="text" value={formSupplier.contactPersonName} onChange={e => setFormSupplier({...formSupplier, contactPersonName: e.target.value})} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}><Landmark size={12} /> Opening Balance (৳)</label>
                      <input type="number" value={formSupplier.balance} onChange={e => setFormSupplier({...formSupplier, balance: e.target.value})} className={`${inputClass} text-emerald-500 font-black`} />
                    </div>
                    <div>
                      <label className={labelClass}><MapPin size={12} /> Address</label>
                      <input type="text" value={formSupplier.address} onChange={e => setFormSupplier({...formSupplier, address: e.target.value})} className={inputClass} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-zinc-800">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-8 py-4 rounded-2xl bg-zinc-800 text-zinc-500 font-black uppercase text-[10px] hover:text-white transition-all">Cancel</button>
                  <button type="submit" className="px-10 py-4 rounded-2xl text-white font-black uppercase text-[10px] shadow-2xl transition-all hover:scale-105" style={{ backgroundColor: themeColor }}>
                    <Save size={18} className="inline mr-2" /> Save Supplier
                  </button>
                </div>
              </form>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
