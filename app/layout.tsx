import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/settings'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  title: {
    default: 'Stichting het Wijze Weeskitten - Help katten in nood',
    template: '%s | Stichting het Wijze Weeskitten',
  },
  description: 'Onvoorwaardelijke hulp aan katten in noodsituaties. Adopteer een kat, doneer of wordt vrijwilliger bij onze stichting.',
  keywords: ['katten', 'adoptie', 'dierenwelzijn', 'kattenstichting', 'donatie', 'vrijwilliger', 'Nederland'],
  authors: [{ name: 'Stichting het Wijze Weeskitten' }],
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: '/',
    siteName: 'Stichting het Wijze Weeskitten',
    title: 'Stichting het Wijze Weeskitten - Help katten in nood',
    description: 'Onvoorwaardelijke hulp aan katten in noodsituaties. Adopteer een kat, doneer of wordt vrijwilliger bij onze stichting.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stichting het Wijze Weeskitten - Help katten in nood',
    description: 'Onvoorwaardelijke hulp aan katten in noodsituaties. Adopteer een kat, doneer of wordt vrijwilliger bij onze stichting.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings();
  
  // Convert hex color to RGB for Tailwind
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
      : '238 111 160'; // fallback to default pink
  };
  
  return (
    <html lang="nl">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-primary-rgb: ${hexToRgb(settings.primary_color)};
            }
            .bg-primary-500 { background-color: rgb(var(--color-primary-rgb)) !important; }
            .bg-primary-600 { background-color: rgb(var(--color-primary-rgb)); filter: brightness(0.9); }
            .bg-primary-700 { background-color: rgb(var(--color-primary-rgb)); filter: brightness(0.8); }
            .bg-primary-800 { background-color: rgb(var(--color-primary-rgb)); filter: brightness(0.7); }
            .bg-primary-900 { background-color: rgb(var(--color-primary-rgb)); filter: brightness(0.6); }
            .text-primary-500 { color: rgb(var(--color-primary-rgb)) !important; }
            .text-primary-600 { color: rgb(var(--color-primary-rgb)); filter: brightness(0.9); }
            .text-primary-700 { color: rgb(var(--color-primary-rgb)); filter: brightness(0.8); }
            .hover\\:bg-primary-600:hover { background-color: rgb(var(--color-primary-rgb)); filter: brightness(0.9); }
            .hover\\:bg-primary-700:hover { background-color: rgb(var(--color-primary-rgb)); filter: brightness(0.8); }
            .hover\\:text-primary-700:hover { color: rgb(var(--color-primary-rgb)); filter: brightness(0.8); }
            .border-primary-500 { border-color: rgb(var(--color-primary-rgb)) !important; }
            .focus\\:ring-primary-500:focus { --tw-ring-color: rgb(var(--color-primary-rgb)) !important; }
            
            /* Override hard-coded pink colors with primary */
            .bg-pink-500, .bg-pink-600 { background-color: rgb(var(--color-primary-rgb)) !important; }
            .hover\\:bg-pink-600:hover, .hover\\:bg-pink-700:hover { background-color: rgb(var(--color-primary-rgb)); filter: brightness(0.9); }
            .text-pink-500, .text-pink-600 { color: rgb(var(--color-primary-rgb)) !important; }
            .focus\\:ring-pink-500:focus { --tw-ring-color: rgb(var(--color-primary-rgb)) !important; }
          `
        }} />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
