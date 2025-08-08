import React, { JSX } from 'react';

export function processMarkdown(content: string): JSX.Element[] {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  // let inList = false
  let listItems: JSX.Element[] = [];

  const processInlineFormatting = (text: string) => {
    // Images ![alt](url) - must come before links
    text = text.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />'
    );
    // Links [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-accent hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    // Bold **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code `code`
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
    );
    return text;
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className='mb-4 ml-6 list-disc space-y-1'>
          {listItems}
        </ul>
      );
      listItems = [];
      // inList = false
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={index} className='bg-muted my-4 overflow-x-auto rounded-lg p-4 text-sm'>
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={index} className='mt-8 mb-4 text-4xl font-bold first:mt-0'>
          {line.substring(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index} className='mt-8 mb-4 text-3xl font-bold'>
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={index} className='mt-6 mb-3 text-2xl font-bold'>
          {line.substring(4)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      const content = processInlineFormatting(line.substring(2));
      listItems.push(<li key={index} dangerouslySetInnerHTML={{ __html: content }} />);
      // inList = true
    } else if (line.trim() === '') {
      flushList();
      elements.push(<div key={index} className='h-4' />);
    } else if (line.trim()) {
      flushList();
      const content = processInlineFormatting(line);
      elements.push(
        <p
          key={index}
          className='mb-4 leading-relaxed'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
  });

  flushList();
  return elements;
}
