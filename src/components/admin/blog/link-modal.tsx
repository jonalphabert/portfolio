'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text: string) => void;
}

export function LinkModal({ isOpen, onClose, onInsert }: LinkModalProps) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);

  const validateUrl = (urlString: string) => {
    if (!urlString) {
      setIsValidUrl(null);
      return;
    }

    try {
      const urlObj = new URL(urlString);
      const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      setIsValidUrl(isValid);
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    validateUrl(value);
    
    // Auto-fill text if empty
    if (!text || text === url) {
      setText(value);
    }
  };

  const handleInsert = () => {
    if (url && text && isValidUrl) {
      onInsert(url, text);
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl('');
    setText('');
    setIsValidUrl(null);
    onClose();
  };

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setText('');
      setIsValidUrl(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Insert Link
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            {url && (
              <p className={`text-sm mt-1 ${
                isValidUrl === null 
                  ? 'text-muted-foreground' 
                  : isValidUrl 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {isValidUrl === null 
                  ? 'Enter a valid URL' 
                  : isValidUrl 
                  ? '✓ Valid URL' 
                  : '✗ Invalid URL format'
                }
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="text">Link Text</Label>
            <Input
              id="text"
              placeholder="Link display text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          {url && text && isValidUrl && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Preview:</p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {text}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleInsert} 
              disabled={!url || !text || !isValidUrl}
            >
              Insert Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}