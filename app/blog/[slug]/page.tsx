import type { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';

async function getBlogPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.post;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog post niet gevonden',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
    keywords: ['katten', 'blog', post.title],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      images: post.image_url ? [{ url: post.image_url, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog post niet gevonden</h1>
        <p className="text-gray-600">Deze blog post bestaat niet.</p>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
            image: post.image_url || undefined,
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: {
              '@type': 'Organization',
              name: 'Stichting het Wijze Weeskitten',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Stichting het Wijze Weeskitten',
            },
          }),
        }}
      />

      <div className="h-96 bg-gray-200 rounded-lg overflow-hidden mb-8 flex items-center justify-center">
        {post.image_url ? (
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '120px' }}>
            article
          </span>
        )}
      </div>
      
      <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
      
      <p className="text-gray-600 mb-8">
        Gepubliceerd op {new Date(post.created_at).toLocaleDateString('nl-NL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
    </article>
  );
}
