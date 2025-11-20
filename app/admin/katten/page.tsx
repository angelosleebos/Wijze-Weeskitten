'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authenticatedFetch } from '@/lib/api-client';

interface Cat {
  id: number;
  name: string;
  age: number;
  gender: string;
  breed: string;
  description: string;
  image_url?: string;
  is_adopted: boolean;
}

export default function CatsAdmin() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCats();
  }, []);

  const fetchCats = async () => {
    try {
      const res = await fetch('/api/cats');
      const data = await res.json();
      setCats(data.cats || []);
    } catch (error) {
      console.error('Error fetching cats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze kat wilt verwijderen?')) return;

    try {
      const res = await authenticatedFetch(`/api/cats/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCats();
      }
    } catch (error) {
      console.error('Error deleting cat:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">pets</span>
              Katten Beheren
            </h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Alle Katten</h2>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Nieuwe Kat
            </button>
          </div>

          {loading ? (
            <p>Laden...</p>
          ) : cats.length === 0 ? (
            <p className="text-gray-500">Nog geen katten toegevoegd.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cats.map((cat) => (
                <div key={cat.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  {cat.image_url && (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{cat.name}</h3>
                      {cat.is_adopted && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Geadopteerd
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {cat.age} jaar • {cat.gender === 'male' ? 'Kater' : 'Poes'} • {cat.breed}
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">{cat.description}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 text-blue-600 hover:bg-blue-50 py-2 px-3 rounded flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Bewerk
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="flex-1 text-red-600 hover:bg-red-50 py-2 px-3 rounded flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Verwijder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
