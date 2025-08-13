import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') as 'draft' | 'published' | 'archived' || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'latest',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    };

    const { posts, total } = await PostService.getPosts(filters);
    
    return NextResponse.json({
      posts,
      total,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    });
  } catch (error: unknown) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, content, tags, user_id, thumbnail_image_id, blog_description } = await request.json();

    if (!title || !slug || !content || !user_id) {
      return NextResponse.json(
        { error: 'Title, slug, content, and user_id are required' },
        { status: 400 }
      );
    }

    const post = await PostService.createPost({
      title,
      slug,
      content,
      tags,
      user_id,
      thumbnail_image_id,
      blog_description
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}