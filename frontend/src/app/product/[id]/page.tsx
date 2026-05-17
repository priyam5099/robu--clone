"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ShoppingCart, Heart, Truck, ShieldCheck, ChevronLeft, Loader2 } from 'lucide-react';

// 1. Define exactly what a Product looks like
interface ProductData {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
}

export default function ProductPage() {
  const params = useParams();
  
  // 2. Replace <any> with our new interface!
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${params.id}`);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-600" size={48} /></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center"><h1 className="text-2xl font-bold">Product not found</h1><Link href="/" className="text-rose-600 mt-4">Go Home</Link></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-rose-600 mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Store
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 p-12 flex items-center justify-center bg-gray-50/50 border-r border-gray-100">
            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-[400px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" />
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 p-10 lg:p-14 flex flex-col">
            <div className="text-rose-600 text-sm font-extrabold tracking-widest uppercase mb-2">{product.category}</div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">{product.name}</h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed flex-grow">{product.description}</p>
            
            <div className="text-5xl font-extrabold text-black mb-8 tracking-tighter">
              ₹{product.price}<span className="text-xl text-gray-400 font-medium tracking-normal">.00</span>
            </div>

            <div className="flex gap-4 mb-8">
              <button className="flex-1 bg-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-700 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20">
                <ShoppingCart size={22} /> Add to Cart
              </button>
              <button className="bg-gray-100 text-gray-600 p-4 rounded-xl hover:bg-gray-200 hover:text-rose-600 transition-colors">
                <Heart size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3"><Truck className="text-rose-600"/><span className="text-sm font-bold text-gray-700">Free Shipping</span></div>
              <div className="flex items-center gap-3"><ShieldCheck className="text-rose-600"/><span className="text-sm font-bold text-gray-700">1 Year Warranty</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}