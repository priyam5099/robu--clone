import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Chatbot from '../components/Chatbot';
import FloatingRobot from '../components/FloatingRobot';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'ROBU Clone - Electronics & Robotics',
  description: 'Your one-stop shop for electronics components',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* The comment is safely inside the html tag now! */}
      <body className="bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white min-h-screen flex flex-col transition-colors duration-500" suppressHydrationWarning>
        <CartProvider>
          
          <Navbar />

          <main className="flex-grow w-full">
            {children}
          </main>
          
          
          <Chatbot />

        </CartProvider>
      </body>
    </html>
  );
}