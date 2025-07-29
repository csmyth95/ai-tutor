import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { PostHogProvider } from "../components/PostHogProvider";

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
      <body className="min-h-screen bg-black text-white flex flex-col">
        <PostHogProvider>
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-green-500/20">
            <nav className="container mx-center">
              <div className="flex justify-between w-full max-w-4xl">
                <div>
                  <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                    Home
                  </Link>
                </div>
                <div>
                  <Link href="/login" className="text-gray-300 hover:text-green-400 transition-colors">
                    Login
                  </Link>
                </div>
                <div>
                  <Link href="/register" className="text-gray-300 hover:text-green-400 transition-colors">
                    Register
                  </Link>
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center pt-20">
            {children}
          </main>

          <footer className="bg-black/80 backdrop-blur-md border-t border-green-500/20">
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center">
                <p className="text-gray-400">© 2025 MuinteoirAI. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </PostHogProvider>
      </body>
    </html>
  );
}
