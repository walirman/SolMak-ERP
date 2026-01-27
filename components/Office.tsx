
import React from 'react';
import { ListChecks, Clock, User, AlertCircle, CheckCircle2, MoreVertical, Plus } from 'lucide-react';
import { OfficeTask, Language } from '../types';

interface OfficeProps {
  t: any;
  tasks: OfficeTask[];
  setTasks: React.Dispatch<React.SetStateAction<OfficeTask[]>>;
  themeColor: string;
  darkMode: boolean;
  lang: Language;
}

const Office: React.FC<OfficeProps> = ({ t, tasks, themeColor, darkMode, lang }) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
          <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
          {t.modules.OFFICE}
        </h2>
        <button className="text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all" style={{ backgroundColor: themeColor }}>
          <Plus size={18} className="inline mr-2" /> {lang === 'bn' ? 'নতুন টাস্ক' : 'New Task'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className={`text-xl font-black uppercase tracking-widest flex items-center gap-3 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <Clock size={20} /> {lang === 'bn' ? 'চলমান কার্যক্রম' : 'Ongoing Tasks'}
          </h3>
          <div className="space-y-4">
            {tasks.filter(tk => tk.status !== 'Done').map(tk => (
              <div key={tk.id} className={`p-6 rounded-[2.5rem] border transition-all hover:border-emerald-500/30 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-lg'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                    tk.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>{tk.priority} Priority</span>
                  <p className="text-[10px] font-mono font-black text-zinc-500">{tk.deadline}</p>
                </div>
                <h4 className={`text-lg font-black leading-snug ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{tk.task}</h4>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-800/30">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${tk.assignedTo}/32/32`} />
                  </div>
                  <p className="text-xs font-bold text-zinc-500">{tk.assignedTo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className={`text-xl font-black uppercase tracking-widest flex items-center gap-3 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <CheckCircle2 size={20} /> {lang === 'bn' ? 'সম্পন্ন টাস্ক' : 'Completed'}
          </h3>
          <div className="space-y-4 opacity-60">
            {tasks.filter(tk => tk.status === 'Done').map(tk => (
              <div key={tk.id} className={`p-6 rounded-[2.5rem] border grayscale ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'}`}>
                <h4 className="text-sm font-black line-through text-zinc-500">{tk.task}</h4>
                <p className="text-[9px] font-black uppercase mt-2 text-emerald-500">Verified by Admin</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Office;
