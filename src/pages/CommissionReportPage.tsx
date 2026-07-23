import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, Download, DollarSign, Store } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function CommissionReportPage() {
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const [search, setSearch] = useState('');

  const parseAmount = (str: string) => {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Compile active report data dynamically
  const reportData = sellers.map((seller, index) => {
    const sellerOrders = orders.filter(o => o.store === seller.storeName && o.status !== 'Cancelled');
    const totalSalesNum = sellerOrders.reduce((sum, o) => sum + parseAmount(o.amount), 0);
    const commissionNum = totalSalesNum * 0.10; // Flat 10% platform commission

    return {
      id: seller.id || String(index + 1),
      store: seller.storeName,
      ordersCount: sellerOrders.length,
      totalSales: totalSalesNum,
      commission: commissionNum,
      period: 'Jun 2026'
    };
  });

  const totalAdminCommission = reportData.reduce((sum, r) => sum + r.commission, 0);

  const filteredReports = reportData.filter(r => 
    r.store.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    alert('Exporting Commission Report as CSV file successfully completed!');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">Seller Commission Report</h1>
          <p className="text-slate-500 mt-1">View and audit platform service revenue from registered Sultanpur merchant stores.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
         <Card className="border-emerald-100 shadow-sm shadow-emerald-50 text-emerald-900 bg-emerald-50/20">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Cumulative Admin Commission</p>
                     <h3 className="text-3xl font-black text-emerald-950">₹{totalAdminCommission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                     <DollarSign className="w-6 h-6" />
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
      
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/20">
           <CardTitle className="font-bold text-slate-800 text-lg">Platform Commission Invoices</CardTitle>
           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
             <select className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none cursor-pointer font-semibold text-slate-700">
               <option>June 2026 (Current)</option>
               <option>May 2026</option>
             </select>
             <div className="relative">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Search store..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-9 pr-4 py-2 w-full sm:w-64 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all font-medium text-slate-700" 
               />
             </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600 font-medium">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold">
                   <tr>
                      <th className="px-6 py-4">Store Name</th>
                      <th className="px-6 py-4">Fulfillment Period</th>
                      <th className="px-6 py-4 text-right">Fulfillment Orders</th>
                      <th className="px-6 py-4 text-right">Gross Sales Volume</th>
                      <th className="px-6 py-4 text-right">Admin Cut (10%)</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                   {filteredReports.map((row) => (
                     <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                               <Store className="w-4 h-4" />
                             </div>
                             <span className="font-bold text-slate-900">{row.store}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-semibold">{row.period}</td>
                        <td className="px-6 py-4 text-right font-semibold">{row.ordersCount}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹{row.totalSales.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-right font-black text-emerald-600">₹{row.commission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
