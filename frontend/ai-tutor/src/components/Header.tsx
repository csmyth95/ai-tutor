'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BrainIcon } from '@/components/icons';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        setIsLoggedIn(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="section-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BrainIcon className="w-8 h-8 text-green-500" />
            <span className="text-xl font-bold text-gray-900">MuinteoirAI</span>
          </Link>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/summary"
                className="btn-primary py-2 px-5"
              >
                My Summaries
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-secondary py-2 px-5"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary py-2 px-5"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
