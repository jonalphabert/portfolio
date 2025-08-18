import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const publishedPost = await PostService.updatePostStatus(slug, 'published');

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