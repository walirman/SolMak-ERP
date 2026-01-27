
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppConfig, ModuleType, Language, Tenant, UserRecord, InventoryItem, Transaction, Supplier, PurchaseOrder, SaleRecord, Employee, LegalDoc, OfficeTask, AccountRecord } from './types';
import { translations } from './translations';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Finance from './components/Finance';
import Inventory from './components/Inventory';
import SupportAI from './components/SupportAI';
import Settings from './components/Settings';
import SuperAdmin from './components/SuperAdmin';
import Admin from './components/Admin';
import Communication from './components/Communication';
import EmptyModule from './components/EmptyModule';
import Suppliers from './components/Suppliers';
import Purchase from './components/Purchase';
import Sales from './components/Sales';
import HR from './components/HR';
import Office from './components/Office';
import Legal from './components/Legal';
import Categories from './components/Categories';
import Accounts from './components/Accounts';
import Reports from './components/Reports';

const ALL_MODULES: ModuleType[] = [
  "DASHBOARD", "FINANCE", "INVENTORY", "PURCHASE", "SUPPLIERS", "SALES", "OFFICE", "HR", 
  "REPORTS", "SETTINGS", "LEGAL", "CATEGORIES", "SUPER_ADMIN", "COMMUNICATION", 
  "SUPPORT_AI", "ACCOUNTS", "ADMIN"
];

const STORAGE_VERSION = 'v4_secure_persist';

// --- INITIAL MOCK DATA ---
const MOCK_SALES: SaleRecord[] = [
  { id: 'SL-5001', customerName: 'Zubair Hossain', date: '2024-02-01', total: 12500, items: 3, status: 'Paid' },
  { id: 'SL-5002', customerName: 'Akash Ahmed', date: '2024-02-02', total: 4500, items: 1, status: 'Unpaid' },
  { id: 'SL-5003', customerName: 'Rifat Khan', date: '2024-02-05', total: 67000, items: 12, status: 'Paid' },
  { id: 'SL-5004', customerName: 'Karim Ullah', date: '2024-02-07', total: 2200, items: 2, status: 'Partial' },
  { id: 'SL-5005', customerName: 'Sumaiya Akter', date: '2024-02-10', total: 15600, items: 5, status: 'Paid' },
  { id: 'SL-5006', customerName: 'Labib Rahman', date: '2024-02-12', total: 8900, items: 3, status: 'Paid' },
  { id: 'SL-5007', customerName: 'Farhana Yeasmin', date: '2024-02-15', total: 3400, items: 2, status: 'Unpaid' },
  { id: 'SL-5008', customerName: 'Tahsan Adil', date: '2024-02-18', total: 1200, items: 1, status: 'Paid' },
  { id: 'SL-5009', customerName: 'Musa Ibrahim', date: '2024-02-20', total: 45000, items: 8, status: 'Paid' },
  { id: 'SL-5010', customerName: 'Nabil Haque', date: '2024-02-22', total: 28000, items: 6, status: 'Partial' },
];

const MOCK_HR: Employee[] = [
  { id: 'EMP-101', name: 'Arif Faisal', role: 'Sales Manager', department: 'Sales', joiningDate: '2022-01-15', status: 'Active', salary: 45000, mobile: '01711122233', email: 'arif@solmak.pro' },
  { id: 'EMP-102', name: 'Tania Sultana', role: 'Accountant', department: 'Finance', joiningDate: '2022-03-10', status: 'Active', salary: 38000, mobile: '01811223344', email: 'tania@solmak.pro' },
  { id: 'EMP-103', name: 'Kazi Rayhan', role: 'Inventory Specialist', department: 'Ops', joiningDate: '2022-05-20', status: 'Active', salary: 32000, mobile: '01911334455', email: 'rayhan@solmak.pro' },
  { id: 'EMP-104', name: 'Jannatul Mawa', role: 'HR Executive', department: 'HR', joiningDate: '2023-01-05', status: 'On Leave', salary: 35000, mobile: '01611445566', email: 'mawa@solmak.pro' },
];

