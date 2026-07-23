import React from 'react';
import { 
  Building2, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Star,
  AlertCircle,
  Truck,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { marketplaceStore, useMarketplaceData } from '../lib/store';

export function Dashboard() {
  const orders = useMarketplaceData('orders', () => marketplaceStore.getOrders());
  const products = useMarketplaceData('products', () => marketplaceStore.getProducts());
  const sellers = useMarketplaceData('sellers', () => marketplaceStore.getSellers());

  // Dynamic KPI Metric calculations
  const totalRevenueNum = sellers.reduce((acc, s) => {
    const revVal = parseFloat(s.revenue.replace(/[^0-9.]/g, '')) || 0;
    return acc + revVal;
  }, 0);
  const totalRevenue = `₹${totalRevenueNum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Out for Delivery').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const listedProductsCount = products.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:px-8 sm:py-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden">
        <div className="z-10 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome Back, <span className="text-blue-600">Admin</span>
          </h1>
          <p className="text-slate-500 max-w-xl">
            Here's what's happening with your marketplace today. You have <strong className="text-slate-900">{sellers.length}</strong> registered sellers online.
          </p>
        </div>
        
        {/* Abstract decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none hidden md:block"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="z-10 flex gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-600/20">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <StatCard 
          title="Total Revenue" 
          value={totalRevenue} 
          subtitle="All active vendors combined"
          icon={TrendingUp}
          highlightColor="teal"
          trend={{ value: 14.2, isPositive: true }}
        />
        <StatCard 
          title="Active Orders" 
          value={String(activeOrdersCount)} 
          subtitle={`${deliveredCount} delivered successfully`}
          icon={ShoppingCart}
          highlightColor="blue"
        />
        <StatCard 
          title="Active Vendors" 
          value={String(sellers.length)} 
          subtitle="Verified stores"
          icon={Building2}
          highlightColor="amber"
          trend={{ value: 25, isPositive: true }}
        />
        <StatCard 
          title="Listed Products" 
          value={String(listedProductsCount)} 
          subtitle="Catalog total"
          icon={Package}
          highlightColor="slate"
        />
        <StatCard 
          title="Total Wallet Balance" 
          value="₹45,200" 
          subtitle="Referral & bonus credits"
          icon={Wallet}
          highlightColor="teal"
          trend={{ value: 12.5, isPositive: true }}
        />
      </div>

      {/* Notifications Row */}
      <div className="grid grid-cols-1 gap-6">
         <Card className="border-rose-100 shadow-sm shadow-rose-100/50">
            <CardHeader className="bg-rose-50/50 border-b border-rose-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                   <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                   <CardTitle className="text-rose-900">Alerts & Action Items</CardTitle>
                   <p className="text-sm text-rose-600/80 mt-0.5">Critical notifications requiring immediate attention</p>
                </div>
                <span className="ml-auto bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">4 New</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-rose-100/50">
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <p className="text-sm font-medium text-slate-800">157 orders unassigned for more than 15 min.</p>
                     </div>
                     <button className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <ArrowRight className="w-3 h-3" />
                     </button>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <p className="text-sm font-medium text-slate-800">4 active zones with no delivery boys.</p>
                     </div>
                     <button className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <ArrowRight className="w-3 h-3" />
                     </button>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <p className="text-sm font-medium text-slate-800">38 products are low on stock (&lt; 5 units).</p>
                     </div>
                     <button className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <ArrowRight className="w-3 h-3" />
                     </button>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <p className="text-sm font-medium text-slate-800">9 sellers have pending payouts &gt; 7 days.</p>
                     </div>
                     <button className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <ArrowRight className="w-3 h-3" />
                     </button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Charts & Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        
        {/* Top Sellers Column (to replace standard chart) */}
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {[
                { name: 'City Square Mart', orders: 167, revenue: '₹192,769', rating: 4.8 },
                { name: 'Bhuj Bus St. store', orders: 45, revenue: '₹22,191', rating: 4.5 },
                { name: 'Silicon Valley Store', orders: 11, revenue: '₹12,390', rating: 4.2 },
                { name: 'Amit Grocery Hub', orders: 2, revenue: '₹650', rating: 3.9 },
                { name: 'Fresh Organic Foods', orders: 1, revenue: '₹120', rating: 5.0 },
              ].map((seller, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                      {seller.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors cursor-pointer">{seller.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{seller.orders} Orders</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs ml-1 font-medium">{seller.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{seller.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
              View All Sellers
            </button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
