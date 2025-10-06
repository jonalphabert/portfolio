// User Types
export interface User {
  user_id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserAdmin extends User {
  role?: string;
}

// Category Types
export interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Image Types
export interface ImageUploaded {
  image_id: string;
  image_path: string;
  image_alt: string;
  created_at?: string;
  updated_at?: string;
}

export type SQLParam = string | number | boolean | null | Date;

// Blog Post Types
export interface BlogPost {
  blog_id: string;
  blog_title: string;
  blog_slug: string;
  blog_content: string;
  blog_description: string;
  blog_tags: string[];
  blog_status: 'draft' | 'published' | 'archived';
  blog_views: number;
  blog_likes: number;
  thumbnail_id?: string;
  created_at: string;
  published_at: string | null;
  updated_at: string;
  author: {
    username: string;
    email: string;
  };
  categories: Category[];
  thumbnail?: ImageUploaded;
}

// Blog Editor Types
export interface BlogEditorPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  categoryData: Category[];
  tags: string;
  thumbnail: File | null;
  thumbnailUrl: string | null;
  isPublished: boolean;
  isDraft: boolean;
}

// Related Post Types
export interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  featuredImage: string;
}

export interface CategoryHeader {
  category_id: string;
  category_name: string;
  category_slug: string;
}

// Public Blog Post Types (for guest pages)
export interface PublicBlogPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  readTime: number;
  categories: CategoryHeader[];
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  featuredImage: string;
  tags: string[];
}

// API Filter Types
export interface PostFilters {
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  posts: T[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  tags: string[];
  user_id: string;
  thumbnail_image_id?: string;
  blog_description?: string;
  category_ids?: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  blog_description?: string;
  tags?: string[];
  thumbnail_image_id?: string;
  category_ids?: string[];
}

// Project Types
export interface Project {
  project_id: string;
  project_title: string;
  project_description: string;
  project_slug: string;
  project_content: string;
  project_tech_stacks: string[];
  project_user_id: string;
  project_url?: string;
  project_github?: string;
  project_thumbnail?: string;
  project_status: 'draft' | 'published' | 'archived';
  project_views: number;
  is_featured: boolean;
  created_at: string;
  published_at: string | null;
  updated_at: string;
  author: {
    username: string;
    email: string;
  };
  thumbnail?: ImageUploaded;
}

// Project Editor Types
export interface ProjectEditorPost {
  title: string;
  slug: string;
  description: string;
  content: string;
  techStacks: string;
  projectUrl: string;
  githubUrl: string;
  thumbnail: File | null;
  thumbnailUrl: string | null;
  originalThumbnailId?: string | null;
  isPublished: boolean;
  isDraft: boolean;
  isFeatured: boolean;
}

// Project Filter Types
export interface ProjectFilters {
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

// Project Form Types
export interface CreateProjectData {
  title: string;
  slug: string;
  description: string;
  content: string;
  tech_stacks: string[];
  user_id: string;
  project_url?: string;
  project_github?: string;
  project_thumbnail?: string;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  content?: string;
  tech_stacks?: string[];
  project_url?: string;
  project_github?: string;
  project_thumbnail?: string;
}

export interface Subscriber{
  subscription_id: string;
  subscription_name: string;
  subscription_email: string;
  subscription_created_at: string;
  subscription_updated_at: string;
};

export interface PostStat{
  totalPost: number;
  publishedPost: number;
  draftPost: number;
  totalViews: number;
};

export interface SubscriberStat{
  newSubscribers: number;
  unsubscribed: number;
  activeSubscribers: number;
}