import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const project = await ProjectService.getProjectBySlug(resolvedParams.slug);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error: unknown) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { title, description, content, tech_stacks, project_url, project_github, project_thumbnail } = await request.json();
    
    // Validate description length
    if (description && description.length > 255) {
      return NextResponse.json(
        { error: 'Project description must be 255 characters or less' },
        { status: 400 }
      );
    }

    const project = await ProjectService.updateProject(resolvedParams.slug, {
      title,
      description,
      content,
      tech_stacks,
      project_url,
      project_github,
      project_thumbnail
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error: unknown) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}