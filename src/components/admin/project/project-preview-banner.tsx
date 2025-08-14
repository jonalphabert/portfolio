'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Eye } from 'lucide-react';
import Link from 'next/link';

interface ProjectPreviewBannerProps {
  isPublished: boolean;
  onPublish: () => Promise<boolean>;
}

export function ProjectPreviewBanner({ isPublished, onPublish }: ProjectPreviewBannerProps) {
  const handlePublish = async () => {
    await onPublish();
  };

  return (
    <div className="border-b bg-muted/30">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/project">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Preview Mode</span>
            <Badge variant={isPublished ? 'default' : 'secondary'}>
              {isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isPublished && (
            <Button onClick={handlePublish} size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Publish Project
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}