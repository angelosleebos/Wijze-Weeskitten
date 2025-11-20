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
  smtp_host: string;
  smtp_port: string;
  smtp_secure: string;
  smtp_user: string;
  smtp_pass: string;
  smtp_from: string;
  smtp_from_name: string;
  recaptcha_site_key: string;
  recaptcha_secret_key: string;
  google_analytics_id: string;
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
    hero_image: '/images/hero-cats.jpg',
    smtp_host: 'mailhog',
    smtp_port: '1025',
    smtp_secure: 'false',
    smtp_user: '',
    smtp_pass: '',
    smtp_from: 'noreply@wijzeweeskitten.nl',
    smtp_from_name: 'Stichting het Wijze Weeskitten',
    recaptcha_site_key: '',
    recaptcha_secret_key: '',
    google_analytics_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Use admin endpoint for sensitive settings
      const res = await authenticatedFetch('/api/settings/admin');
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
        hero_image: settingsObj.hero_image || '/images/hero-cats.jpg',
        smtp_host: settingsObj.smtp_host || 'mailhog',
        smtp_port: settingsObj.smtp_port || '1025',
        smtp_secure: settingsObj.smtp_secure || 'false',
        smtp_user: settingsObj.smtp_user || '',
        smtp_pass: settingsObj.smtp_pass || '',
        smtp_from: settingsObj.smtp_from || 'noreply@wijzeweeskitten.nl',
        smtp_from_name: settingsObj.smtp_from_name || 'Stichting het Wijze Weeskitten',
        recaptcha_site_key: settingsObj.recaptcha_site_key || '',
        recaptcha_secret_key: settingsObj.recaptcha_secret_key || '',
        google_analytics_id: settingsObj.google_analytics_id || ''
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

  const handleTestEmail = async () => {
    if (!testEmailAddress) {
      setMessage('Vul een e-mail adres in voor de test');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setTestingEmail(true);
    setMessage('');

    try {
      // First save settings
      await handleSave();
      
      // Then test connection
      const testRes = await authenticatedFetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'test-connection'
        })
      });
      
      const testData = await testRes.json();
      
      if (!testData.success) {
        setMessage(`❌ ${testData.message}`);
        setTestingEmail(false);
        setTimeout(() => setMessage(''), 5000);
        return;
      }
      
      // Send test email
      const sendRes = await authenticatedFetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'send-test',
          to: testEmailAddress
        })
      });
      
      const sendData = await sendRes.json();
      
      if (sendData.success) {
        setMessage('✅ Test e-mail succesvol verzonden! Check je inbox (of Mailhog op http://localhost:8026)');
      } else {
        setMessage(`❌ ${sendData.error || 'Fout bij verzenden'}`);
      }
      
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('❌ Fout bij testen e-mail');
      console.error('Error testing email:', error);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setTestingEmail(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Alleen afbeeldingsbestanden zijn toegestaan');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Afbeelding mag maximaal 5MB zijn');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploadingHeroImage(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'hero');

      // Get auth token manually for FormData upload
      const token = localStorage.getItem('admin_token');
      const csrfToken = localStorage.getItem('csrf_token');
      
      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
      };
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: headers,
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      handleChange('hero_image', data.url);
      setMessage('Hero afbeelding succesvol geüpload!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Fout bij uploaden van afbeelding');
      console.error('Error uploading image:', error);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploadingHeroImage(false);
    }
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
                  
                  {settings.hero_image && (
                    <div className="mb-3 rounded-lg overflow-hidden border">
                      <img 
                        src={settings.hero_image} 
                        alt="Hero Preview" 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        disabled={uploadingHeroImage}
                        className="hidden"
                        id="hero-image-upload"
                      />
                      <div className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition cursor-pointer text-center font-semibold">
                        {uploadingHeroImage ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined animate-spin">hourglass_empty</span>
                            Uploaden...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">upload</span>
                            Nieuwe afbeelding uploaden
                          </span>
                        )}
                      </div>
                    </label>
                    
                    <p className="text-xs text-gray-500">
                      Aanbevolen: breed formaat (bijv. 1920x600px), max 5MB
                    </p>
                  </div>
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

            {/* SMTP E-mail Instellingen */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">mail</span>
                SMTP E-mail Instellingen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_host}
                    onChange={(e) => handleChange('smtp_host', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="smtp.gmail.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Voor testing: mailhog (in Docker)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_port}
                    onChange={(e) => handleChange('smtp_port', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="587"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Standaard: 587 (TLS) of 465 (SSL)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beveiligde verbinding (SSL/TLS)
                  </label>
                  <select
                    value={settings.smtp_secure}
                    onChange={(e) => handleChange('smtp_secure', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="false">Nee (STARTTLS)</option>
                    <option value="true">Ja (SSL/TLS)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Port 465 vereist SSL/TLS
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Afzender E-mail
                  </label>
                  <input
                    type="email"
                    value={settings.smtp_from}
                    onChange={(e) => handleChange('smtp_from', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="noreply@wijzeweeskitten.nl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Afzender Naam
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_from_name}
                    onChange={(e) => handleChange('smtp_from_name', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Stichting het Wijze Weeskitten"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Gebruikersnaam
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_user}
                    onChange={(e) => handleChange('smtp_user', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="(optioneel)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laat leeg als geen authenticatie nodig is
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Wachtwoord
                  </label>
                  <input
                    type="password"
                    value={settings.smtp_pass}
                    onChange={(e) => handleChange('smtp_pass', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="(optioneel)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Voor Gmail: gebruik App Password
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Mailhog voor Testing
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  In Docker is Mailhog beschikbaar op <strong>http://localhost:8026</strong> om test e-mails te bekijken.
                  Gebruik host: <code className="bg-blue-100 px-2 py-1 rounded">mailhog</code>, 
                  port: <code className="bg-blue-100 px-2 py-1 rounded">1025</code>, 
                  secure: <code className="bg-blue-100 px-2 py-1 rounded">false</code>
                </p>
                
                {/* Test Email Form */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Test E-mail Verzenden</h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="test@example.com"
                    />
                    <button
                      onClick={handleTestEmail}
                      disabled={testingEmail || saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {testingEmail ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">hourglass_empty</span>
                          Testen...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">send</span>
                          Test Verzenden
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Dit slaat eerst je instellingen op en verstuurt daarna een test e-mail.
                  </p>
                </div>
              </div>
            </div>

            {/* reCAPTCHA Spam Protection */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">shield</span>
                reCAPTCHA v3 Spam Bescherming
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    reCAPTCHA Site Key
                  </label>
                  <input
                    type="text"
                    value={settings.recaptcha_site_key}
                    onChange={(e) => handleChange('recaptcha_site_key', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    placeholder="6LdxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxL"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Publieke sleutel voor frontend gebruik
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    reCAPTCHA Secret Key
                  </label>
                  <input
                    type="password"
                    value={settings.recaptcha_secret_key}
                    onChange={(e) => handleChange('recaptcha_secret_key', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    placeholder="6LdxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxL"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Geheime sleutel voor server-side verificatie
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-900">
                  <span className="material-symbols-outlined text-sm">info</span>
                  reCAPTCHA v3 Instellen
                </h3>
                <div className="text-sm text-yellow-800 space-y-2">
                  <p>
                    1. Ga naar <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google reCAPTCHA Admin</a>
                  </p>
                  <p>2. Registreer een nieuwe site met reCAPTCHA v3</p>
                  <p>3. Voeg je domein toe (bijv. wijzeweeskitten.nl)</p>
                  <p>4. Kopieer de Site Key en Secret Key hierboven</p>
                  <p className="mt-3">
                    <strong>Let op:</strong> reCAPTCHA v3 werkt onzichtbaar op de achtergrond en geeft een score (0-1). 
                    Scores boven 0.5 worden als menselijk beschouwd.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Analytics */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">analytics</span>
                Google Analytics 4 Tracking
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Analytics Measurement ID
                  </label>
                  <input
                    type="text"
                    value={settings.google_analytics_id}
                    onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Voorbeeld: G-12345ABCDE
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-purple-900">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Google Analytics Instellen
                </h3>
                <div className="text-sm text-purple-800 space-y-2">
                  <p>
                    1. Ga naar <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google Analytics</a>
                  </p>
                  <p>2. Maak een nieuwe GA4 property aan</p>
                  <p>3. Navigeer naar Admin → Data Streams → Web</p>
                  <p>4. Kopieer het Measurement ID (begint met G-)</p>
                  <p>5. Plak het ID hierboven</p>
                  <p className="mt-3">
                    <strong>Privacy:</strong> Vergeet niet een cookiemelding en privacyverklaring toe te voegen volgens de AVG/GDPR wetgeving.
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
