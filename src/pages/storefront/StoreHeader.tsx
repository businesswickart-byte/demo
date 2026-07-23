import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Search, User, Menu, LogOut, Heart, Repeat, ArrowLeft } from 'lucide-react';
import { navigateTo } from '../../lib/navigation';

interface StoreHeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
  cartCount: number;
  wishlistCount?: number;
  compareCount?: number;
  onOpenWishlist?: () => void;
  onOpenCompare?: () => void;
}

export function StoreHeader({ 
  activePage, 
  onNavigate, 
  cartCount,
  wishlistCount = 0,
  compareCount = 0,
  onOpenWishlist,
  onOpenCompare
}: StoreHeaderProps) {
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('companyName') || 'Wikcart');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('customerName') || 'John Doe');
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(() => {
    return localStorage.getItem('isCustomerLoggedIn') === 'true' || !!localStorage.getItem('customerName');
  });

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const name = localStorage.getItem('companyName');
      if (name) {
        setCompanyName(name);
      }
    };

    const handleCustomerAuthUpdate = () => {
      const loggedIn = localStorage.getItem('isCustomerLoggedIn') === 'true' || !!localStorage.getItem('customerName');
      setIsCustomerLoggedIn(loggedIn);
      setCustomerName(localStorage.getItem('customerName') || 'John Doe');
    };

    handleSettingsUpdate();
    handleCustomerAuthUpdate();

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    window.addEventListener('customerAuthUpdated', handleCustomerAuthUpdate);
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('customerAuthUpdated', handleCustomerAuthUpdate);
    };
  }, []);

  const handleCustomerLogout = () => {
    localStorage.removeItem('isCustomerLoggedIn');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerUser');
    setIsCustomerLoggedIn(false);
    window.dispatchEvent(new Event('customerAuthUpdated'));
  };

  const handleQuickDemoCustomerLogin = () => {
    localStorage.setItem('isCustomerLoggedIn', 'true');
    localStorage.setItem('customerName', 'John Doe');
    setIsCustomerLoggedIn(true);
    setCustomerName('John Doe');
    window.dispatchEvent(new Event('customerAuthUpdated'));
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="bg-slate-900 text-white px-4 py-2 text-xs font-medium flex justify-between items-center">
         <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
           <div className="flex items-center gap-2">
             <MapPin className="w-3.5 h-3.5 text-blue-400" />
             <span>Delivery Location: <strong className="text-white">Sultanpur, UP</strong></span>
           </div>
           <div className="flex items-center gap-4">
               <a href="/admin" className="text-amber-400 hover:text-amber-300 font-bold">Admin Portal</a>
               <a href="/vendor-registration" className="hover:text-blue-300">Become a Seller</a>
               <a href="/vendor-login" className="hover:text-blue-300">Vendor Login</a>
           </div>
         </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {activePage !== 'Home' && (
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  onNavigate('Home');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-full transition-all border border-slate-200 cursor-pointer shadow-xs mr-1"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-bold text-2xl tracking-tight text-slate-900 cursor-pointer flex items-center" onClick={() => onNavigate('Home')}>
            <span className="text-blue-600 mr-1">{companyName.substring(0, Math.ceil(companyName.length / 2))}</span>
            <span>{companyName.substring(Math.ceil(companyName.length / 2))}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
           {['Home', 'Products', 'About', 'Contact'].map(item => (
             <button 
               key={item}
               onClick={() => onNavigate(item)}
               className={`text-sm font-semibold transition-colors ${activePage === item ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
             >
               {item}
             </button>
           ))}
         </div>

        <div className="flex-1 max-w-md hidden md:block px-6">
          <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="Search for groceries, electronics..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-700" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {isCustomerLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]" title={customerName}>
                  {customerName}
                </span>
              </div>
              <button
                onClick={handleCustomerLogout}
                title="Customer Logout"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition-colors border border-red-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateTo('/customer-registration')} 
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-full transition-colors border border-slate-200/80 cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Login / Register</span>
              </button>
              <button 
                onClick={handleQuickDemoCustomerLogin}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors border border-blue-200/60 cursor-pointer"
                title="Log in as demo customer"
              >
                <span>Demo Login</span>
              </button>
            </div>
          )}
          
          {/* Compare Button */}
          <button 
            onClick={onOpenCompare} 
            className="relative p-2 text-slate-700 hover:bg-amber-50 hover:text-amber-600 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Compare Products"
          >
            <div className="relative">
               <Repeat className="w-5 h-5" />
               {compareCount > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                   {compareCount}
                 </span>
               )}
            </div>
            <span className="text-xs font-bold hidden md:block">Compare</span>
          </button>

          {/* Wishlist Button */}
          <button 
            onClick={onOpenWishlist} 
            className="relative p-2 text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Wishlist"
          >
            <div className="relative">
               <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
               {wishlistCount > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                   {wishlistCount}
                 </span>
               )}
            </div>
            <span className="text-xs font-bold hidden md:block">Wishlist</span>
          </button>

          {/* Cart Button */}
          <button onClick={() => onNavigate('Cart')} className="relative p-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer">
            <div className="relative">
               <ShoppingCart className="w-5 h-5" />
               {cartCount > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                   {cartCount}
                 </span>
               )}
            </div>
            <span className="text-sm font-bold hidden sm:block">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation side drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu container */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
              <div className="font-bold text-2xl tracking-tight text-slate-900 cursor-pointer flex items-center" onClick={() => { onNavigate('Home'); setMobileMenuOpen(false); }}>
                <span className="text-blue-600 mr-1">{companyName.substring(0, Math.ceil(companyName.length / 2))}</span>
                <span>{companyName.substring(Math.ceil(companyName.length / 2))}</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors font-bold text-xl"
              >
                &times;
              </button>
            </div>

            {/* Mobile-only Search Bar */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-xs focus:bg-white focus:border-blue-500 outline-none transition-all text-slate-700" 
              />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1.5">
              {['Home', 'Products', 'About', 'Contact'].map(item => (
                <button 
                  key={item}
                  onClick={() => {
                    onNavigate(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activePage === item 
                      ? 'bg-blue-50 text-blue-600 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Seller, admin and auth buttons stacked beautifully at bottom of drawer */}
            <div className="mt-auto pt-6 border-t border-slate-100 space-y-2.5">
              {isCustomerLoggedIn ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-none">{customerName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Customer Account</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleCustomerLogout(); setMobileMenuOpen(false); }} 
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200/80 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Customer Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button 
                    onClick={() => { navigateTo('/customer-registration'); setMobileMenuOpen(false); }} 
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <User className="w-4.5 h-4.5 text-slate-400" />
                    <span>Login / Register</span>
                  </button>
                  <button 
                    onClick={() => { handleQuickDemoCustomerLogin(); setMobileMenuOpen(false); }} 
                    className="w-full text-center py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
                  >
                    Login as Demo Customer
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 pt-2">
                <a href="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200/60 transition-colors">
                  Admin Portal
                </a>
                <a href="/vendor-registration" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-250/60 transition-colors">
                  Become a Seller
                </a>
                <a href="/vendor-login" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 px-4 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl border border-slate-200 transition-colors">
                  Vendor Login
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
