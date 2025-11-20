async function getVolunteers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/volunteers`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.volunteers || [];
}

export default async function ContactPage() {
  const volunteers = await getVolunteers();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Contact</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Heb je vragen of wil je meer informatie? Neem contact op met één van onze vrijwilligers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {volunteers.map((volunteer: any) => (
          <div key={volunteer.id} className="bg-white rounded-lg shadow-lg p-6">
            {volunteer.image_url && (
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={volunteer.image_url} 
                  alt={volunteer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h2 className="text-xl font-bold text-center mb-1">{volunteer.name}</h2>
            {volunteer.role && (
              <p className="text-primary-600 text-center text-sm mb-4">{volunteer.role}</p>
            )}
            {volunteer.bio && (
              <p className="text-gray-700 text-sm mb-4">{volunteer.bio}</p>
            )}
            <div className="space-y-2 text-sm">
              {volunteer.email && (
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <a href={`mailto:${volunteer.email}`} className="text-primary-600 hover:underline">
                    {volunteer.email}
                  </a>
                </div>
              )}
              {volunteer.phone && (
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <a href={`tel:${volunteer.phone}`} className="text-primary-600 hover:underline">
                    {volunteer.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {volunteers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Er zijn momenteel geen contactpersonen beschikbaar.
          </p>
        </div>
      )}
    </div>
  );
}
