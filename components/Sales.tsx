
import React, { useState, useMemo, memo } from 'react';
import { ShoppingCart, TrendingUp, User, Calendar, CheckCircle, Clock, AlertTriangle, Search, Plus, X, Trash2, ChevronDown, CreditCard, Box, Hash, Eye, Printer, Download, QrCode, FileText } from 'lucide-react';
import { SaleRecord, Language, InventoryItem, Transaction } from '../types';

interface SalesProps {
  t: any;
  sales: SaleRecord[];
  setSales: React.Dispatch<React.SetStateAction<SaleRecord[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  themeColor: string;
  darkMode: boolean;
  lang: Language;
}

// Memoized Table Row for better scroll performance
const SaleRow = memo(({ s, darkMode, headingColor, onClick, onEyeClick }: { 
  s: SaleRecord, 
  darkMode: boolean, 
  headingColor: string, 
  onClick: () => void,
  onEyeClick: (e: React.MouseEvent) => void 
}) => (
  <tr 
    className="hover:bg-zinc-800/10 transition-colors cursor-pointer group will-change-transform"
    onClick={onClick}
  >
    <td className="px-10 py-6 font-mono text-emerald-500 font-black">{s.id}</td>
    <td className="px-10 py-6">
      <p className={`font-black ${headingColor}`}>{s.customerName}</p>
      <p className="text-[10px] text-zinc-500 font-bold uppercase">{s.date}</p>
    </td>
    <td className="px-10 py-6 font-bold text-center">{s.items}</td>
    <td className="px-10 py-6 font-black text-lg">৳{s.total.toLocaleString()}</td>
    <td className="px-10 py-6">
      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
        s.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
        s.status === 'Unpaid' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
        'bg-amber-500/10 text-amber-500 border-amber-500/20'
      }`}>
        {s.status}
      </span>
    </td>
    <td className="px-10 py-6 text-right">
      <button 
        onClick={onEyeClick}
        className={`p-3 rounded-xl border transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white' : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900 shadow-sm'}`}
      >
        <Eye size={18} />
      </button>
    </td>
  </tr>
));

// Helper to convert number to words
const numberToWords = (num: number): string => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const n: any = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; 
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() ? str.trim() + ' Taka Only' : 'Zero Taka';
};

const Sales: React.FC<SalesProps> = ({ t, sales, setSales, inventory, setInventory, transactions, setTransactions, themeColor, darkMode, lang }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newSale, setNewSale] = useState({
    customerName: '',
    items: [{ itemId: '', quantity: 1, unitPrice: 0 }]
  });

  const handleAddItemRow = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { itemId: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleUpdateItem = (index: number, itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    const newItems = [...newSale.items];
    newItems[index] = { itemId, quantity: 1, unitPrice: item.mrp || 0 };
    setNewSale({ ...newSale, items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    setNewSale({
      ...newSale,
      items: newSale.items.filter((_, i) => i !== index)
    });
  };

  const calculateTotal = useMemo(() => {
    return newSale.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }, [newSale.items]);

  const handlePrint = (sale: SaleRecord) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;
    const now = new Date().toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${sale.id}</title>
        <link href="https://fonts.maateen.me/fn-rojhan-lipika/font.css" rel="stylesheet">
        <style>
          body { font-family: 'FN Rojhan Lipika', sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 4px solid ${themeColor}; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 32px; font-weight: 900; color: ${themeColor}; margin: 0; text-transform: uppercase; }
          .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .info-block h4 { text-transform: uppercase; font-size: 10px; letter-spacing: 2px; color: #888; margin-bottom: 8px; }
          .info-block p { font-size: 16px; font-weight: bold; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f9f9f9; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; padding: 12px; text-align: left; border-bottom: 2px solid #eee; }
          td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
          .total-section { display: flex; justify-content: flex-end; border-top: 2px solid #333; padding-top: 15px; }
          .total-box { text-align: right; }
          .total-box span { font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; }
          .total-box h2 { font-size: 36px; font-weight: 900; margin: 5px 0 0 0; color: ${themeColor}; }
          .in-words { font-size: 10px; color: #666; font-style: italic; margin-top: 10px; text-transform: uppercase; font-weight: bold; }
          .timestamp { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }
          .footer { margin-top: 60px; text-align: center; font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; border-top: 1px solid #eee; padding-top: 20px; }
          .qr-code { text-align: center; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">SALES INVOICE</h1>
            <p style="font-size: 12px; color: #666; font-weight: bold; margin-top: 5px;">Reference: ${sale.id}</p>
            <p class="timestamp">Generated on: ${now}</p>
          </div>
          <div style="text-align: right"><p style="font-weight: bold; margin: 0;">Date: ${sale.date}</p><p style="font-size: 11px; color: #888; margin-top: 4px;">Status: ${sale.status}</p></div>
        </div>
        <div class="info-grid">
          <div class="info-block"><h4>Bill To</h4><p>${sale.customerName}</p></div>
          <div class="info-block" style="text-align: right;"><h4>Issued By</h4><p>SolMak ERP Suite</p></div>
        </div>
        <table>
          <thead><tr><th>Description</th><th style="text-align: center;">Qty</th><th style="text-align: right;">Amount</th></tr></thead>
          <tbody><tr><td>Standard Sales Transaction</td><td style="text-align: center;">${sale.items} items</td><td style="text-align: right;">৳${sale.total.toLocaleString()}</td></tr></tbody>
        </table>
        <div class="total-section"><div class="total-box"><span>Grand Total</span><h2>৳${sale.total.toLocaleString()}</h2><p class="in-words">In Words: ${numberToWords(sale.total)}</p></div></div>
        <div class="qr-code"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${sale.id}" width="100" /></div>
        <div class="footer">This is a computer-generated invoice from SolMak ERP. Printed at ${now}</div>
        <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };</script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSale.customerName || newSale.items.some(i => !i.itemId)) {
      alert(lang === 'bn' ? 'দয়া করে সব তথ্য পূরণ করুন' : 'Please fill all details');
      return;
    }
    const saleId = `SL-${Date.now().toString().slice(-4)}`;
    const totalAmount = calculateTotal;
    const record: SaleRecord = { id: saleId, customerName: newSale.customerName, date: new Date().toISOString().split('T')[0], total: totalAmount, items: newSale.items.length, status: 'Paid' };
    setSales(prev => [record, ...prev]);
    setInventory(prev => prev.map(invItem => {
      const soldItem = newSale.items.find(i => i.itemId === invItem.id);
      if (soldItem) return { ...invItem, stock: Math.max(0, invItem.stock - soldItem.quantity) };
      return invItem;
    }));
    const tx: Transaction = { id: `TX-SL-${Date.now().toString().slice(-4)}`, date: new Date().toISOString().split('T')[0], category: `Sale: ${newSale.customerName}`, amount: totalAmount, type: 'credit', status: 'Completed' };
    setTransactions(prev => [tx, ...prev]);
    setNewSale({ customerName: '', items: [{ itemId: '', quantity: 1, unitPrice: 0 }] });
    setShowAddModal(false);
  };

  const filteredSales = useMemo(() => {
    return sales.filter(s => s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [sales, searchQuery]);

  const headingColor = darkMode ? 'text-white' : 'text-zinc-950';
  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl';
  const innerCardBg = darkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-100';

  const previewTime = new Date().toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10 smooth-scroll">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${headingColor}`}>
            <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: themeColor }} />
            {t.modules.SALES}
          </h2>
          <p className="text-zinc-500 font-medium mt-1">{lang === 'bn' ? 'কাস্টমার ইনভয়েসিং এবং সেলস ট্র্যাকিং' : 'Customer Invoicing & Sales Tracking'}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2" style={{ backgroundColor: themeColor }}>
          <Plus size={18} /> {lang === 'bn' ? 'নতুন ইনভয়েস' : 'Create Invoice'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
          <TrendingUp className="text-emerald-500 mb-4" size={32} />
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{lang === 'bn' ? 'মোট বিক্রয়' : 'Total Revenue'}</p>
          <p className={`text-3xl font-black mt-1 ${headingColor}`}>৳{sales.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</p>
        </div>
        <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
          <ShoppingCart className="text-blue-500 mb-4" size={32} />
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{lang === 'bn' ? 'অর্ডার সংখ্যা' : 'Order Count'}</p>
          <p className={`text-3xl font-black mt-1 ${headingColor}`}>{sales.length}</p>
        </div>
        <div className={`p-8 rounded-[2.5rem] border ${cardBg}`}>
          <AlertTriangle className="text-rose-500 mb-4" size={32} />
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{lang === 'bn' ? 'বকেয়া ইনভয়েস' : 'Unpaid Invoices'}</p>
          <p className={`text-3xl font-black mt-1 ${headingColor}`}>{sales.filter(s => s.status === 'Unpaid').length}</p>
        </div>
      </div>

      <div className={`p-4 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
        <Search className="text-zinc-500 ml-2" size={20} />
        <input type="text" placeholder={lang === 'bn' ? 'কাস্টমার বা আইডি দিয়ে খুঁজুন...' : 'Search by customer or ID...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`flex-1 bg-transparent border-none outline-none text-sm font-medium ${headingColor}`} />
      </div>

      <div className={`border rounded-[3rem] overflow-hidden list-container ${darkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-2xl'}`}>
        <table className="w-full text-left">
          <thead className={`text-[10px] uppercase font-black tracking-[0.2em] border-b ${darkMode ? 'text-zinc-600 border-zinc-800' : 'text-zinc-400 border-zinc-100'}`}>
            <tr><th className="px-10 py-6">Invoice ID</th><th className="px-10 py-6">Customer</th><th className="px-10 py-6 text-center">Items</th><th className="px-10 py-6">Amount</th><th className="px-10 py-6">Status</th><th className="px-10 py-6 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {filteredSales.map(s => (
              <SaleRow 
                key={s.id} 
                s={s} 
                darkMode={darkMode} 
                headingColor={headingColor} 
                onClick={() => setSelectedSale(s)} 
                onEyeClick={(e) => { e.stopPropagation(); setSelectedSale(s); }}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedSale && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/92 backdrop-blur-3xl animate-fade-in overflow-y-auto">
          <div className={`border w-full max-w-2xl rounded-[3rem] md:rounded-[4rem] p-8 md:p-14 my-auto shadow-2xl relative ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl shadow-inner border border-emerald-500/10"><FileText size={32} /></div>
                <div><h3 className={`text-2xl md:text-3xl font-black tracking-tighter ${headingColor}`}>Sales Manifest</h3><p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest mt-1">Invoice Ref: {selectedSale.id}</p></div>
              </div>
              <button onClick={() => setSelectedSale(null)} className="p-3 text-zinc-500 hover:text-rose-500 transition-colors"><X size={32}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Customer / Client</p>
                   <p className={`text-xl md:text-2xl font-black ${headingColor}`}>{selectedSale.customerName}</p>
                   <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Viewing at: {previewTime}</p>
                 </div>
                 <div><p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Payment Status</p><span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${selectedSale.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>{selectedSale.status}</span></div>
              </div>
              <div className="flex flex-col items-center justify-center md:border-l border-zinc-800/60 md:pl-10">
                <div className="p-4 bg-white rounded-[2rem] shadow-2xl mb-4 group cursor-pointer transition-transform hover:rotate-2">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${selectedSale.id}&bgcolor=ffffff&color=000000`} alt="Invoice QR" className="w-24 h-24 md:w-32 md:h-32" />
                </div>
              </div>
            </div>
            <div className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border ${innerCardBg} mb-10 shadow-inner relative overflow-hidden`}>
              <div className="mt-8 pt-8 border-t border-zinc-800/50">
                <div className="flex justify-between items-center"><span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Net Receivable</span><span className="text-3xl md:text-4xl font-black text-emerald-500 tracking-tighter">৳{selectedSale.total.toLocaleString()}</span></div>
                <div className="mt-4 text-right"><p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic">In Words: {numberToWords(selectedSale.total)}</p></div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <button onClick={() => handlePrint(selectedSale)} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all ${darkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}><Printer size={18} /> Print Invoice</button>
              <button onClick={() => handlePrint(selectedSale)} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all text-white shadow-2xl`} style={{ backgroundColor: themeColor }}><Download size={18} /> Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in overflow-y-auto">
          <div className={`w-full max-w-3xl rounded-[3rem] p-10 md:p-14 my-auto shadow-2xl border animate-scale-in relative ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className={`text-3xl md:text-4xl font-black tracking-tight ${headingColor}`}>{lang === 'bn' ? 'নতুন সেলস ইনভয়েস' : 'Create Sales Invoice'}</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Customer Billing Portal</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className={`p-3 rounded-2xl transition-all ${darkMode ? 'text-zinc-600 hover:text-rose-500 bg-zinc-900' : 'text-zinc-400 hover:text-rose-600 bg-zinc-50'}`}><X size={28}/></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-3 text-zinc-500">Customer Name</label>
                <input 
                  required 
                  type="text" 
                  value={newSale.customerName}
                  onChange={e => setNewSale({...newSale, customerName: e.target.value})}
                  placeholder="e.g. John Doe / Walk-in Customer"
                  className={`w-full border rounded-2xl px-6 py-4 font-bold outline-none transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-emerald-500' : 'bg-zinc-50 border-zinc-200 text-zinc-950 shadow-inner'}`} 
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800/50 pb-4">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Billing Items</label>
                   <button type="button" onClick={handleAddItemRow} className="text-xs font-black uppercase text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">+ Add Row</button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {newSale.items.map((row, idx) => (
                    <div key={idx} className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200 shadow-sm'}`}>
                      <div className="col-span-12 md:col-span-6 relative">
                         <select 
                           required
                           value={row.itemId}
                           onChange={e => handleUpdateItem(idx, e.target.value)}
                           className={`w-full border rounded-xl pl-4 pr-10 py-3 text-xs font-bold outline-none appearance-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-950'}`}
                         >
                           <option value="">Select Product</option>
                           {inventory.map(i => <option key={i.id} value={i.id} disabled={i.stock <= 0}>{i.name} (Stock: {i.stock})</option>)}
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={16} />
                      </div>
                      <div className="col-span-5 md:col-span-2">
                         <input 
                           type="number" 
                           min="1"
                           value={row.quantity}
                           onChange={e => {
                             const newItems = [...newSale.items];
                             newItems[idx].quantity = parseInt(e.target.value);
                             setNewSale({...newSale, items: newItems});
                           }}
                           className={`w-full border rounded-xl px-3 py-3 text-xs font-black text-center outline-none ${darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-950'}`}
                           placeholder="Qty"
                         />
                      </div>
                      <div className="col-span-5 md:col-span-3">
                         <div className={`w-full border rounded-xl px-3 py-3 text-xs font-black text-right ${darkMode ? 'bg-zinc-800/50 border-zinc-800 text-emerald-400' : 'bg-zinc-100 border-zinc-100 text-emerald-700'}`}>
                           ৳{(row.unitPrice * row.quantity).toLocaleString()}
                         </div>
                      </div>
                      <div className="col-span-2 md:col-span-1 text-center">
                        <button type="button" onClick={() => handleRemoveItem(idx)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-all"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-8 rounded-[2rem] border flex justify-between items-center ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-emerald-50 border-emerald-100'}`}>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Net Payable</p>
                    <p className={`text-4xl font-black ${headingColor}`}>৳{calculateTotal.toLocaleString()}</p>
                 </div>
                 <div className="flex gap-4">
                   <button type="button" onClick={() => setShowAddModal(false)} className={`px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${darkMode ? 'bg-zinc-800 text-zinc-500 hover:text-white' : 'bg-white border border-zinc-200 text-zinc-400'}`}>Discard</button>
                   <button type="submit" className="px-10 py-4 rounded-xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all" style={{ backgroundColor: themeColor }}>Confirm Sale</button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
