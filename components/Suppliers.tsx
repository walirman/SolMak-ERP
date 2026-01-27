
import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, Filter, Trash2, Mail, Phone, 
  CheckCircle, X, ShieldCheck, CreditCard, Building, 
  ExternalLink, MoreVertical, Ban, UserCheck, Tag,
  ArrowUpDown, Globe, Edit3, ArrowLeft, History,
  TrendingUp, TrendingDown, Clock, Landmark
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Supplier, Language, Transaction } from '../types';

interface SuppliersProps {
  t: any;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  transactions: Transaction[];
  themeColor: string;
  darkMode: boolean;
  lang: Language;
}

const DEFAULT_CATEGORIES = ['Pharma', 'General', 'Surgical', 'Electronics', 'Logistics', 'Supplies'];

const Suppliers: React.FC<SuppliersProps> = ({ t, suppliers, setSuppliers, transactions, themeColor, darkMode, lang }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'balance'>('name');
  
  const [formSupplier, setFormSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    category: 'General',
    customCategory: '',
    balance: ''
  });

  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  const filteredSuppliers = useMemo(() => {
    let result = suppliers.filter(s => {
      if (s.isPendingDeletion) return false;
      const matchesSearch = 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.contact.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.balance - a.balance;
    });
  }, [suppliers, search, categoryFilter, sortBy]);

  const stats = useMemo(() => {
    const total = filteredSuppliers.length;
    const totalBalance = filteredSuppliers.reduce((acc, curr) => acc + curr.balance, 0);
    const activeOnes = filteredSuppliers.filter(s => s.status === 'Active').length;
    return { total, totalBalance, activeOnes };
  }, [filteredSuppliers]);

  // Derived data for a specific supplier
  const supplierDetails = useMemo(() => {
    if (!viewingSupplier) return null;
    const relatedTx = transactions.filter(tx => tx.supplierId === viewingSupplier.id && !tx.isPendingDeletion);
    
    // Monthly history for charts
    const monthlyDataMap: Record<string, { month: string, payments: number, balance: number }> = {};
    
    // Sort transactions by date
    const sortedTx = [...relatedTx].sort((a, b) => a.date.localeCompare(b.date));
    
    let runningBalance = viewingSupplier.balance;
    sortedTx.forEach(tx => {
        const month = tx.date.slice(0, 7); // YYYY-MM
        if (!monthlyDataMap[month]) {
            monthlyDataMap[month] = { month, payments: 0, balance: runningBalance };
        }
        if (tx.type === 'debit') {
            monthlyDataMap[month].payments += Math.abs(tx.amount);
        }
    });

    const chartData = Object.values(monthlyDataMap).sort((a, b) => a.month.localeCompare(b.month));

    return {
      history: sortedTx,
      chartData,
      totalPaid: relatedTx.filter(tx => tx.type === 'debit').reduce((s, tx) => s + Math.abs(tx.amount), 0),
    };
  }, [viewingSupplier, transactions]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSupplier.name) return;

    const finalCategory = formSupplier.category === 'Custom' ? formSupplier.customCategory : formSupplier.category;
    
    if (formSupplier.category === 'Custom' && formSupplier.customCategory && !categories.includes(formSupplier.customCategory)) {
        setCategories(prev => [...prev, formSupplier.customCategory]);
    }

    const supplier: Supplier = {
      id: `SUP-${Date.now().toString().slice(-4)}`,
      name: formSupplier.name,
      contact: formSupplier.contact,
      email: formSupplier.email,
      category: finalCategory || 'General',
      balance: parseFloat(formSupplier.balance) || 0,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    setSuppliers(prev => [...prev, supplier]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier || !formSupplier.name) return;

    const finalCategory = formSupplier.category === 'Custom' ? formSupplier.customCategory : formSupplier.category;

    setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? {
        ...s,
        name: formSupplier.name,
        contact: formSupplier.contact,
        email: formSupplier.email,
        category: finalCategory || 'General',
        balance: parseFloat(formSupplier.balance) || 0
    } : s));

    setShowEditModal(false);
    setEditingSupplier(null);
    resetForm();
  };

  const openEditModal = (s: Supplier) => {
    setEditingSupplier(s);
    setFormSupplier({
        name: s.name,
        contact: s.contact,
        email: s.email,
        category: categories.includes(s.category) ? s.category : 'Custom',
        customCategory: categories.includes(s.category) ? '' : s.category,
        balance: s.balance.toString()
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormSupplier({ name: '', contact: '', email: '', category: 'General', customCategory: '', balance: '' });
  };

  const toggleStatus = (id: string) => {
    setSuppliers(prev => prev.map(s => 
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Blocked' : 'Active' } : s
    ));
  };

  const handleSoftDelete = (id: string) => {
    const confirmMsg = lang === 'bn' 
      ? 'আপনি কি এই সরবরাহকারীকে মুছে ফেলার অনুরোধ পাঠাতে চান?' 
      : 'Send supplier deletion request?';
    if(confirm(confirmMsg)) {
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, isPendingDeletion: true } : s));
    }
  };

  const cardBg = darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl shadow-zinc-200/40';
  const innerCardBg = darkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-100';
  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';
  const textColor = darkMode ? 'text-zinc-500' : 'text-zinc-500';

  if (viewingSupplier && supplierDetails) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
        <button 
          onClick={() => setViewingSupplier(null)}
          className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all ${darkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
        >
          <ArrowLeft size={16} /> {lang === 'bn' ? 'তালিকায় ফিরে যান' : 'Back to Directory'}
        </button>

        {/* Profile Header */}
        <div className={`p-10 rounded-[3.5rem] border flex flex-col lg:flex-row justify-between items-center gap-8 ${cardBg}`}>
            <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-[2.5rem] border-4 flex items-center justify-center transition-all bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    <Building size={48} />
                </div>
                <div>
                    <h2 className={`text-4xl font-black tracking-tighter ${headingColor}`}>{viewingSupplier.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-white text-zinc-500'}`}>
                            {viewingSupplier.category}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-2 border ${viewingSupplier.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                            {viewingSupplier.status}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <button 
                  onClick={() => openEditModal(viewingSupplier)}
                  className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all active:scale-95 ${darkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}
                >
                    <Edit3 size={16} /> {lang === 'bn' ? 'প্রোফাইল এডিট' : 'Edit Profile'}
                </button>
            </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><TrendingDown size={20} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Total Dues</span>
                </div>
                <p className={`text-3xl font-black ${headingColor}`}>৳{viewingSupplier.balance.toLocaleString()}</p>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold">Unpaid Balance</p>
            </div>
            <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><TrendingUp size={20} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Total Payments</span>
                </div>
                <p className={`text-3xl font-black ${headingColor}`}>৳{supplierDetails.totalPaid.toLocaleString()}</p>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold">Lifetime Paid</p>
            </div>
            <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><History size={20} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Activity</span>
                </div>
                <p className={`text-3xl font-black ${headingColor}`}>{supplierDetails.history.length}</p>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold">Financial Events</p>
            </div>
        </div>

        {/* Visualization Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-10 rounded-[3.5rem] border ${cardBg}`}>
                <h3 className={`text-xl font-black uppercase tracking-tight mb-8 ${headingColor}`}>Payment & Due Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={supplierDetails.chartData}>
                            <defs>
                                <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#eee"} vertical={false} />
                            <XAxis dataKey="month" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip 
                                formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Amount']}
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: darkMode ? '#18181b' : '#fff' }}
                            />
                            <Area type="monotone" dataKey="payments" stroke={themeColor} fillOpacity={1} fill="url(#colorPayments)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={`p-10 rounded-[3.5rem] border flex flex-col ${cardBg}`}>
                <h3 className={`text-xl font-black uppercase tracking-tight mb-6 ${headingColor}`}>{lang === 'bn' ? 'লেনদেনের ইতিহাস' : 'Transaction Logs'}</h3>
                <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] pr-2 custom-scrollbar">
                    {supplierDetails.history.map(tx => (
                        <div key={tx.id} className={`flex items-center justify-between p-5 rounded-2xl border ${innerCardBg}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${tx.type === 'debit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {tx.type === 'debit' ? <ArrowUpDown size={16} /> : <Clock size={16} />}
                                </div>
                                <div>
                                    <p className={`text-xs font-black ${headingColor}`}>{tx.category}</p>
                                    <p className="text-[9px] text-zinc-500 uppercase font-bold">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-black ${tx.type === 'debit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {tx.type === 'debit' ? '-' : '+'}৳{Math.abs(tx.amount).toLocaleString()}
                                </p>
                                <p className="text-[9px] text-zinc-500 uppercase font-black">{tx.status}</p>
                            </div>
                        </div>
                    ))}
                    {supplierDetails.history.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 py-10">
                            <Landmark size={48} className="mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No transaction history</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Dynamic Header Section */}
      <div className={`p-10 rounded-[3.5rem] border flex flex-col lg:flex-row justify-between items-center gap-8 ${darkMode ? 'bg-zinc-900/60 border-zinc-800 shadow-2xl shadow-emerald-500/5' : 'bg-white/80 border-white shadow-2xl shadow-zinc-200/50 backdrop-blur-md'}`}>
        <div className="flex items-center gap-6">
          <div className="p-5 rounded-[2rem] shadow-inner border transition-transform hover:scale-105" style={{ backgroundColor: `${themeColor}15`, color: themeColor, borderColor: `${themeColor}30` }}>
            <Globe size={40} className="animate-float" />
          </div>
          <div>
            <h2 className={`text-4xl font-black tracking-tighter ${headingColor}`}>
              {lang === 'bn' ? 'সাপ্লায়ার নেটওয়ার্ক' : 'Global Partners'}
            </h2>
            <p className={`${textColor} font-medium mt-1`}>
              {lang === 'bn' ? 'আপনার সকল সোর্সিং এবং পেমেন্ট এক জায়গায়।' : 'Centralized management for your sourcing ecosystem.'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
            <button 
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              style={{ backgroundColor: themeColor, boxShadow: `0 20px 40px -10px ${themeColor}40` }}
            >
              <Plus size={20} />
              {lang === 'bn' ? 'নতুন পার্টনার যোগ করুন' : 'Onboard Partner'}
            </button>
        </div>
      </div>

      {/* Analytics Mini Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Sourcing Partners', value: stats.total, icon: Users, color: themeColor },
          { label: 'Accounts Payable', value: `৳${stats.totalBalance.toLocaleString()}`, icon: CreditCard, color: '#ef4444' },
          { label: 'Active Contracts', value: stats.activeOnes, icon: ShieldCheck, color: '#10b981' }
        ].map((stat, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border backdrop-blur-md flex items-center gap-6 transition-all hover:translate-y-[-4px] ${cardBg}`}>
            <div className="p-4 rounded-2xl" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>{stat.label}</p>
              <p className={`text-3xl font-black ${headingColor}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filter Hub */}
      <div className={`p-4 rounded-[2.5rem] border flex flex-col lg:flex-row gap-4 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100 shadow-lg'}`}>
        <div className="relative flex-1 group">
          <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-zinc-600 group-focus-within:text-emerald-500' : 'text-zinc-300 group-focus-within:text-emerald-600'}`} size={20} />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder={lang === 'bn' ? 'পার্টনারের নাম বা ইমেইল দিয়ে খুঁজুন...' : 'Search by entity name or digital ID...'} 
            className={`w-full border rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:outline-none transition-all ${darkMode ? 'bg-zinc-800/40 border-zinc-700 text-white placeholder-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-300'}`} 
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative min-w-[180px]">
            <Tag className={`absolute left-5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`} size={18} />
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)} 
              className={`w-full border rounded-2xl pl-14 pr-10 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer ${darkMode ? 'bg-zinc-800/40 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`}
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button 
            onClick={() => setSortBy(sortBy === 'name' ? 'balance' : 'name')}
            className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-950'}`}
          >
            <ArrowUpDown size={16} />
            {sortBy === 'name' ? 'Sort by Name' : 'Sort by Balance'}
          </button>
        </div>
      </div>

      {/* Supplier Grid Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className={`group rounded-[3.5rem] border transition-all hover:translate-y-[-8px] overflow-hidden ${darkMode ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 shadow-2xl shadow-black/50' : 'bg-white border-zinc-100 shadow-2xl shadow-zinc-200/30 hover:shadow-emerald-500/5'}`}>
            <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-6 cursor-pointer" onClick={() => setViewingSupplier(supplier)}>
                    <div className={`w-20 h-20 rounded-[2rem] border-4 flex items-center justify-center transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500 group-hover:border-emerald-500/50 group-hover:text-emerald-500' : 'bg-zinc-50 border-white text-zinc-300 shadow-inner group-hover:bg-emerald-50'}`}>
                      <Building size={36} />
                    </div>
                    <div>
                      <h4 className={`text-2xl font-black tracking-tight ${headingColor}`}>{supplier.name}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border ${darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-600' : 'bg-zinc-100 border-white text-zinc-500'}`}>
                          {supplier.category}
                        </span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleStatus(supplier.id); }}
                            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all border ${supplier.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${supplier.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          {supplier.status}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(supplier)} className={`p-4 rounded-2xl transition-all ${darkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-emerald-500' : 'bg-zinc-50 hover:bg-zinc-100 text-emerald-600'}`}>
                        <Edit3 size={20}/>
                    </button>
                    <button onClick={() => handleSoftDelete(supplier.id)} className={`p-4 rounded-2xl transition-all ${darkMode ? 'bg-zinc-800 hover:bg-rose-500/20 text-rose-500' : 'bg-rose-50 hover:bg-rose-100 text-rose-600'}`}>
                        <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className={`p-8 rounded-[2.5rem] border mb-8 flex justify-between items-center ${innerCardBg} cursor-pointer`} onClick={() => setViewingSupplier(supplier)}>
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>Digital Ledger Reference</p>
                        <p className={`text-xs font-mono font-bold mt-1 ${darkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>{supplier.id}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>Outstanding Dues</p>
                        <p className={`text-3xl font-black text-rose-500 tracking-tighter`}>৳{supplier.balance.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href={`tel:${supplier.contact}`} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-100 hover:bg-zinc-50 shadow-sm'}`}>
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Phone size={18} /></div>
                    <span className={`text-xs font-black ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{supplier.contact}</span>
                  </a>
                  <a href={`mailto:${supplier.email}`} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-100 hover:bg-zinc-50 shadow-sm'}`}>
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Mail size={18} /></div>
                    <span className={`text-xs font-black truncate ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{supplier.email}</span>
                  </a>
                </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="py-40 text-center opacity-30 animate-pulse">
          <Users size={100} className="mx-auto mb-6 text-zinc-700" />
          <p className="font-black uppercase tracking-[0.5em] text-sm">Empty Partner Ecosystem</p>
        </div>
      )}

      {/* Modal: Partner Onboarding / Edit */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className={`border w-full max-w-2xl rounded-[4rem] p-12 animate-scale-in shadow-2xl my-auto ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-3xl"><Plus size={32}/></div>
                <div>
                    <h3 className={`text-3xl font-black tracking-tight ${headingColor}`}>
                        {showEditModal ? (lang === 'bn' ? 'প্রোফাইল সংশোধন' : 'Refine Profile') : (lang === 'bn' ? 'পার্টনার অনবোর্ডিং' : 'Establish Partner')}
                    </h3>
                    <p className={`text-xs font-bold uppercase tracking-widest ${textColor} mt-1`}>Network Expansion Module</p>
                </div>
              </div>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className={`p-4 rounded-2xl transition-all ${darkMode ? 'bg-zinc-900 text-zinc-500 hover:text-white' : 'bg-zinc-50 text-zinc-400 hover:text-zinc-900'}`}><X size={28}/></button>
            </div>

            <form onSubmit={showEditModal ? handleEditSubmit : handleAdd} className="space-y-8">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-3 ${textColor}`}>Corporate Entity Name</label>
                <input required type="text" value={formSupplier.name} onChange={e => setFormSupplier({...formSupplier, name: e.target.value})} placeholder="e.g. Al-Madina Pharma LTD" className={`w-full border rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500 placeholder-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-emerald-600 placeholder-zinc-300'}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-3 ${textColor}`}>Point of Contact (Phone)</label>
                  <input required type="text" value={formSupplier.contact} onChange={e => setFormSupplier({...formSupplier, contact: e.target.value})} className={`w-full border rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-3 ${textColor}`}>Secure Email Access</label>
                  <input required type="email" value={formSupplier.email} onChange={e => setFormSupplier({...formSupplier, email: e.target.value})} className={`w-full border rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-3 ${textColor}`}>Market Sector</label>
                  <div className="relative">
                    <select value={formSupplier.category} onChange={e => setFormSupplier({...formSupplier, category: e.target.value})} className={`w-full border rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all appearance-none ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="Custom">+ Create New Category</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-3 ${textColor}`}>Current Ledger Balance (৳)</label>
                  <input type="number" step="0.01" value={formSupplier.balance} onChange={e => setFormSupplier({...formSupplier, balance: e.target.value})} className={`w-full border rounded-3xl px-8 py-5 text-sm font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                </div>
              </div>

              {formSupplier.category === 'Custom' && (
                <div className="space-y-2 animate-fade-in">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-3 text-emerald-500`}>New Category Name</label>
                  <input required type="text" value={formSupplier.customCategory} onChange={e => setFormSupplier({...formSupplier, customCategory: e.target.value})} placeholder="e.g. Bio-Medical" className={`w-full border-2 rounded-3xl px-8 py-5 text-sm font-bold outline-none border-emerald-500/30 ${darkMode ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-950'}`} />
                </div>
              )}

              <div className="flex gap-6 pt-10">
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className={`flex-1 py-5 font-black uppercase text-xs tracking-widest rounded-[2rem] transition-all ${darkMode ? 'bg-zinc-900 text-zinc-500 hover:text-white' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-600'}`}>Cancel</button>
                <button type="submit" className="flex-1 py-5 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-[2rem] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">
                    {showEditModal ? (lang === 'bn' ? 'আপডেট করুন' : 'Apply Updates') : (lang === 'bn' ? 'যুক্ত করুন' : 'Establish Entity')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Suppliers;
