import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const project = await ProjectService.getProjectBySlug(resolvedParams.slug);
    
    if (!project || project.project_status !== 'published') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Transform for guest API
    const guestProject = {
      slug: project.project_slug,
      title: project.project_title,
      description: project.project_description,
      content: project.project_content,
      technologies: project.project_tech_stacks || [],
      projectUrl: project.project_url,
      githubUrl: project.project_github,
      image: project.thumbnail?.image_path || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
      publishedDate: project.published_at || project.created_at,
      author: {
        name: project.author.username,
      },
      isFeatured: project.is_featured
    };
    
    return NextResponse.json(guestProject);
  } catch (error: unknown) {
    console.error('Get guest project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}