'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useImageModal } from '@/store/image-modal';
import { useBlogEditor } from '@/store/blog-editor';

export function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [imageName, setImageName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { closeModal } = useImageModal();
  const { updateContent, blogPost } = useBlogEditor();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageName(selectedFile.name.split('.')[0]);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !altText || !imageName) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('type', 'file');
      formData.append('file', file);
      formData.append('alt', altText);

      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const markdown = `![${altText}](${result.image_path})`;
        
        // Insert markdown into editor
        const newContent = blogPost.content + '\n\n' + markdown;
        updateContent(newContent);
        
        // Close modal and reset form
        closeModal();
        setFile(null);
        setAltText('');
        setImageName('');
        setPreviewUrl(null);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='file-upload'>Upload File</Label>
        <div className='flex w-full items-center justify-center'>
          <label
            htmlFor='file-upload'
            className='border-border hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed'
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              <Upload className='text-muted-foreground mb-4 h-8 w-8' />
              <p className='text-muted-foreground mb-2 text-sm'>
                <span className='font-semibold'>Click to upload</span> or drag and drop
              </p>
              <p className='text-muted-foreground text-xs'>PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              id='file-upload'
              type='file'
              className='hidden'
              accept='image/*'
              onChange={handleFileChange}
            />
          </label>
        </div>
        {file && (
          <div className='space-y-2'>
            <p className='text-muted-foreground text-sm'>Selected: {file.name}</p>
            {previewUrl && (
              <div className='rounded-lg border p-2'>
                <Image
                  src={previewUrl}
                  alt='Preview'
                  width={200}
                  height={200}
                  className='h-32 w-full rounded object-cover'
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='image-name'>Image Name</Label>
        <Input
          id='image-name'
          placeholder='Enter image name for database'
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='alt-text'>Alt Text</Label>
        <Input
          id='alt-text'
          placeholder='Enter alt text'
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
      </div>

      <Button onClick={handleUpload} disabled={!file || !altText || !imageName || uploading} className='w-full'>
        {uploading ? 'Uploading...' : 'Upload & Insert'}
      </Button>
    </div>
  );
}
