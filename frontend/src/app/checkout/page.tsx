"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { MapPin, Lock, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { cartCount } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle size={80} className="text-emerald-500 mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Thank you for shopping at robu.in. Your components are being packed and will be shipped shortly.
        </p>
        <Link href="/" className="bg-[#e31837] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-red-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10 lg:py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side: Shipping Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <MapPin className="text-[#e31837]" /> Shipping Details
            </h2>
            
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 dark:text-white outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input type="tel" required className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 dark:text-white outline-none" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complete Address</label>
                <textarea rows={3} required className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 dark:text-white outline-none" placeholder="Flat No, Building Name, Street..." />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PIN Code</label>
                  <input type="text" required maxLength={6} className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 dark:text-white outline-none" placeholder="400001" />
                </div>
                <div className="col-span-1 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 dark:text-white outline-none" placeholder="Mumbai" />
                </div>
                <div className="col-span-1 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 dark:text-white outline-none" placeholder="Maharashtra" />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-200 dark:border-neutral-800 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 border-b border-gray-200 dark:border-neutral-800 pb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Items ({cartCount})</span>
                <span>Calculated</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-emerald-500 font-bold">FREE</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Payment Method</h3>
              <div className="p-4 border border-[#e31837] bg-red-50 dark:bg-[#e31837]/10 rounded-xl flex items-center gap-3 text-[#e31837] font-bold">
                <div className="w-4 h-4 rounded-full bg-[#e31837] border-4 border-white dark:border-neutral-900 ring-1 ring-[#e31837]"></div>
                Cash on Delivery (COD)
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className="w-full bg-[#e31837] text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all active:scale-[0.98]"
            >
              Place Order Now
            </button>
            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
              <Lock size={12} /> Secure, encrypted checkout
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}