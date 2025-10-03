'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react';
import { processMarkdown } from '@/lib/markdown';
import { PublicBlogPost, RelatedPost } from '@/types';
import SubscribeSection from '../subscribe/subscribe-section';

interface BlogPostContentProps {
  post: PublicBlogPost;
  relatedPosts: RelatedPost[];
}

export function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='bg-background min-h-screen'>
      <main className='pt-20'>
        {/* Back to Blog Link */}
        <div className='container mx-auto max-w-4xl px-6 py-8'>
          <Link
            href='/blog'
            className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Blog
          </Link>
        </div>

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
              <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {formatDate(post.publishedDate)}
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  {post.readTime} min read
                </div>
              </div>
            </div>

            <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>{post.title}</h1>

            <div className='flex flex-wrap gap-1 mb-2'>
              {post.category.split(',').map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>

            <p className='text-muted-foreground mb-6 text-xl'>{post.excerpt}</p>


            {/* Share Buttons */}
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>Share:</span>
              <Button variant='outline' size='sm'>
                <Share2 className='mr-1 h-4 w-4' />
                Share
              </Button>
            </div>
          </header>

          <Separator className='mb-8' />

          {/* Article Content */}
          <div className='prose prose-lg prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded max-w-none'>
            {processMarkdown(post.content)}
          </div>

          {/* Tags */}
          <div className='mb-6 flex flex-wrap gap-2 pt-12'>
            <span className='text-sm font-semibold'>Tags:</span>
            {post.tags.map((tag) => (
              <Badge key={tag} variant='outline' className='text-xs'>
                <Tag className='mr-1 h-3 w-3' />
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className='my-8' />

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
                      <h3 className='font-semibold'>{post.author.name}</h3>
                    </div>
                    <p className='text-muted-foreground mb-4'>{post.author.bio}</p>
                    <SubscribeSection />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className='mb-12'>
              <h2 className='mb-6 text-2xl font-bold'>Related Posts</h2>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.slug} className='hover:shadow-lg transition-shadow py-0'>
                    <div className='relative h-48 overflow-hidden rounded-t-lg'>
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <CardContent className='p-4'>
                      <Badge variant='outline' className='mb-2 text-xs'>
                        {relatedPost.category}
                      </Badge>
                      <h3 className='mb-2 font-semibold line-clamp-2'>
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className='hover:text-primary transition-colors'
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className='text-muted-foreground mb-3 text-sm line-clamp-2'>
                        {relatedPost.excerpt}
                      </p>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <Clock className='h-3 w-3' />
                        {relatedPost.readTime} min read
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}