import React from 'react';
import { Search, Bell, Menu, User, Settings, Store, LogOut, ArrowLeft } from 'lucide-react';
import { useActiveSellerStore } from '../../lib/useActiveSellerStore';
import { navigateTo } from '../../lib/navigation';

interface HeaderProps {
  isSeller?: boolean;
  onSettingsClick?: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export function Header({ isSeller = false, onSettingsClick, onMenuClick, onLogout }: HeaderProps) {
  const { activeSellerStoreName, sellers, changeSeller } = useActiveSellerStore();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    if (isSeller) {
      localStorage.removeItem('activeSellerId');
      localStorage.removeItem('activeSellerStoreName');
      sessionStorage.removeItem('sellerAuth');
      navigateTo('/vendor-login');
    } else {
      sessionStorage.removeItem('adminAuth');
      navigateTo('/admin');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo(isSeller ? '/seller' : '/admin');
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200/80 cursor-pointer shadow-xs"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search */}
        <div className="hidden sm:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input 
            type="text" 
            placeholder={isSeller ? `Search ${activeSellerStoreName}...` : "Search stores, orders, products..."} 
            className="pl-9 pr-4 py-2 w-64 lg:w-72 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
           onClick={() => navigateTo('/')}
           className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
        >
           View Storefront
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2 border-r border-slate-200 pr-2 sm:pr-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          <button onClick={onSettingsClick} className="hidden sm:block p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {isSeller ? <Store className="w-4 h-4" /> : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-none">{isSeller ? activeSellerStoreName : 'Admin User'}</p>
              <p className="text-xs text-slate-500 mt-1">{isSeller ? 'Seller Account' : 'Super Admin'}</p>
            </div>
          </div>

          {/* Explicit Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200/80 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
