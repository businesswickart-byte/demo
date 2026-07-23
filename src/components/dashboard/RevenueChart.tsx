import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';

const data = [
  { date: '18 May', revenue: 0, orders: 0 },
  { date: '19 May', revenue: 0, orders: 0 },
  { date: '21 May', revenue: 50000, orders: 8 },
  { date: '22 May', revenue: 12000, orders: 2 },
  { date: '23 May', revenue: 25000, orders: 5 },
  { date: '24 May', revenue: 35000, orders: 7 },
  { date: '25 May', revenue: 20000, orders: 4 },
  { date: '26 May', revenue: 28000, orders: 7 },
  { date: '28 May', revenue: 15000, orders: 3 },
  { date: '30 May', revenue: 10000, orders: 2 },
  { date: '01 Jun', revenue: 5000, orders: 1 },
  { date: '02 Jun', revenue: 22000, orders: 5 },
  { date: '03 Jun', revenue: 0, orders: 0 },
];

export function RevenueChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Revenue vs Orders</CardTitle>
          <CardDescription>Last 30 days performance</CardDescription>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-slate-500 font-medium">Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
            <span className="text-xs text-slate-500 font-medium">Revenue</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }} 
                dy={10}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }} 
                tickFormatter={(val) => `₹${val/1000}k`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748B' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#14B8A6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#14B8A6' }}
              />
              <Area 
                yAxisId="right"
                type="step" 
                dataKey="orders" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="none" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
