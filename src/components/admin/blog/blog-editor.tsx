'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { processMarkdown } from '@/lib/markdown';
import { ImageModal } from '@/components/image-modal/image-modal';
import { useImageModal } from '@/store/image-modal';
import { BlogSaveModal } from '@/components/admin/blog/blog-save-modal';
import { LinkModal } from '@/components/admin/blog/link-modal';
import { useBlogEditor } from '@/store/blog-editor';
import {
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Eye,
  FileCode,
} from 'lucide-react';

interface BlogEditorProps {
  mode: 'new' | 'edit';
  slug?: string;
}

export function BlogEditor({ mode, slug }: BlogEditorProps) {
  const { blogPost, updateTitle, updateContent, openSaveModal } = useBlogEditor();
  const { openModal } = useImageModal();
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);


  const insertMarkdown = (
    type: 'wrap' | 'prefix' | 'block',
    syntax: string,
    placeholder = '',
    endSyntax = ''
  ) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = blogPost.content.substring(start, end);
    const replacement = selectedText || placeholder;

    let newText = '';
    let cursorOffset = 0;

    if (type === 'wrap') {
      newText = syntax + replacement + (endSyntax || syntax);
      cursorOffset = syntax.length + replacement.length;
    } else if (type === 'prefix') {
      newText = syntax + replacement;
      cursorOffset = newText.length;
    } else if (type === 'block') {
      if (syntax.includes('$1')) {
        newText = syntax.replace('$1', replacement);
        cursorOffset = newText.length;
      } else {
        newText = syntax + replacement + endSyntax;
        cursorOffset = syntax.length + replacement.length;
      }
    }

    const newContent =
      blogPost.content.substring(0, start) + newText + blogPost.content.substring(end);
    updateContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    { icon: Heading1, label: 'H1', action: () => insertMarkdown('prefix', '# ', 'Heading 1') },
    { icon: Heading2, label: 'H2', action: () => insertMarkdown('prefix', '## ', 'Heading 2') },
    { icon: Heading3, label: 'H3', action: () => insertMarkdown('prefix', '### ', 'Heading 3') },
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('wrap', '**', 'bold text') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('wrap', '*', 'italic text') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('wrap', '`', 'code') },
    {
      icon: LinkIcon,
      label: 'Link',
      action: () => setIsLinkModalOpen(true),
    },
    {
      icon: ImageIcon,
      label: 'Image',
      action: () => openModal(),
    },
    { icon: List, label: 'List', action: () => insertMarkdown('prefix', '- ', 'list item') },
    {
      icon: FileCode,
      label: 'Code Block',
      action: () => insertMarkdown('block', '```\n', 'code here', '\n```'),
    },
  ];

  const previewUrl = mode === 'new' ? '/admin/blog/preview' : `/admin/blog/preview/${slug}`;

  return (
    <div className='flex h-screen flex-col'>
      {/* Header */}
      <div className='bg-background border-b p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>
            {mode === 'new' ? 'Blog Editor' : 'Edit Blog Post'}
          </h1>
          <div className='flex gap-2'>
            <Link href={previewUrl}>
              <Button variant='outline' size='sm' className='cursor-pointer'>
                <Eye className='mr-2 h-4 w-4' />
                Preview
              </Button>
            </Link>
            <Button size='sm' className='cursor-pointer' onClick={openSaveModal}>
              <Save className='mr-2 h-4 w-4' />
              {mode === 'new' ? 'Save Draft' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Meta Fields */}
      <div className='bg-muted/30 space-y-4 border-b p-4'>
        <Input
          placeholder='Blog post title...'
          value={blogPost.title}
          onChange={(e) => updateTitle(e.target.value)}
          className='text-lg font-medium'
        />
      </div>

      {/* Toolbar */}
      <div className='bg-background sticky top-0 z-10 border-b p-2'>
        <div className='flex flex-wrap gap-1'>
          {formatButtons.map((button) => {
            const Icon = button.icon;
            return (
              <Button
                key={button.label}
                variant='ghost'
                size='sm'
                onClick={button.action}
                className='h-8 w-8 cursor-pointer p-0'
                title={button.label}
              >
                <Icon className='h-4 w-4' />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className='flex flex-1'>
        {/* Editor Pane */}
        <div className='w-1/2 border-r'>
          <textarea
            value={blogPost.content}
            onChange={(e) => updateContent(e.target.value)}
            className='h-full w-full resize-none border-none p-4 font-mono text-sm leading-relaxed outline-none'
            placeholder='Write your markdown content here...'
          />
        </div>

        {/* Preview Pane */}
        <div className='w-1/2 overflow-auto'>
          <div className='p-4'>
            {blogPost.title && (
              <div className='mb-6'>
                <h1 className='mb-2 text-3xl font-bold'>{blogPost.title}</h1>
                {blogPost.categoryData.length > 0 && (
                  <div className='mb-2 flex flex-wrap gap-1'>
                    {blogPost.categoryData.map((category) => (
                      <Badge key={category.category_id} variant='secondary'>
                        {category.category_name}
                      </Badge>
                    ))}
                  </div>
                )}
                {blogPost.tags && (
                  <div className='flex flex-wrap gap-1'>
                    {blogPost.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant='outline' className='text-xs'>
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className='prose prose-lg max-w-none'>{processMarkdown(blogPost.content)}</div>
          </div>
        </div>
      </div>
      <ImageModal />
      <BlogSaveModal />
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={(url, text) => {
          const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
          if (!textarea) return;

          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selectedText = blogPost.content.substring(start, end);

          const linkMarkdown = `[${text}](${url})`;
          const newContent =
            blogPost.content.substring(0, start) + linkMarkdown + blogPost.content.substring(end);
          updateContent(newContent);

          setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + linkMarkdown.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        }}
      />
    </div>
  );
}
