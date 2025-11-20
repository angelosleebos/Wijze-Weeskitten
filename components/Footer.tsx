import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🐱 Stichting het Wijze Weeskitten</h3>
            <p className="text-gray-300">
              Kleinschalige organisatie die op geheel eigen wijze onvoorwaardelijke hulp biedt aan katten in noodsituaties.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigatie</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/katten" className="text-gray-300 hover:text-white transition">
                  Katten
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">
              E-mail: info@wijzeweeskitten.nl<br />
              Bankrekening: NL10 INGB 0005 9680 56
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Stichting het Wijze Weeskitten. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
