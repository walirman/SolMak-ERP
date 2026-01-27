
import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, FileText, Calendar, Filter, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface ReportsProps {
  t: any;
  sales: any[];
  transactions: any[];
  inventory: any[];
  darkMode: boolean;
  themeColor: string;
}

const Reports: React.FC<ReportsProps> = ({ t, sales, transactions, inventory, darkMode, themeColor }) => {
  const chartData = [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 67000 },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
            <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
            {t.modules.REPORTS}
          </h2>
          <p className="text-zinc-500 mt-2 font-medium">Enterprise Intelligence & Data Analysis Portal</p>
        </div>
        <div className="flex gap-3">
          <button className={`flex items-center gap-2 px-6 py-4 rounded-2xl border font-black uppercase tracking-widest text-[10px] transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900'}`}>
            <Download size={16} /> Export CSV
          </button>
          <button className="text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all flex items-center gap-2" style={{ backgroundColor: themeColor }}>
            <FileText size={16} /> Generate PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 p-10 rounded-[3.5rem] border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-2xl'}`}>
          <h3 className={`text-xl font-black uppercase tracking-tight mb-10 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
            <TrendingUp className="text-emerald-500" /> Revenue Growth (H1 2024)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#eee"} vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', background: darkMode ? '#18181b' : '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke={themeColor} fillOpacity={1} fill="url(#reportGradient)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`p-8 rounded-[3rem] border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mb-6"><Zap size={24} /></div>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Efficiency Index</p>
            <p className={`text-4xl font-black mt-2 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>84%</p>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-4 overflow-hidden">
               <div className="bg-emerald-500 h-full" style={{ width: '84%' }}></div>
            </div>
          </div>
          
          <div className={`p-8 rounded-[3rem] border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl w-fit mb-6"><BarChart3 size={24} /></div>
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Inventory Turnover</p>
            <p className={`text-4xl font-black mt-2 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>4.2x</p>
            <p className="text-[9px] text-zinc-500 font-bold uppercase mt-2">Target: 5.0x per quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
