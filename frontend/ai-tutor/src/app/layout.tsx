import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { PostHogProvider } from "../components/PostHogProvider";
import { BrainIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: 'MuinteoirAI - Your Personal Learning Assistant',
  description: 'AI-powered learning platform for personalized education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 flex flex-col">
        <PostHogProvider>
          {/* Sticky Header */}
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
                </div>
              </div>
            </nav>
          </header>

          {/* Main content with top padding for fixed header */}
          <main className="flex-1 pt-16">
            {children}
          </main>

          {/* Dark Footer */}
          <footer className="bg-[#1a1a2e] text-white">
            <div className="section-container py-10">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-4">
                  <BrainIcon className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-bold">MuinteoirAI</span>
                </div>
                <p className="text-gray-400 text-sm">
                  © 2025 MuinteoirAI. Empowering learners with artificial intelligence.
                </p>
              </div>
            </div>
          </footer>
        </PostHogProvider>
      </body>
    </html>
  );
}
