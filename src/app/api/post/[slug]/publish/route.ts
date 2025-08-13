import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const publishedPost = await PostService.updatePostStatus(params.slug, 'published');

    if (!publishedPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Post published successfully',
      post: publishedPost
    });
  } catch (error: unknown) {
    console.error('Publish post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}