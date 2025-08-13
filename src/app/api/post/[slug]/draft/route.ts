import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const draftPost = await PostService.updatePostStatus(params.slug, 'draft');

    if (!draftPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Post moved to draft successfully',
      post: draftPost
    });
  } catch (error: unknown) {
    console.error('Draft post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}