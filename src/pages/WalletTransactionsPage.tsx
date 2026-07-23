import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Wallet, Search, PlusCircle, MinusCircle } from 'lucide-react';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function WalletTransactionsPage() {
  const walletTransactions = useMarketplaceData('walletTransactions', () => marketplaceStore.getWalletTransactions());
  
  // Calculate dynamic outstanding balance
  const outstandingBal = walletTransactions.reduce((acc, curr) => {
    const numericAmt = parseFloat(curr.amount.replace(/[^0-9.-]+/g,""));
    return acc + (curr.type === 'Credit' ? numericAmt : -Math.abs(numericAmt));
  }, 24500); // base value for demo, 0 when empty

  const displayOutstanding = outstandingBal.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Wallet Transactions</h1>
          <p className="text-slate-500 mt-1">Audit customer wallet credits, debits, and loyalty points usage.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <Card className="bg-blue-600 text-white border-0">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-blue-100 font-medium mb-1">Total Outstanding Wallet Balance</p>
                     <h3 className="text-3xl font-bold">{displayOutstanding}</h3>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                     <Wallet className="w-6 h-6 text-white" />
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
           <CardTitle>History</CardTitle>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="Search customer..." className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white outline-none" />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 font-medium">Txn ID / Date</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Details</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Closing Bal.</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {walletTransactions.map((txn) => (
                     <tr key={txn.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-900">{txn.id}</div>
                           <div className="text-xs text-slate-500">{txn.date}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-blue-600">{txn.customer}</td>
                        <td className="px-6 py-4 text-slate-700">{txn.desc}</td>
                        <td className="px-6 py-4">
                           <div className={`flex items-center gap-1.5 font-bold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {txn.type === 'Credit' ? <PlusCircle className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
                              {txn.amount}
                           </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{txn.closingBal}</td>
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
