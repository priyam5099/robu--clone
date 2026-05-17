"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Added missing import
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // Toggle between Login view and Register view
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form values state definitions (Fixes missing fields)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Fixes missing setError bug

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Choose the right endpoint dynamically based on form state
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const payload = isLogin ? { email, password } : { name, email, password };

      const res = await axios.post(`https://robu-clone-backend.onrender.com${endpoint}`, payload);

      console.log('Authentication Success:', res.data);

      // Save authentication metadata securely
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data.user || res.data));
      }

      // Route users dynamically based on role tracking profiles
      const userRole = res.data.user?.role || res.data.role;
      if (userRole === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }

    } catch (err: unknown) {
      console.error('Authentication Error:', err);
      
      // Strict ESLint & TypeScript safe object property parsing
      const errorObj = err as { response?: { data?: { message?: string } } };
      const errorMessage = errorObj?.response?.data?.message || 'Invalid email or password.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }} 
              className="font-bold text-[#e31837] hover:text-red-700 transition-colors"
              type="button"
            >
              {isLogin ? 'Sign up today' : 'Log in instead'}
            </button>
          </p>
        </div>

        {/* Display Error Message Alert Panel */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-0.5" size={18} />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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