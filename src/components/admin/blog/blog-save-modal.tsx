'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Save } from 'lucide-react';
import { useBlogEditor } from '@/store/blog-editor';
import { CategoryCombobox } from '@/components/admin/blog/CategoryCombobox';

export function BlogSaveModal() {
  const { 
    blogPost, 
    isSaveModalOpen, 
    slugAvailable, 
    isLoading,
    updateBlogData, 
    generateSlug, 
    checkSlugAvailability, 
    closeSaveModal, 
    saveDraft 
  } = useBlogEditor();
  
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  const router = useRouter();

  // Load existing thumbnail when modal opens
  useEffect(() => {
    if (isSaveModalOpen && blogPost.slug) {
      // Fetch blog data to get thumbnail URL
      fetch(`/api/post/${blogPost.slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.thumbnail) {
            setExistingThumbnailUrl(data.thumbnail.image_path);
          }
        })
        .catch(console.error);
    }
  }, [isSaveModalOpen, blogPost.slug]);

  const handleSave = async () => {
    const success = await saveDraft();
    if (success) {
      router.push('/admin/blog');
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (isEditMode) {
      // Edit mode: don't change slug
      updateBlogData({ title: newTitle });
    } else {
      // New post: auto-generate slug
      const newSlug = generateSlug(newTitle);
      updateBlogData({ title: newTitle, slug: newSlug });
      checkSlugAvailability(newSlug);
    }
  };

  const handleSlugChange = (newSlug: string) => {
    const cleanSlug = generateSlug(newSlug);
    updateBlogData({ slug: cleanSlug });
    checkSlugAvailability(cleanSlug);
  };

  const isEditMode = blogPost.isDraft || blogPost.isPublished;

  const handleThumbnailChange = (file: File) => {
    updateBlogData({ thumbnail: file });
    setThumbnailPreview(URL.createObjectURL(file));
  };

  return (
    <Dialog open={isSaveModalOpen} onOpenChange={closeSaveModal}>
      <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Save Blog Post</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <Label className="mb-2" htmlFor='title'>Blog Title</Label>
              <Input
                id='title'
                placeholder='Enter blog title...'
                value={blogPost.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className='text-lg font-medium'
              />
            </div>
            
            <div>
              <Label className="mb-2" htmlFor='slug'>Blog Slug</Label>
              <Input
                id='slug'
                placeholder='blog-url-slug'
                value={blogPost.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                readOnly={isEditMode}
                className={isEditMode ? 'bg-muted cursor-not-allowed' : ''}
              />
              {blogPost.slug && !isEditMode && (
                <p className={`text-sm mt-1 ${
                  slugAvailable === null 
                    ? 'text-muted-foreground' 
                    : slugAvailable 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {slugAvailable === null
                    ? 'Checking availability...' 
                    : slugAvailable || isEditMode
                    ? '✓ Slug is available' 
                    : '✗ Slug is already taken'
                  }
                </p>
              )}
            </div>
          </div>
          <div className='space-y-4'>
            <CategoryCombobox
              value={blogPost.category ? blogPost.category.split(',').map(c => c.trim()).filter(Boolean) : []}
              onValueChange={(value) => updateBlogData({ category: value.join(',') })}
              placeholder="Select or create categories..."
            />
            
            <div>
              <Label className="mb-2" htmlFor='tags'>Tags</Label>
              <Input
                id='tags'
                placeholder='comma separated tags'
                value={blogPost.tags}
                onChange={(e) => updateBlogData({ tags: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2" htmlFor='excerpt'>Excerpt</Label>
            <Textarea
              id='excerpt'
              placeholder='Brief description of your blog post...'
              value={blogPost.excerpt}
              onChange={(e) => updateBlogData({ excerpt: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label className="mb-2">Featured Image/Thumbnail</Label>
            <div className='flex items-start gap-4'>
              <div className='flex-1'>
                <label className='border-border hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed'>
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <Upload className='text-muted-foreground mb-2 h-6 w-6' />
                    <p className='text-muted-foreground text-sm'>
                      <span className='font-semibold'>Click to upload</span> thumbnail
                    </p>
                    <p className='text-muted-foreground text-xs'>PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleThumbnailChange(file);
                    }}
                  />
                </label>
                {blogPost.thumbnail ? (
                  <p className='text-muted-foreground mt-2 text-sm'>Selected: {blogPost.thumbnail.name}</p>
                ) : existingThumbnailUrl ? (
                  <p className='text-muted-foreground mt-2 text-sm'>Current thumbnail (click to change)</p>
                ) : null}
              </div>

              {(thumbnailPreview || existingThumbnailUrl) && (
                <div className='h-32 w-32 overflow-hidden rounded-lg border'>
                  <Image
                    src={thumbnailPreview || existingThumbnailUrl || ''}
                    alt='Thumbnail preview'
                    width={128}
                    height={128}
                    className='h-full w-full object-cover'
                  />
                </div>
              )}
            </div>
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button variant='outline' onClick={closeSaveModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!blogPost.title || !blogPost.slug || slugAvailable === false || isLoading}
            >
              <Save className='mr-2 h-4 w-4' />
              {isLoading ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
