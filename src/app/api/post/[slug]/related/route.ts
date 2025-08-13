import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');

    // Get related posts (published only, excluding current post)
    const relatedPosts = await PostService.getRelatedPosts(slug, limit);

    return NextResponse.json({
      success: true,
      posts: relatedPosts,
      count: relatedPosts.length,
    });
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch related posts' },
      { status: 500 }
    );
  }
}