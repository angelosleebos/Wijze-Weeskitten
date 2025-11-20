import Hero from '@/components/Hero';
import FeaturedCats from '@/components/FeaturedCats';
import LatestBlogs from '@/components/LatestBlogs';
import DonationCTA from '@/components/DonationCTA';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  return (
    <>
      {/* JSON-LD Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Stichting het Wijze Weeskitten',
            description: 'Onvoorwaardelijke hulp aan katten in noodsituaties',
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            sameAs: [],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Customer Service',
              availableLanguage: ['nl'],
            },
          }),
        }}
      />

      <Hero />
      <FeaturedCats />
      <LatestBlogs />
      <DonationCTA />
    </>
  );
}
