'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, Eye, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useProjectEditor } from '@/store/project-editor';
import { ProjectSaveModal } from './project-save-modal';
import { MarkdownEditor } from '@/components/ui/markdown-editor';

interface ProjectEditorProps {
  params?: Promise<{ slug: string }>;
}

export function ProjectEditor({ params }: ProjectEditorProps) {
  const {
    project,
    isSaveModalOpen,
    slugAvailable,
    isLoading,
    updateTitle,
    updateContent,
    updateProjectData,
    openSaveModal,
    loadProjectBySlug,
    loadDraft,
    resetEditor,
  } = useProjectEditor();

  const [resolvedParams, setResolvedParams] = React.useState<{ slug: string } | null>(null);

  React.useEffect(() => {
    if (params) {
      params.then(setResolvedParams);
    }
  }, [params]);

  React.useEffect(() => {
    if (resolvedParams?.slug) {
      // Edit mode: load existing project
      loadProjectBySlug(resolvedParams.slug);
    } else {
      // New project mode: load draft from session storage
      loadDraft();
    }

    // Cleanup on unmount
    return () => {
      if (!resolvedParams?.slug) {
        resetEditor();
      }
    };
  }, [resolvedParams, loadProjectBySlug, loadDraft, resetEditor]);

  const isEditMode = resolvedParams?.slug ? true : false;
  const previewUrl = isEditMode && resolvedParams
    ? `/admin/project/preview/${resolvedParams.slug}`
    : '/admin/project/preview';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/project">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-lg font-semibold">
                {isEditMode ? 'Edit Project' : 'New Project'}
              </h1>
              {project.title && (
                <p className="text-sm text-muted-foreground">{project.title}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={previewUrl}>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </Link>
            <Button onClick={openSaveModal} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Info & Content */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title..."
                    value={project.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="text-lg"
                  />
                  {!isEditMode && project.slug && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Slug: {project.slug}
                      </span>
                      {slugAvailable === true && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {slugAvailable === false && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your project..."
                    value={project.description}
                    onChange={(e) => updateProjectData({ description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>Project Content</Label>
                  <MarkdownEditor
                    value={project.content}
                    onChange={updateContent}
                    placeholder="Write your project details in markdown..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tech Stacks */}
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="React, TypeScript, Next.js, Tailwind CSS"
                  value={project.techStacks}
                  onChange={(e) => updateProjectData({ techStacks: e.target.value })}
                  rows={3}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Separate technologies with commas
                </p>
                {project.techStacks && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.techStacks.split(',').map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* URLs */}
            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project-url">Live URL</Label>
                  <Input
                    id="project-url"
                    placeholder="https://your-project.com"
                    value={project.projectUrl}
                    onChange={(e) => updateProjectData({ projectUrl: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="github-url">GitHub URL</Label>
                  <Input
                    id="github-url"
                    placeholder="https://github.com/username/repo"
                    value={project.githubUrl}
                    onChange={(e) => updateProjectData({ githubUrl: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        updateProjectData({ thumbnail: file });
                      }
                    }}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {(project.thumbnail || project.thumbnailUrl) && (
                    <div className="relative aspect-video overflow-hidden rounded-md border">
                      <img
                        src={
                          project.thumbnail
                            ? URL.createObjectURL(project.thumbnail)
                            : project.thumbnailUrl || ''
                        }
                        alt="Thumbnail preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            {isEditMode && (
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Published</span>
                      <Badge variant={project.isPublished ? 'default' : 'secondary'}>
                        {project.isPublished ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Featured</span>
                      <Badge variant={project.isFeatured ? 'default' : 'secondary'}>
                        {project.isFeatured ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {isSaveModalOpen && <ProjectSaveModal />}
    </div>
  );
}