import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const available = await ProjectService.checkSlugAvailability(resolvedParams.slug);

    return NextResponse.json({ available });
  } catch (error: unknown) {
    console.error('Check project slug availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}