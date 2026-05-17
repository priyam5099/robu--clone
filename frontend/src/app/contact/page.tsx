"use client";

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Mail, User, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await axios.post('http://localhost:5000/api/products/contact', { name, email, message });
      setStatus('success');
      setName(''); setEmail(''); setMessage('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 font-sans bg-gray-50">
      <div className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        
        <div className="text-center mb-10">
          <Link href="/" className="text-sm font-bold text-rose-600 hover:text-rose-700 mb-4 inline-block">← Back to Store</Link>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Get in touch</h2>
          <p className="mt-3 text-gray-500">Have a question about a component? Send us a message.</p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-500 mb-8">We will get back to you as soon as possible.</p>
            <button onClick={() => setStatus('idle')} className="font-bold text-rose-600 hover:text-rose-700">Send another message</button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={18} /></div>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl py-3 pl-10 border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Mail size={18} /></div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl py-3 pl-10 border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400"><MessageSquare size={18} /></div>
                <textarea rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-xl py-3 pl-10 border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50" placeholder="How can we help you?" />
              </div>
            </div>

            {status === 'error' && <p className="text-red-500 text-sm text-center">Failed to send. Is your backend running?</p>}

            <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center py-4 px-4 font-bold rounded-xl text-white bg-black hover:bg-zinc-800 disabled:opacity-70 transition-all">
              {status === 'loading' ? "Sending..." : <><Send size={18} className="mr-2" /> Send Message</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}