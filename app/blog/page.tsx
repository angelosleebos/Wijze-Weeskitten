import BlogGrid from '@/components/BlogGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Lees meer over onze katten, adoptieverhal en en handige tips voor kattenbezitters.',
  keywords: ['katten blog', 'kattenadvies', 'adoptieverhalen', 'kattentips'],
  openGraph: {
    title: 'Blog | Stichting het Wijze Weeskitten',
    description: 'Lees meer over onze katten, adoptieverhal en en handige tips voor kattenbezitters.',
    type: 'website',
  },
};

async function getBlogPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.posts || [];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Ons Blog</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Lees meer over onze katten, adoptieverhal en en handige tips voor kattenbezitters.
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Er zijn nog geen blogposts gepubliceerd.
          </p>
        </div>
      ) : (
        <BlogGrid posts={posts} />
      )}
    </div>
  );
}
