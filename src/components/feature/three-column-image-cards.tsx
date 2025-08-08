'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    title: 'Building Scalable React Applications with TypeScript',
    excerpt:
      'A comprehensive guide to setting up a React application with TypeScript, covering best practices for type safety and component architecture.',
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    date: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Tutorial',
    slug: 'building-scalable-react-applications',
  },
  {
    title: 'From Concept to Launch: My First SaaS Journey',
    excerpt:
      'Lessons learned from building and launching my first SaaS product, including the challenges faced and strategies that worked.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    date: 'December 12, 2024',
    readTime: '12 min read',
    category: 'Project Retrospective',
    slug: 'first-saas-journey',
  },
  {
    title: 'The Future of Web Development: Trends to Watch in 2025',
    excerpt:
      'Exploring emerging technologies and frameworks that are shaping the future of web development, from AI integration to new JavaScript features.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    date: 'December 10, 2024',
    readTime: '6 min read',
    category: 'Industry Insights',
    slug: 'future-web-development-2025',
  },
];

const ThreeColumnImageCards = () => {
  return (
    <section className='bg-background py-32'>
      <div className='container'>
        <div className='m-auto mb-24 max-w-xl text-center'>
          <h2 className='mb-6 text-3xl font-semibold lg:text-5xl'>Latest from Blog</h2>
          <p className='text-muted-foreground m-auto max-w-3xl text-lg lg:text-xl'>
            Thoughts on development, technology, and best practices
          </p>
          <div className='mt-8 flex flex-col items-center space-y-2'>
            <Button
              className='rounded-xl'
              size='lg'
              onClick={() => (window.location.href = '/blog')}
            >
              View All Posts
            </Button>
          </div>
        </div>
        <div className='mt-11 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className='bg-card overflow-hidden border-0 pt-0 transition-shadow duration-300 hover:shadow-lg'
            >
              <img src={post.image} alt={post.title} className='aspect-video w-full object-cover' />
              <div className='p-6'>
                <div className='text-muted-foreground mb-3 flex-row items-center gap-4 text-sm lg:flex'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    <span>{post.date}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h3 className='mb-3 text-xl leading-tight font-semibold'>{post.title}</h3>
                <p className='text-muted-foreground mb-4 leading-relaxed'>{post.excerpt}</p>
                <span className='text-accent bg-accent/10 rounded-full px-2 py-1 text-xs font-medium'>
                  {post.category}
                </span>
                <div className='mt-4 flex items-center justify-end'>
                  <Link href={`/blog/${post.slug}`}>
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
      </div>
    </section>
  );
};

export { ThreeColumnImageCards };
