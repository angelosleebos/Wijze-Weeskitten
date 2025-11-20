import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 mt-20 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Over ons */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary-500 text-3xl">pets</span>
              <h3 className="text-xl font-bold text-gray-800">Stichting het Wijze Weeskitten</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Kleinschalige organisatie die op geheel eigen wijze onvoorwaardelijke hulp biedt aan katten in noodsituaties.
            </p>
          </div>

          {/* Snelle links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-500">link</span>
              Navigatie
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">home</span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/katten" className="text-gray-600 hover:text-primary-600 transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">pets</span>
                  Katten
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary-600 transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">article</span>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-500">contact_mail</span>
              Contact
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">mail</span>
                <a href="mailto:info@wijzeweeskitten.nl" className="hover:text-primary-600 transition">
                  info@wijzeweeskitten.nl
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">account_balance</span>
                <span className="text-sm">NL10 INGB 0005 9680 56</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">copyright</span>
            {new Date().getFullYear()} Stichting het Wijze Weeskitten. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
