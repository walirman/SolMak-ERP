
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Activity, Sparkles, Bot, ArrowRight, Zap, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface DashboardProps {
  t: any;
  transactions: any[];
  inventory: any[];
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ t, transactions, inventory, darkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const balance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalStock = inventory.reduce((acc, curr) => acc + curr.stock, 0);
  
  // Slider Content Data
  const slides = [
    {
      title: "Welcome Back, Chief!",
      subtitle: "Your organization's revenue is up 12% this week. Keep up the momentum!",
      icon: Bot,
      color: "#10b981",
      badge: "Performance"
    },
    {
      title: "AI Inventory Insight",
      subtitle: "5 Pharma items are running low. We recommend restock within 48 hours.",
      icon: Zap,
      color: "#f59e0b",
      badge: "AI Alert"
    },
    {
      title: "Monthly Goal Tracker",
      subtitle: "You've reached 85% of your sales target. Just a little more effort to hit 100%!",
      icon: Target,
      color: "#3b82f6",
      badge: "Milestone"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 + (balance > 10000 ? 500 : 0) },
  ];

  const barData = [
    { name: t.dashboard.sales, value: transactions.filter(tx => tx.type === 'credit').length * 10, color: '#059669' },
    { name: t.dashboard.support, value: 300, color: '#10b981' },
    { name: t.dashboard.ops, value: totalStock, color: '#34d399' },
    { name: t.dashboard.it, value: 278, color: '#6ee7b7' },
  ];

  const StatCard: React.FC<{ title: string; value: string; trend: number; icon: React.ElementType }> = ({ title, value, trend, icon: Icon }) => {
    const isPositive = trend > 0;
    return (
      <div className={`border p-6 rounded-3xl hover-lift shadow-sm transition-all duration-300 ${darkMode ? 'bg-zinc-900 border-zinc-800 hover:shadow-emerald-900/10' : 'bg-white border-zinc-200 hover:shadow-zinc-200/50'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Icon className="text-emerald-500" size={24} />
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        </div>
        <h3 className={`text-sm font-medium tracking-wide ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{title}</h3>
        <p className={`text-3xl font-bold mt-1 tracking-tight ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{value}</p>
      </div>
    );
  };

  const activeSlide = slides[currentSlide];
  const IconComponent = activeSlide.icon;

  return (
    <div className="space-y-6">
      {/* Dynamic Animated Insights Slider */}
      <div className={`relative w-full h-56 rounded-[3rem] overflow-hidden border transition-all duration-700 ${darkMode ? 'bg-zinc-900/40 border-emerald-500/20 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.15)]' : 'bg-white border-zinc-100 shadow-xl shadow-zinc-200/50'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"></div>
        
        <div className="relative h-full px-8 md:px-12 flex items-center justify-between">
          <div className="flex-1 space-y-4 animate-fade-in" key={currentSlide}>
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${darkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>
              <Sparkles size={12} className="mr-2 animate-pulse" />
              {activeSlide.badge}
            </div>
            <div className="space-y-1">
              <h1 className={`text-3xl md:text-4xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
                {activeSlide.title}
              </h1>
              <p className={`text-sm md:text-base font-medium max-w-lg ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {activeSlide.subtitle}
              </p>
            </div>
            <button className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:gap-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Explore Insight <ArrowRight size={14} />
            </button>
          </div>

          {/* Animated Character / Icon Container */}
          <div className="hidden md:flex relative items-center justify-center w-48 h-48">
            <div className={`absolute inset-0 rounded-full animate-pulse opacity-20`} style={{ backgroundColor: activeSlide.color }}></div>
            <div className={`absolute inset-4 rounded-full border-2 border-dashed opacity-10 animate-spin-slow`} style={{ borderColor: activeSlide.color }}></div>
            <div className="relative z-10 animate-float" key={`icon-${currentSlide}`}>
              <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-800 shadow-2xl border border-zinc-100 dark:border-zinc-700">
                <IconComponent size={56} style={{ color: activeSlide.color }} className="drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-12 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-zinc-700/50'}`}
            ></button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t.dashboard.revenue} value={`৳${balance.toLocaleString()}`} trend={12} icon={DollarSign} />
        <StatCard title={t.dashboard.projects} value="12" trend={-4} icon={Activity} />
        <StatCard title={t.inventory.title} value={`${totalStock}`} trend={18} icon={ShoppingBag} />
        <StatCard title={t.dashboard.customers} value="2,450" trend={8} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 border p-8 rounded-3xl h-[400px] shadow-sm ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <h3 className={`text-xl font-bold mb-8 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            {t.dashboard.revenue_overview}
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#27272a" : "#e5e7eb"} vertical={false} />
              <XAxis dataKey="name" stroke={darkMode ? "#52525b" : "#9ca3af"} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis stroke={darkMode ? "#52525b" : "#9ca3af"} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                animationDuration={300}
                formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: darkMode ? '#18181b' : '#ffffff', 
                  border: `1px solid ${darkMode ? '#3f3f46' : '#e5e7eb'}`, 
                  borderRadius: '12px', 
                  padding: '12px' 
                }}
                itemStyle={{ color: darkMode ? '#fff' : '#000', fontSize: '14px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#059669" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`border p-8 rounded-3xl flex flex-col shadow-sm ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <h3 className={`text-xl font-bold mb-8 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            {t.dashboard.perf_dist}
          </h3>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#27272a" : "#e5e7eb"} vertical={false} />
                <XAxis dataKey="name" stroke={darkMode ? "#52525b" : "#9ca3af"} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#18181b' : '#ffffff', 
                    border: `1px solid ${darkMode ? '#3f3f46' : '#e5e7eb'}`, 
                    borderRadius: '12px' 
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
