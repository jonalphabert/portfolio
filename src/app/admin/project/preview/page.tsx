'use client';

import { notFound } from 'next/navigation';
import { ProjectPreviewBanner } from '@/components/admin/project/project-preview-banner';
import { ProjectPreviewContent } from '@/components/admin/project/project-preview-content';
import { useProjectEditor } from '@/store/project-editor';

export default function ProjectPreviewPage() {
  const { project, publishProject } = useProjectEditor();

  // If no project data in store, show not found
  if (!project.title && !project.content) {
    notFound();
  }

  // Transform store data to preview format
  const previewProject = {
    slug: project.slug || 'new-project',
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
      <ProjectPreviewBanner 
        isPublished={project.isPublished} 
        onPublish={publishProject} 
      />
      <ProjectPreviewContent project={previewProject} />
    </div>
  );
}