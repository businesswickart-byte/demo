import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Gift, Save, Search, Users } from 'lucide-react';

export function ReferralsPage() {
  const [referrerAmount, setReferrerAmount] = useState('200');
  const [refereeAmount, setRefereeAmount] = useState('200');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const MOCK_HISTORY = [
    { id: 1, referrerRole: 'User', referrerId: 'CUST-390', referrerName: 'Alok Nath', referrerEmail: 'alok@example.com', refereeRole: 'User', refereeId: 'CUST-391', refereeName: 'Vikas Patel', refereeEmail: 'vikas@example.com', date: '06 Jun 2026', status: 'Completed', earned: '₹400.00' },
    { id: 2, referrerRole: 'Vendor', referrerId: 'VEND-102', referrerName: 'Priya Desai', referrerEmail: 'priya@example.com', refereeRole: 'Vendor', refereeId: 'VEND-103', refereeName: 'Rahul Sharma', refereeEmail: 'rahul@example.com', date: '05 Jun 2026', status: 'Pending', earned: '₹0.00' },
    { id: 3, referrerRole: 'User', referrerId: 'CUST-112', referrerName: 'Suresh Kumar', referrerEmail: 'suresh@example.com', refereeRole: 'Vendor', refereeId: 'VEND-108', refereeName: 'Amit Traders', refereeEmail: 'amit.t@example.com', date: '01 Jun 2026', status: 'Completed', earned: '₹400.00' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Referral System</h1>
          <p className="text-slate-500 mt-1">Configure referral reward amounts and track successful invites.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-1">
            <Card>
               <CardHeader className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                     <Gift className="w-5 h-5 text-blue-600" />
                     <CardTitle>Reward Configurations</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Reward for Referrer (₹)</label>
                     <p className="text-xs text-slate-500 mb-2">Amount credited to wallet for sharing code.</p>
                     <input 
                       type="number" 
                       value={referrerAmount}
                       onChange={(e) => setReferrerAmount(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Reward for Referee (₹)</label>
                     <p className="text-xs text-slate-500 mb-2">Amount credited to wallet on signup.</p>
                     <input 
                       type="number" 
                       value={refereeAmount}
                       onChange={(e) => setRefereeAmount(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 outline-none"
                     />
                  </div>
                  <button 
                     onClick={handleSave}
                     className="w-full flex justify-center items-center gap-2 px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                     <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Update Settings'}
                  </button>
               </CardContent>
            </Card>
         </div>
         
         <div className="md:col-span-2">
            <Card>
               <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                  <CardTitle>Detailed Referral Logs</CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search name or ID..." className="pl-9 pr-4 py-1 w-48 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                       <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                          <tr>
                             <th className="px-6 py-4 font-medium">Referrer Details</th>
                             <th className="px-6 py-4 font-medium">Referee Details</th>
                             <th className="px-6 py-4 font-medium text-center">Status / Date</th>
                             <th className="px-6 py-4 font-medium text-right">Total Disbursed</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {MOCK_HISTORY.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50">
                               <td className="px-6 py-4">
                                 <div className="font-medium text-blue-600">{row.referrerName}</div>
                                 <div className="text-xs text-slate-500">{row.referrerId} • {row.referrerRole}</div>
                                 <div className="text-xs text-slate-400">{row.referrerEmail}</div>
                               </td>
                               <td className="px-6 py-4">
                                 <div className="font-medium text-slate-900">{row.refereeName}</div>
                                 <div className="text-xs text-slate-500">{row.refereeId} • {row.refereeRole}</div>
                                 <div className="text-xs text-slate-400">{row.refereeEmail}</div>
                               </td>
                               <td className="px-6 py-4 text-center">
                                 <span className={`inline-flex items-center px-2 py-1 mb-1 rounded-full text-xs font-medium ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {row.status}
                                 </span>
                                 <div className="text-xs text-slate-500">{row.date}</div>
                               </td>
                               <td className="px-6 py-4 font-bold text-slate-900 text-right">{row.earned}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </CardContent>
            </Card>
         </div>
      </div>
      
    </div>
  );
}
