import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
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
