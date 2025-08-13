'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Post {
  blog_id: string;
  blog_title: string;
  blog_slug: string;
  blog_content: string;
  blog_description: string;
  blog_status: 'draft' | 'published' | 'archived';
  blog_views: number;
  created_at: string;
  published_at: string | null;
  updated_at: string;
  author: {
    username: string;
    email: string;
  };
  categories: {
    category_id: string;
    category_name: string;
    category_slug: string;
  }[];
  thumbnail?: {
    image_id: string;
    image_path: string;
    image_alt: string;
  };
}

export default function BlogAdminList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/post?limit=50');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to archive this post?')) return;

    try {
      const response = await fetch(`/api/post/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.blog_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.blog_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDescription = (content: string, maxLength = 200) => {
    const text = content.replace(/<[^>]*>/g, '').replace(/#+\s*/g, '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <section className='p-6'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Blog Posts</h1>
              <p className='text-muted-foreground'>Manage your blog content</p>
            </div>
            <Link href='/admin/blog/editor'>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                New Post
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className='rounded-lg border p-4'>
                    <div className='space-y-3'>
                      <div className='h-6 bg-muted animate-pulse rounded w-1/2' />
                      <div className='h-4 bg-muted animate-pulse rounded w-3/4' />
                      <div className='h-4 bg-muted animate-pulse rounded w-1/4' />
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

  return (
    <section className='p-6'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Blog Posts</h1>
            <p className='text-muted-foreground'>Manage your blog content</p>
          </div>
          <Link href='/admin/blog/editor'>
            <Button>
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
              {filteredPosts.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-muted-foreground'>No posts found.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.blog_id}
                    className='hover:bg-muted/50 rounded-lg border p-4 transition-colors'
                  >
                    <div className='flex items-start gap-4'>
                      {/* Thumbnail */}
                      <div className='flex-shrink-0'>
                        {post.thumbnail ? (
                          <Image
                            src={post.thumbnail.image_path}
                            alt={post.thumbnail.image_alt}
                            width={120}
                            height={80}
                            className='rounded-lg object-cover'
                          />
                        ) : (
                          <div className='w-[120px] h-[80px] bg-muted rounded-lg flex items-center justify-center'>
                            <span className='text-muted-foreground text-xs'>No image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='mb-2 flex items-center gap-2'>
                          <h3 className='text-lg font-semibold truncate'>{post.blog_title}</h3>
                          <Badge className={getStatusColor(post.blog_status)}>
                            {post.blog_status}
                          </Badge>
                        </div>
                        <p className='text-muted-foreground mb-3 line-clamp-2'>
                          {post.blog_description || getDescription(post.blog_content)}
                        </p>
                        {post.categories && post.categories.length > 0 && (
                          <div className='flex flex-wrap gap-1 mb-2'>
                            {post.categories.map((category) => (
                              <Badge key={category.category_id} variant="outline" className="text-xs">
                                {category.category_name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                          <div className='flex items-center gap-1'>
                            <User className='h-4 w-4' />
                            {post.author.username}
                          </div>
                          {post.published_at && (
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-4 w-4' />
                              {new Date(post.published_at).toLocaleDateString()}
                            </div>
                          )}
                          <div className='flex items-center gap-1'>
                            <Eye className='h-4 w-4' />
                            {post.blog_views} views
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className='flex items-center gap-2'>
                        <Link href={`/admin/blog/preview/${post.blog_slug}`}>
                          <Button variant='outline' size='sm'>
                            <Eye className='h-4 w-4' />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/editor/${post.blog_slug}`}>
                          <Button variant='outline' size='sm'>
                            <Edit className='h-4 w-4' />
                          </Button>
                        </Link>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-red-600 hover:text-red-700'
                          onClick={() => handleDelete(post.blog_slug)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}