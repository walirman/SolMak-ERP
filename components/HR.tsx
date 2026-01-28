
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

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

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
  const photoRef = useRef<HTMLInputElement>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (emp.mobile && emp.mobile.includes(searchQuery));
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    if (isEditing && selectedEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === selectedEmployee.id ? { ...formData, id: emp.id } : emp));
    } else {
      const newEmp: Employee = { ...formData, id: `EMP-${Date.now().toString().slice(-4)}` };
      setEmployees(prev => [newEmp, ...prev]);
    }
    setShowAddModal(false);
    setIsEditing(false);
    setFormData(initialFormState);
  };

  const handleGeneratePayroll = () => {
    const activeEmps = employees.filter(e => e.status !== 'Resigned');
    const newRecords: PayrollRecord[] = activeEmps.map(e => ({
      id: `PR-${e.id}-${selectedMonth}`,
      employeeId: e.id,
      employeeName: e.name,
      month: selectedMonth,
      amount: e.salary || 0,
      status: 'Pending',
      paymentMethod: 'Bank'
    }));

    setPayrolls(prev => {
      const filtered = newRecords.filter(nr => !prev.some(p => p.id === nr.id));
      return [...prev, ...filtered];
    });
  };

  const handleDisburseSalary = (pr: PayrollRecord) => {
    if (pr.status === 'Paid') return;
    const tx: Transaction = {
      id: `TX-SAL-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      category: `Salary: ${pr.employeeName} (${pr.month})`,
      amount: -Math.abs(pr.amount),
      type: 'debit',
      status: 'Completed',
      method: pr.paymentMethod
    };
    setTransactions(prev => [tx, ...prev]);
    setPayrolls(prev => prev.map(p => p.id === pr.id ? { ...p, status: 'Paid', date: tx.date } : p));
  };

  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';
  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl';
  const subTextColor = darkMode ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${headingColor}`}>
            <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
            {t.modules.HR}
          </h2>
          <p className={`${subTextColor} font-medium mt-1`}>{lang === 'bn' ? 'স্টাফ ম্যানেজমেন্ট ও স্যালারি পোর্টালে স্বাগতম' : 'Personnel Management & Salary Portal'}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className={`p-1 rounded-2xl border flex ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200 shadow-inner'}`}>
             {['EMPLOYEES', 'PAYROLL', 'HISTORY'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? (darkMode ? 'bg-zinc-800 text-white shadow-xl border border-zinc-700' : 'bg-white text-zinc-900 shadow-md') : 'text-zinc-500 hover:text-zinc-700'}`}
               >
                 {lang === 'bn' ? (tab === 'EMPLOYEES' ? 'স্টাফ' : tab === 'PAYROLL' ? 'বেতন বিতরণ' : 'পুরানো ইতিহাস') : tab}
               </button>
             ))}
          </div>
          {activeTab === 'EMPLOYEES' && (
            <button 
              onClick={() => { setFormData(initialFormState); setIsEditing(false); setShowAddModal(true); }}
              className="text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all" 
              style={{ backgroundColor: themeColor }}
            >
              <UserPlus size={16} className="inline mr-2" /> Add Staff
            </button>
          )}
        </div>
      </div>

      {activeTab === 'EMPLOYEES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
             <div className="md:col-span-6 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={18}/>
                <input type="text" placeholder="Search by name, ID or mobile..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`w-full pl-12 pr-6 py-4 rounded-2xl border outline-none font-bold transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950'}`} />
             </div>
             <div className="md:col-span-3 flex gap-2">
                <div 
                  onClick={() => setStatusFilter('On Leave')}
                  className={`flex-1 p-3 rounded-2xl border flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-105 ${statusFilter === 'On Leave' ? 'bg-amber-500 text-white border-amber-400' : (darkMode ? 'bg-zinc-900 border-zinc-800 text-amber-500' : 'bg-white border-zinc-200 text-amber-600')}`}
                >
                   <Clock size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">On Leave ({employees.filter(e => e.status === 'On Leave').length})</span>
                </div>
                <div 
                  onClick={() => setStatusFilter('Active')}
                  className={`flex-1 p-3 rounded-2xl border flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-105 ${statusFilter === 'Active' ? 'bg-emerald-600 text-white border-emerald-500' : (darkMode ? 'bg-zinc-900 border-zinc-800 text-emerald-500' : 'bg-white border-zinc-200 text-emerald-600')}`}
                >
                   <UserCheck size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                </div>
             </div>
             <div className="md:col-span-3">
               <button onClick={() => setStatusFilter('All')} className={`w-full p-4 rounded-2xl border font-black uppercase text-[10px] tracking-widest transition-all ${statusFilter === 'All' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Show All Directory</button>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredEmployees.map(emp => (
              <div key={emp.id} onClick={() => setSelectedEmployee(emp)} className={`p-5 rounded-[2rem] border transition-all hover:translate-y-[-5px] cursor-pointer group relative overflow-hidden ${cardBg}`}>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-zinc-800 bg-zinc-800 shadow-xl group-hover:scale-110 transition-transform">
                      {emp.photo ? <img src={emp.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={32} /></div>}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 flex items-center justify-center ${darkMode ? 'border-zinc-900 bg-zinc-800' : 'border-white bg-zinc-100'}`}>
                       <div className={`w-2 h-2 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : emp.status === 'On Leave' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-rose-500'}`}></div>
                    </div>
                  </div>
                  <div className="min-w-0 px-2">
                    <h3 className={`font-black text-sm truncate uppercase tracking-tight ${headingColor}`}>{emp.name}</h3>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.15em] mt-1">{emp.role}</p>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase mt-0.5">{emp.department} Dept.</p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-zinc-800/40 space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                      <span className="uppercase">Net Salary</span>
                      <span className={headingColor}>৳{emp.salary?.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                      <span className="uppercase">Status</span>
                      <span className={emp.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}>{emp.status}</span>
                   </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                   <button onClick={(e) => {e.stopPropagation(); setIsEditing(true); setFormData({...emp}); setShowAddModal(true);}} className="p-2 bg-zinc-800 text-zinc-400 rounded-xl hover:text-emerald-500 border border-zinc-700 shadow-lg"><Edit2 size={12}/></button>
                   <button onClick={(e) => {e.stopPropagation(); if(confirm('Delete staff?')) setEmployees(prev => prev.filter(p => p.id !== emp.id));}} className="p-2 bg-zinc-800 text-zinc-400 rounded-xl hover:text-rose-500 border border-zinc-700 shadow-lg"><Trash2 size={12}/></button>
                </div>
              </div>
            ))}
            {filteredEmployees.length === 0 && <div className="col-span-full py-20 text-center opacity-20 uppercase font-black tracking-widest text-xs">No personnel matched search</div>}
          </div>
        </div>
      )}

      {activeTab === 'PAYROLL' && (
        <div className={`border rounded-[3rem] overflow-hidden ${cardBg}`}>
           <div className="p-8 border-b border-zinc-800/30 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-950/20">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl"><Banknote size={32}/></div>
                <div>
                  <h4 className={`text-2xl font-black uppercase tracking-tight ${headingColor}`}>Salary Disbursement</h4>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Active Period: {selectedMonth}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className={`px-4 py-3 rounded-xl border text-xs font-black uppercase ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200'}`} />
                <button onClick={handleGeneratePayroll} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all">Generate Sheet</button>
              </div>
           </div>
           <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className={`text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <tr>
                    <th className="px-10 py-6">Personnel</th>
                    <th className="px-10 py-6 text-center">Base Salary</th>
                    <th className="px-10 py-6 text-center">Settlement Method</th>
                    <th className="px-10 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-right">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                  {payrolls.filter(p => p.month === selectedMonth).length === 0 ? (
                    <tr><td colSpan={5} className="py-24 text-center opacity-30 uppercase font-black text-xs tracking-[0.3em]">Run "Generate Sheet" to start processing</td></tr>
                  ) : (
                    payrolls.filter(p => p.month === selectedMonth).map(pr => (
                      <tr key={pr.id} className={`hover:bg-zinc-800/10 transition-colors ${pr.status === 'Paid' ? 'opacity-60' : ''}`}>
                        <td className="px-10 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-500"><UserIcon size={20}/></div>
                            <div>
                              <p className={`font-black text-sm ${headingColor}`}>{pr.employeeName}</p>
                              <p className="text-[10px] text-zinc-500 font-mono">{pr.employeeId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-5 text-center font-black text-lg">৳{pr.amount.toLocaleString()}</td>
                        <td className="px-10 py-5 text-center">
                          {pr.status === 'Pending' ? (
                            <select 
                              value={pr.paymentMethod}
                              onChange={(e) => setPayrolls(prev => prev.map(item => item.id === pr.id ? {...item, paymentMethod: e.target.value as any} : item))}
                              className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase border outline-none cursor-pointer ${darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200'}`}
                            >
                                <option value="Bank">Bank Transfer</option>
                                <option value="Mobile Banking">MFS / bKash</option>
                                <option value="Cash">Petty Cash</option>
                            </select>
                          ) : (
                            <span className="text-[10px] font-black uppercase text-zinc-500">{pr.paymentMethod}</span>
                          )}
                        </td>
                        <td className="px-10 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border ${pr.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                            {pr.status}
                          </span>
                        </td>
                        <td className="px-10 py-5 text-right">
                          {pr.status === 'Paid' ? (
                            <div className="flex items-center justify-end gap-2 text-emerald-500 font-black text-[10px] uppercase"><CheckCircle size={14}/> Released</div>
                          ) : (
                            <button onClick={() => handleDisburseSalary(pr)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 mx-auto md:ml-auto">
                              <Wallet size={12}/> Disburse
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
           </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className={`border rounded-[3rem] overflow-hidden ${cardBg}`}>
           <div className="p-8 border-b border-zinc-800/30 flex items-center gap-4 bg-zinc-950/20">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20"><History size={24}/></div>
              <div>
                <h4 className={`text-xl font-black uppercase tracking-tight ${headingColor}`}>Payroll Transaction History</h4>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Master logs of all distributed salaries</p>
              </div>
           </div>
           <div className="divide-y divide-zinc-800/30">
              {transactions.filter(tx => tx.category.toLowerCase().includes('salary')).length === 0 ? (
                <div className="py-20 text-center opacity-20 font-black uppercase text-xs">No payroll transactions synchronized</div>
              ) : (
                transactions.filter(tx => tx.category.toLowerCase().includes('salary')).map(tx => (
                  <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-zinc-800/10 transition-colors group">
                     <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-zinc-400'} group-hover:text-emerald-500 transition-colors`}><Landmark size={20}/></div>
                        <div>
                          <p className={`font-black text-sm ${headingColor}`}>{tx.category}</p>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{tx.date} • Reference ID: {tx.id}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black text-rose-500">-৳{Math.abs(tx.amount).toLocaleString()}</p>
                        <p className="text-[9px] font-black text-emerald-500 uppercase flex items-center justify-end gap-1"><CheckCircle size={10}/> Ledger Verified</p>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      )}

      {/* Add / Edit Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className={`border w-full max-w-4xl rounded-[4rem] p-10 md:p-14 my-auto relative animate-scale-in shadow-2xl ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-[2rem] border border-emerald-500/20 shadow-inner"><UserPlus size={32} /></div>
                <div>
                  <h3 className={`text-3xl font-black tracking-tighter ${headingColor}`}>{isEditing ? 'Refine Personnel Data' : 'Staff Onboarding Manifest'}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Personnel Ledger Synchronization</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 text-zinc-500 hover:text-rose-500 transition-colors"><X size={32}/></button>
            </div>

            <form onSubmit={handleSaveEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Full Legal Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Role / Designation</label>
                    <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Base Salary (৳)</label>
                      <input required type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: parseInt(e.target.value) || 0})} className={`w-full border rounded-2xl px-6 py-4 font-black outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Department</label>
                      <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none appearance-none cursor-pointer ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`}>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Contact Number</label>
                    <input required type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+880..." className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none appearance-none cursor-pointer ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950'}`}>
                        <option value="Active">Active Duty</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Resigned">Former Staff</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-3">Photo Upload (Optional)</label>
                    <div onClick={() => photoRef.current?.click()} className={`h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${formData.photo ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-500 shadow-inner'}`}>
                       {formData.photo ? <img src={formData.photo} className="h-full object-contain p-2" /> : <div className="flex flex-col items-center gap-1 text-zinc-500 font-bold uppercase text-[8px] tracking-widest"><Camera size={18}/> Choose Image</div>}
                       <input type="file" ref={photoRef} className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => setFormData({...formData, photo: reader.result as string});
                             reader.readAsDataURL(file);
                          }
                       }} />
                    </div>
                  </div>
               </div>

               <div className="md:col-span-2 pt-10 border-t border-zinc-800/50 flex gap-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className={`flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all ${darkMode ? 'bg-zinc-900 text-zinc-500 hover:text-white' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-600'}`}>Abort Onboarding</button>
                  <button type="submit" className="flex-1 py-5 rounded-[2rem] text-white font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all" style={{ backgroundColor: themeColor }}>{isEditing ? 'Sync Changes' : 'Commit Personnel'}</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Overlay */}
      {selectedEmployee && !showAddModal && (
        <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className={`border w-full max-w-4xl rounded-[4rem] p-10 md:p-14 my-auto shadow-2xl relative ${cardBg}`}>
            <button onClick={() => setSelectedEmployee(null)} className="absolute top-8 right-8 p-3 text-zinc-500 hover:text-rose-500"><X size={32}/></button>
            <div className="flex flex-col md:flex-row gap-12">
               <div className="w-full md:w-1/3 flex flex-col items-center space-y-6">
                  <div className="w-48 h-48 rounded-[3.5rem] overflow-hidden border-4 border-emerald-500/20 shadow-2xl bg-zinc-800">
                    {selectedEmployee.photo ? <img src={selectedEmployee.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={48} /></div>}
                  </div>
                  <div className="text-center">
                    <h3 className={`text-3xl font-black ${headingColor}`}>{selectedEmployee.name}</h3>
                    <p className="text-emerald-500 font-black uppercase text-xs tracking-widest mt-2">{selectedEmployee.role}</p>
                  </div>
                  <div className="w-full p-6 rounded-[2.5rem] bg-zinc-950/40 border border-zinc-800 space-y-3 shadow-inner">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase py-2 border-b border-zinc-800/40"><span className="text-zinc-500">Staff ID</span><span className={headingColor}>{selectedEmployee.id}</span></div>
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase py-2 border-b border-zinc-800/40"><span className="text-zinc-500">Dept</span><span className={headingColor}>{selectedEmployee.department}</span></div>
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase py-2"><span className="text-zinc-500">Salary</span><span className="text-emerald-500 font-black">৳{selectedEmployee.salary?.toLocaleString()}</span></div>
                  </div>
               </div>
               <div className="flex-1 space-y-8">
                  <h4 className={`text-2xl font-black uppercase tracking-tight ${headingColor} flex items-center gap-3`}><History size={24} className="text-emerald-500" /> Payment History</h4>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                     {transactions.filter(t => t.category.includes(selectedEmployee.name)).length === 0 ? (
                       <div className="py-20 text-center opacity-20 uppercase font-black text-[10px] tracking-widest border-2 border-dashed border-zinc-800 rounded-3xl">No payouts found</div>
                     ) : (
                       transactions.filter(t => t.category.includes(selectedEmployee.name)).map(t => (
                         <div key={t.id} className="p-5 rounded-2xl bg-zinc-950/30 border border-zinc-800 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                            <div>
                               <p className={`text-sm font-black ${headingColor}`}>{t.category}</p>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase">{t.date} • {t.id}</p>
                            </div>
                            <p className="font-black text-rose-500">-৳{Math.abs(t.amount).toLocaleString()}</p>
                         </div>
                       ))
                     )}
                  </div>
                  <div className="pt-6 flex gap-4">
                     <button onClick={() => window.print()} className="flex-1 py-4 bg-emerald-600 text-white font-black uppercase text-xs rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"><Printer size={16}/> Print Portfolio</button>
                     <button onClick={() => { setIsEditing(true); setFormData({...selectedEmployee}); setShowAddModal(true); setSelectedEmployee(null); }} className="px-10 py-4 bg-zinc-800 text-zinc-400 font-black uppercase text-xs rounded-2xl hover:text-white transition-all border border-zinc-700"><Edit2 size={16}/></button>
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
