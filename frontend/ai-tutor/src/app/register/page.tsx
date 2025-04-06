'use client';
// TODO Try and rewrite this without use client

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 10; // Example: Password must be at least 6 characters
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email)
      ? ""
      : "Please enter a valid email address.";
    const passwordError = validatePassword(formData.password)
      ? ""
      : "Password must be at least 6 characters long.";

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      try {
        // TODO: test signup & ensure cookies are saved in the browser 
        // TODO Replace localhost with env var from .env
        // TODO Handle response from signup i.e set cookie for token
        // await fetch('http://${process.env.BACKEND_HOSTNAME}:${process.env.BACKEND_PORT}/api/users/signup', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // });
        router.push('/login'); // Redirect to login after successful registration
      } catch (error) {
        console.error('Registration failed:', error);
        // TODO: Add react-hot-toast for client errors
        // Example with react-hot-toast:
        // toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)]">
      {/* Left Container: App Title */}
      <div className="w-1/3 bg-gray-100 flex items-center justify-center">
        <h1 className="text-4xl font-bold">App Title</h1>
      </div>

      {/* Right Container: Registration Form */}
      <div className="w-2/3 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-md rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-6">Register</h2>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
