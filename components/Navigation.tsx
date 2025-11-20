'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">pets</span>
            Wijze Weeskitten
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">home</span>
              Home
            </Link>
            <Link href="/katten" className="text-gray-700 hover:text-primary-600 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">pets</span>
              Katten
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary-600 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">article</span>
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">mail</span>
              Contact
            </Link>
            <Link 
              href="/donatie" 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">favorite</span>
              Doneer
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-600">
              <span className="material-symbols-outlined text-sm">home</span>
              Home
            </Link>
            <Link href="/katten" className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-600">
              <span className="material-symbols-outlined text-sm">pets</span>
              Katten
            </Link>
            <Link href="/blog" className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-600">
              <span className="material-symbols-outlined text-sm">article</span>
              Blog
            </Link>
            <Link href="/contact" className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-600">
              <span className="material-symbols-outlined text-sm">mail</span>
              Contact
            </Link>
            <Link href="/donatie" className="flex items-center gap-2 py-2 text-primary-600 font-semibold">
              <span className="material-symbols-outlined text-sm">favorite</span>
              Doneer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
