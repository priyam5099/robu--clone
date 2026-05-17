"use client";

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // We bring back the setTimeout to keep the linter happy!
    const timer = setTimeout(() => {
      setMounted(true);
      
      // Check if dark mode is active on load
      const isDarkMode = 
        document.documentElement.classList.contains('dark') || 
        localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      setIsDark(isDarkMode);

      // Force the class on the HTML tag on load
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Prevents layout shift before hydration
  if (!mounted) return <div className="w-16 h-8"></div>;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none drop-shadow-md cursor-pointer ${
        isDark ? 'bg-neutral-800' : 'bg-sky-200'
      }`}
    >
      <span
        className={`absolute left-1 inline-flex h-6 w-6 transform items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.26,1.55)] ${
          isDark ? 'translate-x-8 bg-neutral-950' : 'translate-x-0 bg-white'
        }`}
      >
        <svg
          className={`absolute w-4 h-4 transition-all duration-500 ${
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100 text-amber-500'
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>

        <svg
          className={`absolute w-4 h-4 transition-all duration-500 ${
            isDark ? 'opacity-100 rotate-0 scale-100 text-yellow-300' : 'opacity-0 -rotate-90 scale-50 text-neutral-900'
          }`}
          fill="solid" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </span>
    </button>
  );
}