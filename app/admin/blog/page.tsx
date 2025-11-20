'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  published: boolean;
  created_at: string;
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Weet je zeker dat je deze blogpost wilt verwijderen?')) return;

    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">article</span>
              Blog Beheren
            </h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Alle Blogposts</h2>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Nieuwe Post
            </button>
          </div>

          {loading ? (
            <p>Laden...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500">Nog geen blogposts toegevoegd.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex gap-4">
                    {post.image_url && (
                      <img src={post.image_url} alt={post.title} className="w-32 h-32 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <p className="text-sm text-gray-500">/{post.slug}</p>
                          <p className="text-gray-700 mt-2 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">calendar_today</span>
                              {new Date(post.created_at).toLocaleDateString('nl-NL')}
                            </span>
                            {post.published ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                Gepubliceerd
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">schedule</span>
                                Concept
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-700 p-2">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(post.slug)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
