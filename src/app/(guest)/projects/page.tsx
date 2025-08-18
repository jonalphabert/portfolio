import { ExternalLink, Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Featured Projects | Portfolio',
  description: 'A collection of featured projects showcasing my skills in web development, from concept to deployment.',
  openGraph: {
    title: 'Featured Projects | Portfolio',
    description: 'A collection of featured projects showcasing my skills in web development, from concept to deployment.',
  },
};

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  href: string;
  githubUrl?: string;
  image: string;
  technologies: string[];
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/guest/project?featured=true&limit=6`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getFeaturedProjects();



  return (
    <div className='min-h-screen py-20'>
      <div className='container mx-auto px-4'>
        <div className='mb-16 text-center'>
          <h1 className='mb-6 text-4xl font-bold md:text-6xl'>My Projects</h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            A collection of featured projects showcasing my skills in web development.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className='py-12 text-center'>
            <p className='text-muted-foreground text-xl'>
              No featured projects available at the moment.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {projects.map((project) => (
              <Card
                key={project.id}
                className='overflow-hidden py-0 transition-shadow hover:shadow-lg'
              >
                <div className='aspect-video overflow-hidden'>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={480}
                    height={270}
                    className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                  />
                </div>
                <CardContent className='p-6'>
                  <h3 className='mb-3 text-xl font-semibold'>{project.title}</h3>
                  <p className='text-muted-foreground mb-4'>{project.description}</p>

                  <div className='mb-4 flex flex-wrap gap-2'>
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant='secondary'>
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className='flex gap-2'>
                    <Button variant='default' className='flex-1' asChild>
                      <a href={`/projects/${project.slug}`}  rel='noopener noreferrer'>
                        View Project
                      </a>
                    </Button>
                    {project.githubUrl && (
                      <Button variant='outline' size='icon' asChild>
                        <a href={project.githubUrl} target='_blank' rel='noopener noreferrer'>
                          <Github className='h-4 w-4' />
                        </a>
                      </Button>
                    )}
                    <Button variant='outline' size='icon' asChild>
                      <a href={project.href} target='_blank' rel='noopener noreferrer'>
                        <ExternalLink className='h-4 w-4' />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
