import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const project = await ProjectService.updateProjectStatus(resolvedParams.slug, 'published');

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error: unknown) {
    console.error('Publish project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}