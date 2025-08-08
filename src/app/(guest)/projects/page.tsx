import Link from 'next/link';
import { Calendar, ExternalLink, Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const projects = [
  {
    slug: 'ecommerce-platform',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React, Node.js, and PostgreSQL',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    date: '2024-01-15',
    github: 'https://github.com/developer/ecommerce',
    demo: 'https://ecommerce-demo.com',
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Socket.io'],
    date: '2023-12-10',
    github: 'https://github.com/developer/task-app',
    demo: 'https://task-app-demo.com',
  },
  {
    slug: 'weather-dashboard',
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard with location-based forecasts',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop',
    technologies: ['Vue.js', 'Chart.js', 'OpenWeather API'],
    date: '2023-11-20',
    github: 'https://github.com/developer/weather-dashboard',
    demo: 'https://weather-demo.com',
  },
];

export default function ProjectsPage() {
  return (
    <div className='min-h-screen py-20'>
      <div className='container mx-auto px-4'>
        <div className='mb-16 text-center'>
          <h1 className='mb-6 text-4xl font-bold md:text-6xl'>My Projects</h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            A collection of projects showcasing my skills in web development, from concept to
            deployment.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {projects.map((project) => (
            <Card
              key={project.slug}
              className='overflow-hidden py-0 transition-shadow hover:shadow-lg'
            >
              <div className='aspect-video overflow-hidden'>
                <img
                  src={project.image}
                  alt={project.title}
                  className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                />
              </div>
              <CardContent className='p-6'>
                <div className='text-muted-foreground mb-3 flex items-center gap-2 text-sm'>
                  <Calendar className='h-4 w-4' />
                  {new Date(project.date).toLocaleDateString()}
                </div>

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
                  <Link href={`/projects/${project.slug}`} className='flex-1'>
                    <Button variant='default' className='w-full cursor-pointer'>
                      View Details
                    </Button>
                  </Link>
                  <Button variant='outline' size='icon' asChild>
                    <a href={project.github} target='_blank' rel='noopener noreferrer'>
                      <Github className='h-4 w-4' />
                    </a>
                  </Button>
                  <Button variant='outline' size='icon' asChild>
                    <a href={project.demo} target='_blank' rel='noopener noreferrer'>
                      <ExternalLink className='h-4 w-4' />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
