'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Globe } from 'lucide-react';

interface BlogPreviewBannerProps {
  isPublished: boolean;
  onPublish: () => void;
}

export function BlogPreviewBanner({ isPublished, onPublish }: BlogPreviewBannerProps) {
  return (
    <div className='border-b border-yellow-200 bg-yellow-50 px-6 py-4'>
      <div className='container mx-auto flex max-w-4xl items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Eye className='h-5 w-5 text-yellow-600' />
          <div>
            <p className='font-medium text-yellow-800'>Preview Mode</p>
            <p className='text-sm text-yellow-600'>
              Anda sedang melihat preview dari blog post ini
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {!isPublished && <Badge variant={'secondary'}>Draft</Badge>}

          <Button onClick={onPublish} disabled={isPublished} size='sm' className='gap-2'>
            <Globe className='h-4 w-4' />
            {isPublished ? 'Published' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
}
