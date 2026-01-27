
import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Plus, Search, Filter, Trash2, X, CheckCircle, 
  Clock, Package, User, CreditCard, ChevronDown, Landmark,
  TrendingUp, ArrowRight, Download, Eye, Ban, Calendar, UserCircle, QrCode, Printer, ChevronRight,
  ShoppingCart, Hash, Info, MapPin, Layers
} from 'lucide-react';
import { PurchaseOrder, InventoryItem, Supplier, Language, UserRecord } from '../types';

interface PurchaseProps {
  t: any;
  purchaseOrders: PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  suppliers: Supplier[];
  themeColor: string;
  darkMode: boolean;
  lang: Language;
  currentUser: UserRecord;
}

const Purchase: React.FC<PurchaseProps> = ({ 
  t, purchaseOrders, setPurchaseOrders, inventory, setInventory, 
  suppliers, themeColor, darkMode, lang, currentUser 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [newPO, setNewPO] = useState<{
    supplierId: string;
    deliveryDate: string;
    paymentDate: string;
    paymentTerms: 'Cash' | 'Credit';
    items: { itemId: string; name: string; quantity: number; unitPrice: number }[];
  }>({
    supplierId: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    paymentDate: new Date().toISOString().split('T')[0],
    paymentTerms: 'Cash',
    items: [{ itemId: '', name: '', quantity: 1, unitPrice: 0 }]
  });

  const handlePrint = () => {
    if (!selectedPO) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const itemsHtml = selectedPO.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px; font-size: 14px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; font-size: 14px; text-align: right;">৳${item.unitPrice.toLocaleString()}</td>
        <td style="padding: 12px; font-size: 14px; text-align: right; font-weight: bold;">৳${(item.quantity * item.unitPrice).toLocaleString()}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Purchase Order - ${selectedPO.id}</title>
        <link href="https://fonts.maateen.me/fn-rojhan-lipika/font.css" rel="stylesheet">
        <style>
          body { font-family: 'FN Rojhan Lipika', sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 4px solid ${themeColor}; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: 900; color: ${themeColor}; margin: 0; }
          .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .info-block h4 { text-transform: uppercase; font-size: 10px; letter-spacing: 2px; color: #888; margin-bottom: 8px; }
          .info-block p { font-size: 16px; font-weight: bold; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f9f9f9; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; padding: 12px; text-align: left; border-bottom: 2px solid #eee; }
          .total-section { display: flex; justify-content: flex-end; border-top: 2px solid #333; padding-top: 15px; }
          .total-box { text-align: right; }
          .total-box span { font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; }
          .total-box h2 { font-size: 32px; font-weight: 900; margin: 5px 0 0 0; color: ${themeColor}; }
          .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; }
          .qr-code { text-align: center; margin-top: 20px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">Purchase Order</h1>
            <p style="font-size: 12px; color: #666; font-weight: bold; margin-top: 5px;">Reference: ${selectedPO.id}</p>
          </div>
          <div style="text-align: right">
            <p style="font-weight: bold; margin: 0;">Date: ${selectedPO.date}</p>
            <p style="font-size: 11px; color: #888; margin-top: 4px;">Terms: ${selectedPO.paymentTerms}</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-block">
            <h4>Supplier Details</h4>
            <p>${selectedPO.supplierName}</p>
            <p style="font-size: 12px; color: #666; font-weight: normal; margin-top: 4px;">Category: ${selectedPO.supplierCategory}</p>
          </div>
          <div class="info-block" style="text-align: right;">
            <h4>Authorized By</h4>
            <p>${selectedPO.purchaserName}</p>
            <p style="font-size: 12px; color: #666; font-weight: normal; margin-top: 4px;">SolMak ERP Procurement Dept.</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Sub-Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-box">
            <span>Net Payable Amount</span>
            <h2>৳${selectedPO.totalAmount.toLocaleString()}</h2>
          </div>
        </div>

        <div class="qr-code">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${selectedPO.id}" width="100" />
          <p style="font-size: 9px; margin-top: 10px; color: #888; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Verified Digital Manifest</p>
        </div>

        <div class="footer">
          Computer Generated Document • No Signature Required • SolMak ERP Suite
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter(po => {
      const matchesSearch = po.id.toLowerCase().includes(search.toLowerCase()) || 
                           po.supplierName.toLowerCase().includes(search.toLowerCase()) ||
                           po.purchaserName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => b.id.localeCompare(a.id));
  }, [purchaseOrders, search, statusFilter]);

  const stats = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    const monthOrders = purchaseOrders.filter(po => po.date.startsWith(month));
    const totalMonth = monthOrders.reduce((sum, po) => sum + po.totalAmount, 0);
    const pending = purchaseOrders.filter(po => po.status === 'Pending').length;
    return { totalMonth, pending };
  }, [purchaseOrders]);

  const generateUniquePONumber = () => {
    const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    return `PO-${datePart}-${randomPart}`;
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === newPO.supplierId);
    if (!supplier || newPO.items.some(i => !i.itemId)) return;

    const total = newPO.items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);
    const order: PurchaseOrder = {
      id: generateUniquePONumber(),
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierCategory: supplier.category,
      date: new Date().toISOString().split('T')[0],
      purchaserName: currentUser.name,
      items: newPO.items,
      totalAmount: total,
      deliveryDate: newPO.deliveryDate,
      paymentDate: newPO.paymentDate,
      paymentTerms: newPO.paymentTerms,
      status: 'Pending'
    };

    setPurchaseOrders(prev => [order, ...prev]);
    setShowAddModal(false);
    setNewPO({ 
        supplierId: '', 
        deliveryDate: new Date().toISOString().split('T')[0],
        paymentDate: new Date().toISOString().split('T')[0],
        paymentTerms: 'Cash',
        items: [{ itemId: '', name: '', quantity: 1, unitPrice: 0 }] 
    });
  };

  const receiveOrder = (po: PurchaseOrder) => {
    if (po.status !== 'Pending') return;
    
    setInventory(prev => prev.map(item => {
      const orderedItem = po.items.find(pi => pi.itemId === item.id);
      if (orderedItem) {
        return {
          ...item,
          stock: item.stock + orderedItem.quantity,
          purchasePrice: orderedItem.unitPrice,
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    }));

    setPurchaseOrders(prev => prev.map(p => 
      p.id === po.id ? { ...p, status: 'Received' } : p
    ));
  };

  const addItemRow = () => {
    setNewPO(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', name: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const updateItemRow = (index: number, itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    const newItems = [...newPO.items];
    newItems[index] = {
      itemId,
      name: item.name,
      quantity: 1,
      unitPrice: item.purchasePrice
    };
    setNewPO({ ...newPO, items: newItems });
  };

  const cardBg = darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl';
  const innerCardBg = darkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-100';
  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-7xl mx-auto pb-12 px-2 md:px-0">
      {/* Page Header */}
      <div className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8 ${cardBg} backdrop-blur-md`}>
        <div className="flex items-center gap-4 md:gap-8 w-full lg:w-auto">
          <div className="p-4 md:p-6 rounded-[2rem] border shadow-2xl transition-transform hover:scale-105 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <ShoppingBag size={window.innerWidth < 768 ? 28 : 44} />
          </div>
          <div>
            <h2 className={`text-2xl md:text-5xl font-black tracking-tighter ${headingColor}`}>{lang === 'bn' ? 'পারচেজ অর্ডার' : 'Purchase Order'}</h2>
            <p className="text-zinc-500 font-medium text-xs md:text-base mt-1.5">{lang === 'bn' ? 'স্টক এবং প্রকিউরমেন্ট পোর্টাল।' : 'Advanced Stock & Procurement Hub.'}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full lg:w-auto text-white px-8 md:px-12 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] md:text-sm flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl"
          style={{ backgroundColor: themeColor, boxShadow: `0 25px 50px -12px ${themeColor}50` }}
        >
          <Plus size={24} />
          {lang === 'bn' ? 'নতুন পারচেজ অর্ডার' : 'Initiate New PO'}
        </button>
      </div>

      {/* Analytics Micro Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
        <div className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border group hover:translate-y-[-5px] transition-all ${cardBg}`}>
           <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">{lang === 'bn' ? 'মাসিক খরচ' : 'Monthly Spend'}</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><TrendingUp size={16}/></div>
           </div>
           <p className={`text-2xl md:text-4xl font-black ${headingColor}`}>৳{stats.totalMonth.toLocaleString()}</p>
        </div>
        <div className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border group hover:translate-y-[-5px] transition-all ${cardBg}`}>
           <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">{lang === 'bn' ? 'পেন্ডিং অর্ডার' : 'Active POs'}</span>
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"><Clock size={16}/></div>
           </div>
           <p className={`text-2xl md:text-4xl font-black text-rose-500`}>{stats.pending}</p>
        </div>
      </div>

      {/* Filter & Search Hub */}
      <div className={`p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] border flex flex-col md:flex-row gap-4 md:gap-6 ${darkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-100 shadow-xl'}`}>
        <div className="relative flex-1 group">
          <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder={lang === 'bn' ? 'আইডি বা সরবরাহকারী খুঁজুন...' : 'Search by Ref ID or Partner Name...'} 
            className={`w-full border rounded-2xl md:rounded-3xl pl-14 md:pl-16 pr-6 py-4 md:py-5 text-sm md:text-base font-bold focus:outline-none transition-all ${darkMode ? 'bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-700 focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-emerald-600 shadow-inner'}`} 
          />
        </div>
        <div className="relative min-w-[200px]">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl border text-[10px] md:text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer pr-12 ${darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`}
          >
            <option value="All">All Transactions</option>
            <option value="Pending">Pending Fulfillment</option>
            <option value="Received">Completed / Stocked</option>
            <option value="Cancelled">Voided</option>
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Table Section */}
      <div className={`border rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px] md:min-w-full">
            <thead className={`text-[9px] md:text-[11px] uppercase font-black tracking-[0.2em] border-b ${darkMode ? 'text-zinc-600 border-zinc-800 bg-zinc-950/40' : 'text-zinc-400 border-zinc-100 bg-zinc-50'}`}>
              <tr>
                <th className="px-6 md:px-10 py-6 md:py-8">Log Reference</th>
                <th className="px-6 md:px-10 py-6 md:py-8">Supplier Entity</th>
                <th className="px-6 md:px-10 py-6 md:py-8">Responsible Staff</th>
                <th className="px-6 md:px-10 py-6 md:py-8">Settlement Amount</th>
                <th className="px-6 md:px-10 py-6 md:py-8">Status</th>
                <th className="px-6 md:px-10 py-6 md:py-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {filteredOrders.map(po => (
                <tr key={po.id} className={`hover:bg-zinc-800/10 transition-all cursor-pointer group`} onClick={() => setSelectedPO(po)}>
                  <td className="px-6 md:px-10 py-6">
                    <span className="font-mono text-[10px] md:text-xs font-black text-emerald-500 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">{po.id}</span>
                  </td>
                  <td className="px-6 md:px-10 py-6">
                    <p className={`font-black text-sm md:text-base ${headingColor}`}>{po.supplierName}</p>
                    <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black mt-1 tracking-wider">{po.supplierCategory}</p>
                  </td>
                  <td className="px-6 md:px-10 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 shadow-sm"><img src={`https://picsum.photos/seed/${po.purchaserName}/32/32`} /></div>
                        <span className={`text-xs md:text-sm font-bold ${headingColor}`}>{po.purchaserName}</span>
                    </div>
                  </td>
                  <td className={`px-6 md:px-10 py-6 font-black ${headingColor} text-base md:text-xl tracking-tighter`}>৳{po.totalAmount.toLocaleString()}</td>
                  <td className="px-6 md:px-10 py-6">
                    <span className={`px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      po.status === 'Received' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      po.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 md:px-10 py-6 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-3">
                        <button 
                            onClick={() => setSelectedPO(po)}
                            className={`p-3 rounded-xl border transition-all ${darkMode ? 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500' : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900 shadow-sm'}`}
                        >
                            <Eye size={18} />
                        </button>
                        {po.status === 'Pending' && (
                        <button 
                            onClick={() => receiveOrder(po)}
                            className="p-3 bg-emerald-500 text-white rounded-xl hover:scale-110 active:scale-90 transition-all shadow-xl"
                            style={{ boxShadow: `0 10px 20px -5px ${themeColor}60` }}
                        >
                            <CheckCircle size={18} />
                        </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="py-24 text-center flex flex-col items-center justify-center opacity-30">
               <Layers size={64} className="text-zinc-500 mb-4" />
               <p className="font-black uppercase tracking-[0.5em] text-xs">No Records Synchronized</p>
            </div>
          )}
        </div>
      </div>

      {/* Modern PO Entry Form - Gilded & Responsive */}
      {showAddModal && (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-6 animate-fade-in overflow-y-auto ${darkMode ? 'bg-black/85' : 'bg-zinc-900/40'} backdrop-blur-3xl`}>
          <div className={`w-full max-w-4xl rounded-[2.5rem] md:rounded-[4.5rem] p-6 md:p-14 my-auto shadow-2xl border animate-scale-in relative overflow-hidden ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: themeColor }} />
            
            <div className="flex justify-between items-center mb-10 md:mb-16">
              <div>
                <h3 className={`text-2xl md:text-5xl font-black tracking-tight ${headingColor}`}>{lang === 'bn' ? 'পারচেজ অর্ডার এন্ট্রি' : 'Purchase Order Ledger'}</h3>
                <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mt-2">New Sourcing Request Verification</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className={`p-4 rounded-2xl transition-all ${darkMode ? 'text-zinc-600 hover:text-rose-500 bg-zinc-900' : 'text-zinc-400 hover:text-rose-600 bg-zinc-50'}`}><X size={32}/></button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-10 md:space-y-16">
              {/* Entity Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-4">
                    <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] ml-2 text-zinc-500 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Authorized Supplier
                    </label>
                    <div className="relative group">
                        <select 
                            required 
                            value={newPO.supplierId} 
                            onChange={e => setNewPO({...newPO, supplierId: e.target.value})}
                            className={`w-full border rounded-2xl md:rounded-[2rem] pl-6 md:pl-10 pr-12 py-4 md:py-6 text-sm md:text-base font-bold outline-none transition-all appearance-none ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500 focus:bg-zinc-900/50' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`}
                        >
                            <option value="">Select Vendor Account</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} — {s.category}</option>)}
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={20} />
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] ml-2 text-zinc-500 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Settlement Terms
                    </label>
                    <div className={`flex p-2 rounded-2xl md:rounded-[2rem] border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-inner'}`}>
                        <button 
                            type="button" 
                            onClick={() => setNewPO({...newPO, paymentTerms: 'Cash'})}
                            className={`flex-1 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${newPO.paymentTerms === 'Cash' ? 'bg-emerald-600 text-white shadow-2xl scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <CreditCard size={16} className="inline mr-2" /> Cash
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setNewPO({...newPO, paymentTerms: 'Credit'})}
                            className={`flex-1 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${newPO.paymentTerms === 'Credit' ? 'bg-blue-600 text-white shadow-2xl scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Landmark size={16} className="inline mr-2" /> Credit
                        </button>
                    </div>
                </div>
              </div>

              {/* Scheduling Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-4">
                    <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] ml-2 text-zinc-500 flex items-center gap-3"><Calendar size={16} /> Fulfillment Schedule</label>
                    <input 
                        type="date" 
                        required 
                        value={newPO.deliveryDate} 
                        onChange={e => setNewPO({...newPO, deliveryDate: e.target.value})}
                        className={`w-full border rounded-2xl md:rounded-[2rem] px-8 md:px-10 py-4 md:py-6 text-sm md:text-base font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950 shadow-inner'}`}
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] ml-2 text-zinc-500 flex items-center gap-3"><Clock size={16} /> Disbursement Date</label>
                    <input 
                        type="date" 
                        required 
                        value={newPO.paymentDate} 
                        onChange={e => setNewPO({...newPO, paymentDate: e.target.value})}
                        className={`w-full border rounded-2xl md:rounded-[2rem] px-8 md:px-10 py-4 md:py-6 text-sm md:text-base font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950 shadow-inner'}`}
                    />
                </div>
              </div>

              {/* Items Table Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-800/50 pb-6">
                  <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] ml-2 text-zinc-500">Procurement Items Inventory</label>
                  <button type="button" onClick={addItemRow} className="text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl" style={{ backgroundColor: themeColor }}>
                    + Append Item
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar p-1">
                  {newPO.items.map((row, idx) => (
                    <div key={idx} className={`flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 animate-scale-in items-center p-6 md:p-3 rounded-3xl border transition-all ${darkMode ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-600' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200 shadow-sm'}`}>
                      <div className="w-full md:col-span-6 relative">
                        <select 
                          required 
                          value={row.itemId}
                          onChange={e => updateItemRow(idx, e.target.value)}
                          className={`w-full border rounded-xl md:rounded-2xl pl-5 md:pl-8 pr-10 py-4 text-xs md:text-sm font-bold outline-none appearance-none transition-all ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950 shadow-sm'}`}
                        >
                          <option value="">Choose Stock Item</option>
                          {inventory.map(i => <option key={i.id} value={i.id}>{i.name} — [SKU: {i.sku}]</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={16} />
                      </div>
                      <div className="w-full md:col-span-2">
                        <input 
                          type="number" 
                          min="1" 
                          value={row.quantity} 
                          onChange={e => {
                            const newItems = [...newPO.items];
                            newItems[idx].quantity = parseInt(e.target.value);
                            setNewPO({...newPO, items: newItems});
                          }}
                          className={`w-full border rounded-xl md:rounded-2xl px-4 py-4 text-xs md:text-sm font-black text-center outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950'}`}
                          placeholder="Quantity"
                        />
                      </div>
                      <div className="w-full md:col-span-3">
                        <input 
                          type="number" 
                          step="0.01" 
                          value={row.unitPrice}
                          onChange={e => {
                            const newItems = [...newPO.items];
                            newItems[idx].unitPrice = parseFloat(e.target.value);
                            setNewPO({...newPO, items: newItems});
                          }}
                          className={`w-full border rounded-xl md:rounded-2xl px-4 py-4 text-xs md:text-sm font-black text-center outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500' : 'bg-white border-zinc-200 text-zinc-950'}`}
                          placeholder="Unit Price"
                        />
                      </div>
                      <div className="w-full md:col-span-1 flex items-center justify-end md:justify-center">
                        <button 
                          type="button" 
                          onClick={() => setNewPO(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }))}
                          className="text-rose-500 p-3 hover:bg-rose-500/10 rounded-xl transition-all hover:scale-110"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Section */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 pt-8 border-t border-zinc-800/50">
                <button type="button" onClick={() => setShowAddModal(false)} className={`order-2 md:order-1 flex-1 py-5 md:py-6 font-black uppercase text-xs tracking-widest rounded-2xl md:rounded-[2.5rem] transition-all ${darkMode ? 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200'}`}>Discard Draft</button>
                <button type="submit" className="order-1 md:order-2 flex-1 py-5 md:py-6 text-white font-black uppercase text-xs md:text-sm tracking-[0.2em] rounded-2xl md:rounded-[2.5rem] shadow-2xl active:scale-95 flex items-center justify-center gap-4 transition-all" style={{ backgroundColor: themeColor, boxShadow: `0 30px 60px -15px ${themeColor}60` }}>
                  <ShoppingCart size={22} /> Commit To Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View / Receipt View */}
      {selectedPO && (
        <div className={`fixed inset-0 z-[250] flex items-center justify-center p-4 animate-fade-in overflow-y-auto ${darkMode ? 'bg-black/92' : 'bg-zinc-900/40'} backdrop-blur-3xl`}>
          <div className={`border w-full max-w-2xl rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 my-auto shadow-2xl relative ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl shadow-inner border border-emerald-500/10"><QrCode size={window.innerWidth < 768 ? 24 : 32} /></div>
                <div>
                  <h3 className={`text-2xl md:text-3xl font-black tracking-tighter ${headingColor}`}>Digital Manifest</h3>
                  <p className="text-zinc-500 text-[9px] md:text-[11px] font-black uppercase tracking-widest mt-1">Ref: {selectedPO.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPO(null)} className="p-3 text-zinc-500 hover:text-rose-500 transition-colors"><X size={32}/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div className="space-y-6">
                 <div>
                   <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Supplier Profile</p>
                   <p className={`text-xl md:text-2xl font-black ${headingColor}`}>{selectedPO.supplierName}</p>
                   <p className="text-[11px] md:text-xs text-zinc-500 font-bold uppercase">{selectedPO.supplierCategory}</p>
                 </div>
                 <div className="flex justify-between md:flex-col md:justify-start gap-4">
                   <div>
                     <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Authorized By</p>
                     <p className={`text-xs md:text-sm font-black ${headingColor}`}>{selectedPO.purchaserName}</p>
                   </div>
                   <div>
                     <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Terms</p>
                     <span className={`inline-block px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest ${selectedPO.paymentTerms === 'Cash' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'}`}>
                        {selectedPO.paymentTerms}
                     </span>
                   </div>
                 </div>
              </div>
              <div className="flex flex-col items-center justify-center md:border-l border-zinc-800/60 md:pl-10">
                <div className="p-5 bg-white rounded-[2.5rem] shadow-2xl mb-4 group cursor-pointer transition-transform hover:rotate-2">
                   <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedPO.id}&bgcolor=ffffff&color=000000`} 
                    alt="PO QR Code" 
                    className="w-28 h-28 md:w-36 md:h-36"
                   />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">Encrypted Asset Link</p>
              </div>
            </div>

            <div className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border ${innerCardBg} mb-10 shadow-inner overflow-hidden relative`}>
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-800/50 pb-3">Manifest Summary</h4>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedPO.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-zinc-800 flex items-center justify-center font-mono text-xs md:text-sm font-black text-emerald-500 border border-zinc-700">{item.quantity}</span>
                            <div>
                                <p className={`font-black text-xs md:text-sm ${headingColor} group-hover:text-emerald-500 transition-colors`}>{item.name}</p>
                                <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black tracking-wider">৳{item.unitPrice} / Item</p>
                            </div>
                        </div>
                        <span className={`font-mono text-xs md:text-sm font-black ${headingColor}`}>৳{(item.quantity * item.unitPrice).toLocaleString()}</span>
                    </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-800/50 flex justify-between items-center">
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Net Valuation</span>
                <span className="text-2xl md:text-4xl font-black text-emerald-500 tracking-tighter">৳{selectedPO.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <button 
                onClick={handlePrint} 
                className={`flex-1 flex items-center justify-center gap-3 py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${darkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}
              >
                <Printer size={18} /> Print Record
              </button>
              <button 
                onClick={() => setSelectedPO(null)}
                className="flex-1 py-4 md:py-6 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-2xl md:rounded-[2.5rem] shadow-2xl transition-all"
                style={{ backgroundColor: themeColor }}
              >
                Close Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchase;
