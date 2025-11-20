'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authenticatedFetch } from '@/lib/api-client';

interface Setting {
  key: string;
  value: string;
}

interface Settings {
  site_name: string;
  site_description: string;
  contact_email: string;
  donation_goal: string;
  hero_title: string;
  hero_subtitle: string;
  donation_account: string;
  primary_color: string;
  hero_image: string;
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings>({
    site_name: '',
    site_description: '',
    contact_email: '',
    donation_goal: '',
    hero_title: '',
    hero_subtitle: '',
    donation_account: '',
    primary_color: '#ee6fa0',
    hero_image: '/images/hero-cats.jpg'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      
      // API returns an object, not an array
      const settingsObj = data.settings || {};
      
      setSettings({
        site_name: settingsObj.site_name || '',
        site_description: settingsObj.site_description || '',
        contact_email: settingsObj.contact_email || '',
        donation_goal: settingsObj.donation_goal || '',
        hero_title: settingsObj.hero_title || '',
        hero_subtitle: settingsObj.hero_subtitle || '',
        donation_account: settingsObj.donation_account || '',
        primary_color: settingsObj.primary_color || '#ee6fa0',
        hero_image: settingsObj.hero_image || '/images/hero-cats.jpg'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value.toString()
      }));

      for (const update of updates) {
        await authenticatedFetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        });
      }

      setMessage('Instellingen succesvol opgeslagen!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Fout bij opslaan');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const presetColors = [
    { name: 'Roze (huidig)', value: '#ee6fa0' },
    { name: 'Paars', value: '#9b59b6' },
    { name: 'Blauw', value: '#3498db' },
    { name: 'Groen', value: '#2ecc71' },
    { name: 'Oranje', value: '#e67e22' },
    { name: 'Koraal', value: '#ff6b9d' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">settings</span>
              Website Instellingen
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">save</span>
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('succesvol') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <p>Laden...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Algemene Instellingen */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">info</span>
                Algemene Informatie
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website Naam
                  </label>
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) => handleChange('site_name', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website Beschrijving
                  </label>
                  <textarea
                    value={settings.site_description}
                    onChange={(e) => handleChange('site_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact E-mail
                  </label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bankrekening (NL)
                  </label>
                  <input
                    type="text"
                    value={settings.donation_account}
                    onChange={(e) => handleChange('donation_account', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="NL10 INGB 0005 9680 56"
                  />
                </div>
              </div>
            </div>

            {/* Styling */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">palette</span>
                Kleuren & Styling
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primaire Kleur
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => handleChange('primary_color', e.target.value)}
                      className="h-12 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primary_color}
                      onChange={(e) => handleChange('primary_color', e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
                      placeholder="#ee6fa0"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleChange('primary_color', color.value)}
                        className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50 text-sm"
                      >
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Sectie */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">image</span>
                Hero Sectie
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Titel
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Ondertitel
                  </label>
                  <textarea
                    value={settings.hero_subtitle}
                    onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Achtergrond Afbeelding
                  </label>
                  <input
                    type="text"
                    value={settings.hero_image}
                    onChange={(e) => handleChange('hero_image', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="/images/hero-cats.jpg"
                  />
                  {settings.hero_image && (
                    <div className="mt-3 rounded-lg overflow-hidden border">
                      <img 
                        src={settings.hero_image} 
                        alt="Preview" 
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Beschikbare afbeeldingen: /images/hero-cats.jpg, /images/cat-1.jpg tot cat-5.jpg
                  </p>
                </div>
              </div>
            </div>

            {/* Donaties */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">volunteer_activism</span>
                Donatie Instellingen
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donatiedoel (in euro's)
                  </label>
                  <input
                    type="number"
                    value={settings.donation_goal}
                    onChange={(e) => handleChange('donation_goal', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Dit bedrag wordt getoond als donatiedoel op de website
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Mollie iDEAL
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mollie API key wordt beheerd via environment variabelen (.env bestand).
                    Voor wijzigingen, pas MOLLIE_API_KEY aan en herstart de applicatie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
