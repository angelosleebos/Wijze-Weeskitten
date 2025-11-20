import Link from 'next/link';
import CatsGrid from '@/components/CatsGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onze Katten',
  description: 'Bekijk al onze katten die klaar zijn voor adoptie. Geef een kat een nieuw thuis en verander een leven.',
  keywords: ['katten adoptie', 'kat adopteren', 'katten beschikbaar', 'adoptie Nederland'],
  openGraph: {
    title: 'Onze Katten | Stichting het Wijze Weeskitten',
    description: 'Bekijk al onze katten die klaar zijn voor adoptie. Geef een kat een nieuw thuis en verander een leven.',
    type: 'website',
  },
};

async function getCats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cats?adopted=true`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.cats || [];
}

export default async function KattenPage() {
  const cats = await getCats();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Onze Katten</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Al deze lieve katten zijn op zoek naar een warm thuis. 
        Klik op "Adopteren" om direct een aanvraag in te dienen!
      </p>

      <CatsGrid cats={cats} />
    </div>
  );
}
