import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function WithdrawalsPage() {
  const [activeTab, setActiveTab] = useState('Pending');
  const withdrawals = useMarketplaceData('withdrawals', () => marketplaceStore.getWithdrawals());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Withdrawal Requests</h1>
          <p className="text-slate-500 mt-1">Manage seller wallet withdrawal and payout requests.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="border-b border-slate-100 p-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex gap-6">
               {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
            <div className="relative hidden sm:block">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input type="text" placeholder="Search store..." className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 font-medium">Req ID & Date</th>
                      <th className="px-6 py-4 font-medium">Store Name</th>
                      <th className="px-6 py-4 font-medium text-right">Amount Requested</th>
                      <th className="px-6 py-4 font-medium">Bank Account</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {withdrawals.filter(w => activeTab === 'All' || w.status === activeTab).map((row) => (
                     <tr key={row.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-900">{row.id}</div>
                           <div className="text-xs text-slate-500">{row.date}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-blue-600">{row.store}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">{row.requestedAmt}</td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600 block w-fit">{row.account}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                             row.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                             row.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {row.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             {row.status === 'Pending' && (
                               <>
                                 <button className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors" title="Mark Paid / Approve">
                                   <CheckCircle2 className="w-4.5 h-4.5" />
                                 </button>
                                 <button className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors" title="Reject">
                                   <XCircle className="w-4.5 h-4.5" />
                                 </button>
                               </>
                             )}
                           </div>
                        </td>
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
