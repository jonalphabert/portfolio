import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const post = await PostService.getPostBySlug(resolvedParams.slug);
    
    if (!post || post.blog_status !== 'published') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Transform for guest API
    const guestPost = {
      slug: post.blog_slug,
      title: post.blog_title,
      description: post.blog_description,
      content: post.blog_content,
      tags: post.blog_tags || [],
      publishedDate: post.published_at || post.created_at,
      author: {
        name: post.author.username,
      },
      thumbnail: post.thumbnail ? {
        url: post.thumbnail.image_path,
        alt: post.thumbnail.image_alt
      } : null,
      views: post.blog_views || 0
    };
    
    return NextResponse.json(guestPost);
  } catch (error: unknown) {
    console.error('Get guest blog post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}