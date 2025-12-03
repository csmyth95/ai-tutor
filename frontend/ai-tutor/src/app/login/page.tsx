'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url_path = `${BACKEND_URL}/api/v1/users/login`
      const response = await fetch(url_path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies if using httpOnly
      });
      if (!response.ok) {
        let errorData = {};
            try {
              errorData = await response.text();
              console.log(errorData);
            } catch (e) {
              console.warn('Failed to parse error response:', e);
            }
            throw new Error('Login failed. Please check your credentials: ', errorData);
      }
      const dataText = await response.text();
      const data = JSON.parse(dataText);
      if (data.token) {
        try {
          localStorage.setItem('token', data.token);
          alert('Login successful & token stashed in localStorage!')
          router.push('/summary');
        } catch (error) {
          console.error('Error setting token:', error);
          alert(error instanceof Error ? error.message : 'An error occurred during login');
        }
      } else {
        throw new Error(`No token received from server: ${data}`);
      }
    } catch (error) {
      console.error(`Login error:, ${error}`);
      alert(error instanceof Error ? error.message : 'An error occurred during login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit"
            className="btn-primary w-full"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Need to sign up?{' '}
          <Link href="/register" className="text-green-500 hover:text-green-600 font-medium">
            Register Here!
          </Link>
        </p>
      </div>
    </div>
  );
}
