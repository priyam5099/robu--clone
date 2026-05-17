"use client";

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Package, DollarSign, Tag, Image as ImageIcon, Plus, CheckCircle2, AlertCircle, AlignLeft } from 'lucide-react';

export default function AdminDashboard() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Microcontrollers');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setError(''); 
    setSuccess(false);

    // Determine final category (use custom if "Other" is selected)
    const finalCategory = category === 'Other' ? customCategory : category;

    if (category === 'Other' && !customCategory.trim()) {
      setError("Please enter a custom category name.");
      setLoading(false);
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      // Dynamic fallback URL checking your environment parameters
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      await axios.post(`${baseURL}/products`,
        { name, price: Number(price), category: finalCategory, description, imageUrl },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      setSuccess(true);
      setName(''); 
      setPrice(''); 
      setDescription(''); 
      setImageUrl(''); 
      setCustomCategory('');
      setCategory('Microcontrollers');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to add product.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 font-sans transition-colors duration-500">
      <div className="max-w-2xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">Add new components with rich descriptions.</p>
          </div>
          <Link href="/" className="text-sm font-bold text-[#e31837] hover:text-red-700 transition-colors">
            ← Back to Store
          </Link>
        </div>

        {/* Messaging Feedback Toasts */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-xl mb-6 flex gap-3 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 animate-pulse">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl mb-6 flex gap-3 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>Product published successfully!</span>
          </div>
        )}

        {/* Input Form Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden transition-colors duration-500">
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            
            {/* Product Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Product Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                  <Package size={18} />
                </div>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full rounded-xl py-3 pl-11 pr-4 border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] dark:focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 text-gray-990 dark:text-white outline-none transition-all" 
                  placeholder="e.g. Raspberry Pi 5" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pricing Metric */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                    <DollarSign size={18} />
                  </div>
                  <input 
                    type="number" 
                    required 
                    min="0" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full rounded-xl py-3 pl-11 pr-4 border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] dark:focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white outline-none transition-all" 
                    placeholder="6499" 
                  />
                </div>
              </div>
              
              {/* Category Dropdown Selection */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                      <Tag size={18} />
                    </div>
                    
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="w-full rounded-xl py-3 pl-11 pr-4 border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] dark:focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="Microcontrollers" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">Microcontrollers</option>
                      <option value="Dev Boards" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">Dev Boards</option>
                      <option value="Sensors & Modules" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">Sensors & Modules</option>
                      <option value="Motors & Drivers" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">Motors & Drivers</option>
                      <option value="Drone Parts" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">Drone Parts</option>
                      <option value="Power Supplies" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">Power Supplies</option>
                      <option value="Other" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">Other (Custom)</option>
                    </select>
                    
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Conditional Custom Input Variant */}
                {category === 'Other' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <input 
                      type="text" 
                      required 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      className="w-full rounded-xl py-3 px-4 border border-red-200 dark:border-red-900/50 focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] bg-red-50/30 dark:bg-[#e31837]/5 text-gray-900 dark:text-white outline-none transition-all" 
                      placeholder="Type custom category name..." 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description Text Box */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Description</label>
              <div className="relative">
                <div className="absolute top-3 left-4 text-gray-400 pointer-events-none">
                  <AlignLeft size={18} />
                </div>
                <textarea 
                  rows={3} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full rounded-xl py-3 pl-11 pr-4 border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] dark:focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white outline-none transition-all" 
                  placeholder="Briefly describe the component properties..." 
                />
              </div>
            </div>

            {/* Optional Image Parameter Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">Image URL (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                  <ImageIcon size={18} />
                </div>
                <input 
                  type="url" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  className="w-full rounded-xl py-3 pl-11 pr-4 border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-[#e31837]/20 focus:border-[#e31837] dark:focus:border-[#e31837] bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white outline-none transition-all" 
                  placeholder="https://example.com/image.jpg" 
                />
              </div>
            </div>

            {/* Execution Submission Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-xl text-white bg-zinc-900 dark:bg-neutral-800 hover:bg-black dark:hover:bg-neutral-950 border border-transparent dark:border-neutral-700 disabled:opacity-70 transition-all active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? "Adding Item..." : <><Plus size={18} className="mr-2" /> Publish Product</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}