
import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Banknote, Plus, X, 
  Filter, Calendar, Trash2, FileText, Table as TableIcon, Sparkles, Loader2, RefreshCw
} from 'lucide-react';
import { Transaction } from '../types';

interface FinanceProps {
  t: any;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  themeColor: string;
  darkMode: boolean;
}

const Finance: React.FC<FinanceProps> = ({ t, transactions, setTransactions, themeColor, darkMode }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [newTx, setNewTx] = useState({ category: '', amount: '', type: 'credit' });
  
  const today = new Date().toISOString().split('T')[0];
  const [dateFrom, setDateFrom] = useState(`${new Date().getFullYear()}-01-01`);
  const [dateTo, setDateTo] = useState(today);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => !tx.isPendingDeletion && tx.date >= dateFrom && tx.date <= dateTo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const inc = filteredTransactions.filter(t => t.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
    const exp = filteredTransactions.filter(t => t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0);
    return { balance: inc + exp, income: inc, expenses: exp };
  }, [filteredTransactions]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.category || !newTx.amount) return;
    const tx: Transaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      category: newTx.category,
      amount: newTx.type === 'credit' ? parseFloat(newTx.amount) : -Math.abs(parseFloat(newTx.amount)),
      type: newTx.type as 'credit' | 'debit',
      status: t.finance.completed
    };
    setTransactions(prev => [tx, ...prev]);
    setNewTx({ category: '', amount: '', type: 'credit' });
    setShowAddModal(false);
  };

  const handleSoftDelete = (id: string) => {
    const confirmMsg = t.lang === 'bn' 
      ? 'লেনদেনটি ডিলিট করার অনুরোধ পাঠাতে চান? সুপার এডমিনের অনুমোদনের জন্য পেন্ডিং থাকবে।' 
      : 'Send transaction deletion request? Pending Super Admin approval.';
    if(confirm(confirmMsg)) {
        setTransactions(prev => prev.map(tx => 
          tx.id === id ? { ...tx, isPendingDeletion: true } : tx
        ));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
          <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
          {t.modules.FINANCE}
        </h2>
        <div className="flex gap-3">
          <button onClick={() => setShowFilter(!showFilter)} className={`p-4 border rounded-2xl transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white' : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900'}`}><Filter size={20} /></button>
          <button onClick={() => setShowAddModal(true)} className="text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95" style={{ backgroundColor: themeColor }}>Entry</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`border p-6 rounded-[2rem] shadow-sm ${darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.finance.balance}</span>
          <p className={`text-3xl font-black mt-2 tabular-nums ${darkMode ? 'text-white' : 'text-zinc-950'}`}>৳{stats.balance.toLocaleString()}</p>
        </div>
        <div className={`border p-6 rounded-[2rem] shadow-sm ${darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.finance.income}</span>
          <p className={`text-3xl font-black mt-2 tabular-nums ${darkMode ? 'text-white' : 'text-zinc-950'}`}>৳{stats.income.toLocaleString()}</p>
        </div>
        <div className={`border p-6 rounded-[2rem] shadow-sm ${darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.finance.expense}</span>
          <p className={`text-3xl font-black mt-2 tabular-nums ${darkMode ? 'text-white' : 'text-zinc-950'}`}>৳{Math.abs(stats.expenses).toLocaleString()}</p>
        </div>
      </div>

      {showFilter && (
        <div className={`p-6 rounded-[2rem] border animate-scale-in flex flex-col md:flex-row gap-6 items-end ${darkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex-1 space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Date From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm font-bold outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
          </div>
          <div className="flex-1 space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Date To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-sm font-bold outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
          </div>
          <button onClick={() => { setDateFrom(`${new Date().getFullYear()}-01-01`); setDateTo(today); }} className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'text-zinc-500 hover:text-white border-zinc-800' : 'text-zinc-400 hover:text-zinc-900 border-zinc-200'}`}><RefreshCw size={20}/></button>
        </div>
      )}

      <div className={`border rounded-[3rem] overflow-hidden shadow-2xl ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="p-10 space-y-4">
          {filteredTransactions.map((tx, idx) => (
            <div 
              key={tx.id} 
              style={{ animationDelay: `${idx * 50}ms` }}
              className={`animate-fade-in flex items-center justify-between p-6 rounded-[2rem] border transition-all group ${darkMode ? 'bg-zinc-950/40 border-zinc-800/50 hover:border-zinc-700' : 'bg-zinc-50/50 border-zinc-100 hover:border-zinc-200'}`}
            >
              <div className="flex items-center space-x-6">
                <div className={`p-5 rounded-2xl ${tx.type === 'credit' ? 'bg-emerald-500/5 text-emerald-500' : 'bg-rose-500/5 text-rose-500'}`}>
                  {tx.type === 'credit' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                </div>
                <div>
                  <p className={`font-black text-xl ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{tx.category}</p>
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>{tx.date} • {tx.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`text-2xl font-black ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>৳{Math.abs(tx.amount).toLocaleString()}</p>
                  <p className={`text-[9px] font-black uppercase mt-1 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{tx.status}</p>
                </div>
                <button onClick={() => handleSoftDelete(tx.id)} className={`p-3 rounded-xl transition-all ${darkMode ? 'text-zinc-600 hover:text-rose-500' : 'text-zinc-400 hover:text-rose-600'}`}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 opacity-30">
               <Banknote size={48} className={darkMode ? 'text-zinc-700' : 'text-zinc-300'} />
               <p className={`font-black uppercase tracking-widest text-xs ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>No transaction history found</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          <div className={`border rounded-[3rem] w-full max-w-md p-10 shadow-2xl ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="flex justify-between items-center mb-10">
              <h3 className={`text-3xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Record Entry</h3>
              <button onClick={() => setShowAddModal(false)} className={`p-3 transition-colors ${darkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-8">
              <div className={`flex p-2 rounded-2xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                <button type="button" onClick={() => setNewTx({...newTx, type: 'credit'})} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${newTx.type === 'credit' ? 'bg-emerald-600 text-white shadow-lg' : (darkMode ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600')}`}>Asset (+)</button>
                <button type="button" onClick={() => setNewTx({...newTx, type: 'debit'})} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${newTx.type === 'debit' ? 'bg-rose-600 text-white shadow-lg' : (darkMode ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600')}`}>Liability (-)</button>
              </div>
              <input required type="text" value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})} placeholder="Reference" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400'}`} />
              <input required type="number" step="0.01" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} placeholder="Amount (৳)" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400'}`} />
              <button type="submit" className="w-full py-6 rounded-[2rem] font-black text-xl text-white shadow-xl active:scale-95 transition-all" style={{ backgroundColor: themeColor }}>Sync to Ledger</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
