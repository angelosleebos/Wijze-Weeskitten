import Hero from '@/components/Hero';
import FeaturedCats from '@/components/FeaturedCats';
import LatestBlogs from '@/components/LatestBlogs';
import DonationCTA from '@/components/DonationCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCats />
      <LatestBlogs />
      <DonationCTA />
    </>
  );
}
