'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AdoptionForm from './AdoptionForm';

interface Cat {
  id: number;
  name: string;
  age: number;
  gender: string;
  breed: string;
  description: string;
  image_url: string;
  status: string;
}

interface CatsGridProps {
  cats: Cat[];
}

export default function CatsGrid({ cats }: CatsGridProps) {
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('available');
  const [filterAge, setFilterAge] = useState<string>('all');

  // Filter cats based on search and filters
  const filteredCats = useMemo(() => {
    return cats.filter((cat) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Gender filter
      const matchesGender = filterGender === 'all' || cat.gender === filterGender;
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || cat.status === filterStatus;
      
      // Age filter
      let matchesAge = true;
      if (filterAge === 'young') matchesAge = cat.age < 2;
      else if (filterAge === 'adult') matchesAge = cat.age >= 2 && cat.age < 8;
      else if (filterAge === 'senior') matchesAge = cat.age >= 8;
      
      return matchesSearch && matchesGender && matchesStatus && matchesAge;
    });
  }, [cats, searchTerm, filterGender, filterStatus, filterAge]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'adopted':
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">Geadopteerd</span>;
      case 'reserved':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Gereserveerd</span>;
      default:
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Beschikbaar</span>;
    }
  };

  return (
    <>
      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zoeken
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zoek op naam, ras of beschrijving..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geslacht
            </label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Alle</option>
              <option value="male">Kater</option>
              <option value="female">Poes</option>
            </select>
          </div>

          {/* Age Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leeftijd
            </label>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Alle</option>
              <option value="young">Jong (&lt; 2 jaar)</option>
              <option value="adult">Volwassen (2-8 jaar)</option>
              <option value="senior">Senior (&gt; 8 jaar)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Alle</option>
              <option value="available">Beschikbaar</option>
              <option value="reserved">Gereserveerd</option>
              <option value="adopted">Geadopteerd</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredCats.length} {filteredCats.length === 1 ? 'kat' : 'katten'} gevonden
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCats.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            {cat.image_url && (
              <div className="h-64 bg-gray-200 relative">
                <img 
                  src={cat.image_url} 
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(cat.status)}
                </div>
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{cat.name}</h2>
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                {cat.age && <span>🎂 {cat.age} jaar</span>}
                {cat.gender && <span>{cat.gender === 'male' ? '♂️' : '♀️'} {cat.gender === 'male' ? 'Kater' : 'Poes'}</span>}
              </div>
              {cat.breed && <p className="text-sm text-gray-500 mb-2">Ras: {cat.breed}</p>}
              <p className="text-gray-700 mb-4">{cat.description}</p>
              
              {cat.status === 'available' ? (
                <button
                  onClick={() => setSelectedCat(cat)}
                  className="w-full bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">favorite</span>
                  Ik wil {cat.name} adopteren
                </button>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 px-6 py-3 rounded-lg text-center">
                  {cat.status === 'adopted' ? 'Al geadopteerd' : 'Gereserveerd'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCats.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-4 block">
            search_off
          </span>
          <p className="text-gray-500 text-lg">
            Geen katten gevonden die aan je criteria voldoen.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterGender('all');
              setFilterAge('all');
              setFilterStatus('available');
            }}
            className="mt-4 text-pink-500 hover:text-pink-600"
          >
            Filters resetten
          </button>
        </div>
      )}

      {/* Adoption Modal */}
      {selectedCat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">Adoptie Aanvraag</h2>
              <button
                onClick={() => setSelectedCat(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <AdoptionForm cat={selectedCat} onClose={() => setSelectedCat(null)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
