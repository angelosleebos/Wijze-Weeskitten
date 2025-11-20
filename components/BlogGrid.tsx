'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt?.toLowerCase().includes(term) ||
          post.content.toLowerCase().includes(term)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [posts, searchTerm, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Zoek in blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-600">sort</span>
            <label className="text-sm font-medium text-gray-700">Sorteren:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">Nieuwste eerst</option>
              <option value="oldest">Oudste eerst</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-600">
            {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 ? 'post' : 'posts'}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredAndSortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredAndSortedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-48 bg-gray-200 relative flex items-center justify-center">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-gray-400 text-6xl">
                    article
                  </span>
                )}
              </div>
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
                {post.excerpt && <p className="text-gray-700">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-gray-400 text-5xl mb-4">
            article
          </span>
          <p className="text-gray-600 text-lg mb-4">
            Geen blog posts gevonden met de huidige zoekopdracht.
          </p>
          {(searchTerm || sortBy !== 'newest') && (
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </>
  );
}
