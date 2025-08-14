'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, Italic, Code, Link, List, ListOrdered, 
  Quote, Image, Eye, Edit3 
} from 'lucide-react';
import { processMarkdown } from '@/lib/markdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic' },
    { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Inline Code' },
    { icon: Link, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')'), title: 'Image' },
    { icon: List, action: () => insertMarkdown('\n- ', ''), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('\n1. ', ''), title: 'Numbered List' },
    { icon: Quote, action: () => insertMarkdown('\n> ', ''), title: 'Quote' },
  ];

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.title}
              className="h-8 w-8 p-0"
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant={isPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8"
          >
            {isPreview ? (
              <>
                <Edit3 className="mr-1 h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="mr-1 h-4 w-4" />
                Preview
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-auto">
        {isPreview ? (
          <div className="p-4 prose prose-sm max-w-none max-h-[55vh] ">
            {value ? processMarkdown(value) : (
              <p className="text-muted-foreground italic">Nothing to preview...</p>
            )}
          </div>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] max-h-[55vh] font-mono text-sm border-0 resize-none focus-visible:ring-0"
            rows={20}
          />
        )}
      </div>
    </div>
  );
}