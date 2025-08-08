'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Image from 'next/image';

// Mock data - replace with actual API call
const mockImages = [
  {
    id: 1,
    url: 'https://via.placeholder.com/300x200',
    name: 'Sample Image 1',
    altText: 'Sample description 1',
  },
  {
    id: 2,
    url: 'https://via.placeholder.com/300x200',
    name: 'Sample Image 2',
    altText: 'Sample description 2',
  },
  {
    id: 3,
    url: 'https://via.placeholder.com/300x200',
    name: 'Sample Image 3',
    altText: 'Sample description 3',
  },
];

export function ImageCollection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedImage, setSelectedImage] = useState<(typeof mockImages)[0] | null>(null);

  const filteredImages = mockImages.filter(
    (img) =>
      img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.altText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageSelect = (image: (typeof mockImages)[0]) => {
    setSelectedImage(image);
    setAltText(image.altText);
  };

  const handleInsert = () => {
    if (selectedImage) {
      const markdown = `![${altText}](${selectedImage.url})`;
      // Insert markdown logic here
      console.log('Insert markdown:', markdown);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
        <Input
          placeholder='Search images...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>

      <div className='grid max-h-60 grid-cols-3 gap-4 overflow-y-auto'>
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className={`cursor-pointer rounded-lg border-2 p-2 transition-colors ${
              selectedImage?.id === image.id ? 'border-primary' : 'border-border'
            }`}
            onClick={() => handleImageSelect(image)}
          >
            <Image
              src={image.url}
              alt={image.name}
              width={150}
              height={100}
              className='h-20 w-full rounded object-cover'
            />
            <p className='mt-1 truncate text-xs'>{image.name}</p>
          </div>
        ))}
      </div>

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
