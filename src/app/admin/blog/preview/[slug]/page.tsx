'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { BlogPreviewBanner } from '@/components/admin/blog/blog-preview-banner';
import { BlogPreviewContent } from '@/components/admin/blog/blog-preview-content';
import { useBlogEditor } from '@/store/blog-editor';

export default function BlogPreviewPage({ params }: { params: { slug: string } }) {
  const { blogPost, publishPost, loadBlogBySlug, isLoading } = useBlogEditor();

  // Load blog data if slug exists and no data in store
  React.useEffect(() => {
    if (params.slug && (!blogPost.title || blogPost.slug !== params.slug)) {
      loadBlogBySlug(params.slug);
    }
  }, [params.slug, blogPost.slug, blogPost.title, loadBlogBySlug]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  // If no blog data in store, show not found
  if (!blogPost.title && !blogPost.content) {
    notFound();
  }

  // Transform store data to preview format
  const previewPost = {
    slug: blogPost.slug || params.slug,
    title: blogPost.title,
    content: blogPost.content,
    excerpt: blogPost.excerpt,
    publishedDate: new Date().toISOString().split('T')[0],
    readTime: Math.ceil(blogPost.content.split(' ').length / 200) || 5,
    category: blogPost.category,
    author: {
      name: 'Admin User',
      avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      bio: 'Blog administrator and content creator.',
    },
    featuredImage: blogPost.thumbnail 
      ? URL.createObjectURL(blogPost.thumbnail)
      : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    tags: blogPost.tags ? blogPost.tags.split(',').map(tag => tag.trim()) : [],
  };

  return (
    <div className='bg-background min-h-screen'>
      <BlogPreviewBanner isPublished={blogPost.isPublished} onPublish={publishPost} />
      <BlogPreviewContent post={previewPost} />
    </div>
  );
}
