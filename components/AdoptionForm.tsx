'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
  image_url: string;
}

interface AdoptionFormProps {
  cat: Cat;
  onClose?: () => void;
}

export default function AdoptionForm({ cat, onClose }: AdoptionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cat_id: cat.id,
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    household_type: '',
    has_garden: false,
    has_other_pets: false,
    other_pets_description: '',
    has_children: false,
    children_ages: '',
    cat_experience: '',
    motivation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.motivation) {
      setError('Vul alle verplichte velden in');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/adoption-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Er ging iets mis');
      }

      setSuccess(true);
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          router.push('/katten');
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <span className="material-symbols-outlined text-green-600 text-6xl mb-4 block">
          check_circle
        </span>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Aanvraag verzonden!
        </h3>
        <p className="text-green-700">
          Bedankt voor je interesse in {cat.name}. We nemen zo snel mogelijk contact met je op.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Cat Info */}
      <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
        <img src={cat.image_url} alt={cat.name} className="w-20 h-20 object-cover rounded-lg" />
        <div>
          <h3 className="font-bold text-lg">{cat.name}</h3>
          <p className="text-sm text-gray-600">{cat.age} jaar • {cat.breed}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">Persoonlijke gegevens</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Naam *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefoon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adres
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stad
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postcode
            </label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Household Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">Woonsituatie</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type woning
          </label>
          <select
            value={formData.household_type}
            onChange={(e) => setFormData({ ...formData, household_type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">Selecteer...</option>
            <option value="apartment">Appartement</option>
            <option value="house">Huis</option>
            <option value="farm">Boerderij</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="has_garden"
            checked={formData.has_garden}
            onChange={(e) => setFormData({ ...formData, has_garden: e.target.checked })}
            className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
          />
          <label htmlFor="has_garden" className="text-sm font-medium text-gray-700">
            Heeft een tuin
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="has_other_pets"
            checked={formData.has_other_pets}
            onChange={(e) => setFormData({ ...formData, has_other_pets: e.target.checked })}
            className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
          />
          <label htmlFor="has_other_pets" className="text-sm font-medium text-gray-700">
            Heeft andere huisdieren
          </label>
        </div>

        {formData.has_other_pets && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Welke huisdieren?
            </label>
            <textarea
              value={formData.other_pets_description}
              onChange={(e) => setFormData({ ...formData, other_pets_description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="has_children"
            checked={formData.has_children}
            onChange={(e) => setFormData({ ...formData, has_children: e.target.checked })}
            className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
          />
          <label htmlFor="has_children" className="text-sm font-medium text-gray-700">
            Heeft kinderen
          </label>
        </div>

        {formData.has_children && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leeftijden kinderen
            </label>
            <input
              type="text"
              value={formData.children_ages}
              onChange={(e) => setFormData({ ...formData, children_ages: e.target.value })}
              placeholder="Bijv: 5, 8, 12 jaar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Experience & Motivation */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg border-b pb-2">Ervaring & Motivatie</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ervaring met katten
          </label>
          <textarea
            value={formData.cat_experience}
            onChange={(e) => setFormData({ ...formData, cat_experience: e.target.value })}
            rows={3}
            placeholder="Vertel over je ervaring met katten..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Waarom wil je deze kat adopteren? *
          </label>
          <textarea
            value={formData.motivation}
            onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
            rows={4}
            placeholder="Vertel waarom je graag deze kat zou willen adopteren..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Annuleren
          </button>
        )}
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
              Verzenden...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              Aanvraag indienen
            </>
          )}
        </button>
      </div>
    </form>
  );
}
