
export type ModuleType = 
  | 'DASHBOARD' 
  | 'FINANCE' 
  | 'INVENTORY' 
  | 'SUPPLIERS' 
  | 'SALES' 
  | 'OFFICE' 
  | 'HR' 
  | 'REPORTS' 
  | 'SETTINGS' 
  | 'LEGAL' 
  | 'CATEGORIES' 
  | 'SUPER_ADMIN' 
  | 'COMMUNICATION' 
  | 'SUPPORT_AI' 
  | 'ACCOUNTS' 
  | 'PURCHASE' 
  | 'ADMIN';

export type Language = 'en' | 'bn';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';
export type AppLayout = 'standard' | 'compact' | 'glass' | 'corporate' | 'minimal';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: ModuleType[];
  avatarUrl?: string;
  themeColor?: string;
  layout?: AppLayout;
}

export interface AppConfig {
  theme: string;
  darkMode: boolean;
  modules: ModuleType[];
  moduleOrder?: ModuleType[];
  logoUrl?: string;
}

export interface Tenant {
  id: string;
  name: string;
  config: AppConfig;
  createdAt: string;
  users: UserRecord[];
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  purchasePrice: number;
  mrp: number;
  price?: number;
  lastUpdated: string;
  isPendingDeletion?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  category: string;
  balance: number;
  status: 'Active' | 'Blocked';
  isPendingDeletion?: boolean;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  status: string;
  isPendingDeletion?: boolean;
  supplierId?: string;
  method?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCategory: string;
  date: string;
  purchaserName: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  deliveryDate: string;
  paymentDate: string;
  paymentTerms: 'Cash' | 'Credit';
  status: 'Pending' | 'Received' | 'Cancelled';
}

export interface SaleRecord {
  id: string;
  customerName: string;
  date: string;
  total: number;
  items: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Resigned';
  fathersName?: string;
  mothersName?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  identityNumber?: string;
  mobile?: string;
  email?: string;
  salary?: number;
  photo?: string;
  signature?: string;
  cv?: string;
}

export interface PayrollRecord {
  id: string;
  disbursementId?: string;
  employeeId: string;
  employeeName: string;
  month: string;
  amount: number;
  status: 'Pending' | 'Paid';
  paymentMethod: 'Bank' | 'Mobile Banking' | 'Cash';
  date?: string;
}

export interface LoanRecord {
  id: string;
  person: string;
  type: 'Given' | 'Taken';
  amount: number;
  paidAmount: number;
  date: string;
  status: 'Active' | 'Closed';
}

export interface DailyExpense {
  id: string;
  date: string;
  title: string;
  amount: number;
  category: string;
}

export interface AccountRecord {
  id: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}
