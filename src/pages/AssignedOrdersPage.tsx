import React from 'react';
import { Truck, Search, Eye } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function AssignedOrdersPage() {
  const mockAssigned = [
    { id: '#ORD-9821', deliveryBoy: 'Ravi Kumar', status: 'On the way', destination: 'Civil Lines, Sultanpur, UP' },
    { id: '#ORD-9822', deliveryBoy: 'Suresh Patel', status: 'Picked Up', destination: 'Gomti Nagar, Sultanpur, UP' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Assigned Orders</h1>
        <p className="text-slate-500 mt-1">Track orders assigned to delivery personnel.</p>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by order ID or delivery boy..." className="pl-10 pr-4 py-2 w-full md:w-80 border rounded-lg text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Delivery Boy</th>
                  <th className="px-6 py-4 font-medium">Destination</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {mockAssigned.map((order, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4">{order.deliveryBoy}</td>
                    <td className="px-6 py-4">{order.destination}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md font-medium text-xs">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-5 h-5 inline" />
                      </button>
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
