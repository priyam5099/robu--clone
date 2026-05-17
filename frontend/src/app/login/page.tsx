"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Faking a network request for the UI
    setTimeout(() => {
      setLoading(false);
      // In a real app, you would save the auth token here.
      // For now, we just push them to the shipping/checkout screen!
      router.push('/checkout');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-neutral-800">
        
        {/* Header Toggle */}
        <div className="text-center">
          <div className="bg-[#e31837] text-white w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-2xl mx-auto mb-4 shadow-sm">R</div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-bold text-[#e31837] hover:text-red-700 transition-colors"
              type="button"
            >
              {isLogin ? 'Sign up today' : 'Log in instead'}
            </button>
          </p>
        </div>

        {/* The Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Only show Name field if registering */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required 
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] dark:focus:border-[#e31837] bg-white dark:bg-neutral-950 dark:text-white outline-none transition-all" 
                  placeholder="John Doe" 
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required 
                className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] dark:focus:border-[#e31837] bg-white dark:bg-neutral-950 dark:text-white outline-none transition-all" 
                placeholder="you@example.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] dark:focus:border-[#e31837] bg-white dark:bg-neutral-950 dark:text-white outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          {/* Forgot Password (Only on Login) */}
          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-neutral-400">
                <input type="checkbox" className="rounded text-[#e31837] focus:ring-[#e31837] bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700" />
                Remember me
              </label>
              <button type="button" className="font-bold text-[#e31837] hover:text-red-700">
                Forgot your password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#e31837] hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
            {!loading && <ArrowRight size={18} className="ml-2" />}
          </button>
        </form>

      </div>
    </div>
  );
}