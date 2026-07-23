import React from 'react';
import { Headset, Mail, Phone, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Support & Help Desk</h1>
        <p className="text-slate-500 mt-1">Manage support tickets and contact support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="flex items-center p-6 gap-4 border-l-4 border-blue-500">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
               <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Live Chat</h3>
              <p className="text-sm text-slate-500">Chat with our support team in real-time.</p>
              <button className="mt-2 text-blue-600 font-medium text-sm hover:underline">Start Chat</button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6 gap-4 border-l-4 border-emerald-500">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
               <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Create a Ticket</h3>
              <p className="text-sm text-slate-500">Submit a support request for complex issues.</p>
              <button className="mt-2 text-emerald-600 font-medium text-sm hover:underline">Open Ticket</button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6 gap-4 border-l-4 border-amber-500">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
               <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Phone Support</h3>
              <p className="text-sm text-slate-500">Call us directly during business hours.</p>
              <p className="mt-2 text-amber-600 font-medium text-sm">1-800-123-4567</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6 gap-4 border-l-4 border-purple-500">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
               <Headset className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Help Center</h3>
              <p className="text-sm text-slate-500">Browse FAQs and tutorials.</p>
              <button className="mt-2 text-purple-600 font-medium text-sm hover:underline">Visit Help Center</button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
         <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Support Tickets</h3>
         </div>
         <CardContent className="p-0 text-center py-12 text-slate-500 flex flex-col items-center">
            <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
            <p>No open support tickets.</p>
         </CardContent>
      </Card>
    </div>
  );
}
