'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock blog posts data
const mockPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 15',
    slug: 'getting-started-nextjs-15',
    excerpt: 'Learn the fundamentals of Next.js 15 and build modern web applications.',
    status: 'published',
    author: 'John Doe',
    publishedAt: '2024-01-15',
    views: 1250,
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    slug: 'advanced-react-patterns',
    excerpt: 'Explore advanced React patterns for building scalable applications.',
    status: 'draft',
    author: 'John Doe',
    publishedAt: null,
    views: 0,
  },
  {
    id: 3,
    title: 'TypeScript Best Practices',
    slug: 'typescript-best-practices',
    excerpt: 'Essential TypeScript practices every developer should know.',
    status: 'published',
    author: 'John Doe',
    publishedAt: '2024-01-10',
    views: 890,
  },
];

export default function BlogAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts] = useState(mockPosts);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className='p-6'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Blog Posts</h1>
            <p className='text-muted-foreground'>Manage your blog content</p>
          </div>
          <Link href='/admin/blog/editor'>
            <Button className='cursor-pointer'>
              <Plus className='mr-2 h-4 w-4' />
              New Post
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <div className='flex items-center space-x-2'>
              <Search className='text-muted-foreground h-4 w-4' />
              <Input
                placeholder='Search posts...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='max-w-sm'
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className='hover:bg-muted/50 rounded-lg border p-4 transition-colors'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-2'>
                        <h3 className='text-lg font-semibold'>{post.title}</h3>
                        <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                      </div>
                      <p className='text-muted-foreground mb-3'>{post.excerpt}</p>
                      <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1'>
                          <User className='h-4 w-4' />
                          {post.author}
                        </div>
                        {post.publishedAt && (
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                        <div className='flex items-center gap-1'>
                          <Eye className='h-4 w-4' />
                          {post.views} views
                        </div>
                      </div>
                    </div>
                    <div className='ml-4 flex items-center gap-2'>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant='outline' size='sm' className='cursor-pointer'>
                          <Eye className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Link href={`/admin/blog/editor?id=${post.id}`}>
                        <Button variant='outline' size='sm' className='cursor-pointer'>
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Button
                        variant='outline'
                        size='sm'
                        className='cursor-pointer text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
