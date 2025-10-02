import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      status: searchParams.get('status') as 'draft' | 'published' | 'archived' || undefined,
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'latest',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined
    };

    const { projects, total } = await ProjectService.getProjects(filters);
    
    return NextResponse.json({
      projects,
      total,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    });
  } catch (error: unknown) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, description, content, tech_stacks, user_id, project_url, project_github, project_thumbnail } = await request.json();
    
    // Validate description length
    if (description && description.length > 255) {
      return NextResponse.json(
        { error: 'Project description must be 255 characters or less' },
        { status: 400 }
      );
    }

    if (!title || !slug || !description || !content || !user_id) {
      return NextResponse.json(
        { error: 'Title, slug, description, content, and user_id are required' },
        { status: 400 }
      );
    }

    const project = await ProjectService.createProject({
      title,
      slug,
      description,
      content,
      tech_stacks: tech_stacks || [],
      user_id,
      project_url,
      project_github,
      project_thumbnail
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}