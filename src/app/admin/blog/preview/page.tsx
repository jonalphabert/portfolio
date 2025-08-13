'use client';

import { notFound } from 'next/navigation';
import { BlogPreviewBanner } from '@/components/admin/blog/blog-preview-banner';
import { BlogPreviewContent } from '@/components/admin/blog/blog-preview-content';
import { useBlogEditor } from '@/store/blog-editor';

export default function BlogPreviewPage() {
  const { blogPost, publishPost } = useBlogEditor();

  // If no blog data in store, show not found
  if (!blogPost.title && !blogPost.content) {
    notFound();
  }

  // Transform store data to preview format
  const previewPost = {
    slug: blogPost.slug || 'new-blog-post',
    title: blogPost.title,
    content: blogPost.content,
    excerpt: blogPost.excerpt,
    publishedDate: new Date().toISOString().split('T')[0],
    readTime: Math.ceil(blogPost.content.split(' ').length / 200) || 5,
    category: blogPost.categoryData.length > 0 
      ? blogPost.categoryData.map(cat => cat.category_name).join(', ')
      : blogPost.category,
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
      <BlogPreviewBanner 
        isPublished={blogPost.isPublished} 
        onPublish={publishPost} 
      />
      <BlogPreviewContent post={previewPost} />
    </div>
  );
}