
import React, { useState, useMemo } from 'react';
import { 
  Landmark, Wallet, CreditCard, PieChart, ArrowUpRight, ArrowDownLeft, 
  Search, Plus, Receipt, History, HandCoins, MinusCircle, CheckCircle, 
  X, ChevronDown, Filter, Calendar, Banknote, Trash2, Printer, 
  ArrowRightCircle, Smartphone, Building2, TrendingUp, TrendingDown
} from 'lucide-react';
import { AccountRecord, Language, Transaction, LoanRecord, DailyExpense } from '../types';

interface AccountsProps {
  t: any;
  accounts: AccountRecord[];
  setAccounts: React.Dispatch<React.SetStateAction<AccountRecord[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  themeColor: string;
  darkMode: boolean;
  lang: Language;
}

const Accounts: React.FC<AccountsProps> = ({ t, accounts, setAccounts, transactions, setTransactions, themeColor, darkMode, lang }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PAYMENTS' | 'EXPENSES' | 'LOANS'>('OVERVIEW');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Persisted Local States for this session
  const [loans, setLoans] = useState<LoanRecord[]>(() => {
    const saved = localStorage.getItem('erp_loans_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState<DailyExpense[]>(() => {
    const saved = localStorage.getItem('erp_expenses_v1');
    return saved ? JSON.parse(saved) : [];
  });

  const saveToLocal = (newLoans?: LoanRecord[], newExpenses?: DailyExpense[]) => {
    if (newLoans) localStorage.setItem('erp_loans_v1', JSON.stringify(newLoans));
    if (newExpenses) localStorage.setItem('erp_expenses_v1', JSON.stringify(newExpenses));
  };

  const [paymentForm, setPaymentForm] = useState({ category: '', amount: '', type: 'credit', method: 'Cash' });
  const [loanForm, setLoanForm] = useState({ person: '', type: 'Taken' as const, amount: '', date: new Date().toISOString().split('T')[0] });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: 'General' });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.category || !paymentForm.amount) return;
    const tx: Transaction = {
      id: `TX-PAY-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      category: paymentForm.category,
      amount: paymentForm.type === 'credit' ? parseFloat(paymentForm.amount) : -Math.abs(parseFloat(paymentForm.amount)),
      type: paymentForm.type as 'credit' | 'debit',
      status: 'Completed',
      method: paymentForm.method
    };
    setTransactions([tx, ...transactions]);
    setShowAddModal(false);
    setPaymentForm({ category: '', amount: '', type: 'credit', method: 'Cash' });
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanForm.person || !loanForm.amount) return;
    const newLoan: LoanRecord = {
      id: `LN-${Date.now().toString().slice(-4)}`,
      person: loanForm.person,
      type: loanForm.type,
      amount: parseFloat(loanForm.amount),
      paidAmount: 0,
      date: loanForm.date,
      status: 'Active'
    };
    const updated = [...loans, newLoan];
    setLoans(updated);
    saveToLocal(updated);
    setShowAddModal(false);
    setLoanForm({ person: '', type: 'Taken', amount: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    const newExp: DailyExpense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      title: expenseForm.title,
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category
    };
    const updated = [...expenses, newExp];
    setExpenses(updated);
    saveToLocal(undefined, updated);

    // Sync to main transaction ledger
    const tx: Transaction = {
      id: `TX-EXP-${newExp.id}`,
      date: newExp.date,
      category: `Daily Expense: ${newExp.title}`,
      amount: -Math.abs(newExp.amount),
      type: 'debit',
      status: 'Completed',
      method: 'Cash'
    };
    setTransactions([tx, ...transactions]);
    setShowAddModal(false);
    setExpenseForm({ title: '', amount: '', category: 'General' });
  };

  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';
  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';
  const subTextColor = darkMode ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${headingColor}`}>
            <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
            {t.modules.ACCOUNTS}
          </h2>
          <p className={`${subTextColor} font-medium mt-1`}>{lang === 'bn' ? 'আর্থিক হিসাব ও লোন ব্যবস্থাপনা পোর্টাল' : 'Financial Ledger & Loan Management Portal'}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className={`flex p-1 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200 shadow-inner'}`}>
             {['OVERVIEW', 'PAYMENTS', 'EXPENSES', 'LOANS'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? (darkMode ? 'bg-zinc-800 text-white shadow-xl border border-zinc-700' : 'bg-white text-zinc-900 shadow-md') : 'text-zinc-500 hover:text-zinc-700'}`}
               >
                 {lang === 'bn' ? (tab === 'OVERVIEW' ? 'সংক্ষিপ্ত' : tab === 'PAYMENTS' ? 'পেমেন্ট' : tab === 'EXPENSES' ? 'খরচ' : 'লোন') : tab}
               </button>
             ))}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2" 
            style={{ backgroundColor: themeColor }}
          >
            <Plus size={16} /> {lang === 'bn' ? (activeTab === 'PAYMENTS' ? 'পেমেন্ট যোগ' : activeTab === 'LOANS' ? 'নতুন লোন' : 'নতুন খরচ') : 'Add Entry'}
          </button>
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Asset Balance', value: accounts.filter(a => a.type === 'Asset').reduce((s, a) => s + a.balance, 0), color: '#10b981', icon: Landmark },
             { label: 'Daily Expenses', value: expenses.reduce((s, e) => s + e.amount, 0), color: '#f43f5e', icon: Receipt },
             { label: 'Active Loans', value: loans.filter(l => l.status === 'Active').reduce((s, l) => s + (l.amount - l.paidAmount), 0), color: '#f59e0b', icon: HandCoins },
             { label: 'Total Inflow', value: transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0), color: '#3b82f6', icon: ArrowUpRight },
           ].map((stat, i) => (
             <div key={i} className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}><stat.icon size={24} /></div>
                </div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{stat.label}</p>
                <p className={`text-3xl font-black mt-1 ${headingColor}`}>৳{stat.value.toLocaleString()}</p>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'PAYMENTS' && (
        <div className={`border rounded-[3rem] overflow-hidden ${cardBg}`}>
           <div className="p-8 border-b border-zinc-800/30 flex justify-between items-center">
              <h3 className={`text-xl font-black uppercase tracking-tight ${headingColor}`}>All Payment Ledger</h3>
              <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                <input type="text" placeholder="Filter payments..." className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-bold outline-none border transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
              </div>
           </div>
          <table className="w-full text-left">
            <thead className={`text-[10px] uppercase font-black tracking-widest border-b ${darkMode ? 'text-zinc-600 border-zinc-800 bg-zinc-950/20' : 'text-zinc-400 border-zinc-100 bg-zinc-50'}`}>
              <tr>
                <th className="px-10 py-6">Description / Ref</th>
                <th className="px-10 py-6">Method</th>
                <th className="px-10 py-6 text-center">Amount</th>
                <th className="px-10 py-6">Date</th>
                <th className="px-10 py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center opacity-30 uppercase font-black tracking-widest text-xs">No records found</td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-zinc-800/10 transition-colors animate-fade-in">
                    <td className="px-10 py-5">
                      <p className={`font-black text-sm ${headingColor}`}>{tx.category}</p>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">{tx.id}</p>
                    </td>
                    <td className="px-10 py-5">
                      <div className="flex items-center gap-2">
                        {tx.method === 'Bank' ? <Building2 size={12}/> : tx.method === 'Cash' ? <Wallet size={12}/> : <Smartphone size={12}/>}
                        <span className="text-[10px] font-black uppercase text-zinc-400">{tx.method || 'Cash'}</span>
                      </div>
                    </td>
                    <td className={`px-10 py-5 font-black text-lg text-center ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'credit' ? '+' : '-'}৳{Math.abs(tx.amount).toLocaleString()}
                    </td>
                    <td className="px-10 py-5 text-zinc-500 text-xs font-bold">{tx.date}</td>
                    <td className="px-10 py-5 text-right"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase border border-emerald-500/20">Cleared</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'EXPENSES' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           <div className="md:col-span-8 space-y-4">
              {expenses.length === 0 ? (
                <div className={`p-24 text-center rounded-[3rem] border-2 border-dashed border-zinc-800 opacity-20`}><Receipt size={64} className="mx-auto mb-4" /><p className="font-black uppercase tracking-[0.4em] text-xs">Expense Logs Empty</p></div>
              ) : (
                expenses.map(exp => (
                  <div key={exp.id} className={`p-6 rounded-[2rem] border flex items-center justify-between ${cardBg} hover:border-emerald-500/30 transition-all group animate-fade-in`}>
                     <div className="flex items-center gap-5">
                        <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl group-hover:rotate-12 transition-transform"><MinusCircle size={24}/></div>
                        <div>
                          <p className={`font-black text-xl ${headingColor}`}>{exp.title}</p>
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{exp.category} • {exp.date}</p>
                        </div>
                     </div>
                     <p className="text-2xl font-black text-rose-500">৳{exp.amount.toLocaleString()}</p>
                  </div>
                ))
              )}
           </div>
           <div className={`md:col-span-4 p-8 rounded-[3rem] border h-fit sticky top-24 ${cardBg}`}>
              <h4 className={`text-xl font-black uppercase tracking-tight mb-6 ${headingColor}`}>Expense Analysis</h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-center"><span className="text-zinc-500 text-xs font-bold uppercase">Today Total</span><span className={`text-xl font-black ${headingColor}`}>৳{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</span></div>
                 <div className="flex justify-between items-center"><span className="text-zinc-500 text-xs font-bold uppercase">Logs count</span><span className={`text-xl font-black ${headingColor}`}>{expenses.length}</span></div>
                 <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[45%]" /></div>
                 <button className="w-full py-4 mt-2 bg-zinc-800 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"><Printer size={14}/> Download Expense Sheet</button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'LOANS' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loans.map(loan => (
                <div key={loan.id} className={`p-8 rounded-[3rem] border relative overflow-hidden group ${cardBg} animate-fade-in`}>
                   <div className={`absolute -top-10 -right-10 p-6 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-110`}><HandCoins size={200} /></div>
                   <div className="flex justify-between items-start mb-6">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${loan.type === 'Taken' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                        {loan.type === 'Taken' ? 'Payable (দেনা)' : 'Receivable (পাওনা)'}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${loan.status === 'Active' ? 'text-emerald-500 animate-pulse' : 'text-zinc-500'}`}>{loan.status}</span>
                   </div>
                   <h3 className={`text-2xl font-black ${headingColor}`}>{loan.person}</h3>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Initiated: {loan.date}</p>
                   
                   <div className="mt-8 space-y-4">
                      <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-500">Principal</span><span className={headingColor}>৳{loan.amount.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-500">Paid Back</span><span className="text-emerald-500">৳{loan.paidAmount.toLocaleString()}</span></div>
                      <div className="w-full bg-zinc-950 border border-zinc-800 h-3 rounded-full overflow-hidden shadow-inner">
                         <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(loan.paidAmount / loan.amount) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-zinc-800/40">
                         <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Outstanding</p>
                            <p className={`text-2xl font-black ${headingColor}`}>৳{(loan.amount - loan.paidAmount).toLocaleString()}</p>
                         </div>
                         <button className={`px-6 py-3 bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 active:scale-95 transition-all shadow-lg`}>Manage Settlement</button>
                      </div>
                   </div>
                </div>
              ))}
              {loans.length === 0 && <div className="col-span-2 py-32 text-center border-2 border-dashed border-zinc-800 rounded-[4rem] opacity-20"><HandCoins size={64} className="mx-auto mb-4" /><p className="font-black uppercase tracking-[0.5em] text-xs">No active loan entities</p></div>}
           </div>
        </div>
      )}

      {/* Modern Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className={`border w-full max-w-md rounded-[3.5rem] p-10 md:p-12 animate-scale-in my-auto relative overflow-hidden ${cardBg}`}>
             <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: themeColor }} />
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Plus size={24}/></div>
                  <div>
                    <h3 className={`text-2xl font-black tracking-tight ${headingColor}`}>
                      {activeTab === 'PAYMENTS' ? 'New Payment' : activeTab === 'EXPENSES' ? 'Log Expense' : 'Establish Loan'}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Accounts Manifest v4.0</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"><X size={32}/></button>
             </div>

             {activeTab === 'PAYMENTS' && (
                <form onSubmit={handleAddPayment} className="space-y-8">
                   <div className={`flex p-1.5 rounded-2xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200 shadow-inner'}`}>
                      <button type="button" onClick={() => setPaymentForm({...paymentForm, type: 'credit'})} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${paymentForm.type === 'credit' ? 'bg-emerald-600 text-white shadow-2xl scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}>Receive (+)</button>
                      <button type="button" onClick={() => setPaymentForm({...paymentForm, type: 'debit'})} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${paymentForm.type === 'debit' ? 'bg-rose-600 text-white shadow-2xl scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}>Pay (-)</button>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Description</label>
                      <input required type="text" value={paymentForm.category} onChange={e => setPaymentForm({...paymentForm, category: e.target.value})} placeholder="e.g. Service Fee / Sales Balance" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`} />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Amount (৳)</label>
                        <input required type="number" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-black outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Channel</label>
                        <select value={paymentForm.method} onChange={e => setPaymentForm({...paymentForm, method: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all appearance-none cursor-pointer ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`}>
                            <option value="Cash">Cash Hand</option>
                            <option value="Bank">Bank AC</option>
                            <option value="Mobile Banking">MFS (Nagad/bKash)</option>
                        </select>
                      </div>
                   </div>
                   <button type="submit" className="w-full py-6 rounded-[2rem] font-black text-lg text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3" style={{ backgroundColor: themeColor }}>
                      <CheckCircle size={24}/> Sync to Ledger
                   </button>
                </form>
             )}

             {activeTab === 'EXPENSES' && (
                <form onSubmit={handleAddExpense} className="space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Title of Expense</label>
                      <input required type="text" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} placeholder="e.g. Office Electricity" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`} />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Valuation (৳)</label>
                        <input required type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-black outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Category</label>
                        <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all appearance-none cursor-pointer ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`}>
                            <option value="General">General</option>
                            <option value="Utility">Utilities</option>
                            <option value="Travel">Staff Travel</option>
                            <option value="Marketing">Promo/Ads</option>
                        </select>
                      </div>
                   </div>
                   <button type="submit" className="w-full py-6 rounded-[2rem] font-black text-lg text-white shadow-2xl transition-all active:scale-95 bg-rose-600">
                      <MinusCircle size={24}/> Record Loss
                   </button>
                </form>
             )}

             {activeTab === 'LOANS' && (
                <form onSubmit={handleAddLoan} className="space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Counterparty Name</label>
                      <input required type="text" value={loanForm.person} onChange={e => setLoanForm({...loanForm, person: e.target.value})} placeholder="Borrower / Lender Name" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`} />
                   </div>
                   <div className={`flex p-1.5 rounded-2xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200 shadow-inner'}`}>
                      <button type="button" onClick={() => setLoanForm({...loanForm, type: 'Taken'})} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${loanForm.type === 'Taken' ? 'bg-rose-600 text-white shadow-2xl scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}>Taken (দেনা)</button>
                      <button type="button" onClick={() => setLoanForm({...loanForm, type: 'Given'})} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${loanForm.type === 'Given' ? 'bg-emerald-600 text-white shadow-2xl scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}>Given (পাওনা)</button>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Principal (৳)</label>
                        <input required type="number" value={loanForm.amount} onChange={e => setLoanForm({...loanForm, amount: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-black outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Issue Date</label>
                        <input type="date" value={loanForm.date} onChange={e => setLoanForm({...loanForm, date: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`} />
                      </div>
                   </div>
                   <button type="submit" className="w-full py-6 rounded-[2rem] font-black text-lg text-white shadow-2xl transition-all active:scale-95" style={{ backgroundColor: themeColor }}>
                      <HandCoins size={24}/> Create Loan Record
                   </button>
                </form>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
