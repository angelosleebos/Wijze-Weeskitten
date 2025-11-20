'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authenticatedFetch } from '@/lib/api-client';

interface Stats {
  cats: {
    total: number;
    available: number;
    reserved: number;
    adopted: number;
  };
  blog: {
    total: number;
    published: number;
    drafts: number;
  };
  donations: {
    total: number;
    total_amount: number;
    successful: number;
    pending: number;
  };
}

interface Activity {
  type: string;
  title: string;
  date: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await authenticatedFetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Statistics Cards */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Cats Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Katten</h3>
                <span className="material-symbols-outlined text-pink-500 text-3xl">pets</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Totaal</span>
                  <span className="font-bold">{stats.cats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Zoekt een thuis</span>
                  <span className="text-blue-600 font-semibold">{stats.cats.available}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gereserveerd</span>
                  <span className="text-yellow-600 font-semibold">{stats.cats.reserved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Geadopteerd</span>
                  <span className="text-green-600 font-semibold">{stats.cats.adopted}</span>
                </div>
              </div>
            </div>

            {/* Blog Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Blog</h3>
                <span className="material-symbols-outlined text-pink-500 text-3xl">article</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Totaal posts</span>
                  <span className="font-bold">{stats.blog.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gepubliceerd</span>
                  <span className="text-green-600 font-semibold">{stats.blog.published}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Concepten</span>
                  <span className="text-gray-400 font-semibold">{stats.blog.drafts}</span>
                </div>
              </div>
            </div>

            {/* Donations Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Donaties</h3>
                <span className="material-symbols-outlined text-pink-500 text-3xl">payments</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Totaal bedrag</span>
                  <span className="font-bold text-green-600">
                    €{stats.donations.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Succesvol</span>
                  <span className="text-green-600 font-semibold">{stats.donations.successful}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In behandeling</span>
                  <span className="text-yellow-600 font-semibold">{stats.donations.pending}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {!loading && recentActivity.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-pink-500">history</span>
              Recente activiteit
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <span className="material-symbols-outlined text-gray-400">
                    {activity.type === 'cat' ? 'pets' : 
                     activity.type === 'blog' ? 'article' : 
                     'payments'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleString('nl-NL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Management Cards */}
        <h3 className="text-xl font-bold mb-4">Beheer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/katten"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <span className="material-symbols-outlined text-primary-500 text-5xl mb-4 block">pets</span>
            <h2 className="text-2xl font-bold mb-2">Katten Beheren</h2>
            <p className="text-gray-600">Voeg katten toe, bewerk of verwijder ze</p>
          </Link>

          <Link
            href="/admin/adoptie-aanvragen"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <span className="material-symbols-outlined text-primary-500 text-5xl mb-4 block">favorite</span>
            <h2 className="text-2xl font-bold mb-2">Adoptie Aanvragen</h2>
            <p className="text-gray-600">Bekijk en beheer adoptieaanvragen</p>
          </Link>

          <Link
            href="/admin/blog"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <span className="material-symbols-outlined text-primary-500 text-5xl mb-4 block">article</span>
            <h2 className="text-2xl font-bold mb-2">Blog Beheren</h2>
            <p className="text-gray-600">Schrijf en publiceer blogposts</p>
          </Link>

          <Link
            href="/admin/vrijwilligers"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <span className="material-symbols-outlined text-primary-500 text-5xl mb-4 block">group</span>
            <h2 className="text-2xl font-bold mb-2">Vrijwilligers Beheren</h2>
            <p className="text-gray-600">Beheer contactpersonen</p>
          </Link>

          <Link
            href="/admin/donaties"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <span className="material-symbols-outlined text-primary-500 text-5xl mb-4 block">payments</span>
            <h2 className="text-2xl font-bold mb-2">Donaties</h2>
            <p className="text-gray-600">Bekijk alle donaties</p>
          </Link>

          <Link
            href="/admin/instellingen"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <span className="material-symbols-outlined text-primary-500 text-5xl mb-4 block">settings</span>
            <h2 className="text-2xl font-bold mb-2">Instellingen</h2>
            <p className="text-gray-600">Beheer website instellingen</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
