
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, UserPlus, Briefcase, Calendar, CheckCircle, Search, 
  Mail, Phone, X, Trash2, UserCircle, ChevronDown, UserCheck, 
  UserMinus, AlertCircle, Clock, Upload, Camera, FileText, 
  CreditCard, Fingerprint, Edit2, User as UserIcon, Download, 
  Banknote, Sparkles, DollarSign, Wallet, ShieldCheck, Printer,
  Smartphone, Building, SearchCheck, Filter
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
const GENDERS = ['Male', 'Female', 'Other'];
const PAYMENT_METHODS: ('Bank' | 'Mobile Banking' | 'Cash')[] = ['Bank', 'Mobile Banking', 'Cash'];

const HR: React.FC<HRProps> = ({ t, employees, setEmployees, transactions, setTransactions, themeColor, darkMode, lang }) => {
  const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'PAYROLL'>('EMPLOYEES');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [payrollSearch, setPayrollSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Resigned'>('All');
  
  // Payroll State
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('erp_payrolls_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    localStorage.setItem('erp_payrolls_v3', JSON.stringify(payrolls));
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
  const signRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (emp.mobile && emp.mobile.includes(searchQuery));
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'signature' | 'cv') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    if (isEditing && selectedEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === selectedEmployee.id ? { ...formData, id: emp.id } : emp));
    } else {
      const newEmp: Employee = {
        ...formData,
        id: `EMP-${Date.now().toString().slice(-4)}`,
      };
      setEmployees(prev => [newEmp, ...prev]);
    }

    setShowAddModal(false);
    setIsEditing(false);
    setFormData(initialFormState);
  };

  const handleEdit = (emp: Employee) => {
    setFormData({
      name: emp.name || '',
      role: emp.role || '',
      department: emp.department || 'Sales',
      joiningDate: emp.joiningDate || '',
      status: emp.status || 'Active',
      fathersName: emp.fathersName || '',
      mothersName: emp.mothersName || '',
      gender: emp.gender || 'Male',
      dob: emp.dob || '',
      identityNumber: emp.identityNumber || '',
      mobile: emp.mobile || '',
      email: emp.email || '',
      salary: emp.salary || 0,
      photo: emp.photo || '',
      signature: emp.signature || '',
      cv: emp.cv || ''
    });
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে আপনি এই কর্মীকে মুছে ফেলতে চান?' : 'Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      if (selectedEmployee?.id === id) setSelectedEmployee(null);
    }
  };

  const handleGeneratePayroll = () => {
    const activeEmps = employees.filter(e => e.status === 'Active');
    const newRecords: PayrollRecord[] = activeEmps.map(e => ({
      id: `PR-${e.id}-${selectedMonth}`,
      employeeId: e.id,
      employeeName: e.name,
      month: selectedMonth,
      amount: e.salary || 0,
      status: 'Pending',
      paymentMethod: 'Cash'
    }));

    setPayrolls(prev => {
      const filtered = newRecords.filter(nr => !prev.some(p => p.id === nr.id));
      return [...prev, ...filtered];
    });
  };

  const handleDisburseSalary = (pr: PayrollRecord) => {
    if (pr.status === 'Paid') return;

    const disbId = `DISB-${selectedMonth.replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const tx: Transaction = {
      id: `TX-SAL-${disbId}`,
      date: new Date().toISOString().split('T')[0],
      category: `Salary: ${pr.employeeName} [${pr.paymentMethod}]`,
      amount: -Math.abs(pr.amount),
      type: 'debit',
      status: 'Completed'
    };
    setTransactions(prev => [tx, ...prev]);

    setPayrolls(prev => prev.map(p => p.id === pr.id ? { 
      ...p, 
      status: 'Paid', 
      date: tx.date,
      disbursementId: disbId
    } : p));
  };

  const handleUpdatePaymentMethod = (id: string, method: any) => {
    setPayrolls(prev => prev.map(p => p.id === id ? { ...p, paymentMethod: method } : p));
  };

  const currentMonthPayrolls = useMemo(() => {
    return payrolls
      .filter(p => p.month === selectedMonth)
      .filter(p => 
        p.employeeName.toLowerCase().includes(payrollSearch.toLowerCase()) ||
        (p.disbursementId && p.disbursementId.toLowerCase().includes(payrollSearch.toLowerCase()))
      );
  }, [payrolls, selectedMonth, payrollSearch]);

  const generateSalaryCertificate = (pr: PayrollRecord) => {
    const emp = employees.find(e => e.id === pr.employeeId);
    if (!emp) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) return;

    const dateStr = new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const amountInWords = pr.amount.toLocaleString() + ' Taka Only';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Salary Certificate - ${emp.name}</title>
        <link href="https://fonts.maateen.me/fn-rojhan-lipika/font.css" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;800&display=swap');
          body { font-family: 'Inter', sans-serif; padding: 0; margin: 0; color: #1f2937; background: #fff; }
          .certificate-wrapper { padding: 40px; background: #fff; min-height: 100vh; }
          .outer-border { border: 20px solid ${themeColor}15; padding: 15px; border-radius: 4px; }
          .inner-border { border: 2px solid ${themeColor}60; padding: 60px; border-radius: 2px; position: relative; }
          .header { text-align: center; margin-bottom: 60px; }
          .brand-logo { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 900; color: ${themeColor}; letter-spacing: -1px; }
          .dept { text-transform: uppercase; font-size: 11px; letter-spacing: 5px; color: #6b7280; font-weight: 800; margin-top: 5px; }
          .cert-title { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 900; margin: 40px 0; text-align: center; border-bottom: 3px double #e5e7eb; padding-bottom: 10px; display: inline-block; width: 100%; }
          .ref-line { display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; margin-bottom: 40px; font-weight: 600; }
          .main-text { font-size: 17px; line-height: 1.8; text-align: justify; margin-bottom: 40px; }
          .data-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; margin: 40px 0; }
          .data-row { background: #f9fafb; }
          .data-row td { padding: 20px; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; font-weight: 800; }
          .value { font-size: 18px; font-weight: 700; color: #111827; }
          .footer { display: flex; justify-content: space-between; margin-top: 80px; align-items: flex-end; }
          .signature-block { text-align: center; width: 220px; }
          .sig-line { border-top: 2px solid #111827; margin-top: 15px; padding-top: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
          .qr-box { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); opacity: 0.8; text-align: center; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 100px; font-weight: 900; color: ${themeColor}; opacity: 0.04; white-space: nowrap; pointer-events: none; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="certificate-wrapper">
          <div class="outer-border">
            <div class="inner-border">
              <div class="watermark">SOLMAK ERP OFFICIAL</div>
              
              <div class="header">
                <div class="brand-logo">SolMak ERP Suite</div>
                <div class="dept">Human Capital Management</div>
              </div>

              <div class="ref-line">
                <span>Ref ID: ${pr.disbursementId || 'SEC-'+pr.id}</span>
                <span>Issued Date: ${dateStr}</span>
              </div>

              <div class="cert-title">Salary Certificate</div>

              <div class="main-text">
                This is to officially certify that <b>${emp.name}</b>, child of <b>${emp.fathersName || 'N/A'}</b>, has been a dedicated member of our team since <b>${emp.joiningDate}</b>. He/She is currently serving in the capacity of <b>${emp.role}</b> within our <b>${emp.department}</b> division. 
                <br><br>
                Based on our payroll disbursement records, the following compensation details were recorded for the month of <b>${pr.month}</b>:
              </div>

              <table class="data-table">
                <tr class="data-row">
                  <td width="50%"><div class="label">Payee Reference</div><div class="value">${emp.id}</div></td>
                  <td width="50%"><div class="label">Disbursement ID</div><div class="value">${pr.disbursementId || 'Pending'}</div></td>
                </tr>
                <tr class="data-row">
                  <td><div class="label">Payment Method</div><div class="value">${pr.paymentMethod}</div></td>
                  <td><div class="label">Net Amount Credited</div><div class="value" style="color: ${themeColor}; font-size: 26px;">৳${pr.amount.toLocaleString()}</div></td>
                </tr>
              </table>

              <div style="font-size: 14px; font-style: italic; color: #4b5563; margin-top: -10px;">
                In Words: ${amountInWords}
              </div>

              <div class="main-text" style="margin-top: 40px; font-size: 15px; color: #4b5563;">
                The conduct and character of the aforementioned employee have been exemplary throughout their tenure. We issue this certificate upon request for official verification purposes.
              </div>

              <div class="qr-box">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${pr.disbursementId || pr.id}" width="90" />
                <div style="font-size: 8px; font-weight: 800; margin-top: 8px; letter-spacing: 2px; color: #9ca3af;">VERIFIED DIGITAL RECORD</div>
              </div>

              <div class="footer">
                <div class="signature-block">
                  <div class="sig-line">Employee Acknowledgement</div>
                </div>
                <div class="signature-block">
                  <img src="${emp.signature || ''}" style="height: 50px; margin-bottom: 5px; opacity: 0.8;" />
                  <div class="sig-line">Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';
  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl';
  const inputClass = `w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500 placeholder-zinc-700' : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-emerald-600 shadow-inner'}`;
  const labelClass = `text-[10px] font-black uppercase tracking-widest ml-3 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${headingColor}`}>
            <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
            {t.modules.HR}
          </h2>
          <p className={`${darkMode ? 'text-zinc-400' : 'text-zinc-500'} font-medium mt-1`}>{lang === 'bn' ? 'জনবল ও বেতন ব্যবস্থাপনা পোর্টাল' : 'Workforce & Payroll Management Portal'}</p>
        </div>
        <div className="flex gap-4">
          <div className={`p-1.5 rounded-2xl border flex ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200 shadow-inner'}`}>
            <button 
              onClick={() => setActiveTab('EMPLOYEES')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'EMPLOYEES' ? (darkMode ? 'bg-zinc-800 text-white shadow-xl border border-zinc-700' : 'bg-white text-zinc-900 shadow-lg') : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              {lang === 'bn' ? 'কর্মচারী তালিকা' : 'Staff'}
            </button>
            <button 
              onClick={() => setActiveTab('PAYROLL')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'PAYROLL' ? (darkMode ? 'bg-zinc-800 text-white shadow-xl border border-zinc-700' : 'bg-white text-zinc-900 shadow-lg') : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              {lang === 'bn' ? 'পে-রোল (বেতন)' : 'Payroll'}
            </button>
          </div>
          {activeTab === 'EMPLOYEES' && (
            <button 
              onClick={() => { setFormData(initialFormState); setIsEditing(false); setShowAddModal(true); }}
              className="text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2" 
              style={{ backgroundColor: themeColor }}
            >
              <UserPlus size={18} /> {lang === 'bn' ? 'নতুন কর্মচারী' : 'Add Employee'}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'EMPLOYEES' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder={lang === 'bn' ? 'নাম, আইডি বা মোবাইল দিয়ে খুঁজুন...' : 'Search by name, ID or mobile...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950 shadow-sm'}`}
              />
            </div>
            <div className="md:col-span-2 relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`w-full border rounded-2xl pl-10 pr-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer ${darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300 focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950'}`}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div 
              onClick={() => setStatusFilter('Active')}
              className={`md:col-span-3 p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'Active' ? 'ring-2 ring-emerald-500' : ''} ${cardBg}`}
            >
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><UserCheck size={18}/></div>
                 <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{lang === 'bn' ? 'সক্রিয়' : 'Active'}</span>
              </div>
              <span className={`text-xl font-black ${headingColor}`}>{employees.filter(e => e.status === 'Active').length}</span>
            </div>
            <div 
              onClick={() => setStatusFilter('On Leave')}
              className={`md:col-span-3 p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'On Leave' ? 'ring-2 ring-amber-500' : ''} ${cardBg}`}
            >
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Clock size={18}/></div>
                 <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{lang === 'bn' ? 'ছুটিতে' : 'On Leave'}</span>
              </div>
              <span className={`text-xl font-black ${headingColor}`}>{employees.filter(e => e.status === 'On Leave').length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(emp => (
              <div 
                key={emp.id} 
                onClick={() => setSelectedEmployee(emp)}
                className={`p-8 rounded-[3rem] border transition-all hover:translate-y-[-5px] cursor-pointer group relative overflow-hidden ${cardBg}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-emerald-500/10 shadow-lg group-hover:scale-105 transition-transform bg-zinc-800">
                      {emp.photo ? (
                        <img src={emp.photo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={32} /></div>
                      )}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 flex items-center justify-center ${darkMode ? 'border-zinc-900 bg-zinc-800' : 'border-white bg-zinc-100'}`}>
                       <div className={`w-2.5 h-2.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500 animate-pulse' : emp.status === 'On Leave' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(emp); }} className={`p-3 rounded-xl border transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-emerald-500' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:text-emerald-600'}`}><Edit2 size={16} /></button>
                    <button onClick={(e) => handleDelete(emp.id, e)} className={`p-3 rounded-xl border transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-rose-500' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:text-rose-600'}`}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className={`text-2xl font-black tracking-tight ${headingColor}`}>{emp.name}</h3>
                  <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">{emp.role}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{emp.department} Section</p>
                </div>
                <div className="mt-8 space-y-3 pt-6 border-t border-zinc-800/30">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <Phone size={14} />
                    <span className="text-[11px] font-black text-zinc-400">{emp.mobile || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <Calendar size={14} />
                      <span className={`text-[11px] font-black ${darkMode ? 'text-white' : 'text-zinc-950'}`}>৳{(emp.salary || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${emp.status === 'On Leave' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                            {emp.status}
                        </span>
                        <ChevronDown size={14} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredEmployees.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-30">
                 <Users size={64} className="mb-4" />
                 <p className="font-black uppercase tracking-widest">No employees found in this criteria.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className={`p-8 rounded-[3rem] border flex flex-col md:flex-row justify-between items-center gap-8 ${cardBg}`}>
            <div className="flex items-center gap-6">
              <div className="p-5 bg-emerald-500/10 text-emerald-500 rounded-[2rem] border border-emerald-500/20 shadow-inner">
                <Banknote size={40} />
              </div>
              <div>
                <h3 className={`text-3xl font-black tracking-tight ${headingColor}`}>Payroll Management</h3>
                <p className={`${darkMode ? 'text-zinc-400' : 'text-zinc-500'} text-sm font-medium mt-1`}>Generate and disburse salaries via Bank, MFS, or Cash.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className={`relative group w-full md:w-64`}>
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500" size={16}/>
                 <input 
                  type="text" 
                  value={payrollSearch}
                  onChange={(e) => setPayrollSearch(e.target.value)}
                  placeholder="Disbursement ID or Staff..."
                  className={`w-full border rounded-2xl pl-10 pr-4 py-3 text-xs font-bold outline-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 focus:border-emerald-600 shadow-inner'}`}
                 />
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
                <input 
                  type="month" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-none text-white font-black uppercase text-xs p-3 outline-none cursor-pointer"
                />
                <button 
                  onClick={handleGeneratePayroll}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
                >
                  Generate {selectedMonth}
                </button>
              </div>
            </div>
          </div>

          <div className={`border rounded-[3rem] overflow-hidden ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <table className="w-full text-left">
              <thead className={`text-[10px] uppercase font-black tracking-[0.2em] border-b ${darkMode ? 'text-zinc-600 border-zinc-800' : 'text-zinc-400 border-zinc-100'}`}>
                <tr>
                  <th className="px-10 py-6">Reference / Staff</th>
                  <th className="px-10 py-6 text-center">Amount</th>
                  <th className="px-10 py-6 text-center">Payment Method</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {currentMonthPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center opacity-30">
                      <SearchCheck size={64} className="mx-auto mb-4" />
                      <p className="font-black uppercase tracking-[0.3em] text-xs">No matching records. Run Generate to start.</p>
                    </td>
                  </tr>
                ) : (
                  currentMonthPayrolls.map(pr => (
                    <tr key={pr.id} className={`hover:bg-zinc-800/10 transition-colors ${pr.status === 'Paid' ? 'opacity-80' : ''}`}>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${pr.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                             {pr.paymentMethod === 'Bank' ? <Building size={16}/> : pr.paymentMethod === 'Mobile Banking' ? <Smartphone size={16}/> : <Banknote size={16}/>}
                          </div>
                          <div>
                            <span className={`font-black block text-sm ${headingColor}`}>{pr.employeeName}</span>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{pr.disbursementId || 'REF: PENDING'}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`px-10 py-6 text-center font-black text-xl ${headingColor}`}>৳{pr.amount.toLocaleString()}</td>
                      <td className="px-10 py-6 text-center">
                        {pr.status === 'Pending' ? (
                          <div className="relative group max-w-[140px] mx-auto">
                            <select 
                              value={pr.paymentMethod}
                              onChange={(e) => handleUpdatePaymentMethod(pr.id, e.target.value)}
                              className={`w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border appearance-none outline-none cursor-pointer transition-colors ${darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100 hover:border-emerald-500' : 'bg-zinc-100 border-zinc-200 text-zinc-950 hover:border-emerald-600'}`}
                            >
                              {PAYMENT_METHODS.map(m => (
                                <option key={m} value={m} className={darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-950'}>{m}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={12} />
                          </div>
                        ) : (
                          <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{pr.paymentMethod}</span>
                        )}
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                          pr.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {pr.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {pr.status === 'Pending' ? (
                            <button 
                              onClick={() => handleDisburseSalary(pr)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 group"
                            >
                              <Wallet size={12} className="group-hover:rotate-12 transition-transform" /> Disburse
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => generateSalaryCertificate(pr)}
                                className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700' : 'bg-zinc-50 border-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
                                title="Salary Certificate"
                              >
                                <Printer size={16} />
                              </button>
                              <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2">
                                <CheckCircle size={14} /> Paid
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in overflow-y-auto">
          <div className={`border w-full max-w-4xl rounded-[3rem] p-10 md:p-14 my-auto shadow-2xl relative animate-scale-in ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-3xl shadow-inner border border-emerald-500/10"><UserPlus size={32} /></div>
                <div>
                  <h3 className={`text-2xl md:text-3xl font-black tracking-tighter ${headingColor}`}>{isEditing ? (lang === 'bn' ? 'তথ্য সংশোধন' : 'Edit Employee') : (lang === 'bn' ? 'নতুন কর্মচারী অনবোর্ডিং' : 'Onboard Employee')}</h3>
                  <p className={`${darkMode ? 'text-zinc-500' : 'text-zinc-400'} text-[10px] font-black uppercase tracking-widest mt-1`}>Personnel Registration Manifest</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 text-zinc-500 hover:text-rose-500 transition-colors"><X size={32}/></button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-10 bg-zinc-900/20 p-8 rounded-[2.5rem] border border-zinc-800/50">
                <div onClick={() => photoRef.current?.click()} className="w-32 h-32 rounded-[2rem] bg-zinc-900 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 group transition-all overflow-hidden relative">
                  {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <><Camera size={32} className="text-zinc-600 group-hover:text-emerald-500 mb-2" /><span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Upload Photo</span></>}
                  <input type="file" ref={photoRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'photo')} />
                </div>
                <div className="flex-1 space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className={labelClass}>{lang === 'bn' ? 'পুরো নাম' : 'Full Name'}</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="Arif Faisal" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>{lang === 'bn' ? 'পদবী / সেকশন' : 'Role / Section'}</label>
                        <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={inputClass} placeholder="Sales Executive" />
                      </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1.5"><label className={labelClass}>{lang === 'bn' ? 'পিতার নাম' : "Father's Name"}</label><input type="text" value={formData.fathersName} onChange={e => setFormData({...formData, fathersName: e.target.value})} className={inputClass} /></div>
                 <div className="space-y-1.5"><label className={labelClass}>{lang === 'bn' ? 'মাতার নাম' : "Mother's Name"}</label><input type="text" value={formData.mothersName} onChange={e => setFormData({...formData, mothersName: e.target.value})} className={inputClass} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-1.5">
                    <label className={labelClass}>{lang === 'bn' ? 'লিঙ্গ' : 'Gender'}</label>
                    <div className="relative">
                      <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})} className={`${inputClass} appearance-none`}>
                        {GENDERS.map(g => <option key={g} value={g} className={darkMode ? 'bg-zinc-950' : 'bg-white'}>{g}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
                    </div>
                 </div>
                 <div className="space-y-1.5"><label className={labelClass}>{lang === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}</label><input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className={`${inputClass} cursor-pointer`} /></div>
                 <div className="space-y-1.5"><label className={labelClass}>NID / Passport / BC</label><input type="text" value={formData.identityNumber} onChange={e => setFormData({...formData, identityNumber: e.target.value})} className={inputClass} placeholder="Identity No" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1.5"><label className={labelClass}>{lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}</label><input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className={inputClass} placeholder="+88017..." /></div>
                 <div className="space-y-1.5"><label className={labelClass}>{lang === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} placeholder="arif@company.com" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-1.5"><label className={labelClass}>{lang === 'bn' ? 'যোগদানের তারিখ' : 'Joining Date'}</label><input required type="date" value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} className={`${inputClass} cursor-pointer`} /></div>
                 <div className="space-y-1.5">
                    <label className={labelClass}>{lang === 'bn' ? 'বিভাগ' : 'Department'}</label>
                    <div className="relative">
                      <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className={`${inputClass} appearance-none`}>
                        {DEPARTMENTS.map(d => <option key={d} value={d} className={darkMode ? 'bg-zinc-950' : 'bg-white'}>{d}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
                    </div>
                 </div>
                 <div className="space-y-1.5"><label className={labelClass}>{lang === 'bn' ? 'মাসিক বেতন' : 'Gross Salary (৳)'}</label><input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: parseInt(e.target.value) || 0})} className={inputClass} /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className={labelClass}>{lang === 'bn' ? 'ডিজিটাল স্বাক্ষর' : 'Digital Signature'}</label>
                    <div onClick={() => signRef.current?.click()} className={`h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${formData.signature ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-500 shadow-inner'}`}>
                       {formData.signature ? <img src={formData.signature} className="h-full object-contain p-2" /> : <div className="flex items-center gap-3 text-zinc-500 font-bold uppercase text-[9px] tracking-widest"><Upload size={16}/> Upload Signature</div>}
                       <input type="file" ref={signRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'signature')} />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className={labelClass}>{lang === 'bn' ? 'সিভি আপলোড' : 'Curriculum Vitae (CV)'}</label>
                    <div onClick={() => cvRef.current?.click()} className={`h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${formData.cv ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-500 shadow-inner'}`}>
                       <div className="flex items-center gap-3 text-zinc-500 font-bold uppercase text-[9px] tracking-widest">{formData.cv ? <div className="flex items-center gap-2 text-blue-500"><FileText size={16}/> File Ready</div> : <><Upload size={16}/> Click to upload PDF</>}</div>
                       <input type="file" ref={cvRef} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'cv')} />
                    </div>
                 </div>
              </div>

              <div className="flex gap-6 pt-10 border-t border-zinc-800/50">
                <button type="button" onClick={() => setShowAddModal(false)} className={`flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all ${darkMode ? 'bg-zinc-900 text-zinc-500 hover:text-white' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-600'}`}>Discard Changes</button>
                <button type="submit" className="flex-1 py-5 rounded-[2rem] text-white font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all" style={{ backgroundColor: themeColor }}>{isEditing ? 'Save Record' : 'Onboard Personnel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedEmployee && !showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/92 backdrop-blur-3xl animate-fade-in overflow-y-auto">
          <div className={`border w-full max-w-3xl rounded-[3rem] p-10 md:p-14 my-auto shadow-2xl relative ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-8">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-500/20 shadow-2xl bg-zinc-800">
                  {selectedEmployee.photo ? <img src={selectedEmployee.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={48} /></div>}
                </div>
                <div>
                   <h3 className={`text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>{selectedEmployee.name}</h3>
                   <div className="flex flex-wrap gap-3 mt-4">
                      <span className="px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">{selectedEmployee.role}</span>
                      <span className="px-4 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-zinc-700">{selectedEmployee.department} Dept.</span>
                   </div>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-3">Employee UID: {selectedEmployee.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="p-3 text-zinc-500 hover:text-rose-500 transition-colors"><X size={32}/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-zinc-800/50">
               <div className="space-y-8">
                  <DetailRow label={lang === 'bn' ? 'পিতার নাম' : "Father's Name"} value={selectedEmployee.fathersName} icon={UserIcon} darkMode={darkMode} />
                  <DetailRow label={lang === 'bn' ? 'মাতার নাম' : "Mother's Name"} value={selectedEmployee.mothersName} icon={UserIcon} darkMode={darkMode} />
                  <DetailRow label={lang === 'bn' ? 'লিঙ্গ' : 'Gender'} value={selectedEmployee.gender} icon={Users} darkMode={darkMode} />
                  <DetailRow label={lang === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'} value={selectedEmployee.dob} icon={Calendar} darkMode={darkMode} />
                  <DetailRow label="NID / Passport" value={selectedEmployee.identityNumber} icon={Fingerprint} darkMode={darkMode} />
               </div>
               <div className="space-y-8">
                  <DetailRow label={lang === 'bn' ? 'মোবাইল' : 'Contact Number'} value={selectedEmployee.mobile} icon={Phone} darkMode={darkMode} />
                  <DetailRow label={lang === 'bn' ? 'ইমেইল' : 'Email Address'} value={selectedEmployee.email} icon={Mail} darkMode={darkMode} />
                  <DetailRow label={lang === 'bn' ? 'জয়েনিং ডেট' : 'Joining Date'} value={selectedEmployee.joiningDate} icon={Clock} darkMode={darkMode} />
                  <DetailRow label={lang === 'bn' ? 'বেতন' : 'Current Salary'} value={`৳${selectedEmployee.salary?.toLocaleString()}`} icon={CreditCard} darkMode={darkMode} />
                  <div className="pt-4 flex gap-4">
                     <button onClick={() => { handleEdit(selectedEmployee); setSelectedEmployee(null); }} className="flex-1 p-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl" style={{ backgroundColor: themeColor }}><Edit2 size={16}/> Edit Profile</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value, icon: Icon, darkMode }: { label: string, value?: string | number, icon: any, darkMode: boolean }) => (
  <div className="flex items-center gap-5 group">
    <div className={`p-3 border rounded-xl transition-colors ${darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-600 group-hover:text-emerald-500 group-hover:border-emerald-500/30' : 'bg-zinc-50 border-zinc-100 text-zinc-400 group-hover:text-emerald-600'}`}><Icon size={18} /></div>
    <div>
      <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</p>
      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{value || 'Not Disclosed'}</p>
    </div>
  </div>
);

export default HR;
