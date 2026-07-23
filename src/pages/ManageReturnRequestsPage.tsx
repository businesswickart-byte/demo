import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, RotateCcw, Check, X, Eye } from 'lucide-react';

const MOCK_RETURNS = [
  { id: 'RET-001', orderId: '#ORD-9821', customer: 'Alok Nath', reason: 'Damaged Product', date: '06 Jun 2026', status: 'Pending Approval' },
  { id: 'RET-002', orderId: '#ORD-9810', customer: 'Priya Desai', reason: 'Wrong Item Delivered', date: '05 Jun 2026', status: 'Approved' },
  { id: 'RET-003', orderId: '#ORD-9750', customer: 'Rohan Sharma', reason: 'Quality Issue', date: '01 Jun 2026', status: 'Rejected' },
];

export function ManageReturnRequestsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Return Requests</h1>
          <p className="text-slate-500 mt-1">Review and approve customer return requests.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
           <CardTitle>All Returns</CardTitle>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="Search orders..." className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 font-medium">Req ID</th>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Customer / Date</th>
                      <th className="px-6 py-4 font-medium">Reason</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {MOCK_RETURNS.map((req) => (
                     <tr key={req.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{req.id}</td>
                        <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline">{req.orderId}</td>
                        <td className="px-6 py-4">
                           <div className="text-slate-900 font-medium">{req.customer}</div>
                           <div className="text-xs text-slate-500">{req.date}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{req.reason}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            req.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' :
                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors" title="View Details">
                               <Eye className="w-4 h-4" />
                             </button>
                             {req.status === 'Pending Approval' && (
                               <>
                                 <button className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors" title="Approve">
                                   <Check className="w-4 h-4" />
                                 </button>
                                 <button className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors" title="Reject">
                                   <X className="w-4 h-4" />
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
