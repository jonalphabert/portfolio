'use client';

import { useEffect } from 'react';
import { BlogEditor } from '@/components/admin/blog/blog-editor';
import { useBlogEditor } from '@/store/blog-editor';
import { useParams } from 'next/navigation';

export default function BlogEditorSlugPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;
  const { isLoading, loadBlogBySlug } = useBlogEditor();

  useEffect(() => {
    if (slug) {
      loadBlogBySlug(slug);
    }
  }, [slug, loadBlogBySlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  return <BlogEditor mode="edit" slug={slug} />;
}