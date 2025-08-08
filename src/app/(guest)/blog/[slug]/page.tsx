import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MinimalCenteredFooter } from '@/components/footers/minimal-centered-footer';
import { processMarkdown } from '@/lib/markdown';

// Mock data types
interface BlogPost {
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

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  featuredImage: string;
}

// Mock database function
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockPosts: BlogPost[] = [
    {
      slug: 'building-scalable-react-applications',
      title: 'Building Scalable React Applications with TypeScript',
      content: `
# Introduction

Building scalable React applications requires careful consideration of architecture, type safety, and developer experience. In this comprehensive guide, we'll explore best practices for creating maintainable React applications using TypeScript.

## Why TypeScript?

TypeScript brings several advantages to React development:

- **Type Safety**: Catch errors at compile time rather than runtime
- **Better Developer Experience**: Enhanced autocomplete and refactoring
- **Self-Documenting Code**: Types serve as inline documentation
- **Easier Refactoring**: Confident code changes with type checking

## Project Structure

A well-organized project structure is crucial for scalability:

\`\`\`
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── forms/       # Form components
│   └── layout/      # Layout components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── lib/             # Third-party library configurations
\`\`\`

## Component Design Patterns

### 1. Compound Components

Compound components provide a flexible API for complex UI elements:

\`\`\`typescript
interface TabsProps {
  defaultValue?: string
  children: React.ReactNode
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent
\`\`\`

### 2. Custom Hooks

Extract component logic into reusable hooks:

\`\`\`typescript
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}
\`\`\`

## Performance Optimization

### Memoization

Use React.memo, useMemo, and useCallback strategically:

\`\`\`typescript
const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }))
  }, [data])

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id)
  }, [onUpdate])

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onUpdate={handleUpdate} />
      ))}
    </div>
  )
})
\`\`\`

### Code Splitting

Implement lazy loading for better performance:

\`\`\`typescript
const Dashboard = lazy(() => import('./Dashboard'))
const Settings = lazy(() => import('./Settings'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
\`\`\`

## State Management

### Context for Global State

Use React Context for application-wide state:

\`\`\`typescript
interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  notifications: Notification[]
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
\`\`\`

### Local State Management

For complex local state, use useReducer:

\`\`\`typescript
interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  isSubmitting: boolean
}

type FormAction = 
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }
      }
    // ... other cases
    default:
      return state
  }
}
\`\`\`

## Testing Strategies

### Component Testing

Use React Testing Library for component tests:

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  }

  it('displays user information', () => {
    render(<UserCard user={mockUser} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn()
    render(<UserCard user={mockUser} onEdit={onEdit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith(mockUser.id)
  })
})
\`\`\`

### Integration Testing

Test component interactions:

\`\`\`typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserList } from './UserList'
import { ApiProvider } from './ApiProvider'

describe('UserList Integration', () => {
  it('loads and displays users', async () => {
    render(
      <ApiProvider>
        <UserList />
      </ApiProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})
\`\`\`

## Conclusion

Building scalable React applications with TypeScript requires:

1. **Strong Type System**: Define clear interfaces and types
2. **Component Architecture**: Use composition and reusable patterns
3. **Performance Optimization**: Implement memoization and code splitting
4. **State Management**: Choose appropriate state solutions
5. **Testing**: Write comprehensive tests for reliability

By following these practices, you'll create maintainable, scalable React applications that can grow with your project's needs.

## Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
`,
      excerpt:
        'Learn best practices for building maintainable and scalable React applications using TypeScript, covering architecture, patterns, and optimization techniques.',
      publishedDate: '2024-01-15',
      readTime: 12,
      category: 'React',
      author: {
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
        bio: 'Senior Frontend Developer with 8+ years of experience building scalable web applications. Passionate about React, TypeScript, and developer experience.',
      },
      featuredImage:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      tags: ['React', 'TypeScript', 'Architecture', 'Best Practices'],
    },
    {
      slug: 'modern-css-techniques',
      title: 'Modern CSS Techniques for Better User Interfaces',
      content: `
# Modern CSS: Beyond the Basics

CSS has evolved significantly in recent years, introducing powerful features that enable developers to create more sophisticated and maintainable user interfaces. Let's explore some modern CSS techniques that can elevate your web development skills.

## CSS Custom Properties (Variables)

CSS custom properties provide a way to store values that can be reused throughout your stylesheet:

\`\`\`css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --border-radius: 0.5rem;
  --spacing-unit: 1rem;
}

.button {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 0.5) var(--spacing-unit);
}
\`\`\`

## Container Queries

Container queries allow you to apply styles based on the size of a container rather than the viewport:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
  }
}
\`\`\`

## CSS Grid for Complex Layouts

CSS Grid provides powerful layout capabilities:

\`\`\`css
.dashboard {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 250px 1fr 200px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

## Modern Selectors

Take advantage of new CSS selectors:

\`\`\`css
/* :is() pseudo-class */
:is(h1, h2, h3, h4, h5, h6) {
  font-family: var(--font-heading);
  line-height: 1.2;
}

/* :where() pseudo-class (0 specificity) */
:where(ul, ol) :where(ul, ol) {
  margin-top: 0;
}

/* :has() pseudo-class */
.card:has(img) {
  overflow: hidden;
}
\`\`\`

## Conclusion

Modern CSS provides powerful tools for creating better user interfaces. By leveraging these techniques, you can write more maintainable and efficient stylesheets.
`,
      excerpt:
        'Discover modern CSS techniques including custom properties, container queries, and advanced selectors to create better user interfaces.',
      publishedDate: '2024-01-10',
      readTime: 8,
      category: 'CSS',
      author: {
        name: 'Alex Chen',
        avatar: '/api/placeholder/80/80',
        bio: 'Senior Frontend Developer with 8+ years of experience building scalable web applications. Passionate about React, TypeScript, and developer experience.',
      },
      featuredImage:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      tags: ['CSS', 'Frontend', 'UI/UX', 'Web Development'],
    },
  ];

  return mockPosts.find((post) => post.slug === slug) || null;
}

