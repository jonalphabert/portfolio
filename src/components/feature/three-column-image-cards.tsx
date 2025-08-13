'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BlogPost {
  blog_id: string;
  blog_title: string;
  blog_slug: string;
  blog_description: string;
  blog_tags: string[];
  created_at: string;
  published_at: string | null;
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
  author: {
    username: string;
    email: string;
  };
}

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/post?status=published&limit=3`, {
      next: { revalidate: 604800 } // 1 week = 7 days * 24 hours * 60 minutes * 60 seconds
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

const ThreeColumnImageCards = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getLatestPosts();
      setBlogPosts(posts);
      setLoading(false);
    };
    
    fetchPosts();
  }, []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content: string) => {
    const words = content.split(' ').length;
    return Math.ceil(words / 200);
  };

  if (loading) {
    return (
      <section className='bg-background py-32'>
        <div className='container'>
          <div className='text-center'>
            <div className='animate-pulse'>Loading blog posts...</div>
          </div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return null;
  }
  return (
    <section className='bg-background py-32'>
      <div className='container'>
        <div className='m-auto mb-24 max-w-xl text-center'>
          <h2 className='mb-6 text-3xl font-semibold lg:text-5xl'>Latest from Blog</h2>
          <p className='text-muted-foreground m-auto max-w-3xl text-lg lg:text-xl'>
            Thoughts on development, technology, and best practices
          </p>
          <div className='mt-8 flex flex-col items-center space-y-2'>
            <Link href='/blog'>
              <Button className='rounded-xl' size='lg'>
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
        <div className='mt-11 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {blogPosts.map((post) => (
              <Card
                key={post.blog_id}
                className='bg-card overflow-hidden border-0 py-0 transition-shadow duration-300 hover:shadow-lg'
              >
                <Link href={`/blog/${post.blog_slug}`}>
                <img 
                  src={post.thumbnail?.image_path || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop'} 
                  alt={post.thumbnail?.image_alt || post.blog_title} 
                  className='aspect-video w-full object-cover' 
                />
                <div className='p-6'>
                  <div className='text-muted-foreground mb-3 flex-row items-center gap-4 text-sm lg:flex'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock className='h-4 w-4' />
                      <span>{calculateReadTime(post.blog_description)} min read</span>
                    </div>
                  </div>
                  <h3 className='mb-3 text-xl leading-tight font-semibold hover:text-accent transition-colors cursor-pointer'>{post.blog_title}</h3>
                  <p className='text-muted-foreground mb-4 leading-relaxed'>{post.blog_description}</p>
                  <span className='text-accent bg-accent/10 rounded-full px-2 py-1 text-xs font-medium'>
                    {post.categories.length > 0 ? post.categories[0].category_name : 'Uncategorized'}
                  </span>
                  <div className='mt-4 flex items-center justify-end'>
                      <Button variant='ghost' size='sm' className='text-accent hover:text-gray-50'>
                        Read More
                        <ArrowRight className='ml-1 h-4 w-4' />
                      </Button>
                  </div>
                </div>
                </Link>
              </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ThreeColumnImageCards };
