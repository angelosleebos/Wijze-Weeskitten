import Link from 'next/link';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {posts.map((post: any) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            {post.image_url && (
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 hover:text-primary-600 transition">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {new Date(post.created_at).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {post.excerpt && (
                <p className="text-gray-700">{post.excerpt}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Er zijn nog geen blogposts gepubliceerd.
          </p>
        </div>
      )}
    </div>
  );
}
