import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import { processMarkdown } from '@/lib/markdown'


interface Project {
  slug: string;
  title: string;
  description: string;
  content: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  image: string;
  publishedDate: string;
  author: {
    name: string;
  };
  isFeatured: boolean;
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/guest/project/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found | Portfolio',
      description: 'The requested project could not be found.'
    };
  }
  
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Portfolio`,
      description: project.description,
      images: [project.image],
    },
  };
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            {new Date(project.publishedDate).toLocaleDateString()}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
          
          <div className="flex gap-4 mb-8">
            {project.projectUrl && (
              <Button asChild>
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="aspect-video mb-12 overflow-hidden rounded-lg">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="prose prose-lg max-w-none">
          <div className="mb-12">
            <p className="text-xl leading-relaxed text-muted-foreground">{project.description}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            {processMarkdown(project.content)}
          </div>
        </article>
      </div>
    </div>
  );
}