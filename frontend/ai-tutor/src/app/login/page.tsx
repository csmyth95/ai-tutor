'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Stops form from submitting traditionally
    // // Now we can:
    // 1. Handle form submission with JavaScript
    // 2. Make API calls
    // 3. Validate data
    // 4. Update state
    // Without page refresh
    // TODO: Implement login logic
    router.push('/summary');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-black/30 p-8 rounded-xl border border-green-500/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-300">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-300">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 bg-black/50 border border-green-500/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-300">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 bg-black/50 border border-green-500/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                required
              />
            </div>
          </div>

            {/* TODO Implement password reset logic */}
          {/* <div className="flex items-center justify-between">
            <Link href="/forgot-password" className="text-sm text-green-400 hover:text-green-300">
              Forgot your password?
            </Link>
          </div> */}

            {/* TODO On submit with successful login, route to /summaries */}
          <button type="submit"
            className="w-full py-3 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-400 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-300">
          Need to sign up?
          <Link href="/register" className="text-green-400 hover:text-green-300">
            Register Here!
          </Link>
        </p>
      </div>
    </div>
  );
}
