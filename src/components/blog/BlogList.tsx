'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Clock, ArrowRight, Filter, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { BlogPost } from '@/types';

const POSTS_PER_PAGE = 6;



const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Most Popular' },
];

// Using BlogPost from @/types
/*interface Post {
  blog_id: string;
  blog_title: string;
  blog_slug: string;
  blog_content: string;
  blog_tags: string[];
  blog_status: string;
  blog_views: number;
  blog_likes: number;
  blog_description: string;
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
}*/

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const fetchPosts = useCallback(async (page = 1, search = '', sort = 'latest', category = 'All') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: POSTS_PER_PAGE.toString(),
        page: page.toString(),
        sort: sort,
        ...(search && { search }),
        ...(category !== 'All' && { category })
      });
      
      const response = await fetch(`/api/guest/blog?${params}`);
      const data = await response.json();
      
      // Transform guest API response to match BlogPost interface
      const transformedPosts = data.posts.map((post: {
        slug: string;
        title: string;
        content: string;
        tags: string[];
        views: number;
        description: string;
        publishedDate: string;
        author: { name: string };
        thumbnail?: { url: string; alt: string };
      }) => ({
        blog_id: post.slug,
        blog_title: post.title,
        blog_slug: post.slug,
        blog_content: post.content,
        blog_tags: post.tags,
        blog_status: 'published',
        blog_views: post.views,
        blog_description: post.description,
        created_at: post.publishedDate,
        published_at: post.publishedDate,
        updated_at: post.publishedDate,
        author: {
          username: post.author.name,
          email: ''
        },
        thumbnail: post.thumbnail ? {
          image_id: '',
          image_path: post.thumbnail.url,
          image_alt: post.thumbnail.alt
        } : undefined
      }));
      
      setPosts(transformedPosts);
      setTotalPosts(data.total || 0);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(currentPage, debouncedSearchQuery, sortBy, selectedCategory);
  }, [fetchPosts, currentPage, debouncedSearchQuery, sortBy, selectedCategory]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

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
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className='py-16'>
        <div className='container mx-auto max-w-6xl px-6'>
          {posts.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-muted-foreground'>
                No articles found matching your search criteria.
              </p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {posts.map((post) => (
                  <Card
                    key={post.blog_id}
                    className='group overflow-hidden py-0 transition-all duration-300 hover:shadow-lg'
                  >
                    <div className='relative overflow-hidden'>
                      <Image
                        src={post.thumbnail?.image_path || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop'}
                        width={400}
                        height={192}
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

                      <Link href={`/blog/${post.blog_slug}`}>
                        <h3 className='hover:text-accent mb-3 text-xl font-semibold transition-colors duration-200 cursor-pointer'>
                          {post.blog_title}
                        </h3>
                      </Link>

                      <p className='text-muted-foreground mb-4 line-clamp-2'>
                        {getExcerpt(post.blog_description)}
                      </p>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <User className='text-muted-foreground h-4 w-4' />
                          <span className='text-sm text-muted-foreground'>{post.author.username}</span>
                        </div>
                        <Link href={`/blog/${post.blog_slug}`}>
                          <Button variant='ghost' size='sm' className='text-accent hover:text-gray-50'>
                            Read More
                            <ArrowRight className='ml-1 h-4 w-4' />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className='mt-12 flex flex-col items-center gap-4'>
                <div className='text-sm text-muted-foreground'>
                  Showing {posts.length} of {totalPosts} posts
                </div>
                
                {totalPages > 1 && (
                  <div className='flex items-center justify-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className='flex gap-1'>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => setCurrentPage(pageNum)}
                            className='h-8 w-8 p-0'
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
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
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}