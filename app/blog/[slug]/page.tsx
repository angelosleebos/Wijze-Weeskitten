async function getBlogPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${slug}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.post;
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
      {post.image_url && (
        <div className="h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
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
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
