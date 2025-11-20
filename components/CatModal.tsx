'use client';

import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { authenticatedFetch } from '@/lib/api-client';

interface Cat {
  id?: number;
  name: string;
  age: number;
  gender: string;
  breed: string;
  description: string;
  image_url: string;
  status: string;
}

interface CatModalProps {
  cat?: Cat;
  onClose: () => void;
  onSave: () => void;
}

export default function CatModal({ cat, onClose, onSave }: CatModalProps) {
  const [formData, setFormData] = useState<Cat>({
    name: '',
    age: 0,
    gender: 'male',
    breed: '',
    description: '',
    image_url: '',
    status: 'available',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cat) {
      setFormData(cat);
    }
  }, [cat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Naam is verplicht');
      return;
    }
    if (formData.age < 0 || formData.age > 30) {
      setError('Leeftijd moet tussen 0 en 30 zijn');
      return;
    }
    if (!formData.image_url) {
      setError('Upload een afbeelding');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const url = cat ? `/api/cats/${cat.id}` : '/api/cats';
      const method = cat ? 'PUT' : 'POST';

      const response = await authenticatedFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Er ging iets mis');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {cat ? 'Kat bewerken' : 'Nieuwe kat'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <ImageUpload
            currentImage={formData.image_url}
            onImageChange={(url) => setFormData({ ...formData, image_url: url })}
            type="cats"
            label="Foto van de kat"
          />

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naam *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Bijvoorbeeld: Mimi"
              required
            />
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leeftijd *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
                max="30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geslacht *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="male">Man</option>
                <option value="female">Vrouw</option>
              </select>
            </div>
          </div>

          {/* Breed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ras
            </label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Bijvoorbeeld: Europees korthaar"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="available">Zoekt een thuis</option>
              <option value="reserved">Gereserveerd</option>
              <option value="adopted">Geadopteerd</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschrijving
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="Vertel over het karakter en de eigenschappen van deze kat..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    hourglass_empty
                  </span>
                  Opslaan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  {cat ? 'Wijzigingen opslaan' : 'Kat toevoegen'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
