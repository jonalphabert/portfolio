import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlogPostContent } from '@/components/blog/blog-post-content';
import { PublicBlogPost, RelatedPost } from '@/types';

// Using PublicBlogPost and RelatedPost from @/types

// Fetch blog post from API
async function getBlogPost(slug: string): Promise<PublicBlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/guest/blog/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Transform guest API response to BlogPost format
    return {
      slug: data.slug,
      title: data.title,
      content: data.content,
      excerpt: data.description || '',
      publishedDate: new Date(data.publishedDate).toISOString().split('T')[0],
      readTime: Math.ceil(data.content.split(' ').length / 200) || 5,
      categories: data.categories,
      author: {
        name: data.author.name,
        avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
        bio: 'Content creator and developer.',
      },
      featuredImage: data.thumbnail 
        ? data.thumbnail.url 
        : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      tags: data.tags || [],
    } as PublicBlogPost;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Fetch related posts from API
async function getRelatedPosts(currentSlug: string): Promise<RelatedPost[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/guest/blog?limit=3`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const posts = data.posts || [];
    
    // Filter out current post and transform to RelatedPost format
    return posts
      .filter((post: { slug: string }) => post.slug !== currentSlug)
      .slice(0, 3)
      .map((post: { slug: string; title: string; description: string; content: string; tags: string[]; thumbnail?: { url: string } }) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.description || post.content.substring(0, 150) + '...',
        category: post.tags && post.tags.length > 0 ? post.tags[0] : 'Uncategorized',
        readTime: Math.ceil(post.content.split(' ').length / 200) || 5,
        featuredImage: post.thumbnail 
          ? post.thumbnail.url 
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

  const urlOgImage = post.featuredImage.replace('/upload/',
    '/upload/w_1200,h_630,c_fill,q_auto,f_auto/');

  return {
    title: `${post.title} | Portfolio Website`,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug}`,
      publishedTime: post.publishedDate,
      authors: [post.author.name],
      images: [
        {
          url: urlOgImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [urlOgImage],
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