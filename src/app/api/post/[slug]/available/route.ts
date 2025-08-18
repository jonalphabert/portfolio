import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const isAvailable = await PostService.checkSlugAvailability(slug);

    return NextResponse.json({
      slug: slug,
      available: isAvailable
    });
  } catch (error: unknown) {
    console.error('Check slug availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}