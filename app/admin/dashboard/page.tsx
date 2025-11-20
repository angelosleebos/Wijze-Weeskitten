'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CMS Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Uitloggen
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/katten"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">🐱</div>
            <h2 className="text-2xl font-bold mb-2">Katten Beheren</h2>
            <p className="text-gray-600">Voeg katten toe, bewerk of verwijder ze</p>
          </Link>

          <Link
            href="/admin/blog"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2">Blog Beheren</h2>
            <p className="text-gray-600">Schrijf en publiceer blogposts</p>
          </Link>

          <Link
            href="/admin/vrijwilligers"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-2xl font-bold mb-2">Vrijwilligers Beheren</h2>
            <p className="text-gray-600">Beheer contactpersonen</p>
          </Link>

          <Link
            href="/admin/donaties"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-2xl font-bold mb-2">Donaties</h2>
            <p className="text-gray-600">Bekijk alle donaties</p>
          </Link>

          <Link
            href="/admin/instellingen"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold mb-2">Instellingen</h2>
            <p className="text-gray-600">Beheer website instellingen</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