const MOCK_LEGAL: LegalDoc[] = [
  { id: 'LEG-001', title: 'Office Lease Agreement', type: 'Property', expiryDate: '2025-12-31', status: 'Active' },
  { id: 'LEG-002', title: 'Supplier Contract - Medline', type: 'Vendor', expiryDate: '2024-06-30', status: 'Active' },
  { id: 'LEG-003', title: 'Employee Non-Disclosure', type: 'HR', expiryDate: '2028-01-01', status: 'Active' },
  { id: 'LEG-004', title: 'Trade License 2024', type: 'License', expiryDate: '2024-04-15', status: 'Renewing' },
  { id: 'LEG-005', title: 'Insurance Policy - Assets', type: 'Insurance', expiryDate: '2024-09-20', status: 'Active' },
  { id: 'LEG-006', title: 'IT Infrastructure Service', type: 'Service', expiryDate: '2024-11-10', status: 'Active' },
  { id: 'LEG-007', title: 'Partnership MOU - GlobalTech', type: 'Partnership', expiryDate: '2026-05-15', status: 'Active' },
  { id: 'LEG-008', title: 'Tax Clearance Certificate', type: 'License', expiryDate: '2024-03-31', status: 'Renewing' },
  { id: 'LEG-009', title: 'Software License Agreement', type: 'Software', expiryDate: '2025-01-20', status: 'Active' },
  { id: 'LEG-010', title: 'Waste Management Contract', type: 'Utility', expiryDate: '2024-08-15', status: 'Active' },
];

const MOCK_TASKS: OfficeTask[] = [
  { id: 'TSK-201', task: 'Review Monthly Audit', priority: 'High', assignedTo: 'Tania Sultana', deadline: '2024-02-28', status: 'In Progress' },
  { id: 'TSK-202', task: 'Update Inventory Labels', priority: 'Medium', assignedTo: 'Kazi Rayhan', deadline: '2024-03-02', status: 'Pending' },
  { id: 'TSK-203', task: 'Prepare Employee Payroll', priority: 'High', assignedTo: 'Tania Sultana', deadline: '2024-02-25', status: 'Done' },
  { id: 'TSK-204', task: 'Restock Medical Supplies', priority: 'High', assignedTo: 'Arif Faisal', deadline: '2024-02-26', status: 'In Progress' },
  { id: 'TSK-205', task: 'Client Presentation Deck', priority: 'Medium', assignedTo: 'Arif Faisal', deadline: '2024-03-05', status: 'Pending' },
  { id: 'TSK-206', task: 'Security System Upgrade', priority: 'Low', assignedTo: 'Omar Faruk', deadline: '2024-03-15', status: 'Pending' },
  { id: 'TSK-207', task: 'Organize Team Lunch', priority: 'Low', assignedTo: 'Rakibul Islam', deadline: '2024-02-27', status: 'Done' },
  { id: 'TSK-208', task: 'Legal Review - New Vendor', priority: 'High', assignedTo: 'Nabila Karim', deadline: '2024-03-01', status: 'In Progress' },
  { id: 'TSK-209', task: 'Update Software Patches', priority: 'Medium', assignedTo: 'Adnan Sami', deadline: '2024-02-28', status: 'In Progress' },
  { id: 'TSK-210', task: 'Draft New HR Policies', priority: 'Medium', assignedTo: 'Jannatul Mawa', deadline: '2024-03-10', status: 'Pending' },
];

const MOCK_ACCOUNTS: AccountRecord[] = [
  { id: 'ACC-101', name: 'Main Cash Account', type: 'Asset', balance: 450000 },
  { id: 'ACC-102', name: 'BRAC Bank Current', type: 'Asset', balance: 2500000 },
  { id: 'ACC-103', name: 'Accounts Receivable', type: 'Asset', balance: 125000 },
  { id: 'ACC-201', name: 'Accounts Payable', type: 'Liability', balance: 85000 },
  { id: 'ACC-202', name: 'Bank Loan (SME)', type: 'Liability', balance: 500000 },
  { id: 'ACC-301', name: 'Owner Capital', type: 'Equity', balance: 2000000 },
  { id: 'ACC-401', name: 'Product Sales Rev', type: 'Revenue', balance: 1850000 },
  { id: 'ACC-402', name: 'Consultancy Fees', type: 'Revenue', balance: 450000 },
  { id: 'ACC-501', name: 'Salary Expense', type: 'Expense', balance: 1200000 },
  { id: 'ACC-502', name: 'Utilities & Rent', type: 'Expense', balance: 350000 },
];

const INITIAL_USER: UserRecord = {
  id: 'root-admin',
  name: 'Root Super Admin',
  email: 'admin@solmak.pro',
  role: 'SUPER_ADMIN',
  permissions: ALL_MODULES,
  themeColor: "#059669",
  layout: 'standard'
};

