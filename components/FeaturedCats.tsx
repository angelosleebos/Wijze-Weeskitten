import Link from 'next/link';

async function getCats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cats`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.cats?.slice(0, 3) || [];
  } catch (error) {
    console.error('Error fetching cats:', error);
    return [];
  }
}

export default async function FeaturedCats() {
  const cats = await getCats();

  if (cats.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">Onze Katten</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cats.map((cat: any) => (
          <div key={cat.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            {cat.image_url && (
              <div className="h-64 bg-gray-200">
                <img 
                  src={cat.image_url} 
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{cat.description}</p>
              <Link 
                href="/katten"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Meer informatie →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link 
          href="/katten"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
        >
          Bekijk alle katten
        </Link>
      </div>
    </section>
  );
}
