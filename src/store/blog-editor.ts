import { create } from 'zustand';

export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  thumbnail: File | null;
  isPublished: boolean;
  isDraft: boolean;
}

interface BlogEditorState {
  // Blog data
  blogPost: BlogPost;

  // UI state
  isSaveModalOpen: boolean;
  slugAvailable: boolean | null;
  isLoading: boolean;

  // Actions
  updateTitle: (title: string) => void;
  updateContent: (content: string) => void;
  updateBlogData: (data: Partial<BlogPost>) => void;
  generateSlug: (title: string) => string;
  checkSlugAvailability: (slug: string) => Promise<void>;

  // API actions
  loadBlogBySlug: (slug: string) => Promise<void>;

  // Modal actions
  openSaveModal: () => void;
  closeSaveModal: () => void;

  // Save actions
  saveDraft: () => Promise<void>;
  publishPost: () => Promise<void>;

  // Draft persistence
  loadDraft: () => void;
  saveDraftToSession: () => void;
  clearAllDrafts: () => void;

  // Reset
  resetEditor: () => void;
}

const initialBlogPost: BlogPost = {
  title: '',
  slug: '',
  content:
    '# Welcome to the Blog Editor\n\nStart writing your **markdown** content here!\n\n## Features\n\n- Bold text with **double asterisks**\n- Italic text with *single asterisks*\n- `Inline code` with backticks\n- [Links](https://example.com)\n- ![Images](https://via.placeholder.com/300x200)\n\n```javascript\n// Code blocks\nconst hello = "world";\nconsole.log(hello);\n```',
  excerpt: '',
  category: '',
  tags: '',
  thumbnail: null,
  isPublished: false,
  isDraft: false,
};

export const useBlogEditor = create<BlogEditorState>((set, get) => ({
  blogPost: initialBlogPost,
  isSaveModalOpen: false,
  slugAvailable: null,
  isLoading: false,

  updateTitle: (title) => {
    const slug = get().generateSlug(title);
    set((state) => ({
      blogPost: { ...state.blogPost, title, slug },
    }));
    get().checkSlugAvailability(slug);
    get().saveDraftToSession();
  },

  updateContent: (content) => {
    set((state) => ({
      blogPost: { ...state.blogPost, content },
    }));
    get().saveDraftToSession();
  },

  updateBlogData: (data) => {
    set((state) => ({
      blogPost: { ...state.blogPost, ...data },
    }));
  },

  generateSlug: (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  checkSlugAvailability: async (slug) => {
    if (!slug) {
      set({ slugAvailable: null });
      return;
    }

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    const unavailableSlugs = ['building-scalable-react-applications', 'modern-css-techniques'];
    set({ slugAvailable: !unavailableSlugs.includes(slug) });
  },

  loadBlogBySlug: async (slug) => {
    set({ isLoading: true });

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockBlog: BlogPost = {
        title: 'Building Scalable React Applications with TypeScript',
        slug: 'getting-started-nextjs-15',
        content: `# Introduction

Building scalable React applications requires careful consideration of architecture, type safety, and developer experience.

## Why TypeScript?

TypeScript brings several advantages to React development:

- **Type Safety**: Catch errors at compile time
- **Better Developer Experience**: Enhanced autocomplete
- **Self-Documenting Code**: Types serve as documentation

## Conclusion

Building scalable React applications with TypeScript requires strong architecture and best practices.`,
        excerpt:
          'Learn best practices for building maintainable and scalable React applications using TypeScript.',
        category: 'React',
        tags: 'React, TypeScript, Architecture, Best Practices',
        thumbnail: null,
        isPublished: slug === 'building-scalable-react-applications',
        isDraft: true,
      };

      set({ blogPost: mockBlog });
    } catch (error) {
      console.error('Failed to load blog:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  openSaveModal: () => set({ isSaveModalOpen: true }),
  closeSaveModal: () => set({ isSaveModalOpen: false }),

  saveDraft: async () => {
    const { blogPost } = get();
    console.log('Saving draft:', { ...blogPost, isDraft: true });

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    set((state) => ({
      blogPost: { ...state.blogPost, isDraft: true },
      isSaveModalOpen: false,
    }));

    // Clear all drafts after successful save
    get().clearAllDrafts();
  },

  publishPost: async () => {
    const { blogPost } = get();
    console.log('Publishing post:', { ...blogPost, isPublished: true });

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    set((state) => ({
      blogPost: { ...state.blogPost, isPublished: true, isDraft: false },
    }));
  },

  loadDraft: () => {
    if (typeof window !== 'undefined') {
      const draft = sessionStorage.getItem('blog-editor-new-draft');
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft);
          set({ blogPost: { ...initialBlogPost, ...parsedDraft } });
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  },

  saveDraftToSession: () => {
    if (typeof window !== 'undefined') {
      const { blogPost } = get();
      const key =
        blogPost.slug && blogPost.slug !== ''
          ? `blog-editor-edit-${blogPost.slug}`
          : 'blog-editor-new-draft';
      sessionStorage.setItem(
        key,
        JSON.stringify({
          title: blogPost.title,
          content: blogPost.content,
          excerpt: blogPost.excerpt,
          category: blogPost.category,
          tags: blogPost.tags,
          slug: blogPost.slug,
        })
      );
    }
  },

  clearAllDrafts: () => {
    if (typeof window !== 'undefined') {
      // Clear all blog editor related keys
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('blog-editor-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  },

  resetEditor: () => {
    set({
      blogPost: initialBlogPost,
      isSaveModalOpen: false,
      slugAvailable: null,
      isLoading: false,
    });
  },
}));
