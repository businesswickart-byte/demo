import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { marketplaceStore } from '../../lib/store';
import { CartItem } from '../../lib/cartStore';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
  cartItems?: CartItem[];
  onClearCart?: () => void;
}

export function CheckoutPage({ onNavigate, cartItems = [], onClearCart }: CheckoutPageProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [isSuccessfullyApplied, setIsSuccessfullyApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 499 || subtotal === 0 ? 0 : 20;
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.05); // 5% tax
  const total = Math.max(0, subtotal + delivery + tax - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneInput = document.querySelector('[name="phone"]') as HTMLInputElement;
    const phoneVal = phoneInput?.value?.trim() || '';

    if (!phoneVal) {
      alert('Please enter your Phone Number in the delivery form first so we can verify coupon eligibility.');
      return;
    }

    if (marketplaceStore.hasPhoneNumberUsedDiscount(phoneVal)) {
      alert(`🚫 Coupon Restriction Error:\n\nPhone number "${phoneVal}" has ALREADY redeemed a coupon or discount on a previous order. Each phone number is allowed only 1 coupon/discount use.`);
      setIsSuccessfullyApplied(false);
      setDiscount(0);
      return;
    }

    const cleanCode = discountCode.trim().toUpperCase();
    const coupons = marketplaceStore.getCoupons();
    const foundCoupon = coupons.find(c => c.code === cleanCode && c.status === 'Active');

    if (foundCoupon) {
      setIsSuccessfullyApplied(true);
      const calculatedDiscount = foundCoupon.discountType === 'percentage' 
        ? Math.round(subtotal * (foundCoupon.value / 100)) 
        : foundCoupon.value;
      setDiscount(calculatedDiscount);
    } else {
      setIsSuccessfullyApplied(false);
      setDiscount(0);
      alert('Invalid or inactive coupon. Try WELCOME50, SUPER10, or create a custom coupon in Admin Panel!');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      onNavigate('Products');
      return;
    }

    const formEl = e.currentTarget as HTMLFormElement;
    const nameInput = formEl.querySelector('[name="fullName"]') as HTMLInputElement;
    const phoneInput = formEl.querySelector('[name="phone"]') as HTMLInputElement;
    const addressInput = formEl.querySelector('[name="address"]') as HTMLInputElement;
    const storeInput = formEl.querySelector('[name="storeSelect"]') as HTMLSelectElement;

    const fullNameVal = nameInput?.value || 'John Doe';
    const phoneVal = phoneInput?.value || '+91 98765 43210';
    const addressVal = addressInput?.value || 'Sultanpur, UP';
    const storeVal = storeInput?.value || (cartItems[0]?.vendor || 'City Square Mart');

    if ((discount > 0 || isSuccessfullyApplied) && marketplaceStore.hasPhoneNumberUsedDiscount(phoneVal)) {
      alert(`🚫 Order Placement Blocked:\n\nPhone number "${phoneVal}" has ALREADY redeemed a coupon or discount on a previous order. Each phone number is strictly restricted to 1 coupon/discount use.`);
      return;
    }

    const orderItems = cartItems.map(item => ({
      name: item.name,
      qty: item.quantity,
      price: `₹${item.price}`
    }));

    // Insert live order into marketplace state engine
    marketplaceStore.addOrder({
      customer: fullNameVal,
      store: storeVal,
      amount: `₹${total.toFixed(2)}`,
      address: addressVal,
      phone: phoneVal,
      items: orderItems,
      discountAmount: discount > 0 ? `₹${discount.toFixed(2)}` : undefined,
      discountReason: discount > 0 ? `Coupon Code: ${discountCode.trim().toUpperCase()}` : undefined
    });

    onClearCart?.();
    setOrderPlaced(true);
    setTimeout(() => {
       onNavigate('Home');
    }, 4000);
  };

  if (orderPlaced) {
    return (
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] flex items-center justify-center py-12 animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl shadow-slate-200/50">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8">Thank you for shopping with Wikcart. Your order has been placed and will be delivered to Sultanpur within 2 hours.</p>
          <button onClick={() => onNavigate('Home')} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-12 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => onNavigate('Cart')} className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-600 cursor-pointer">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Form Section */}
           <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
               <h2 className="font-bold text-xl text-slate-900 mb-6">Delivery Details</h2>
               <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                        <input name="fullName" required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="e.g. John Doe" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                        <input name="phone" required type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="+91 98765 43210" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number (For Order Updates)</label>
                     <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="+91 98765 43210" />
                  </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Store / Vendor</label>
                      <select name="storeSelect" defaultValue={cartItems[0]?.vendor || "City Square Mart"} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors font-medium text-slate-700">
                         {marketplaceStore.getSellers().map(seller => (
                            <option key={seller.id} value={seller.storeName}>{seller.storeName} ({seller.name})</option>
                         ))}
                      </select>
                   </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Complete Delivery Address</label>
                     <textarea name="address" required rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors" placeholder="House/Flat No., Building Name, Street, Landmark... (Sultanpur only)" />
                  </div>
                  <div className="pt-4">
                     <p className="text-xs text-slate-500 font-medium">By placing this order, you agree to our Terms & Conditions and acknowledge that delivery is strictly within Sultanpur limits.</p>
                  </div>
               </form>
             </div>
           </div>

           {/* Order Summary & Payment */}
           <div className="space-y-6">
              <div className="bg-[#e9eee6] rounded-[2rem] p-6 sm:p-8 shadow-sm text-[#4b5563]">
                 <h2 className="font-black text-xl text-[#1f2937] mb-4 tracking-tight">Order Items ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
                 
                 <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-1">
                   {cartItems.map((item) => (
                     <div key={item.id} className="flex justify-between items-center text-xs font-bold text-[#1f2937]">
                       <span className="truncate pr-2">{item.quantity}x {item.name}</span>
                       <span className="shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                     </div>
                   ))}
                 </div>

                 {/* Coupon */}
                 <div className="mb-6">
                   <form onSubmit={handleApplyCoupon} className="flex gap-2">
                     <input 
                       type="text" 
                       value={discountCode}
                       onChange={(e) => setDiscountCode(e.target.value)}
                       placeholder="Have a coupon?" 
                       className="flex-1 bg-white border border-transparent focus:border-[#3b82f6] rounded-xl outline-none px-3 py-2.5 font-medium text-sm text-[#1f2937] placeholder:text-[#9ca3af] transition-colors uppercase" 
                     />
                     <button type="submit" className="bg-[#1f2937] hover:bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#1f2937] cursor-pointer">
                        Apply
                     </button>
                   </form>
                   {isSuccessfullyApplied && <p className="text-[#10b981] text-xs font-bold mt-2">Discount of ₹{discount} applied successfully!</p>}
                 </div>

                 {/* Totals */}
                 <div className="space-y-3 mb-6 border-t border-[#cfd6d1] pt-4">
                    <div className="flex justify-between items-center text-sm font-bold text-[#3b82f6]">
                       <span className="uppercase text-xs opacity-80">SUBTOTAL</span>
                       <span className="text-[#1f2937]">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-[#3b82f6]">
                       <span className="uppercase text-xs opacity-80">DELIVERY FEE</span>
                       <span className="text-[#1f2937]">{delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}</span>
                    </div>
                    {isSuccessfullyApplied && (
                       <div className="flex justify-between items-center text-sm font-bold text-emerald-600">
                          <span className="uppercase text-xs opacity-80">DISCOUNT</span>
                          <span>-₹{discount.toFixed(2)}</span>
                       </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-bold text-[#3b82f6]">
                       <span className="uppercase text-xs opacity-80">ESTIMATED TAX (5%)</span>
                       <span className="text-[#1f2937]">₹{tax.toFixed(2)}</span>
                    </div>
                 </div>

                 {/* Grand Total */}
                 <div className="flex justify-between items-end mb-8 pt-4 border-t border-[#cfd6d1]">
                    <span className="text-[10px] font-bold tracking-widest text-[#3b82f6] opacity-80 uppercase">TOTAL TO PAY</span>
                    <span className="text-3xl font-black text-[#1f2937] tracking-tighter">₹{total.toFixed(2)}</span>
                 </div>

                 <button form="checkout-form" type="submit" className="w-full bg-[#10b981] hover:bg-[#059669] active:bg-[#047857] text-[#064e3b] py-4 rounded-2xl font-black text-sm uppercase tracking-wide flex items-center justify-center transition-colors shadow-lg shadow-[#10b981]/20 cursor-pointer">
                    Place Order (COD)
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
