import Link from 'next/link';

async function getBlogPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data.posts?.slice(0, 3) || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function LatestBlogs() {
  const posts = await getBlogPosts();

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Laatste Nieuws</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link 
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {post.image_url && (
                <div className="h-48 bg-gray-200">
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 hover:text-primary-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {new Date(post.created_at).toLocaleDateString('nl-NL')}
                </p>
                {post.excerpt && (
                  <p className="text-gray-700 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/blog"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            Lees meer blogs
          </Link>
        </div>
      </div>
    </section>
  );
}
