import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MuinteoirAI - Your AI Tutor',
  description: 'Learn with the help of AI-powered tutoring that adapts to your needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {/* HEADER */}
        <header className="bg-black shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
              <Link href="/login" className="text-gray-600 hover:text-green-600 transition-colors">Login</Link>
              <Link href="/register" className="text-gray-600 hover:text-green-600 transition-colors">Register</Link>
              <Link href="/faq" className="text-gray-600 hover:text-green-600 transition-colors">FAQs</Link>
            </nav>
          </div>
        </header>
        {/* HomePage */}
        <main className="container text-center mx-auto px-4 py-8">
          {children}
        </main>
        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-gray-500 text-sm">© {new Date().getFullYear()} MuinteoirAI. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 