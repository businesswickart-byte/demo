import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Plus, Check, Percent } from 'lucide-react';

export function TaxSettingsPage() {
  const taxes = [
    { id: 1, name: 'Standard GST - 18%', rate: '18%', appliesTo: 'Electronics, Fashion', status: 'Active' },
    { id: 2, name: 'Lower GST - 12%', rate: '12%', appliesTo: 'Processed Foods', status: 'Active' },
    { id: 3, name: 'Reduced GST - 5%', rate: '5%', appliesTo: 'Food, Groceries', status: 'Active' },
    { id: 4, name: 'Zero Tax - 0%', rate: '0%', appliesTo: 'Fresh Produce', status: 'Active' },
    { id: 5, name: 'Luxury GST - 28%', rate: '28%', appliesTo: 'Luxury Goods', status: 'Active' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tax Configurations</h1>
          <p className="text-slate-500 mt-1">Manage tax rules and rates applicable to categories and products.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Tax Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {taxes.map((tax) => (
           <Card key={tax.id} className="border-slate-200">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Percent className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-900">{tax.name}</h3>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{tax.status}</span>
                       </div>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{tax.rate}</div>
                 </div>
                 <div className="text-sm text-slate-500">
                    <strong className="text-slate-700">Applies to:</strong> {tax.appliesTo}
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Edit</button>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>
      
      <Card>
        <CardHeader>
           <CardTitle>Global Tax Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                 <h4 className="font-bold text-slate-900 text-sm">Display prices inclusive of tax in storefront</h4>
                 <p className="text-xs text-slate-500 mt-0.5">Customers will see the final price including applied taxes.</p>
              </div>
              <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                 <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-600" />
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
