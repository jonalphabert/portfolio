'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Clock, ArrowRight, Filter, User } from 'lucide-react';
import Link from 'next/link';

const POSTS_PER_PAGE = 9;

const categories = [
  'All',
  'React',
  'CSS',
  'JavaScript',
  'Tutorial',
  'Industry Insights',
  'Project Retrospective',
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Most Popular' },
];

interface Post {
  blog_id: string;
  blog_title: string;
  blog_slug: string;
  blog_content: string;
  blog_tags: string[];
  blog_status: string;
  blog_views: number;
  blog_likes: number;
  created_at: string;
  published_at: string | null;
  updated_at: string;
  author: {
    username: string;
    email: string;
  };
  thumbnail?: {
    image_id: string;
    image_path: string;
    image_alt: string;
  };
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/post?status=published&limit=50');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch =
        post.blog_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.blog_content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.blog_tags.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.published_at || a.created_at).getTime() - new Date(b.published_at || b.created_at).getTime();
        case 'popular':
          return b.blog_views - a.blog_views;
        case 'latest':
        default:
          return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
      }
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const getExcerpt = (content: string, maxLength = 150) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters and Search */}
      <section className='bg-background border-b py-12'>
        <div className='container mx-auto max-w-6xl px-6'>
          <div className='flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center'>
            {/* Search */}
            <div className='relative max-w-md flex-1'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
              <Input
                placeholder='Search articles...'
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* Sort */}
            <div className='flex items-center gap-2'>
              <Filter className='text-muted-foreground h-4 w-4' />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className='border-input bg-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none'
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className='mt-6 flex flex-wrap gap-2'>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleCategoryChange(category)}
                className='transition-all duration-200'
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className='py-16'>
        <div className='container mx-auto max-w-6xl px-6'>
          {paginatedPosts.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-muted-foreground'>
                No articles found matching your search criteria.
              </p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {paginatedPosts.map((post) => (
                  <Card
                    key={post.blog_id}
                    className='group overflow-hidden py-0 transition-all duration-300 hover:shadow-lg'
                  >
                    <div className='relative overflow-hidden'>
                      <img
                        src={post.thumbnail?.image_path || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop'}
                        alt={post.thumbnail?.image_alt || post.blog_title}
                        className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                      <div className='absolute top-3 left-3'>
                        <Badge variant='secondary' className='bg-background/90 backdrop-blur-sm'>
                          {post.blog_tags[0] || 'Article'}
                        </Badge>
                      </div>
                    </div>

                    <div className='p-6'>
                      <div className='text-muted-foreground mb-3 flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {formatDate(post.published_at || post.created_at)}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {getReadTime(post.blog_content)}
                        </div>
                      </div>

                      <h3 className='group-hover:text-accent mb-3 text-xl font-semibold transition-colors duration-200'>
                        {post.blog_title}
                      </h3>

                      <p className='text-muted-foreground mb-4 line-clamp-2'>
                        {getExcerpt(post.blog_content)}
                      </p>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <User className='text-muted-foreground h-4 w-4' />
                          <span className='text-muted-foreground text-sm'>{post.author.username}</span>
                        </div>

                        <Link href={`/blog/${post.blog_slug}`}>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='group/button text-accent hover:text-accent-foreground h-auto p-0 font-medium'
                          >
                            Read More
                            <ArrowRight className='ml-1 h-3 w-3 transition-transform duration-200 group-hover/button:translate-x-1' />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='mt-12 flex items-center justify-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className='flex gap-1'>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setCurrentPage(page)}
                        className='h-8 w-8 p-0'
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}