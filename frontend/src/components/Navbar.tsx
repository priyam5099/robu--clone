import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-neutral-800 transition-colors duration-500 sticky top-0 z-[100]">
      {/* Top Bar */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-[#e31837] text-white p-1 rounded font-bold text-xl">R</div>
          <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">robu.in</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <input
            type="text"
            placeholder="Search components..."
            className="w-full px-4 py-2 bg-gray-100 dark:bg-neutral-900 border border-transparent dark:border-neutral-800 focus:border-[#e31837] dark:focus:border-[#e31837] rounded-md outline-none text-gray-900 dark:text-white transition-colors duration-300"
          />
          <button className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-[#e31837]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Link href="/admin" className="hidden lg:block text-[#e31837] hover:underline">Admin →</Link>
          
          <Link href="/login" className="hidden sm:flex items-center gap-1 hover:text-[#e31837] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Account
          </Link>
          
          <button className="flex items-center gap-1 hover:text-[#e31837] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="hidden sm:inline">Cart</span>
          </button>

          {/* THE THEME TOGGLE */}
          <div className="pl-2 border-l border-gray-200 dark:border-neutral-700 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Bottom Bar (Categories) */}
      <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        <button className="bg-[#e31837] text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-red-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          ALL CATEGORIES
        </button>
        <Link href="#" className="hover:text-[#e31837] transition-colors">Arduino</Link>
        <Link href="#" className="hover:text-[#e31837] transition-colors">Raspberry Pi</Link>
        <Link href="#" className="hover:text-[#e31837] transition-colors">Sensors & Modules</Link>
        <Link href="#" className="hover:text-[#e31837] transition-colors">Motors & Drivers</Link>
        <Link href="#" className="hover:text-[#e31837] transition-colors">Drone Parts</Link>
      </div>
    </header>
  );
}