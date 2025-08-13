import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlogPostContent } from '@/components/blog/blog-post-content';

export interface BlogPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  readTime: number;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  featuredImage: string;
  tags: string[];
}

export interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  featuredImage: string;
}

// Fetch blog post from API
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/post/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Transform API response to BlogPost format
    return {
      slug: data.blog_slug,
      title: data.blog_title,
      content: data.blog_content,
      excerpt: data.blog_description || '',
      publishedDate: data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      readTime: Math.ceil(data.blog_content.split(' ').length / 200) || 5,
      category: data.categories && data.categories.length > 0 
        ? data.categories.map((cat: any) => cat.category_name).join(', ')
        : 'Uncategorized',
      author: {
        name: data.author.username,
        avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
        bio: 'Content creator and developer.',
      },
      featuredImage: data.thumbnail 
        ? data.thumbnail.image_path 
        : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      tags: data.blog_tags || [],
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Fetch related posts from API
async function getRelatedPosts(currentSlug: string): Promise<RelatedPost[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/post/${currentSlug}/related?limit=3`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const posts = data.posts || [];
    
    // Transform API response to RelatedPost format
    return posts.map((post: any) => ({
      slug: post.blog_slug,
      title: post.blog_title,
      excerpt: post.blog_description || post.blog_content.substring(0, 150) + '...',
      category: post.categories && post.categories.length > 0 
        ? post.categories[0].category_name 
        : 'Uncategorized',
      readTime: Math.ceil(post.blog_content.split(' ').length / 200) || 5,
      featuredImage: post.thumbnail 
        ? post.thumbnail.image_path 
        : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    }));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Portfolio Website',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Portfolio Website`,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug);

  return <BlogPostContent post={post} relatedPosts={relatedPosts} />;
}