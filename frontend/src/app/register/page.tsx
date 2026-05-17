"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
      });

      console.log('Registration Success:', res.data);
      router.push('/login?registered=true');
      
    } catch (err) {
      console.error('Registration Error:', err);
      
      // Our beautiful, ESLint-approved Type Guard
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong during registration.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="bg-black text-white p-1.5 rounded font-bold text-xl leading-none">R</div>
            <span className="text-2xl font-bold tracking-tight text-black">robu<span className="text-rose-500">.</span></span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-rose-600 hover:text-rose-500 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-0.5" size={18} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:z-10 sm:text-sm transition-all"
                placeholder="Full Name"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:z-10 sm:text-sm transition-all"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:z-10 sm:text-sm transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-zinc-800 to-black hover:from-black hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 shadow-md transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Creating account..."
            ) : (
              <>
                <span className="absolute right-0 inset-y-0 flex items-center pr-3 translate-x-full group-hover:-translate-x-2 transition-transform duration-300">
                  <ArrowRight size={18} />
                </span>
                Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}