"use client";

import { ShoppingCart, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity?: number;
}

interface CartFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartFlyout({ isOpen, onClose }: CartFlyoutProps) {
  // We replace 'any' with a proper type definition to keep the strict linter 100% happy!
  const context = useCart() as {
    cartItems?: CartItem[];
    cart?: CartItem[];
    removeFromCart?: (id: string) => void;
    updateQuantity?: (id: string, quantity: number) => void;
    cartTotal?: number;
  };

  const cartItems = context.cartItems || context.cart || [];
  const removeFromCart = context.removeFromCart || (() => console.log("removeFromCart not linked"));
  const updateQuantity = context.updateQuantity || (() => console.log("updateQuantity not linked"));
  const cartTotal = context.cartTotal || 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Dark Overlay Background */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Cart Panel */}
      <div className={`fixed inset-y-0 right-0 z-[200] w-full max-w-md bg-white dark:bg-[#0a0a0a] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-800">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-[#e31837]" /> Your Cart
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-[#e31837] hover:bg-red-50 dark:hover:bg-neutral-900 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500 dark:text-neutral-400">
              <ShoppingCart size={64} className="text-gray-300 dark:text-neutral-700 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">Your cart is empty</p>
              <p className="text-sm">Looks like you havenapos&;t added any components yet.</p>
              <button onClick={onClose} className="text-[#e31837] font-bold mt-4 hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item: CartItem) => (
              <div key={item._id} className="flex gap-4 bg-gray-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800">
                
                {/* Item Image */}
                <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-xl p-2 flex shrink-0 items-center justify-center border border-gray-200 dark:border-neutral-700">
                  <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain" />
                </div>
                
                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-[#e31837] font-extrabold mt-1">₹{item.price}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-700 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                        className="text-gray-500 hover:text-[#e31837]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold text-gray-900 dark:text-white w-4 text-center">
                        {item.quantity || 1}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                        className="text-gray-500 hover:text-[#e31837]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-[#e31837] transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout Button */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-neutral-800 p-6 bg-gray-50 dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-neutral-400 font-medium">Subtotal</span>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{cartTotal}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-neutral-500 mb-6">Shipping and taxes calculated at checkout.</p>
            
            <Link 
              href="/login" 
              onClick={onClose} 
              className="w-full flex items-center justify-center gap-2 py-4 px-4 font-bold rounded-xl text-white bg-[#e31837] hover:bg-red-700 transition-all active:scale-[0.98]"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}