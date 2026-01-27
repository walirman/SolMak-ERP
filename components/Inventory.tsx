
import React, { useState, useMemo } from 'react';
import { Package, Plus, Filter, Trash2, Search, X, Tag, DollarSign, BarChart, LayoutGrid, Clock } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryProps {
  t: any;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  themeColor: string;
  darkMode: boolean;
}

const CATEGORIES = ['Pharma', 'Non-Pharma', 'Surgical', 'General', 'Electronics', 'Supplies'];

const Inventory: React.FC<InventoryProps> = ({ t, inventory, setInventory, themeColor, darkMode }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [newItem, setNewItem] = useState({ 
    name: '', 
    sku: '', 
    category: 'General', 
    stock: '', 
    purchasePrice: '', 
    mrp: '' 
  });

  const filtered = useMemo(() => {
    return inventory.filter(item => {
      if (item.isPendingDeletion) return false;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, search, categoryFilter]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.sku) return;
    
    const item: InventoryItem = {
      id: `ITEM-${Date.now().toString().slice(-6)}`,
      name: newItem.name,
      sku: newItem.sku,
      category: newItem.category,
      stock: parseInt(newItem.stock) || 0,
      purchasePrice: parseFloat(newItem.purchasePrice) || 0,
      mrp: parseFloat(newItem.mrp) || 0,
      price: parseFloat(newItem.mrp) || 0,
      lastUpdated: new Date().toISOString()
    };
    
    setInventory(prev => [...prev, item]);
    setNewItem({ name: '', sku: '', category: 'General', stock: '', purchasePrice: '', mrp: '' });
    setShowAddModal(false);
  };

  const handleSoftDelete = (id: string) => {
    const confirmMsg = t.lang === 'bn' 
      ? 'আপনি কি ডিলিট করার অনুরোধ পাঠাতে চান? এটি সুপার এডমিনের অনুমোদনের জন্য পেন্ডিং থাকবে।' 
      : 'Send deletion request? This will be pending Super Admin approval.';
    
    if(confirm(confirmMsg)) {
        setInventory(prev => prev.map(item => 
          item.id === id ? { ...item, isPendingDeletion: true } : item
        ));
    }
  };

  const getStatus = (stock: number) => {
    if (stock <= 0) return t.inventory.status.out_of_stock;
    if (stock < 10) return t.inventory.status.low_stock;
    return t.inventory.status.in_stock;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-3xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{t.inventory.title}</h2>
          <p className="text-zinc-500 text-sm mt-1">{t.inventory.subtitle}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="text-white px-8 py-4 rounded-2xl flex items-center space-x-3 transition-all duration-300 shadow-2xl hover:brightness-110 hover:scale-105 active:scale-95 font-black uppercase tracking-widest text-xs"
          style={{ backgroundColor: themeColor, boxShadow: `0 20px 40px -10px ${themeColor}40` }}
        >
          <Plus size={20} />
          <span>{t.inventory.add_item}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className={`md:col-span-8 border rounded-3xl p-3 flex flex-col md:flex-row items-center gap-3 backdrop-blur-md ${darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/80 border-zinc-200 shadow-sm'}`}>
           <div className="relative flex-1 w-full group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-zinc-500 group-focus-within:text-emerald-500' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} size={20} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.header.search_placeholder}
              className={`w-full border rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none transition-all ${darkMode ? 'bg-zinc-800/40 border-zinc-700 text-white placeholder-zinc-600 focus:border-emerald-500/50' : 'bg-zinc-100 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-emerald-600/30'}`}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group min-w-[180px]">
              <Filter className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} size={18} />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full border rounded-2xl pl-12 pr-10 py-3 text-xs font-black uppercase tracking-widest focus:outline-none transition-all appearance-none cursor-pointer ${darkMode ? 'bg-zinc-800/40 border-zinc-700 text-zinc-300 focus:border-emerald-500/50' : 'bg-zinc-100 border-zinc-200 text-zinc-700 focus:border-emerald-600/30'}`}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className={`md:col-span-4 border rounded-3xl p-5 flex items-center justify-between backdrop-blur-md ${darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/80 border-zinc-200 shadow-sm'}`}>
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20"><LayoutGrid size={20} /></div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>Active Records</p>
                <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{filtered.length}</p>
              </div>
           </div>
        </div>
      </div>

      <div className={`border rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`text-[10px] uppercase font-black tracking-[0.2em] border-b ${darkMode ? 'text-zinc-500 border-zinc-800 bg-zinc-950/40' : 'text-zinc-400 border-zinc-100 bg-zinc-50/50'}`}>
              <tr>
                <th className="px-8 py-6">{t.inventory.table.product}</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">{t.inventory.table.sku}</th>
                <th className="px-8 py-6">{t.inventory.table.stock}</th>
                <th className="px-8 py-6">MRP</th>
                <th className="px-8 py-6">{t.inventory.table.status}</th>
                <th className="px-8 py-6 text-right">{t.inventory.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-zinc-800/50' : 'divide-zinc-100'}`}>
              {filtered.map((item, idx) => {
                const status = getStatus(item.stock);
                return (
                  <tr 
                    key={item.id} 
                    className={`transition-all duration-300 group animate-fade-in ${darkMode ? 'hover:bg-zinc-800/30' : 'hover:bg-zinc-50'}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
                          <Package size={24} />
                        </div>
                        <span className={`font-black text-lg tracking-tight ${darkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-[0.1em] ${darkMode ? 'text-zinc-400 bg-zinc-800/80 border-zinc-700/50' : 'text-zinc-600 bg-zinc-100 border-zinc-200'}`}>{item.category}</span>
                    </td>
                    <td className="px-8 py-5 font-mono text-zinc-500 text-xs">{item.sku}</td>
                    <td className={`px-8 py-5 font-black text-lg ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{item.stock}</td>
                    <td className="px-8 py-5 font-black text-xl text-emerald-400 tracking-tighter">৳{(item.mrp || 0).toFixed(2)}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        status === t.inventory.status.in_stock ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' :
                        status === t.inventory.status.low_stock ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' :
                        'bg-rose-500/5 text-rose-500 border-rose-500/20'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleSoftDelete(item.id)}
                        className={`p-3 rounded-2xl transition-all duration-300 active:scale-90 ${darkMode ? 'text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10' : 'text-zinc-400 hover:text-rose-600 hover:bg-rose-50'}`}
                        title="Delete (Pending Approval)"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-32 text-center flex flex-col items-center justify-center space-y-6">
              <div className={`p-8 rounded-[3rem] border ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-300'}`}>
                <Search size={64} />
              </div>
              <p className="text-xl font-black text-zinc-400 uppercase tracking-widest">No matching assets found</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className={`border rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl animate-scale-in ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="flex justify-between items-center mb-10">
              <h3 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
                <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }}></div>
                {t.inventory.add_item}
              </h3>
              <button onClick={() => setShowAddModal(false)} className={`p-4 rounded-2xl transition-all ${darkMode ? 'text-zinc-500 hover:text-white bg-zinc-900' : 'text-zinc-400 hover:text-zinc-900 bg-zinc-100'}`}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Product Name" className={`w-full border rounded-3xl px-6 py-5 text-sm font-black transition-all ${darkMode ? 'bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-emerald-600'}`} />
                <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className={`w-full border rounded-3xl px-6 py-5 text-sm font-black transition-all appearance-none ${darkMode ? 'bg-zinc-900/50 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`}>{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input required type="text" value={newItem.sku} onChange={e => setNewItem({...newItem, sku: e.target.value})} placeholder="SKU Code" className={`w-full border rounded-3xl px-6 py-5 text-sm font-black transition-all ${darkMode ? 'bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-emerald-600'}`} />
                <input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} placeholder="Opening Stock" className={`w-full border rounded-3xl px-6 py-5 text-sm font-black transition-all ${darkMode ? 'bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-emerald-600'}`} />
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[3rem] border ${darkMode ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-zinc-50/50 border-zinc-200'}`}>
                <input type="number" step="0.01" value={newItem.purchasePrice} onChange={e => setNewItem({...newItem, purchasePrice: e.target.value})} placeholder="Purchase Price (৳)" className={`w-full border rounded-[2rem] px-6 py-5 text-sm font-black transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-emerald-600'}`} />
                <input type="number" step="0.01" value={newItem.mrp} onChange={e => setNewItem({...newItem, mrp: e.target.value})} placeholder="MRP (৳)" className={`w-full border rounded-[2rem] px-6 py-5 text-sm font-black transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-emerald-600'}`} />
              </div>
              <button type="submit" className="w-full py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl text-white" style={{ backgroundColor: themeColor }}>Sync Asset to Ledger</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
