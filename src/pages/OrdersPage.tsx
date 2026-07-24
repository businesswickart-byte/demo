import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  X, 
  Printer, 
  User, 
  Phone, 
  Store, 
  Package, 
  Bike,
  MapPin
} from 'lucide-react';
import { marketplaceStore, useMarketplaceData, Order } from '../lib/store';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Out for Delivery': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const deliveryPartners = useMarketplaceData('deliveryPartners', () => marketplaceStore.getDeliveryPartners());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const activeDeliveryPartners = deliveryPartners.filter(p => p.status === 'Active');

  const updateOrderStatus = (id: string, newStatus: Order['status'], partnerId?: string) => {
    const list = marketplaceStore.getOrders();
    const updated = list.map(order => {
      if (order.id === id) {
        const item: Order = { ...order, status: newStatus };
        if (partnerId) {
          const partner = deliveryPartners.find(p => p.id === partnerId);
          if (partner) {
            item.deliveryPartnerId = partner.id;
            item.deliveryPartnerName = partner.name;
          }
        }
        return item;
      }
      return order;
    });
    marketplaceStore.saveOrders(updated);
    
    // Keep selectedOrder state in sync if viewing
    if (selectedOrder && selectedOrder.id === id) {
      const refreshed = updated.find(o => o.id === id);
      if (refreshed) setSelectedOrder(refreshed);
    }
  };

  const searchedOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.phone && o.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredOrders = activeTab === 'All' 
    ? searchedOrders 
    : searchedOrders.filter(o => o.status === activeTab);

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders Management</h1>
          <p className="text-slate-500 mt-1">View, track, and process customer orders across all stores.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search orders, phone, store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none shadow-xs font-medium"
            />
          </div>
        </div>
      </div>

      <Card className="border border-slate-200">
        <CardHeader className="border-b border-slate-100 p-0 bg-slate-50/50">
          <div className="flex items-center justify-between px-6 py-3 overflow-x-auto">
            <div className="flex gap-2">
              {['All', 'Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(tab => {
                const count = tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length;
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Customer / Store</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                      <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No orders found for the selected filter.
                    </td>
                  </tr>
                ) : filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td 
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-4 font-bold text-blue-600 cursor-pointer hover:underline"
                    >
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{order.customer}</div>
                      <div className="text-xs text-slate-500 font-medium">{order.store}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200" 
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {order.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Confirmed')} 
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" 
                              title="Approve/Accept Order"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Cancelled')} 
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
                              title="Cancel Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {order.status === 'Confirmed' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Out for Delivery')} 
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" 
                            title="Dispatch Order"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status === 'Out for Delivery' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Delivered')} 
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" 
                            title="Mark Delivered"
                          >
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

      {/* FULL-FEATURED INTERACTIVE ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl border border-slate-200 shadow-2xl bg-white max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-extrabold text-slate-900">{selectedOrder.id}</CardTitle>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Placed on {selectedOrder.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition cursor-pointer"
                  title="Print Invoice"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>

            {/* Modal Body */}
            <CardContent className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Customer & Store Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Customer Information
                  </h4>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrder.customer}</p>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${selectedOrder.phone || '9821054321'}`} className="text-blue-600 hover:underline">
                      {selectedOrder.phone || '+91 98210 54321'}
                    </a>
                  </div>
                  <div className="text-xs text-slate-600 flex items-start gap-1.5 font-medium pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedOrder.address || 'Civil Lines, Sultanpur, Uttar Pradesh - 228001'}</span>
                  </div>
                </div>

                {/* Merchant & Delivery Details */}
                <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-blue-600" /> Store & Courier Info
                  </h4>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrder.store}</p>
                  
                  {/* Assigned Courier */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Bike className="w-3 h-3 text-indigo-600" /> Assigned Courier
                    </p>
                    <select
                      value={selectedOrder.deliveryPartnerId || ''}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, selectedOrder.status, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">-- No Courier Assigned --</option>
                      {activeDeliveryPartners.map(dp => (
                        <option key={dp.id} value={dp.id}>{dp.name} ({dp.type})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-500" /> Order Items & Pricing
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Item Name</th>
                        <th className="px-4 py-2.5 text-center">Qty</th>
                        <th className="px-4 py-2.5 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-bold text-slate-800">{item.name}</td>
                            <td className="px-4 py-3 text-center text-slate-600 font-bold">x{item.qty}</td>
                            <td className="px-4 py-3 text-right font-extrabold text-slate-900">{item.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-3 font-bold text-slate-800">Hyperlocal Marketplace Item</td>
                          <td className="px-4 py-3 text-center text-slate-600 font-bold">x1</td>
                          <td className="px-4 py-3 text-right font-extrabold text-slate-900">{selectedOrder.amount}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Financial Total Summary */}
                  <div className="p-4 bg-slate-50/90 border-t border-slate-200 space-y-1.5 text-xs font-medium">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-800">{selectedOrder.amount}</span>
                    </div>
                    {selectedOrder.discountAmount && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount ({selectedOrder.discountReason || 'Coupon'})</span>
                        <span>-{selectedOrder.discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>Delivery & Handling Fee</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                      <span>Total Amount Payable</span>
                      <span className="text-blue-600 text-base">{selectedOrder.amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Order Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedOrder.status === st 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Store ID: <strong className="text-slate-800">{selectedOrder.store}</strong>
              </span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
