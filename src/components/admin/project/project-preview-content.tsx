'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Globe, Github, User } from 'lucide-react';
import { processMarkdown } from '@/lib/markdown';

interface ProjectPreviewContentProps {
  project: {
    slug: string;
    title: string;
    description: string;
    content: string;
    techStacks: string[];
    projectUrl?: string;
    githubUrl?: string;
    featuredImage: string;
    author: {
      name: string;
      avatar: string;
    };
    publishedDate: string;
  };
}

export function ProjectPreviewContent({ project }: ProjectPreviewContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='bg-background min-h-screen'>
      <main className='pt-8'>
        {/* Featured Image */}
        <div className='container mx-auto max-w-4xl px-6'>
          <div className='relative mb-8 h-64 overflow-hidden rounded-lg md:h-96'>
            <Image
              src={project.featuredImage}
              alt={project.title}
              fill
              className='object-cover'
              priority
            />
          </div>
        </div>

        {/* Project Header */}
        <article className='container mx-auto max-w-4xl px-6'>
          <header className='mb-8'>
            <div className='mb-4 flex items-center gap-4 text-sm text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {formatDate(project.publishedDate)}
              </div>
            </div>

            <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>
              {project.title}
            </h1>

            <p className='text-muted-foreground mb-6 text-xl'>{project.description}</p>

            {/* Project Links */}
            <div className='flex items-center gap-4'>
              {project.projectUrl && (
                <a href={project.projectUrl} target='_blank' rel='noopener noreferrer'>
                  <Button variant='default' size='sm'>
                    <Globe className='mr-2 h-4 w-4' />
                    Live Demo
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target='_blank' rel='noopener noreferrer'>
                  <Button variant='outline' size='sm'>
                    <Github className='mr-2 h-4 w-4' />
                    Source Code
                  </Button>
                </a>
              )}
            </div>
          </header>

          <Separator className='mb-8' />

          {/* Project Content */}
          <div className='prose prose-lg prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded max-w-none'>
            {processMarkdown(project.content)}
          </div>

          <Separator className='my-12' />

          {/* Tech Stack */}
          <div className='mb-6 flex flex-wrap gap-2'>
            {project.techStacks.map((tech) => (
              <Badge key={tech} variant='outline' className='text-sm'>
                {tech}
              </Badge>
            ))}
          </div>

          {/* Author Bio */}
          <div className='mb-12'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full'>
                    <Image
                      src={project.author.avatar}
                      alt={project.author.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <div className='mb-2 flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      <h3 className='font-semibold'>{project.author.name}</h3>
                    </div>
                    <p className='text-muted-foreground'>
                      Project creator and developer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </article>
      </main>
    </div>
  );
}