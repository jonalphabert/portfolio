'use client';

import { useState, useMemo } from 'react';

import { MinimalCenteredFooter } from '@/components/footers/minimal-centered-footer';
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

const mockBlogPosts = [
  {
    id: 1,
    title: 'Building Modern React Applications with TypeScript',
    slug: 'building-modern-react-applications-typescript',
    excerpt:
      'Explore the benefits of using TypeScript in React projects and learn best practices for type-safe component development.',
    category: 'React',
    author: 'Alex Johnson',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    views: 1250,
  },
  {
    id: 2,
    title: 'CSS Grid vs Flexbox: When to Use Each',
    slug: 'css-grid-vs-flexbox-when-to-use',
    excerpt:
      'A comprehensive comparison of CSS Grid and Flexbox layout systems with practical examples and use cases.',
    category: 'CSS',
    author: 'Sarah Chen',
    publishedAt: '2024-01-12',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    views: 980,
  },
  {
    id: 3,
    title: 'JavaScript ES2024: New Features You Should Know',
    slug: 'javascript-es2024-new-features',
    excerpt:
      'Discover the latest JavaScript features introduced in ES2024 and how they can improve your development workflow.',
    category: 'JavaScript',
    author: 'Mike Rodriguez',
    publishedAt: '2024-01-10',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop',
    views: 1450,
  },
  {
    id: 4,
    title: 'Complete Guide to Next.js App Router',
    slug: 'complete-guide-nextjs-app-router',
    excerpt:
      'Learn everything about Next.js App Router including routing, layouts, and data fetching patterns.',
    category: 'Tutorial',
    author: 'Emily Wang',
    publishedAt: '2024-01-08',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    views: 2100,
  },
  {
    id: 5,
    title: 'The Future of Web Development in 2024',
    slug: 'future-web-development-2024',
    excerpt:
      'Insights into emerging trends, technologies, and practices shaping the future of web development.',
    category: 'Industry Insights',
    author: 'David Kim',
    publishedAt: '2024-01-05',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    views: 1800,
  },
  {
    id: 6,
    title: 'Project Retrospective: Building a Real-time Chat App',
    slug: 'project-retrospective-realtime-chat-app',
    excerpt:
      'Lessons learned from building a real-time chat application using WebSockets, Node.js, and React.',
    category: 'Project Retrospective',
    author: 'Lisa Park',
    publishedAt: '2024-01-03',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    views: 1320,
  },
  {
    id: 7,
    title: 'Mastering CSS Animations and Transitions',
    slug: 'mastering-css-animations-transitions',
    excerpt:
      'Create smooth, performant animations using CSS transitions, keyframes, and modern animation techniques.',
    category: 'CSS',
    author: 'Tom Wilson',
    publishedAt: '2024-01-01',
    readTime: '11 min read',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop',
    views: 1100,
  },
  {
    id: 8,
    title: 'React Performance Optimization Techniques',
    slug: 'react-performance-optimization-techniques',
    excerpt:
      'Advanced strategies for optimizing React applications including memoization, code splitting, and bundle analysis.',
    category: 'React',
    author: 'Anna Martinez',
    publishedAt: '2023-12-28',
    readTime: '14 min read',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop',
    views: 2350,
  },
  {
    id: 9,
    title: 'Building APIs with Node.js and Express',
    slug: 'building-apis-nodejs-express',
    excerpt:
      'Step-by-step tutorial on creating robust REST APIs using Node.js, Express, and best practices for API design.',
    category: 'Tutorial',
    author: 'Chris Thompson',
    publishedAt: '2023-12-25',
    readTime: '15 min read',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop',
    views: 1890,
  },
  {
    id: 10,
    title: 'Understanding JavaScript Closures',
    slug: 'understanding-javascript-closures',
    excerpt:
      'Deep dive into JavaScript closures with practical examples and common use cases in modern development.',
    category: 'JavaScript',
    author: 'Rachel Green',
    publishedAt: '2023-12-22',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&h=400&fit=crop',
    views: 1560,
  },
  {
    id: 11,
    title: 'Remote Work Tools for Developers',
    slug: 'remote-work-tools-developers',
    excerpt:
      'Essential tools and practices for maintaining productivity and collaboration while working remotely as a developer.',
    category: 'Industry Insights',
    author: 'Kevin Brown',
    publishedAt: '2023-12-20',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
    views: 1200,
  },
  {
    id: 12,
    title: 'E-commerce Platform Migration: Lessons Learned',
    slug: 'ecommerce-platform-migration-lessons',
    excerpt:
      'Key insights from migrating a large e-commerce platform to a modern tech stack while maintaining business continuity.',
    category: 'Project Retrospective',
    author: 'Jennifer Lee',
    publishedAt: '2023-12-18',
    readTime: '13 min read',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    views: 2000,
  },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = mockBlogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'latest':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

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

  return (
    <div className='bg-background min-h-screen'>
      {/* Hero Section */}
      <section className='from-surface to-background bg-gradient-to-b py-20'>
        <div className='container mx-auto max-w-6xl px-6 text-center'>
          <h1 className='mb-6 text-5xl font-bold tracking-tight'>Blog</h1>
          <p className='text-muted-foreground mx-auto mb-4 max-w-2xl text-xl'>
            Thoughts on development, technology, and best practices
          </p>
          <p className='text-muted-foreground mx-auto max-w-3xl'>
            Welcome to my blog where I share insights, tutorials, and experiences from my journey as
            a developer. Explore articles covering modern web technologies, project retrospectives,
            and industry trends.
          </p>
        </div>
      </section>

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
                    key={post.id}
                    className='group overflow-hidden py-0 transition-all duration-300 hover:shadow-lg'
                  >
                    <div className='relative overflow-hidden'>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                      <div className='absolute top-3 left-3'>
                        <Badge variant='secondary' className='bg-background/90 backdrop-blur-sm'>
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    <div className='p-6'>
                      <div className='text-muted-foreground mb-3 flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className='group-hover:text-accent mb-3 text-xl font-semibold transition-colors duration-200'>
                        {post.title}
                      </h3>

                      <p className='text-muted-foreground mb-4 line-clamp-2'>{post.excerpt}</p>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <User className='text-muted-foreground h-4 w-4' />
                          <span className='text-muted-foreground text-sm'>{post.author}</span>
                        </div>

                        <Link href={`/blog/${post.slug}`}>
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
    </div>
  );
}
