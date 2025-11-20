import Link from 'next/link';
import { getSettings } from '@/lib/settings';

export default async function Hero() {
  const settings = await getSettings();
  
  return (
    <div className="relative bg-gradient-to-r from-primary-500 to-primary-700 text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${settings.hero_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          {settings.hero_title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-lg">
          {settings.hero_subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/katten"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Bekijk onze katten
          </Link>
          <Link
            href="/donatie"
            className="bg-primary-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-900 transition"
          >
            Doneer nu
          </Link>
        </div>
      </div>
    </div>
  );
}
