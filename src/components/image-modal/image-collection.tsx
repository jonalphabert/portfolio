'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useImageModal } from '@/store/image-modal';
import { useBlogEditor } from '@/store/blog-editor';
import { SearchInput } from './SearchInput';
import { ImageGrid } from './ImageGrid';

interface ImageData {
  image_id: string;
  image_name: string;
  image_path: string;
  image_alt: string;
  image_size: number;
  image_type: string;
  created_at: string;
}

export function ImageCollection() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { closeModal } = useImageModal();
  const { updateContent, blogPost } = useBlogEditor();

  const IMAGES_PER_PAGE = 12;

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: IMAGES_PER_PAGE.toString(),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/image?${params}`);
      const data = await response.json();
      
      setImages(data.images || []);
      setHasMore(data.images?.length === IMAGES_PER_PAGE);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedImage(null);
  }, []);

  const handleImageSelect = useCallback((image: ImageData) => {
    setSelectedImage(image);
    setAltText(image.image_alt);
  }, []);

  const handleInsert = () => {
    if (selectedImage) {
      const markdown = `![${altText}](${selectedImage.image_path})`;
      
      // Insert markdown into editor
      const newContent = blogPost.content + '\n\n' + markdown;
      updateContent(newContent);
      
      // Close modal
      closeModal();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='space-y-4'>
      <SearchInput onSearch={handleSearch} />

      <ImageGrid
        images={images}
        loading={loading}
        selectedImage={selectedImage}
        currentPage={currentPage}
        hasMore={hasMore}
        searchTerm={searchTerm}
        onImageSelect={handleImageSelect}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />

      <div className='space-y-2'>
        <Input
          placeholder='Alt text'
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
        <Button onClick={handleInsert} disabled={!selectedImage} className='w-full'>
          Insert Image
        </Button>
      </div>
    </div>
  );
}