'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { processMarkdown } from '@/lib/markdown';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  readTime: number;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  featuredImage: string;
  tags: string[];
}

interface BlogPreviewContentProps {
  post: BlogPost;
}

export function BlogPreviewContent({ post }: BlogPreviewContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className='pt-8'>
      {/* Featured Image */}
      <div className='container mx-auto max-w-4xl px-6'>
        <div className='relative mb-8 h-64 overflow-hidden rounded-lg md:h-96'>
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className='object-cover'
            priority
          />
        </div>
      </div>

      {/* Article Header */}
      <article className='container mx-auto max-w-4xl px-6'>
        <header className='mb-8'>
          <div className='mb-4 flex flex-wrap items-center gap-4'>
            <Badge variant='secondary' className='text-sm'>
              {post.category}
            </Badge>
            <div className='text-muted-foreground flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {formatDate(post.publishedDate)}
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                {post.readTime} menit baca
              </div>
            </div>
          </div>

          <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>{post.title}</h1>

          <p className='text-muted-foreground mb-6 text-xl'>{post.excerpt}</p>

          {/* Tags */}
          <div className='mb-6 flex flex-wrap gap-2'>
            {post.tags.map((tag) => (
              <Badge key={tag} variant='outline' className='text-xs'>
                <Tag className='mr-1 h-3 w-3' />
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <Separator className='mb-8' />

        {/* Article Content */}
        <div className='prose prose-lg prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded max-w-none'>
          {processMarkdown(post.content)}
        </div>

        <Separator className='my-12' />

        {/* Author Bio */}
        <div className='mb-12'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-start gap-4'>
                <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full'>
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <div className='mb-2 flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    <h3 className='font-semibold'>{post.author.name}</h3>
                  </div>
                  <p className='text-muted-foreground'>{post.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>
    </main>
  );
}