'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            🐱 Wijze Weeskitten
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link href="/katten" className="text-gray-700 hover:text-primary-600 transition">
              Katten
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary-600 transition">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition">
              Contact
            </Link>
            <Link 
              href="/donatie" 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Doneer
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/katten" className="block py-2 text-gray-700 hover:text-primary-600">
              Katten
            </Link>
            <Link href="/blog" className="block py-2 text-gray-700 hover:text-primary-600">
              Blog
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-primary-600">
              Contact
            </Link>
            <Link href="/donatie" className="block py-2 text-primary-600 font-semibold">
              Doneer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
