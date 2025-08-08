'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useImageModal, type ImageModalTab } from '@/store/image-modal';
import { ImageCollection } from './image-collection';
import { ImageUpload } from './image-upload';
import { ImageUrl } from './image-url';

export function ImageModal() {
  const { isOpen, activeTab, closeModal, setActiveTab } = useImageModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ImageModalTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collection">Image Collection</TabsTrigger>
            <TabsTrigger value="upload">Upload Picture</TabsTrigger>
            <TabsTrigger value="url">Copy Image URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collection" className="mt-4">
            <ImageCollection />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <ImageUpload />
          </TabsContent>
          
          <TabsContent value="url" className="mt-4">
            <ImageUrl />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}