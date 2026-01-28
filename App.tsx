
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

const MOCK_SALES: SaleRecord[] = [
  { id: 'SL-5001', customerName: 'Zubair Hossain', date: '2024-02-01', total: 12500, items: 3, status: 'Paid' },
  { id: 'SL-5002', customerName: 'Akash Ahmed', date: '2024-02-02', total: 4500, items: 1, status: 'Unpaid' },
];

const MOCK_HR: Employee[] = [
  { id: 'EMP-101', name: 'Arif Faisal', role: 'Sales Manager', department: 'Sales', joiningDate: '2022-01-15', status: 'Active', salary: 45000, mobile: '01711122233', email: 'arif@solmak.pro' },
  { id: 'EMP-102', name: 'Tania Sultana', role: 'Accountant', department: 'Finance', joiningDate: '2022-03-10', status: 'On Leave', salary: 38000, mobile: '01811223344', email: 'tania@solmak.pro' },
  { id: 'EMP-103', name: 'Kabir Ahmed', role: 'Operations Lead', department: 'Ops', joiningDate: '2021-06-20', status: 'Active', salary: 52000, mobile: '01911445566', email: 'kabir@solmak.pro' },
];

const MOCK_ACCOUNTS: AccountRecord[] = [
  { id: 'ACC-101', name: 'Main Cash Account', type: 'Asset', balance: 450000 },
  { id: 'ACC-102', name: 'Corporate Bank (BRAC)', type: 'Asset', balance: 2500000 },
];

const INITIAL_USER: UserRecord = {
  id: 'root-admin',
  name: 'SolMak Super User',
  email: 'admin@solmak.pro',
  role: 'SUPER_ADMIN',
  permissions: ALL_MODULES,
  themeColor: "#059669",
  layout: 'standard'
};

const INITIAL_TENANT: Tenant = {
  id: 'tenant-1',
  name: 'SolMak Enterprise',
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
  const config = activeTenant.config;
  const [activeModule, setActiveModule] = useState<ModuleType>('DASHBOARD');

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
    localStorage.setItem(`erp_acc_${activeTenantId}`, JSON.stringify(accounts));
  }, [tenants, activeTenantId, currentUserId, transactions, inventory, suppliers, purchaseOrders, sales, employees, accounts]);

  useEffect(() => persist(), [persist]);

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
      case 'ACCOUNTS':
        return <Accounts t={t} accounts={accounts} setAccounts={setAccounts} transactions={transactions} setTransactions={setTransactions} themeColor={effectiveTheme} darkMode={config.darkMode} lang={lang} />;
      case 'ADMIN':
        return <Admin t={t} users={activeTenant.users} setUsers={(u) => setTenants(tenants.map(t => t.id === activeTenantId ? {...t, users: u} : t))} themeColor={effectiveTheme} lang={lang} darkMode={config.darkMode} />;
      case 'SETTINGS':
        return <Settings t={t} lang={lang} setLang={setLang} themeColor={effectiveTheme} setThemeColor={(c) => setTenants(tenants.map(t => t.id === activeTenantId ? {...t, users: t.users.map(u => u.id === currentUser.id ? {...u, themeColor: c} : u)} : t))} logoUrl={config.logoUrl || ''} setLogoUrl={(url) => setTenants(tenants.map(t => t.id === activeTenantId ? {...t, config: {...t.config, logoUrl: url}} : t))} currentUser={currentUser} onUserUpdate={(u) => setTenants(tenants.map(t => t.id === activeTenantId ? {...t, users: t.users.map(user => user.id === u.id ? u : user)} : t))} darkMode={config.darkMode} />;
      case 'SUPPORT_AI':
        return <SupportAI themeColor={effectiveTheme} t={t} lang={lang} darkMode={config.darkMode} />;
      case 'SUPER_ADMIN':
        return <SuperAdmin t={t} lang={lang} config={config} tenants={tenants} setTenants={setTenants} activeTenantId={activeTenantId} setActiveTenantId={setActiveTenantId} inventory={inventory} setInventory={setInventory} transactions={transactions} setTransactions={setTransactions} darkMode={config.darkMode} onUpdateOrder={(newOrder) => setTenants(tenants.map(t => t.id === activeTenantId ? {...t, config: {...t.config, moduleOrder: newOrder}} : t))} currentUser={currentUser} />;
      default:
        return <EmptyModule name={activeModule} t={t} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-500 ${config.darkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'} ${lang === 'bn' ? 'font-bn' : ''}`}>
      <Sidebar appName={activeTenant.name} modules={sortedModules} activeModule={activeModule} setActiveModule={setActiveModule} themeColor={effectiveTheme} logoUrl={config.logoUrl} t={t} currentUser={currentUser} darkMode={config.darkMode} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header appName={activeTenant.name} activeModule={activeModule} setActiveModule={setActiveModule} themeColor={effectiveTheme} lang={lang} setLang={setLang} t={t} currentUser={currentUser} allUsers={activeTenant.users} setCurrentUserId={setCurrentUserId} transactions={transactions} darkMode={config.darkMode} toggleDarkMode={() => setTenants(tenants.map(t => t.id === activeTenantId ? {...t, config: {...t.config, darkMode: !t.config.darkMode}} : t))} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 animate-fade-in smooth-scroll">{renderModule()}</main>
      </div>
    </div>
  );
};

export default App;
