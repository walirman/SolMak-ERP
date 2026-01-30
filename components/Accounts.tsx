
import React, { useState, useMemo } from 'react';
import { 
  Landmark, Wallet, CreditCard, PieChart, ArrowUpRight, ArrowDownLeft, 
  Search, Plus, Receipt, History, HandCoins, MinusCircle, CheckCircle, 
  X, ChevronDown, Filter, Calendar, Banknote, Trash2, Printer, 
  Smartphone, Building2, TrendingUp, TrendingDown, Layers, FileText
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
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ADD_PAYMENT' | 'ALL_PAYMENT' | 'LOANS' | 'EXPENSES'>('OVERVIEW');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [loans, setLoans] = useState<LoanRecord[]>(() => {
    const saved = localStorage.getItem('erp_loans_v4');
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState<DailyExpense[]>(() => {
    const saved = localStorage.getItem('erp_expenses_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const persist = (newLoans?: LoanRecord[], newExpenses?: DailyExpense[]) => {
    if (newLoans) localStorage.setItem('erp_loans_v4', JSON.stringify(newLoans));
    if (newExpenses) localStorage.setItem('erp_expenses_v4', JSON.stringify(newExpenses));
  };

  const [paymentForm, setPaymentForm] = useState({ category: '', amount: '', type: 'credit', method: 'Cash' });
  const [loanForm, setLoanForm] = useState({ person: '', type: 'Taken' as any, amount: '', date: new Date().toISOString().split('T')[0] });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: 'General' });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const tx: Transaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      category: paymentForm.category,
      amount: paymentForm.type === 'credit' ? parseFloat(paymentForm.amount) : -Math.abs(parseFloat(paymentForm.amount)),
      type: paymentForm.type as any,
      status: 'Completed',
      method: paymentForm.method
    };
    setTransactions([tx, ...transactions]);
    setPaymentForm({ category: '', amount: '', type: 'credit', method: 'Cash' });
    setActiveTab('ALL_PAYMENT');
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
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
    persist(updated);
    setShowAddModal(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: DailyExpense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      title: expenseForm.title,
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category
    };
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    persist(undefined, updated);

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
    setExpenseForm({ title: '', amount: '', category: 'General' });
    setShowAddModal(false);
  };

  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';
  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${headingColor}`}>
            <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
            {t.modules.ACCOUNTS}
          </h2>
          <p className="text-zinc-500 font-medium mt-1">{lang === 'bn' ? 'আর্থিক লেনদেন ও লোন ব্যবস্থাপনা' : 'Financial Transactions & Loan Management'}</p>
        </div>
        <div className={`p-1.5 rounded-2xl border flex flex-wrap gap-1 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200 shadow-inner'}`}>
          {[
            { id: 'OVERVIEW', bn: 'সংক্ষিপ্ত' },
            { id: 'ADD_PAYMENT', bn: 'পেমেন্ট যোগ' },
            { id: 'ALL_PAYMENT', bn: 'সব লেনদেন' },
            { id: 'LOANS', bn: 'লোন ম্যানেজমেন্ট' },
            { id: 'EXPENSES', bn: 'ডেইলি খরচ' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? (darkMode ? 'bg-zinc-800 text-white shadow-xl border border-zinc-700' : 'bg-white text-zinc-900 shadow-md') : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              {lang === 'bn' ? tab.bn : tab.id.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Current Assets', value: accounts.filter(a => a.type === 'Asset').reduce((s, a) => s + a.balance, 0), color: '#10b981', icon: Landmark },
             { label: 'Daily Expenses', value: expenses.reduce((s, e) => s + e.amount, 0), color: '#f43f5e', icon: Receipt },
             { label: 'Loans Payable', value: loans.filter(l => l.type === 'Taken').reduce((s, l) => s + (l.amount - l.paidAmount), 0), color: '#f59e0b', icon: HandCoins },
             { label: 'Total Inflow', value: transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0), color: '#3b82f6', icon: TrendingUp },
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

      {activeTab === 'ADD_PAYMENT' && (
        <div className={`p-10 rounded-[3rem] border max-w-2xl mx-auto ${cardBg}`}>
           <h3 className={`text-2xl font-black uppercase tracking-tight mb-10 text-center ${headingColor}`}>Initiate Transaction</h3>
           <form onSubmit={handleAddPayment} className="space-y-8">
              <div className={`flex p-1.5 rounded-2xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                <button type="button" onClick={() => setPaymentForm({...paymentForm, type: 'credit'})} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${paymentForm.type === 'credit' ? 'bg-emerald-600 text-white shadow-2xl' : 'text-zinc-500'}`}>Receive Money (+)</button>
                <button type="button" onClick={() => setPaymentForm({...paymentForm, type: 'debit'})} className={`flex-1 py-4 text-[10px] font-black uppercase rounded-xl transition-all ${paymentForm.type === 'debit' ? 'bg-rose-600 text-white shadow-2xl' : 'text-zinc-500'}`}>Payment Out (-)</button>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Purpose / Category</label>
                <input required type="text" value={paymentForm.category} onChange={e => setPaymentForm({...paymentForm, category: e.target.value})} placeholder="e.g. Sales Collection, Office Rent..." className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Amount (৳)</label>
                  <input required type="number" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-black outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Method</label>
                  <select value={paymentForm.method} onChange={e => setPaymentForm({...paymentForm, method: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`}>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="MFS">bKash / Nagad</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-6 rounded-[2rem] font-black text-lg text-white shadow-2xl transition-all active:scale-95" style={{ backgroundColor: themeColor }}>Record Transaction</button>
           </form>
        </div>
      )}

      {activeTab === 'ALL_PAYMENT' && (
        <div className={`border rounded-[3rem] overflow-hidden ${cardBg}`}>
          <div className="p-8 border-b border-zinc-800/30 flex justify-between items-center">
            <h3 className={`text-xl font-black uppercase tracking-tight ${headingColor}`}>Ledger Master List</h3>
            <button className={`p-3 rounded-xl border transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white' : 'bg-white border-zinc-200 text-zinc-400'}`}><Printer size={20}/></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className={`text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <tr><th className="px-10 py-6">Description</th><th className="px-10 py-6">Method</th><th className="px-10 py-6 text-center">Amount</th><th className="px-10 py-6">Date</th><th className="px-10 py-6 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="px-10 py-5"><p className={`font-black text-sm ${headingColor}`}>{tx.category}</p><p className="text-[10px] font-mono text-zinc-500">{tx.id}</p></td>
                    <td className="px-10 py-5">
                      <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-lg text-[9px] font-black uppercase border border-zinc-700">{tx.method || 'Cash'}</span>
                    </td>
                    <td className={`px-10 py-5 font-black text-lg text-center ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>৳{Math.abs(tx.amount).toLocaleString()}</td>
                    <td className="px-10 py-5 text-zinc-500 text-xs font-bold">{tx.date}</td>
                    <td className="px-10 py-5 text-right"><span className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1"><CheckCircle size={12}/> Success</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'LOANS' && (
        <div className="space-y-6">
           <div className="flex justify-end">
              <button onClick={() => setShowAddModal(true)} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">Establish New Loan</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loans.map(loan => (
                <div key={loan.id} className={`p-8 rounded-[3rem] border relative overflow-hidden group ${cardBg} animate-fade-in`}>
                   <div className="flex justify-between items-start mb-6">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${loan.type === 'Taken' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>{loan.type} Loan</div>
                      <span className={`text-[10px] font-black uppercase ${loan.status === 'Active' ? 'text-emerald-500' : 'text-zinc-500'}`}>{loan.status}</span>
                   </div>
                   <h3 className={`text-2xl font-black ${headingColor}`}>{loan.person}</h3>
                   <div className="mt-8 space-y-4 pt-6 border-t border-zinc-800/40">
                      <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-500">Principal</span><span className={headingColor}>৳{loan.amount.toLocaleString()}</span></div>
                      <div className="flex justify-between text-xs font-bold uppercase"><span className="text-zinc-500">Paid Back</span><span className="text-emerald-500">৳{loan.paidAmount.toLocaleString()}</span></div>
                      <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800"><div className="bg-emerald-500 h-full" style={{ width: `${(loan.paidAmount / loan.amount) * 100}%` }}></div></div>
                      <div className="flex justify-between items-center pt-2">
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Outstanding: ৳{(loan.amount - loan.paidAmount).toLocaleString()}</p>
                         <button className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-[9px] font-black uppercase hover:bg-zinc-700">Payment Logs</button>
                      </div>
                   </div>
                </div>
              ))}
              {loans.length === 0 && <div className="col-span-2 py-32 text-center border-2 border-dashed border-zinc-800 rounded-[4rem] opacity-20"><HandCoins size={64} className="mx-auto mb-4"/><p className="font-black uppercase tracking-widest">No active loan entities</p></div>}
           </div>
        </div>
      )}

      {activeTab === 'EXPENSES' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           <div className="md:col-span-8 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-black uppercase tracking-tight ${headingColor}`}>Daily Expense Logs</h3>
                <button onClick={() => setShowAddModal(true)} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-all"><Plus size={20}/></button>
              </div>
              {expenses.map(exp => (
                <div key={exp.id} className={`p-6 rounded-[2rem] border flex items-center justify-between ${cardBg} hover:border-rose-500/30 transition-all animate-fade-in`}>
                   <div className="flex items-center gap-5">
                      <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl"><MinusCircle size={24}/></div>
                      <div>
                        <p className={`font-black text-xl ${headingColor}`}>{exp.title}</p>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{exp.category} • {exp.date}</p>
                      </div>
                   </div>
                   <p className="text-2xl font-black text-rose-500">৳{exp.amount.toLocaleString()}</p>
                </div>
              ))}
           </div>
           <div className={`md:col-span-4 p-8 rounded-[3rem] border h-fit sticky top-24 ${cardBg}`}>
              <h4 className={`text-xl font-black uppercase tracking-tight mb-6 ${headingColor}`}>Expense Summary</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center"><span className="text-zinc-500 text-xs font-bold uppercase">Today Total</span><span className={`text-lg font-black ${headingColor}`}>৳{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</span></div>
                 <div className="flex justify-between items-center"><span className="text-zinc-500 text-xs font-bold uppercase">Log count</span><span className={`text-lg font-black ${headingColor}`}>{expenses.length}</span></div>
                 <button className="w-full py-4 mt-4 bg-zinc-800 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"><FileText size={14}/> Generate Report</button>
              </div>
           </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in">
          <div className={`border w-full max-w-md rounded-[3rem] p-12 animate-scale-in my-auto ${cardBg}`}>
             <div className="flex justify-between items-center mb-8">
                <h3 className={`text-2xl font-black tracking-tight uppercase ${headingColor}`}>
                   {activeTab === 'LOANS' ? 'Establish Loan' : 'Log Daily Expense'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-zinc-500 hover:text-white"><X size={32}/></button>
             </div>

             {activeTab === 'LOANS' ? (
                <form onSubmit={handleAddLoan} className="space-y-6">
                   <input required type="text" value={loanForm.person} onChange={e => setLoanForm({...loanForm, person: e.target.value})} placeholder="Borrower / Lender Name" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                   <div className={`flex p-1 rounded-2xl border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                      <button type="button" onClick={() => setLoanForm({...loanForm, type: 'Taken'})} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${loanForm.type === 'Taken' ? 'bg-rose-600 text-white' : 'text-zinc-500'}`}>Taken (দেনা)</button>
                      <button type="button" onClick={() => setLoanForm({...loanForm, type: 'Given'})} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${loanForm.type === 'Given' ? 'bg-emerald-600 text-white' : 'text-zinc-500'}`}>Given (পাওনা)</button>
                   </div>
                   <input required type="number" value={loanForm.amount} onChange={e => setLoanForm({...loanForm, amount: e.target.value})} placeholder="Principal Amount (৳)" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                   <input type="date" value={loanForm.date} onChange={e => setLoanForm({...loanForm, date: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                   <button type="submit" className="w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all active:scale-95" style={{ backgroundColor: themeColor }}>Create Record</button>
                </form>
             ) : (
                <form onSubmit={handleAddExpense} className="space-y-6">
                   <input required type="text" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} placeholder="Purpose of Expense" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                   <input required type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} placeholder="Amount (৳)" className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                   <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`}>
                      <option value="General">General</option>
                      <option value="Food">Food / Beverage</option>
                      <option value="Utility">Utility Bills</option>
                      <option value="Travel">Staff Travel</option>
                   </select>
                   <button type="submit" className="w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all active:scale-95 bg-rose-600">Sync to Ledger</button>
                </form>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
