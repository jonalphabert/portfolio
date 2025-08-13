'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ImageData {
  image_id: string;
  image_name: string;
  image_path: string;
  image_alt: string;
  image_size: number;
  image_type: string;
  created_at: string;
}

interface ImageGridProps {
  images: ImageData[];
  loading: boolean;
  selectedImage: ImageData | null;
  currentPage: number;
  hasMore: boolean;
  searchTerm: string;
  onImageSelect: (image: ImageData) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function ImageGrid({
  images,
  loading,
  selectedImage,
  currentPage,
  hasMore,
  searchTerm,
  onImageSelect,
  onPrevPage,
  onNextPage,
}: ImageGridProps) {
  if (loading && currentPage === 1) {
    return (
      <div className='space-y-4'>
        <div className='grid max-h-60 grid-cols-3 gap-4 overflow-y-auto'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='rounded-lg border p-2'>
              <div className='h-20 w-full bg-muted animate-pulse rounded' />
              <div className='mt-1 h-3 bg-muted animate-pulse rounded' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='grid max-h-60 grid-cols-3 gap-4 overflow-y-auto'>
        {images.length === 0 ? (
          <div className='col-span-3 text-center py-8'>
            <p className='text-muted-foreground text-sm'>
              {searchTerm ? 'No images found matching your search.' : 'No images available.'}
            </p>
          </div>
        ) : (
          images.map((image) => (
            <div
              key={image.image_id}
              className={`cursor-pointer rounded-lg border-2 p-2 transition-colors ${
                selectedImage?.image_id === image.image_id ? 'border-primary' : 'border-border'
              }`}
              onClick={() => onImageSelect(image)}
            >
              <Image
                src={image.image_path}
                alt={image.image_alt}
                width={150}
                height={100}
                className='h-20 w-full rounded object-cover'
              />
              <p className='mt-1 truncate text-xs'>{image.image_name}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <Button
          variant='outline'
          size='sm'
          onClick={onPrevPage}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className='h-4 w-4 mr-1' />
          Previous
        </Button>
        
        <span className='text-sm text-muted-foreground'>
          Page {currentPage}
        </span>
        
        <Button
          variant='outline'
          size='sm'
          onClick={onNextPage}
          disabled={!hasMore || loading}
        >
          Next
          <ChevronRight className='h-4 w-4 ml-1' />
        </Button>
      </div>
    </div>
  );
}