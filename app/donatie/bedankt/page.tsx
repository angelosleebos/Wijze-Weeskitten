export default function BedanktPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-12 mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-4 text-green-800">Bedankt voor je donatie!</h1>
          <p className="text-lg text-gray-700">
            Jouw bijdrage helpt ons om katten in nood op te vangen en te verzorgen. 
            We zijn je enorm dankbaar voor je steun!
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Je ontvangt een bevestiging per e-mail.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Terug naar home
            </a>
            <a
              href="/katten"
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Bekijk onze katten
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
