'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { ProjectPreviewBanner } from '@/components/admin/project/project-preview-banner';
import { ProjectPreviewContent } from '@/components/admin/project/project-preview-content';
import { useProjectEditor } from '@/store/project-editor';

export default function ProjectPreviewSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { project, publishProject, loadProjectBySlug, isLoading } = useProjectEditor();
  const resolvedParams = React.use(params);

  // Load project data if slug exists and no data in store
  React.useEffect(() => {
    if (resolvedParams.slug && (!project.title || project.slug !== resolvedParams.slug)) {
      loadProjectBySlug(resolvedParams.slug);
    }
  }, [resolvedParams.slug, project.slug, project.title, loadProjectBySlug]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  // If no project data in store, show not found
  if (!project.title && !project.content) {
    notFound();
  }

  // Transform store data to preview format
  const previewProject = {
    slug: project.slug || resolvedParams.slug,
    title: project.title,
    description: project.description,
    content: project.content,
    techStacks: project.techStacks ? project.techStacks.split(',').map(tech => tech.trim()) : [],
    projectUrl: project.projectUrl,
    githubUrl: project.githubUrl,
    featuredImage: project.thumbnail 
      ? URL.createObjectURL(project.thumbnail)
      : project.thumbnailUrl
      || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    author: {
      name: 'Admin User',
      avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    },
    publishedDate: new Date().toISOString().split('T')[0],
  };

  return (
    <div className='bg-background min-h-screen'>
      <ProjectPreviewBanner isPublished={project.isPublished} onPublish={publishProject} />
      <ProjectPreviewContent project={previewProject} />
    </div>
  );
}