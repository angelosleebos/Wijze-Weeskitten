import Link from 'next/link';

export default function DonationCTA() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Steun onze missie</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Jouw donatie helpt ons om katten in nood op te vangen, 
          te verzorgen en aan een nieuw thuis te helpen.
        </p>
        <Link
          href="/donatie"
          className="inline-block bg-white text-primary-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
        >
          Doneer nu met iDEAL
        </Link>
      </div>
    </section>
  );
}
