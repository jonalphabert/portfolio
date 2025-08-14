import { create } from 'zustand';
import { BlogEditorPost, Category } from '@/types';

// Using BlogEditorPost from @/types

interface BlogEditorState {
  // Blog data
  blogPost: BlogEditorPost;

  // UI state
  isSaveModalOpen: boolean;
  slugAvailable: boolean | null;
  isLoading: boolean;

  // Actions
  updateTitle: (title: string) => void;
  updateContent: (content: string) => void;
  updateBlogData: (data: Partial<BlogEditorPost>) => void;
  generateSlug: (title: string) => string;
  checkSlugAvailability: (slug: string) => Promise<void>;

  // API actions
  loadBlogBySlug: (slug: string) => Promise<void>;

  // Modal actions
  openSaveModal: () => void;
  closeSaveModal: () => void;

  // Save actions
  saveDraft: () => Promise<boolean>;
  publishPost: () => Promise<boolean>;

  // Draft persistence
  loadDraft: () => void;
  saveDraftToSession: () => void;
  clearAllDrafts: () => void;

  // Reset
  resetEditor: () => void;
}

const initialBlogPost: BlogEditorPost = {
  title: '',
  slug: '',
  content:
    '# Welcome to the Blog Editor\n\nStart writing your **markdown** content here!\n\n## Features\n\n- Bold text with **double asterisks**\n- Italic text with *single asterisks*\n- `Inline code` with backticks\n- [Links](https://example.com)\n- ![Images](https://via.placeholder.com/300x200)\n\n```javascript\n// Code blocks\nconst hello = "world";\nconsole.log(hello);\n```',
  excerpt: '',
  category: '',
  categoryData: [],
  tags: '',
  thumbnail: null,
  thumbnailUrl: null,
  isPublished: false,
  isDraft: false,
};

export const useBlogEditor = create<BlogEditorState>((set, get) => ({
  blogPost: initialBlogPost,
  isSaveModalOpen: false,
  slugAvailable: null,
  isLoading: false,

  updateTitle: (title) => {
    const { blogPost } = get();
    const isEditMode = blogPost.isDraft || blogPost.isPublished;
    
    if (isEditMode) {
      // Edit mode: don't change slug
      set((state) => ({
        blogPost: { ...state.blogPost, title },
      }));
    } else {
      // New post: auto-generate slug
      const slug = get().generateSlug(title);
      set((state) => ({
        blogPost: { ...state.blogPost, title, slug },
      }));
      get().checkSlugAvailability(slug);
    }
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

  checkSlugAvailability: (() => {
    let timeoutId: NodeJS.Timeout;
    
    return async (slug: string) => {
      if (!slug) {
        set({ slugAvailable: null });
        return;
      }

      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout for debounced API call
      timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(`/api/post/${slug}/available`);
          const data = await response.json();
          set({ slugAvailable: data.available });
        } catch (error) {
          console.error('Error checking slug availability:', error);
          set({ slugAvailable: null });
        }
      }, 500);
    };
  })(),

  loadBlogBySlug: async (slug) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`/api/post/${slug}`);
      
      if (response.ok) {
        const data = await response.json();
        
        const blogPost: BlogEditorPost = {
          title: data.blog_title || '',
          slug: data.blog_slug || '',
          content: data.blog_content || '',
          excerpt: data.blog_description || '',
          category: data.categories ? data.categories.map((c: { category_id: string; category_name: string; category_slug: string }) => c.category_id).join(',') : '',
          categoryData: data.categories || [],
          tags: (data.blog_tags && data.blog_tags.join(', ')) || '',
          thumbnail: null, // File object can't be reconstructed from API
          thumbnailUrl: data.thumbnail ? data.thumbnail.image_path : null,
          isPublished: data.blog_status === 'published',
          isDraft: data.blog_status === 'draft',
        };

        set({ blogPost });
      } else {
        console.error('Failed to load blog: Post not found');
      }
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
    set({ isLoading: true });

    try {
      let thumbnailImageId = null;

      // Upload thumbnail if exists
      if (blogPost.thumbnail) {
        const formData = new FormData();
        formData.append('type', 'file');
        formData.append('file', blogPost.thumbnail);
        formData.append('alt', `${blogPost.title} thumbnail`);

        const imageResponse = await fetch('/api/image', {
          method: 'POST',
          body: formData,
        });

        if (imageResponse.ok) {
          const imageResult = await imageResponse.json();
          thumbnailImageId = imageResult.image_id;
        }
      }

      // Get user ID from auth store
      const { useAuth } = await import('@/store/auth');
      const authStore = useAuth.getState();
      
      console.log('Auth state:', {
        user: authStore.user,
        isAuthenticated: authStore.isAuthenticated,
        isSetupComplete: authStore.isSetupComplete
      });
      
      if (!authStore.isAuthenticated || !authStore.user?.user_id) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      const userId = authStore.user.user_id;
      
      // Detect if this is an edit (existing blog) or create (new blog)
      const isEdit = blogPost.isDraft || blogPost.isPublished;

      // Prepare data for API
      const postData = {
        title: blogPost.title,
        content: blogPost.content,
        blog_description: blogPost.excerpt,
        tags: blogPost.tags ? blogPost.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        thumbnail_image_id: thumbnailImageId,
        ...(isEdit 
          ? { category_ids: blogPost.category ? blogPost.category.split(',').filter(Boolean) : [] } 
          : { slug: blogPost.slug, user_id: userId }
        )
      };

      const response = await fetch(isEdit ? `/api/post/${blogPost.slug}` : '/api/post', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Insert categories after getting the blog_id from result
        if (blogPost.category && result.blog_id) {
          const categoryIds = blogPost.category.split(',').filter(Boolean);
          for (const categoryId of categoryIds) {
            await fetch('/api/post/category', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                blog_id: result.blog_id,
                category_id: categoryId,
              }),
            });
          }
        }

        set((state) => ({
          blogPost: { ...state.blogPost, isDraft: true },
          isSaveModalOpen: false,
        }));

        get().clearAllDrafts();
        return true;
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      // Show error to user
      alert(`Failed to save blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  publishPost: async () => {
    const { blogPost } = get();
    set({ isLoading: true });

    try {
      // First save as draft if not already saved
      if (!blogPost.isDraft) {
        await get().saveDraft();
      }

      // Then publish
      const response = await fetch(`/api/post/${blogPost.slug}/publish`, {
        method: 'PUT',
      });

      if (response.ok) {
        set((state) => ({
          blogPost: { ...state.blogPost, isPublished: true, isDraft: false },
        }));
        return true;
      } else {
        throw new Error('Failed to publish post');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
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