const INITIAL_TENANT: Tenant = {
  id: 'tenant-1',
  name: 'SolMak ERP',
  createdAt: new Date().toISOString(),
  users: [INITIAL_USER],
  config: {
    theme: "#059669",
    darkMode: true,
    modules: ALL_MODULES,
    moduleOrder: ALL_MODULES
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('bn');
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem(`erp_tenants_${STORAGE_VERSION}`);
    return saved ? JSON.parse(saved) : [INITIAL_TENANT];
  });
  
  const [activeTenantId, setActiveTenantId] = useState(() => {
    return localStorage.getItem('erp_active_tenant_id') || INITIAL_TENANT.id;
  });

  const activeTenant = useMemo(() => tenants.find(t => t.id === activeTenantId) || tenants[0], [tenants, activeTenantId]);
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem(`erp_active_user_${activeTenantId}`) || activeTenant.users[0]?.id);
  const currentUser = useMemo(() => activeTenant.users.find(u => u.id === currentUserId) || activeTenant.users[0], [activeTenant, currentUserId]);

  const effectiveTheme = currentUser.themeColor || activeTenant.config.theme;
  const effectiveLayout = currentUser.layout || 'standard';
  const config = activeTenant.config;
  const [activeModule, setActiveModule] = useState<ModuleType>('DASHBOARD');

  // --- PERSISTED STATE HOOKS ---
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`erp_tx_${activeTenantId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`erp_inv_${activeTenantId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`erp_sup_${activeTenantId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(`erp_po_${activeTenantId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const saved = localStorage.getItem(`erp_sales_${activeTenantId}`);
    return saved ? JSON.parse(saved) : MOCK_SALES;
  });
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(`erp_emp_${activeTenantId}`);
    return saved ? JSON.parse(saved) : MOCK_HR;
  });
  const [legalDocs, setLegalDocs] = useState<LegalDoc[]>(() => {
    const saved = localStorage.getItem(`erp_leg_${activeTenantId}`);
    return saved ? JSON.parse(saved) : MOCK_LEGAL;
  });
  const [tasks, setTasks] = useState<OfficeTask[]>(() => {
    const saved = localStorage.getItem(`erp_tsk_${activeTenantId}`);
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });
  const [accounts, setAccounts] = useState<AccountRecord[]>(() => {
    const saved = localStorage.getItem(`erp_acc_${activeTenantId}`);
    return saved ? JSON.parse(saved) : MOCK_ACCOUNTS;
  });

  const persist = useCallback(() => {
    localStorage.setItem(`erp_tenants_${STORAGE_VERSION}`, JSON.stringify(tenants));
    localStorage.setItem('erp_active_tenant_id', activeTenantId);
    localStorage.setItem(`erp_active_user_${activeTenantId}`, currentUserId || '');
    localStorage.setItem(`erp_tx_${activeTenantId}`, JSON.stringify(transactions));
    localStorage.setItem(`erp_inv_${activeTenantId}`, JSON.stringify(inventory));
    localStorage.setItem(`erp_sup_${activeTenantId}`, JSON.stringify(suppliers));
    localStorage.setItem(`erp_po_${activeTenantId}`, JSON.stringify(purchaseOrders));
    localStorage.setItem(`erp_sales_${activeTenantId}`, JSON.stringify(sales));
    localStorage.setItem(`erp_emp_${activeTenantId}`, JSON.stringify(employees));
    localStorage.setItem(`erp_leg_${activeTenantId}`, JSON.stringify(legalDocs));
    localStorage.setItem(`erp_tsk_${activeTenantId}`, JSON.stringify(tasks));
    localStorage.setItem(`erp_acc_${activeTenantId}`, JSON.stringify(accounts));
  }, [tenants, activeTenantId, currentUserId, transactions, inventory, suppliers, purchaseOrders, sales, employees, legalDocs, tasks, accounts]);

  useEffect(() => persist(), [persist]);

  const setTenantUsers = (newUsers: UserRecord[]) => {
    setTenants(prev => prev.map(t => t.id === activeTenantId ? { ...t, users: newUsers } : t));
  };

  const updateTenantConfig = (newConfig: Partial<AppConfig>) => {
    setTenants(prev => prev.map(t => t.id === activeTenantId ? { ...t, config: { ...t.config, ...newConfig } } : t));
  };

  const t = translations[lang];

  const sortedModules = useMemo(() => {
    const baseModules = config.modules.filter(m => currentUser.permissions.includes(m));
    if (!config.moduleOrder) return baseModules;
    return [...config.moduleOrder].filter(m => baseModules.includes(m));
  }, [config.modules, config.moduleOrder, currentUser.permissions]);

  const renderModule = () => {
    switch (activeModule) {
      case 'DASHBOARD':
        return <Dashboard t={t} transactions={transactions} inventory={inventory} darkMode={config.darkMode} />;
      case 'FINANCE':
        return <Finance t={t} transactions={transactions} setTransactions={setTransactions} themeColor={effectiveTheme} darkMode={config.darkMode} />;
      case 'INVENTORY':
        return <Inventory t={t} inventory={inventory} setInventory={setInventory} themeColor={effectiveTheme} darkMode={config.darkMode} />;
      case 'PURCHASE':
        return <Purchase t={t} purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} inventory={inventory} setInventory={setInventory} suppliers={suppliers} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} currentUser={currentUser} />;
      case 'SUPPLIERS':
        return <Suppliers t={t} suppliers={suppliers} setSuppliers={setSuppliers} transactions={transactions} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} />;
      case 'SALES':
        return <Sales t={t} sales={sales} setSales={setSales} inventory={inventory} setInventory={setInventory} transactions={transactions} setTransactions={setTransactions} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} />;
      case 'HR':
        return <HR t={t} employees={employees} setEmployees={setEmployees} transactions={transactions} setTransactions={setTransactions} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} />;
      case 'OFFICE':
        return <Office t={t} tasks={tasks} setTasks={setTasks} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} />;
      case 'LEGAL':
        return <Legal t={t} docs={legalDocs} setDocs={setLegalDocs} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} />;
      case 'ACCOUNTS':
        return <Accounts t={t} accounts={accounts} setAccounts={setAccounts} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} />;
      case 'CATEGORIES':
        return <Categories t={t} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} />;
      case 'REPORTS':
        return <Reports t={t} sales={sales} transactions={transactions} inventory={inventory} darkMode={config.darkMode} themeColor={effectiveTheme} />;
      case 'COMMUNICATION':
        return <Communication themeColor={effectiveTheme} t={t} currentUser={currentUser} allUsers={activeTenant.users} lang={lang} darkMode={config.darkMode} />;
      case 'ADMIN':
        return <Admin t={t} users={activeTenant.users} setUsers={setTenantUsers} themeColor={effectiveTheme} lang={lang} darkMode={config.darkMode} />;
      case 'SETTINGS':
        return (
          <Settings 
            t={t} lang={lang} setLang={setLang} themeColor={effectiveTheme} 
            setThemeColor={(color) => setTenantUsers(activeTenant.users.map(u => u.id === currentUser.id ? { ...u, themeColor: color } : u))}
            logoUrl={config.logoUrl || ''}
            setLogoUrl={(url) => updateTenantConfig({ logoUrl: url })}
            currentUser={currentUser}
            onUserUpdate={(u) => setTenantUsers(activeTenant.users.map(user => user.id === u.id ? u : user))}
            darkMode={config.darkMode}
          />
        );
      case 'SUPPORT_AI':
        return <SupportAI themeColor={effectiveTheme} t={t} lang={lang} darkMode={config.darkMode} />;
      case 'SUPER_ADMIN':
        return <SuperAdmin t={t} lang={lang} config={config} tenants={tenants} setTenants={setTenants} activeTenantId={activeTenantId} setActiveTenantId={setActiveTenantId} inventory={inventory} setInventory={setInventory} transactions={transactions} setTransactions={setTransactions} darkMode={config.darkMode} onUpdateOrder={(newOrder) => updateTenantConfig({ logoUrl: config.logoUrl, ...config, moduleOrder: newOrder })} currentUser={currentUser} />;
      default:
        return <EmptyModule name={activeModule} t={t} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-500 layout-${effectiveLayout} ${config.darkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'} ${lang === 'bn' ? 'font-bn' : ''}`}>
      <Sidebar appName={activeTenant.name} modules={sortedModules} activeModule={activeModule} setActiveModule={setActiveModule} themeColor={effectiveTheme} logoUrl={config.logoUrl} t={t} currentUser={currentUser} darkMode={config.darkMode} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header appName={activeTenant.name} activeModule={activeModule} setActiveModule={setActiveModule} themeColor={effectiveTheme} lang={lang} setLang={setLang} t={t} currentUser={currentUser} allUsers={activeTenant.users} setCurrentUserId={setCurrentUserId} transactions={transactions} darkMode={config.darkMode} toggleDarkMode={() => updateTenantConfig({ darkMode: !config.darkMode })} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 animate-fade-in">{renderModule()}</main>
      </div>
    </div>
  );
};

export default App;
