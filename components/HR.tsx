
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, UserPlus, Briefcase, Calendar, CheckCircle, Search, 
  Mail, Phone, X, Trash2, UserCircle, ChevronDown, UserCheck, 
  UserMinus, AlertCircle, Clock, Upload, Camera, FileText, 
  CreditCard, Fingerprint, Edit2, User as UserIcon, Download, 
  Banknote, Sparkles, DollarSign, Wallet, ShieldCheck, Printer,
  Smartphone, Building, SearchCheck, Filter, History, Landmark,
  ArrowRightCircle
} from 'lucide-react';
import { Employee, Language, PayrollRecord, Transaction } from '../types';

interface HRProps {
  t: any;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  themeColor: string;
  darkMode: boolean;
  lang: Language;
}

const DEPARTMENTS = ['Sales', 'Finance', 'Ops', 'HR', 'Logistics', 'IT', 'Support', 'Admin', 'Legal', 'Security'];
const STATUSES: ('All' | 'Active' | 'On Leave' | 'Resigned')[] = ['All', 'Active', 'On Leave', 'Resigned'];

const HR: React.FC<HRProps> = ({ t, employees, setEmployees, transactions, setTransactions, themeColor, darkMode, lang }) => {
  const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'PAYROLL' | 'HISTORY'>('EMPLOYEES');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Resigned'>('All');
  
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('erp_payrolls_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    localStorage.setItem('erp_payrolls_v4', JSON.stringify(payrolls));
  }, [payrolls]);

  const initialFormState = {
    name: '',
    role: '',
    department: 'Sales',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active' as const,
    fathersName: '',
    mothersName: '',
    gender: 'Male' as const,
    dob: '',
    identityNumber: '',
    mobile: '',
    email: '',
    salary: 0,
    photo: '',
    signature: '',
    cv: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';
  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${headingColor}`}>
            <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
            {t.modules.HR}
          </h2>
          <p className="text-zinc-500 font-medium mt-1">{lang === 'bn' ? 'স্টাফ ম্যানেজমেন্ট ও বেতন পোর্টাল' : 'Workforce & Salary Portal'}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className={`p-1 rounded-2xl border flex ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
             {['EMPLOYEES', 'PAYROLL', 'HISTORY'].map(tab => (
               <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? (darkMode ? 'bg-zinc-800 text-white shadow-xl' : 'bg-white text-zinc-900 shadow-md') : 'text-zinc-500 hover:text-zinc-700'}`}>
                 {lang === 'bn' ? (tab === 'EMPLOYEES' ? 'স্টাফ' : tab === 'PAYROLL' ? 'বেতন' : 'পুরানো রেকর্ড') : tab}
               </button>
             ))}
          </div>
          <button 
            onClick={() => { setFormData(initialFormState); setShowAddModal(true); }}
            className="text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all" 
            style={{ backgroundColor: themeColor }}
          >
            Add New Staff
          </button>
        </div>
      </div>

      {activeTab === 'EMPLOYEES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
             <div className="md:col-span-8 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input type="text" placeholder="Search by name, ID or mobile..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`w-full pl-12 pr-6 py-4 rounded-2xl border outline-none font-bold transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950'}`} />
             </div>
             <div className="md:col-span-4 flex gap-2">
                <button onClick={() => setStatusFilter('Active')} className={`flex-1 rounded-2xl border font-black uppercase text-[10px] tracking-widest transition-all ${statusFilter === 'Active' ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'text-zinc-500'}`}>Active</button>
                <button onClick={() => setStatusFilter('On Leave')} className={`flex-1 rounded-2xl border font-black uppercase text-[10px] tracking-widest transition-all ${statusFilter === 'On Leave' ? 'bg-amber-500 text-white border-amber-400 shadow-lg' : 'text-zinc-500'}`}>On Leave</button>
                <button onClick={() => setStatusFilter('All')} className={`flex-1 rounded-2xl border font-black uppercase text-[10px] tracking-widest transition-all ${statusFilter === 'All' ? 'bg-zinc-800 text-white border-zinc-700 shadow-lg' : 'text-zinc-500'}`}>All</button>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredEmployees.map((emp, idx) => (
              <div key={emp.id} style={{ animationDelay: `${idx * 40}ms` }} onClick={() => setSelectedEmployee(emp)} className={`p-6 rounded-[2.5rem] border transition-all hover:translate-y-[-5px] cursor-pointer group relative overflow-hidden animate-fade-in ${cardBg}`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-zinc-800 bg-zinc-800 group-hover:scale-110 transition-transform">
                      {emp.photo ? <img src={emp.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={24} /></div>}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${darkMode ? 'border-zinc-900 bg-zinc-800' : 'border-white bg-zinc-100'}`}>
                       <div className={`w-full h-full rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : emp.status === 'On Leave' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-black text-sm uppercase truncate ${headingColor}`}>{emp.name}</h3>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">{emp.role}</p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase">{emp.department} Section</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800/40 space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase"><span>Salary</span><span className={headingColor}>৳{emp.salary?.toLocaleString()}</span></div>
                   <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase"><span>Status</span><span className={emp.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}>{emp.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Detail View Modal remains same but with better contrast text */}
      {selectedEmployee && !showAddModal && (
        <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className={`border w-full max-w-4xl rounded-[4rem] p-12 my-auto shadow-2xl relative ${cardBg}`}>
            <button onClick={() => setSelectedEmployee(null)} className="absolute top-8 right-8 p-3 text-zinc-500 hover:text-rose-500 transition-colors"><X size={32}/></button>
            <div className="flex flex-col md:flex-row gap-12">
               <div className="w-full md:w-1/3 flex flex-col items-center space-y-6">
                  <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-4 border-emerald-500/20 shadow-2xl bg-zinc-800">
                    {selectedEmployee.photo ? <img src={selectedEmployee.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={48} /></div>}
                  </div>
                  <div className="text-center">
                    <h3 className={`text-3xl font-black ${headingColor}`}>{selectedEmployee.name}</h3>
                    <p className="text-emerald-500 font-black uppercase text-xs tracking-widest mt-2">{selectedEmployee.role}</p>
                  </div>
               </div>
               <div className="flex-1 space-y-8">
                  <h4 className={`text-2xl font-black uppercase tracking-tight ${headingColor} flex items-center gap-3`}><History size={24} className="text-emerald-500" /> Transaction Logs</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {transactions.filter(t => t.category.includes(selectedEmployee.name)).map(t => (
                       <div key={t.id} className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-800 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                          <div><p className={`text-sm font-black ${headingColor}`}>{t.category}</p><p className="text-[10px] text-zinc-500 font-bold uppercase">{t.date}</p></div>
                          <p className="font-black text-rose-500">৳{Math.abs(t.amount).toLocaleString()}</p>
                       </div>
                     ))}
                     {transactions.filter(t => t.category.includes(selectedEmployee.name)).length === 0 && <div className="p-12 text-center border-2 border-dashed border-zinc-800 rounded-3xl opacity-20 uppercase font-black text-xs tracking-widest">No payout records</div>}
                  </div>
                  <div className="pt-6 flex gap-4">
                     <button className="flex-1 py-4 bg-emerald-600 text-white font-black uppercase text-xs rounded-2xl shadow-xl active:scale-95 transition-all">Print Record</button>
                     <button onClick={() => setSelectedEmployee(null)} className="px-10 py-4 bg-zinc-800 text-zinc-400 font-black uppercase text-xs rounded-2xl hover:text-white transition-all">Close</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;
