import { create } from 'zustand';
import { ProjectEditorPost } from '@/types';

interface ProjectEditorState {
  // Project data
  project: ProjectEditorPost;

  // UI state
  isSaveModalOpen: boolean;
  slugAvailable: boolean | null;
  isLoading: boolean;

  // Actions
  updateTitle: (title: string) => void;
  updateContent: (content: string) => void;
  updateProjectData: (data: Partial<ProjectEditorPost>) => void;
  generateSlug: (title: string) => string;
  checkSlugAvailability: (slug: string) => Promise<void>;

  // API actions
  loadProjectBySlug: (slug: string) => Promise<void>;

  // Modal actions
  openSaveModal: () => void;
  closeSaveModal: () => void;

  // Save actions
  saveDraft: () => Promise<boolean>;
  publishProject: () => Promise<boolean>;

  // Draft persistence
  loadDraft: () => void;
  saveDraftToSession: () => void;
  clearAllDrafts: () => void;

  // Reset
  resetEditor: () => void;
}

const initialProject: ProjectEditorPost = {
  title: '',
  slug: '',
  description: '',
  content: '# Project Overview\n\nDescribe your project here...\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Tech Stack\n\n- Technology 1\n- Technology 2\n- Technology 3\n\n## Installation\n\n```bash\nnpm install\nnpm start\n```',
  techStacks: '',
  projectUrl: '',
  githubUrl: '',
  thumbnail: null,
  thumbnailUrl: null,
  isPublished: false,
  isDraft: false,
  isFeatured: false,
};

export const useProjectEditor = create<ProjectEditorState>((set, get) => ({
  project: initialProject,
  isSaveModalOpen: false,
  slugAvailable: null,
  isLoading: false,

  updateTitle: (title) => {
    const { project } = get();
    const isEditMode = project.isDraft || project.isPublished;
    
    if (isEditMode) {
      // Edit mode: don't change slug
      set((state) => ({
        project: { ...state.project, title },
      }));
    } else {
      // New project: auto-generate slug
      const slug = get().generateSlug(title);
      set((state) => ({
        project: { ...state.project, title, slug },
      }));
      get().checkSlugAvailability(slug);
    }
    get().saveDraftToSession();
  },

  updateContent: (content) => {
    set((state) => ({
      project: { ...state.project, content },
    }));
    get().saveDraftToSession();
  },

  updateProjectData: (data) => {
    set((state) => ({
      project: { ...state.project, ...data },
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
          const response = await fetch(`/api/project/${slug}/available`);
          const data = await response.json();
          set({ slugAvailable: data.available });
        } catch (error) {
          console.error('Error checking slug availability:', error);
          set({ slugAvailable: null });
        }
      }, 500);
    };
  })(),

  loadProjectBySlug: async (slug) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`/api/project/${slug}`);
      
      if (response.ok) {
        const data = await response.json();
        
        const project: ProjectEditorPost = {
          title: data.project_title || '',
          slug: data.project_slug || '',
          description: data.project_description || '',
          content: data.project_content || '',
          techStacks: (data.project_tech_stacks && data.project_tech_stacks.join(', ')) || '',
          projectUrl: data.project_url || '',
          githubUrl: data.project_github || '',
          thumbnail: null, // File object can't be reconstructed from API
          thumbnailUrl: data.thumbnail ? data.thumbnail.image_path : null,
          isPublished: data.project_status === 'published',
          isDraft: data.project_status === 'draft',
          isFeatured: data.is_featured || false,
        };

        set({ project });
      } else {
        console.error('Failed to load project: Project not found');
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  openSaveModal: () => set({ isSaveModalOpen: true }),
  closeSaveModal: () => set({ isSaveModalOpen: false }),

  saveDraft: async () => {
    const { project } = get();
    set({ isLoading: true });

    try {
      let thumbnailImageId = null;

      // Upload thumbnail if exists
      if (project.thumbnail) {
        const formData = new FormData();
        formData.append('type', 'file');
        formData.append('file', project.thumbnail);
        formData.append('alt', `${project.title} thumbnail`);

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
      
      if (!authStore.isAuthenticated || !authStore.user?.user_id) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      const userId = authStore.user.user_id;
      
      // Detect if this is an edit (existing project) or create (new project)
      const isEdit = project.isDraft || project.isPublished;

      // Prepare data for API
      const projectData = {
        title: project.title,
        description: project.description,
        content: project.content,
        tech_stacks: project.techStacks ? project.techStacks.split(',').map(tech => tech.trim()).filter(Boolean) : [],
        project_url: project.projectUrl || null,
        project_github: project.githubUrl || null,
        project_thumbnail: thumbnailImageId,
        ...(isEdit ? {} : { slug: project.slug, user_id: userId })
      };

      const response = await fetch(isEdit ? `/api/project/${project.slug}` : '/api/project', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        set((state) => ({
          project: { ...state.project, isDraft: true },
          isSaveModalOpen: false,
        }));

        get().clearAllDrafts();
        return true;
      } else {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert(`Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  publishProject: async () => {
    const { project } = get();
    set({ isLoading: true });

    try {
      // First save as draft if not already saved
      if (!project.isDraft) {
        const saveSuccess = await get().saveDraft();
        if (!saveSuccess) return false;
      }

      // Then publish
      const response = await fetch(`/api/project/${project.slug}/publish`, {
        method: 'PUT',
      });

      if (response.ok) {
        set((state) => ({
          project: { ...state.project, isPublished: true, isDraft: false },
        }));
        
        get().clearAllDrafts();
        return true;
      } else {
        throw new Error('Failed to publish project');
      }
    } catch (error) {
      console.error('Error publishing project:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  loadDraft: () => {
    if (typeof window !== 'undefined') {
      const draft = sessionStorage.getItem('project-editor-new-draft');
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft);
          set({ project: { ...initialProject, ...parsedDraft } });
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  },

  saveDraftToSession: () => {
    if (typeof window !== 'undefined') {
      const { project } = get();
      const key =
        project.slug && project.slug !== ''
          ? `project-editor-edit-${project.slug}`
          : 'project-editor-new-draft';
      sessionStorage.setItem(
        key,
        JSON.stringify({
          title: project.title,
          description: project.description,
          content: project.content,
          techStacks: project.techStacks,
          projectUrl: project.projectUrl,
          githubUrl: project.githubUrl,
          slug: project.slug,
        })
      );
    }
  },

  clearAllDrafts: () => {
    if (typeof window !== 'undefined') {
      // Clear all project editor related keys
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('project-editor-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  },

  resetEditor: () => {
    set({
      project: initialProject,
      isSaveModalOpen: false,
      slugAvailable: null,
      isLoading: false,
    });
  },
}));