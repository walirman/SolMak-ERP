
import React, { useState } from 'react';
import { UserPlus, Shield, Trash2, Mail, Key, UserCheck, X, CheckSquare, Square } from 'lucide-react';
import { UserRecord, ModuleType, Language } from '../types';

interface AdminProps {
  t: any;
  users: UserRecord[];
  setUsers: (users: UserRecord[]) => void;
  themeColor: string;
  lang: Language;
  darkMode: boolean;
}

const ALL_MODULES: ModuleType[] = [
  'DASHBOARD', 'FINANCE', 'INVENTORY', 'SUPPLIERS', 'SALES', 
  'OFFICE', 'HR', 'REPORTS', 'SETTINGS', 'LEGAL', 
  'CATEGORIES', 'COMMUNICATION', 'SUPPORT_AI', 'ACCOUNTS', 'PURCHASE', 'ADMIN'
];

const Admin: React.FC<AdminProps> = ({ t, users, setUsers, themeColor, lang, darkMode }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserRecord>>({
    name: '', email: '', role: 'USER', permissions: ['DASHBOARD', 'COMMUNICATION']
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user: UserRecord = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      permissions: newUser.permissions as ModuleType[],
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/128/128`
    };

    setUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'USER', permissions: ['DASHBOARD', 'COMMUNICATION'] });
  };

  const togglePermission = (mod: ModuleType) => {
    const current = newUser.permissions || [];
    if (current.includes(mod)) {
      setNewUser({ ...newUser, permissions: current.filter(m => m !== mod) });
    } else {
      setNewUser({ ...newUser, permissions: [...current, mod] });
    }
  };

  const deleteUser = (id: string) => {
    if (confirm(t.admin.delete_confirm)) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
            <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
            {t.admin.title}
          </h2>
          <p className="text-zinc-500 mt-2 font-medium">{t.admin.subtitle}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl"
          style={{ backgroundColor: themeColor }}
        >
          <UserPlus size={18} />
          {t.admin.add_user}
        </button>
      </div>

      <div className={`border rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <div key={user.id} className={`border rounded-[2rem] p-6 transition-all group ${darkMode ? 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-[1.5rem] border-2 overflow-hidden shadow-lg ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
                    <img src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/64/64`} className="w-full h-full object-cover" />
                  </div>
                  {user.role !== 'SUPER_ADMIN' && (
                    <button onClick={() => deleteUser(user.id)} className={`p-3 rounded-xl transition-all ${darkMode ? 'text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10' : 'text-zinc-300 hover:text-rose-600 hover:bg-rose-50'}`}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className={`text-xl font-black truncate ${darkMode ? 'text-white' : 'text-zinc-950'}`}>{user.name}</h4>
                  <div className={`flex items-center gap-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    <Mail size={12} />
                    <span className="text-xs truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${user.role === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {user.role}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${darkMode ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                      {user.permissions.length} {lang === 'bn' ? 'মডিউল' : 'Modules'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className={`border w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="flex justify-between items-center mb-10">
              <h3 className={`text-3xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-zinc-950'}`}>
                <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
                {t.admin.add_user}
              </h3>
              <button onClick={() => setShowAddModal(false)} className={`p-3 transition-colors ${darkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}><X size={24} /></button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Full Name</label>
                  <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-emerald-600'}`} />
                </div>
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Email Address</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-emerald-600'}`} />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Designation / Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none appearance-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`}>
                  <option value="USER">Standard User (Staff)</option>
                  <option value="ADMIN">Manager / Admin</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.admin.permissions}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ALL_MODULES.map(mod => {
                    const isSelected = newUser.permissions?.includes(mod);
                    return (
                      <button 
                        key={mod}
                        type="button"
                        onClick={() => togglePermission(mod)}
                        className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all ${isSelected ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : (darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:border-zinc-200')}`}
                      >
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.modules[mod] || mod.replace('_', ' ')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="w-full py-6 rounded-[2rem] font-black text-xl text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 mt-4" style={{ backgroundColor: themeColor }}>
                {t.admin.save_user}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
