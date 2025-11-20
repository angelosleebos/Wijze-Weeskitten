import Link from 'next/link';

async function getCats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cats`, {
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
        Wil je een kat adopteren? Neem dan contact met ons op!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cats.map((cat: any) => (
          <div key={cat.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            {cat.image_url && (
              <div className="h-64 bg-gray-200 relative">
                <img 
                  src={cat.image_url} 
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
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
              <Link 
                href="/contact" 
                className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Interesse? Neem contact op
              </Link>
            </div>
          </div>
        ))}
      </div>

      {cats.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Er zijn momenteel geen katten beschikbaar voor adoptie.
          </p>
        </div>
      )}
    </div>
  );
}
