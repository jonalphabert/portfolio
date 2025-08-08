'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { processMarkdown } from '@/lib/markdown';
import { ImageModal } from '@/components/image-modal/image-modal';
import { useImageModal } from '@/store/image-modal';
import {
  Bold,
  Italic,
  Code,
  Link,
  Image,
  List,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Eye,
  FileCode,
} from 'lucide-react';

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(
    '# Welcome to the Blog Editor\n\nStart writing your **markdown** content here!\n\n## Features\n\n- Bold text with **double asterisks**\n- Italic text with *single asterisks*\n- `Inline code` with backticks\n- [Links](https://example.com)\n- ![Images](https://via.placeholder.com/300x200)\n\n```javascript\n// Code blocks\nconst hello = "world";\nconsole.log(hello);\n```'
  );
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const { openModal } = useImageModal();

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
    const selectedText = content.substring(start, end);
    const replacement = selectedText || placeholder;

    let newText = '';
    let cursorOffset = 0;

    if (type === 'wrap') {
      // For bold, italic, code - wrap the text
      newText = syntax + replacement + (endSyntax || syntax);
      cursorOffset = syntax.length + replacement.length;
    } else if (type === 'prefix') {
      // For headings, lists - add at start of line
      newText = syntax + replacement;
      cursorOffset = newText.length;
    } else if (type === 'block') {
      // For code blocks, links, images - special handling
      if (syntax.includes('$1')) {
        newText = syntax.replace('$1', replacement);
        cursorOffset = newText.length;
      } else {
        newText = syntax + replacement + endSyntax;
        cursorOffset = syntax.length + replacement.length;
      }
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // Focus back to textarea
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
      icon: Link,
      label: 'Link',
      action: () => insertMarkdown('block', '[', 'link text', '](url)'),
    },
    {
      icon: Image,
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

  return (
    <div className='flex h-screen flex-col'>
      {/* Header */}
      <div className='bg-background border-b p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Blog Editor</h1>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' className='cursor-pointer'>
              <Eye className='mr-2 h-4 w-4' />
              Preview
            </Button>
            <Button size='sm' className='cursor-pointer'>
              <Save className='mr-2 h-4 w-4' />
              Save Draft
            </Button>
          </div>
        </div>
      </div>

      {/* Meta Fields */}
      <div className='bg-muted/30 space-y-4 border-b p-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Input
            placeholder='Blog post title...'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='text-lg font-medium'
          />
          <Input
            placeholder='Category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <Input
          placeholder='Tags (comma separated)'
          value={tags}
          onChange={(e) => setTags(e.target.value)}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='h-full w-full resize-none border-none p-4 font-mono text-sm leading-relaxed outline-none'
            placeholder='Write your markdown content here...'
          />
        </div>

        {/* Preview Pane */}
        <div className='w-1/2 overflow-auto'>
          <div className='p-4'>
            {title && (
              <div className='mb-6'>
                <h1 className='mb-2 text-3xl font-bold'>{title}</h1>
                {category && (
                  <Badge variant='secondary' className='mb-2'>
                    {category}
                  </Badge>
                )}
                {tags && (
                  <div className='flex flex-wrap gap-1'>
                    {tags.split(',').map((tag, index) => (
                      <Badge key={index} variant='outline' className='text-xs'>
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className='prose prose-lg max-w-none'>{processMarkdown(content)}</div>
          </div>
        </div>
      </div>
      <ImageModal />
    </div>
  );
}
