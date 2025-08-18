import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      status: 'published' as const,
      limit: parseInt(searchParams.get('limit') || '6'),
      page: parseInt(searchParams.get('page') || '1'),
      sort: searchParams.get('sort') || 'latest',
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined
    };

    const { posts, total } = await PostService.getPosts(filters);
    
    // Transform for guest API - only return necessary fields
    const guestPosts = posts.map(post => ({
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
    }));
    
    return NextResponse.json({
      posts: guestPosts,
      total,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    });
  } catch (error: unknown) {
    console.error('Get guest blog posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}