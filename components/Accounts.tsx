
import React from 'react';
import { Landmark, Wallet, CreditCard, PieChart, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { AccountRecord, Language } from '../types';

interface AccountsProps {
  t: any;
  accounts: AccountRecord[];
  setAccounts: React.Dispatch<React.SetStateAction<AccountRecord[]>>;
  themeColor: string;
  darkMode: boolean;
  lang: Language;
}

const Accounts: React.FC<AccountsProps> = ({ t, accounts, themeColor, darkMode, lang }) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
          <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
          {t.modules.ACCOUNTS}
        </h2>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl border text-emerald-500 font-black flex items-center gap-3 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
            <Landmark size={20} />
            <span className="text-sm">Current Ratio: 2.1</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Asset', 'Liability', 'Revenue', 'Expense'].map(type => {
          const total = accounts.filter(a => a.type === type).reduce((acc, curr) => acc + curr.balance, 0);
          return (
            <div key={type} className={`p-8 rounded-[2.5rem] border shadow-lg ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{type} Total</p>
              <p className={`text-2xl font-black mt-1 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>৳{total.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <div className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-2xl'}`}>
        <h3 className={`text-xl font-black uppercase tracking-tight mb-8 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>Chart of Accounts</h3>
        <div className="space-y-4">
          {accounts.map(acc => (
            <div key={acc.id} className={`flex items-center justify-between p-6 rounded-[2rem] border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'} transition-all`}>
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-zinc-900 text-zinc-500' : 'bg-white text-zinc-400 border border-zinc-100'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{acc.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{acc.type} • {acc.id}</p>
                </div>
              </div>
              <p className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>৳{acc.balance.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
