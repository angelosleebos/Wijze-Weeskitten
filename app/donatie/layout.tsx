import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doneer',
  description: 'Steun onze kattenstichting met een veilige iDEAL donatie. Jouw bijdrage helpt katten in nood.',
  keywords: ['donatie', 'doneren', 'iDEAL', 'steun', 'katten helpen'],
  openGraph: {
    title: 'Doneer | Stichting het Wijze Weeskitten',
    description: 'Steun onze kattenstichting met een veilige iDEAL donatie. Jouw bijdrage helpt katten in nood.',
    type: 'website',
  },
};

export default function DonatieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
