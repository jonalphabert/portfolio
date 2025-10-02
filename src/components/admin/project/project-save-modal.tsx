'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useProjectEditor } from '@/store/project-editor';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function ProjectSaveModal() {
  const router = useRouter();
  const {
    project,
    isSaveModalOpen,
    slugAvailable,
    isLoading,
    updateProjectData,
    closeSaveModal,
    saveDraft,
    publishProject,
  } = useProjectEditor();

  const isEditMode = project.isDraft || project.isPublished;

  const handleSaveDraft = async () => {
    const success = await saveDraft();
    if (success) {
      closeSaveModal();
      router.push('/admin/project');
    }
  };

  const handlePublish = async () => {
    const success = await publishProject();
    if (success) {
      closeSaveModal();
      router.push('/admin/project');
    }
  };

  const canSave = project.title && project.description && project.content && 
    (!isEditMode ? slugAvailable !== false : true);

  return (
    <Dialog open={isSaveModalOpen} onOpenChange={closeSaveModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Update Project' : 'Save Project'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update your project details and save changes.'
              : 'Fill in the project details to save your work.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={project.title}
              onChange={(e) => updateProjectData({ title: e.target.value })}
              placeholder="Enter project title"
            />
          </div>

          {/* Slug (only for new projects) */}
          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  value={project.slug}
                  readOnly
                  className="bg-muted"
                />
                {slugAvailable === true && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {slugAvailable === false && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              {slugAvailable === false && (
                <p className="text-sm text-red-500">
                  This slug is already taken. Please change the title.
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={project.description}
              onChange={(e) => updateProjectData({ description: e.target.value })}
              placeholder="Brief description of your project"
              rows={3}
            />
            <small className={project.description.length > 255 ? 'text-red-500' : 'text-gray-500'}>Character count : {project.description.length}/255</small>
          </div>

          {/* Tech Stacks Preview */}
          {project.techStacks && (
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <div className="flex flex-wrap gap-1">
                {project.techStacks.split(',').map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-url">Live URL</Label>
              <Input
                id="project-url"
                value={project.projectUrl}
                onChange={(e) => updateProjectData({ projectUrl: e.target.value })}
                placeholder="https://your-project.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub URL</Label>
              <Input
                id="github-url"
                value={project.githubUrl}
                onChange={(e) => updateProjectData({ githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Thumbnail Preview */}
          {(project.thumbnail || project.thumbnailUrl) && (
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="relative aspect-video w-32 overflow-hidden rounded-md border">
                <Image
                  src={
                    project.thumbnail
                      ? URL.createObjectURL(project.thumbnail)
                      : project.thumbnailUrl || ''
                  }
                  alt="Thumbnail preview"
                  fill
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={closeSaveModal} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveDraft}
            disabled={!canSave || isLoading}
            variant="secondary"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save as Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!canSave || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Update & Publish' : 'Save & Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}