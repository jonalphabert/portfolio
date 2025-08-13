import { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';

export const metadata: Metadata = {
  title: 'Blog | Portfolio',
  description: 'Thoughts on development, technology, and best practices',
};

export default function BlogPage() {
  return (
    <div className='bg-background min-h-screen'>
      {/* Hero Section */}
      <section className='from-surface to-background bg-gradient-to-b py-20'>
        <div className='container mx-auto max-w-6xl px-6 text-center'>
          <h1 className='mb-6 text-5xl font-bold tracking-tight'>Blog</h1>
          <p className='text-muted-foreground mx-auto mb-4 max-w-2xl text-xl'>
            Thoughts on development, technology, and best practices
          </p>
          <p className='text-muted-foreground mx-auto max-w-3xl'>
            Welcome to my blog where I share insights, tutorials, and experiences from my journey as
            a developer. Explore articles covering modern web technologies, project retrospectives,
            and industry trends.
          </p>
        </div>
      </section>

      <BlogList />
    </div>
  );
}