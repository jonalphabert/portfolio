import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const isAvailable = await PostService.checkSlugAvailability(params.slug);

    return NextResponse.json({
      slug: params.slug,
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