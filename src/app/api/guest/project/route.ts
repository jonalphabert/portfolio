import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      status: 'published' as const,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      limit: parseInt(searchParams.get('limit') || '10'),
      page: 1,
      sort: 'latest'
    };

    const { projects } = await ProjectService.getProjects(filters);
    
    // Transform for guest API - only return necessary fields
    const guestProjects = projects.map(project => ({
      id: project.project_slug,
      slug: project.project_slug,
      title: project.project_title,
      description: project.project_description,
      href: project.project_url || '#',
      githubUrl: project.project_github,
      image: project.thumbnail?.image_path || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      technologies: project.project_tech_stacks || []
    }));
    
    return NextResponse.json({
      projects: guestProjects,
      total: guestProjects.length
    });
  } catch (error: unknown) {
    console.error('Get guest projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}