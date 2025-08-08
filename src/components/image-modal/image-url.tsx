'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export function ImageUrl() {
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    
    // Simple URL validation for images
    const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isValid = value.startsWith('http') && imageUrlPattern.test(value);
    setIsValidUrl(isValid);
  };

  const handleInsert = () => {
    if (url && altText) {
      const markdown = `![${altText}](${url})`;
      console.log('Insert markdown:', markdown);
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
              onError={() => setIsValidUrl(false)}
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
        disabled={!url || !altText || !isValidUrl}
        className="w-full"
      >
        Insert Image
      </Button>
    </div>
  );
}