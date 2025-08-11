'use client';

import React from 'react';
import { BlogEditor } from '@/components/admin/blog/blog-editor';
import { useBlogEditor } from '@/store/blog-editor';

export default function NewBlogEditorPage() {
  const { resetEditor, loadDraft } = useBlogEditor();

  // Reset state first, then load draft if exists
  React.useEffect(() => {
    resetEditor();
    loadDraft();
  }, [resetEditor, loadDraft]);

  return <BlogEditor mode="new" />;
}
