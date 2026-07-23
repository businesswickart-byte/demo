import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Search, Filter, Eye, CheckCircle2, XCircle, Truck, MapPin } from 'lucide-react';
import { marketplaceStore } from '../lib/store';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Out for Delivery': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState(() => marketplaceStore.getOrders());
  const [searchQuery, setSearchQuery] = useState('');

  const updateOrderStatus = (id: string, newStatus: any) => {
    const updated = orders.map(order => order.id === id ? { ...order, status: newStatus } : order);
    setOrders(updated);
    marketplaceStore.saveOrders(updated);
  };

  const searchedOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.store.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = activeTab === 'All' 
    ? searchedOrders 
    : searchedOrders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders Management</h1>
          <p className="text-slate-500 mt-1">View, track, and process customer orders across all stores.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-slate-100 p-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex gap-6 overflow-x-auto">
              {['All', 'Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium whitespace-nowrap transition-colors border-b-2 py-1 ${
                    activeTab === tab 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-slate-500 border-transparent hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative hidden sm:block ml-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 transition-colors outline-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Customer / Store</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No orders found for this filter.</td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer hover:underline">{order.id}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{order.customer}</div>
                      <div className="text-xs text-slate-500">{order.store}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors tooltip-trigger" title="View Order">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {order.status === 'Pending' && (
                          <>
                            <button onClick={() => updateOrderStatus(order.id, 'Confirmed')} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors tooltip-trigger" title="Approve/Accept">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors tooltip-trigger" title="Cancel Order">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {order.status === 'Confirmed' && (
                          <button onClick={() => updateOrderStatus(order.id, 'Out for Delivery')} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors tooltip-trigger" title="Dispatch / Out for Delivery">
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(order.status === 'Out for Delivery' || order.status === 'Confirmed') && (
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors tooltip-trigger" title="Track Live">
                            <MapPin className="w-4 h-4" />
                          </button>
                        )}

                        {order.status === 'Out for Delivery' && (
                          <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors tooltip-trigger" title="Mark Complete">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
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
