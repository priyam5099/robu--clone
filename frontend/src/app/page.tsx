"use client";
import HeroRobot from '../components/HeroRobot';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ShoppingCart, Loader2, User, Search, 
  ChevronRight, Cpu, CircuitBoard, Target, 
  Settings, Plane, CheckCircle, Mail, MessageSquare, Send 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartFlyout from '@/components/CartFlyout';

interface ProductData {
  _id: string; 
  name: string; 
  price: number; 
  category: string; 
  description: string; 
  imageUrl: string;
}

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories'); 
  
  const { addToCart, cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Animation State for Hero Section
  const [heroIndex, setHeroIndex] = useState(0);

  // Contact Form States
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // 1. Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
        setProducts(res.data.data); 
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  // 2. Cycle Hero Animation
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

  // 3. Advanced Filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All Categories' || product.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  // 4. Handle Add To Cart
  const handleAddToCart = (e: React.MouseEvent, product: ProductData) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    addToCart(product); 
    setIsCartOpen(true); 
  };

  // 5. Handle Contact Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      // Replace line 85 with this:
const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
      setContactStatus('success');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactStatus('idle'), 4000);
    } catch (err) {
      setContactStatus('error');
      setTimeout(() => setContactStatus('idle'), 4000);
    }
  };

  const mainCategories = [
    { name: "Arduino", icon: <Cpu size={24} /> },
    { name: "Raspberry Pi", icon: <CircuitBoard size={24} /> },
    { name: "Sensors & Modules", icon: <Target size={24} /> },
    { name: "Motors & Drivers", icon: <Settings size={24} /> },
    { name: "Drone Parts", icon: <Plane size={24} /> },
    
  ];

  return (
    <div className="w-full font-sans">
      <CartFlyout isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* DYNAMIC BENTO-BOX HERO */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#e31837] rounded-[2rem] p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden shadow-sm">
            <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-6 backdrop-blur-sm">FEATURED</div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-[1.05]">Build your next<br/>big idea.</h1>
            <p className="text-xl text-white/90 mb-10 max-w-md">10,000+ authentic components. Delivered fast.</p>
            <Link href="#inventory" className="bg-white text-black font-bold py-3.5 px-6 rounded-xl w-fit hover:bg-gray-100 transition-transform active:scale-95 flex items-center gap-2">
              Start Shopping <ChevronRight size={18}/>
              
            </Link>
                   <HeroRobot />  
          </div>

          <div className="flex flex-col gap-6 relative">
            {products.length > 0 ? (
              <>
                <Link href={`/product/${products[heroIndex]?._id}`} className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-gray-200 dark:border-slate-700 flex-1 flex flex-col justify-center hover:border-gray-300 transition-all cursor-pointer group shadow-sm" key={`top-${heroIndex}`}>
                  <div className="text-[#e31837] text-xs font-extrabold tracking-wider mb-2 uppercase">{products[heroIndex]?.category}</div>
                  <h2 className="text-2xl font-extrabold text-black dark:text-white mb-2 tracking-tight line-clamp-1">{products[heroIndex]?.name}</h2>
                  <p className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-6">₹{products[heroIndex]?.price}</p>
                  <div className="text-[#e31837] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">View Details <ChevronRight size={18}/></div>
                </Link>

                <Link href={`/product/${products[(heroIndex + 1) % products.length]?._id}`} className="bg-[#0f1115] rounded-[2rem] p-8 text-white flex-1 flex flex-col justify-center hover:bg-black transition-all cursor-pointer group shadow-sm" key={`bot-${heroIndex}`}>
                   <div className="text-[#e31837] text-xs font-extrabold tracking-wider mb-2 uppercase">TRENDING</div>
                   <h2 className="text-2xl font-extrabold mb-2 tracking-tight line-clamp-1">{products[(heroIndex + 1) % products.length]?.name}</h2>
                   <div className="text-[#e31837] font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">View Details <ChevronRight size={18}/></div>
                </Link>
              </>
            ) : (
               <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-gray-200 dark:border-slate-700 flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" size={32}/></div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* CLICKABLE CATEGORY GRID */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {mainCategories.map((cat, idx) => (
              <button key={idx} onClick={() => setSelectedCategory(cat.name)} className={`bg-white dark:bg-slate-800 border rounded-2xl p-6 text-center transition-all flex flex-col items-center shadow-sm ${selectedCategory === cat.name ? 'border-[#e31837] ring-2 ring-red-100 dark:ring-red-900/30' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'}`}>
                <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform ${selectedCategory === cat.name ? 'bg-[#e31837] text-white scale-110' : 'bg-rose-50 dark:bg-slate-700 text-[#e31837]'}`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{cat.name}</h3>
              </button>
            ))}
          </div>
        </section>

        {/* LIVE INVENTORY GRID */}
        <section id="inventory" className="scroll-mt-24 mb-20">
          <div className="flex items-end justify-between mb-8 border-b border-gray-200 dark:border-slate-700 pb-4">
            <div>
              <p className="text-[#e31837] text-xs font-bold tracking-widest uppercase mb-1">Live Inventory</p>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">{selectedCategory}</h2>
            </div>
            {selectedCategory !== 'All Categories' && (
              <button onClick={() => setSelectedCategory('All Categories')} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">Clear Filter ✕</button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                onClick={() => router.push(`/product/${product._id}`)}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1 cursor-pointer"
              >
                <div className="h-48 bg-white relative shrink-0 p-4 flex items-center justify-center border-b border-gray-100 dark:border-slate-700">
                  <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-1">{product.category}</p>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-2 group-hover:text-[#e31837] transition-colors line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="text-xl font-extrabold text-black dark:text-white">₹{product.price}</span>
                    
                    <button onClick={(e) => handleAddToCart(e, product)} className="bg-gray-100 dark:bg-slate-700 hover:bg-[#e31837] hover:text-white text-gray-900 dark:text-white p-2.5 rounded-full transition-colors active:scale-90">
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT US SECTION */}
        <section id="contact" className="scroll-mt-10 max-w-3xl mx-auto mb-10">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-50 dark:from-slate-700 to-rose-100 dark:to-slate-800 rounded-bl-full -z-10 opacity-60"></div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Get in touch</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Have a question about a component? Send us a message.</p>
            </div>

            {contactStatus === 'success' ? (
               <div className="text-center py-10">
                 <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle size={32} className="text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                 <p className="text-gray-500 dark:text-gray-400 mb-6">Our support team will get back to your email shortly.</p>
                 <button onClick={() => setContactStatus('idle')} className="font-bold text-[#e31837] hover:text-red-700">Send another message</button>
               </div>
            ) : (
              <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Your Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none"><User size={18} /></div>
                      <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full rounded-xl py-3 pl-11 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-rose-500/20 focus:border-[#e31837] bg-white dark:bg-slate-700 dark:text-white transition-all text-sm" placeholder="John Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none"><Mail size={18} /></div>
                      <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full rounded-xl py-3 pl-11 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-rose-500/20 focus:border-[#e31837] bg-white dark:bg-slate-700 dark:text-white transition-all text-sm" placeholder="john@example.com" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Message</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 text-gray-400 pointer-events-none"><MessageSquare size={18} /></div>
                    <textarea rows={4} required value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full rounded-xl py-3.5 pl-11 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-rose-500/20 focus:border-[#e31837] bg-white dark:bg-slate-700 dark:text-white transition-all text-sm" placeholder="How can we help you?" />
                  </div>
                </div>
                <button type="submit" disabled={contactStatus === 'loading'} className="w-full flex justify-center items-center py-3.5 px-4 font-bold rounded-xl text-white bg-[#e31837] hover:bg-red-700 disabled:opacity-70 transition-all active:scale-[0.98]">
                  {contactStatus === 'loading' ? <Loader2 size={20} className="animate-spin" /> : <><Send size={18} className="mr-2" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0f1115] text-zinc-300 pt-16 pb-8 border-t border-zinc-800 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2 pr-10">
              <Link href="/" className="flex items-center gap-1.5 mb-6">
                <div className="bg-[#e31837] text-white px-2 py-1.5 rounded font-extrabold text-xl leading-none">R</div>
                <span className="text-2xl font-bold tracking-tighter text-white">robu<span className="text-[#e31837] font-extrabold">.in</span></span>
              </Link>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">Indiaapos&;s largest store for robotics, electronics & automation. 10,000+ products, ships pan-India.</p>
            </div>
            <div>
              <h4 className="text-white font-bold tracking-wider text-sm mb-6 uppercase">Shop</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                {['Arduino', 'Raspberry Pi', 'Sensors', 'Motors', '3D Printer Parts'].map(item => (<li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold tracking-wider text-sm mb-6 uppercase">Support</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                {['Track Order', 'Returns', 'Shipping Policy', 'Contact Us', 'FAQs'].map(item => (<li key={item}><Link href={item === 'Contact Us' ? '#contact' : '#'} className="hover:text-white transition-colors">{item}</Link></li>))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold tracking-wider text-sm mb-6 uppercase">Company</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                {['About Robu', 'Blog', 'Sell on Robu', 'Careers', 'Press'].map(item => (<li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>))}
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <p>© 2026 Robu Store Clone. Built for demonstration.</p>
            <div className="flex gap-4 items-center">
              <span>Visa</span><span>•</span><span>Mastercard</span><span>•</span><span>UPI</span><span>•</span><span>Razorpay</span><span>•</span><span>COD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}