// Related posts function
async function getRelatedPosts(currentSlug: string): Promise<RelatedPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const relatedPosts: RelatedPost[] = [
    {
      slug: 'javascript-design-patterns',
      title: 'Essential JavaScript Design Patterns Every Developer Should Know',
      excerpt:
        'Explore common design patterns in JavaScript and learn how to apply them in your applications.',
      category: 'JavaScript',
      readTime: 10,
      featuredImage:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    },
    {
      slug: 'performance-optimization-react',
      title: 'React Performance Optimization: A Complete Guide',
      excerpt:
        'Learn advanced techniques to optimize your React applications for better performance.',
      category: 'React',
      readTime: 15,
      featuredImage:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    },
  ];

  return relatedPosts.filter((post) => post.slug !== currentSlug).slice(0, 3);
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Portfolio Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Portfolio Blog`,
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='bg-background min-h-screen'>
      <main className='pt-20'>
        {/* Back to Blog Link */}
        <div className='container mx-auto max-w-4xl px-6 py-8'>
          <Link
            href='/blog'
            className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Blog
          </Link>
        </div>

        {/* Featured Image */}
        <div className='container mx-auto max-w-4xl px-6'>
          <div className='relative mb-8 h-64 overflow-hidden rounded-lg md:h-96'>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className='object-cover'
              priority
            />
          </div>
        </div>

        {/* Article Header */}
        <article className='container mx-auto max-w-4xl px-6'>
          <header className='mb-8'>
            <div className='mb-4 flex flex-wrap items-center gap-4'>
              <Badge variant='secondary' className='text-sm'>
                {post.category}
              </Badge>
              <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {formatDate(post.publishedDate)}
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  {post.readTime} min read
                </div>
              </div>
            </div>

            <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>{post.title}</h1>

            <p className='text-muted-foreground mb-6 text-xl'>{post.excerpt}</p>

            {/* Tags */}
            <div className='mb-6 flex flex-wrap gap-2'>
              {post.tags.map((tag) => (
                <Badge key={tag} variant='outline' className='text-xs'>
                  <Tag className='mr-1 h-3 w-3' />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share Buttons */}
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>Share:</span>
              <Button variant='outline' size='sm'>
                <Share2 className='mr-1 h-4 w-4' />
                Share
              </Button>
            </div>
          </header>

          <Separator className='mb-8' />

          {/* Article Content */}
          <div className='prose prose-lg prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded max-w-none'>
            {processMarkdown(post.content)}
          </div>

          <Separator className='my-12' />

          {/* Author Bio */}
          <div className='mb-12'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full'>
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <div className='mb-2 flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      <h3 className='font-semibold'>{post.author.name}</h3>
                    </div>
                    <p className='text-muted-foreground'>{post.author.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className='mb-12'>
              <h2 className='mb-6 text-2xl font-bold'>Related Posts</h2>
              <div className='grid gap-6 md:grid-cols-2'>
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.slug}
                    className='group py-0 transition-shadow hover:shadow-lg'
                  >
                    <div className='relative h-48 overflow-hidden rounded-t-lg'>
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    </div>
                    <CardContent className='p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Badge variant='secondary' className='text-xs'>
                          {relatedPost.category}
                        </Badge>
                        <span className='text-muted-foreground text-xs'>
                          {relatedPost.readTime} min read
                        </span>
                      </div>
                      <h3 className='group-hover:text-accent mb-2 font-semibold transition-colors'>
                        {relatedPost.title}
                      </h3>
                      <p className='text-muted-foreground mb-3 text-sm'>{relatedPost.excerpt}</p>
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className='text-accent inline-flex items-center gap-1 text-sm hover:underline'
                      >
                        Read More
                        <ExternalLink className='h-3 w-3' />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <MinimalCenteredFooter />
    </div>
  );
}
