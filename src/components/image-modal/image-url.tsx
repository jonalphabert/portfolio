'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useImageModal } from '@/store/image-modal';
import { useBlogEditor } from '@/store/blog-editor';
import Image from 'next/image';

export function ImageUrl() {
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { closeModal } = useImageModal();
  const { updateContent, blogPost } = useBlogEditor();

  const handleUrlChange = (value: string) => {
    setUrl(value);
    
    // Simple URL validation for images
    const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isValid = value.startsWith('http') && imageUrlPattern.test(value);
    setIsValidUrl(isValid);
  };

  const handleInsert = async () => {
    if (!url || !altText || !fileName) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('type', 'url');
      formData.append('url', url);
      formData.append('fileName', fileName);
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
        setUrl('');
        setAltText('');
        setFileName('');
        setIsValidUrl(false);
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-url">Image URL</Label>
        <Input
          id="image-url"
          placeholder="https://example.com/image.jpg"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      </div>

      {url && isValidUrl && (
        <div className="space-y-2">
          <Label>Image Preview</Label>
          <div className="border rounded-lg p-4 bg-muted/20">
            <Image
              src={url}
              alt="Preview"
              width={300}
              height={200}
              className="max-w-full h-auto rounded"
            />
          </div>
        </div>
      )}

      {url && !isValidUrl && (
        <p className="text-sm text-destructive">
          Please enter a valid image URL (jpg, jpeg, png, gif, webp, svg)
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="file-name">File Name</Label>
        <Input
          id="file-name"
          placeholder="Enter file name for database"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alt-text-url">Alt Text</Label>
        <Input
          id="alt-text-url"
          placeholder="Enter alt text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
      </div>

      <Button 
        onClick={handleInsert} 
        disabled={!url || !altText || !fileName || !isValidUrl || uploading}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Upload & Insert'}
      </Button>
    </div>
  );
}