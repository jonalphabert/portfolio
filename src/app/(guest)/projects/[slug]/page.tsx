import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'


const projectsData = {
  'ecommerce-platform': {
    title: 'E-commerce Platform',
    intro: 'A comprehensive e-commerce solution built with modern web technologies, featuring user authentication, payment processing, and inventory management.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    date: '2024-01-15',
    github: 'https://github.com/developer/ecommerce',
    demo: 'https://ecommerce-demo.com',
    background: 'This project was born from the need to create a scalable e-commerce solution that could handle high traffic while maintaining excellent user experience. The goal was to build a platform that small to medium businesses could use to establish their online presence.',
    problem: 'Many existing e-commerce solutions are either too expensive for small businesses or lack the flexibility needed for custom requirements. Additionally, most platforms struggle with performance under high load and don\'t provide adequate analytics for business owners.',
    solution: 'I developed a custom e-commerce platform using React for the frontend and Node.js for the backend. The solution includes:\n\n• User authentication and authorization system\n• Product catalog with advanced filtering\n• Shopping cart and checkout process\n• Payment integration with Stripe\n• Order management system\n• Admin dashboard for inventory management\n• Real-time analytics and reporting',
    impact: 'The platform successfully handles over 10,000 concurrent users and has processed more than $500K in transactions. It reduced the client\'s operational costs by 40% compared to their previous solution and improved conversion rates by 25%.',
    keyTakeaways: [
      'Learned the importance of database optimization for high-traffic applications',
      'Gained experience with payment processing and PCI compliance',
      'Developed skills in real-time data synchronization using WebSockets',
      'Understood the critical role of caching strategies in e-commerce platforms'
    ]
  },
  'task-management-app': {
    title: 'Task Management App',
    intro: 'A collaborative task management application designed for remote teams, featuring real-time updates, project organization, and team communication tools.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Socket.io', 'PostgreSQL'],
    date: '2023-12-10',
    github: 'https://github.com/developer/task-app',
    demo: 'https://task-app-demo.com',
    background: 'With the rise of remote work, teams needed better tools for collaboration and project management. This project aimed to create an intuitive task management system that would improve team productivity and communication.',
    problem: 'Existing task management tools often lack real-time collaboration features or are too complex for small teams. Many solutions don\'t integrate well with existing workflows and fail to provide meaningful insights into team productivity.',
    solution: 'I built a modern task management application with the following features:\n\n• Real-time task updates using Socket.io\n• Drag-and-drop Kanban boards\n• Team collaboration with comments and mentions\n• Time tracking and productivity analytics\n• File attachments and document sharing\n• Mobile-responsive design\n• Integration with popular tools like Slack and GitHub',
    impact: 'The application is now used by over 50 teams with more than 500 active users. It has improved team productivity by 30% and reduced project completion time by an average of 2 weeks per project.',
    keyTakeaways: [
      'Mastered real-time communication patterns with WebSockets',
      'Learned advanced TypeScript patterns for large-scale applications',
      'Gained experience with complex state management in React',
      'Understood the importance of user experience in productivity tools'
    ]
  },
  'weather-dashboard': {
    title: 'Weather Dashboard',
    intro: 'A responsive weather dashboard that provides detailed weather information, forecasts, and interactive maps for locations worldwide.',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1200&h=600&fit=crop',
    technologies: ['Vue.js', 'Chart.js', 'OpenWeather API', 'Mapbox', 'PWA'],
    date: '2023-11-20',
    github: 'https://github.com/developer/weather-dashboard',
    demo: 'https://weather-demo.com',
    background: 'Weather information is crucial for daily planning, but most weather apps provide limited data visualization. This project aimed to create a comprehensive weather dashboard with rich visualizations and detailed forecasts.',
    problem: 'Standard weather applications often present information in a basic format without proper data visualization. Users struggle to understand weather patterns and trends, and most apps lack customization options for different user needs.',
    solution: 'I developed a feature-rich weather dashboard that includes:\n\n• Current weather conditions with detailed metrics\n• 7-day weather forecast with hourly breakdowns\n• Interactive weather maps with radar and satellite imagery\n• Historical weather data and trends\n• Customizable widgets and layouts\n• Location-based weather alerts\n• Progressive Web App capabilities for offline access',
    impact: 'The dashboard has gained over 5,000 monthly active users and maintains a 4.8/5 user rating. It has been featured in several web development showcases and serves as a reference implementation for weather data visualization.',
    keyTakeaways: [
      'Learned advanced data visualization techniques with Chart.js',
      'Gained experience with third-party API integration and error handling',
      'Developed skills in Progressive Web App development',
      'Understood the importance of responsive design for data-heavy applications'
    ]
  }
}

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projectsData[params.slug as keyof typeof projectsData]
  
  if (!project) {
    notFound()
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
            {new Date(project.date).toLocaleDateString()}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
          
          <div className="flex gap-4 mb-8">
            <Button asChild>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View Code
              </a>
            </Button>
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
            <p className="text-xl leading-relaxed text-muted-foreground">{project.intro}</p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Background</h2>
            <p className="text-lg leading-relaxed">{project.background}</p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">The Problem</h2>
            <p className="text-lg leading-relaxed">{project.problem}</p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">The Solution</h2>
            <div className="text-lg leading-relaxed whitespace-pre-line">{project.solution}</div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Impact & Results</h2>
            <p className="text-lg leading-relaxed">{project.impact}</p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Key Takeaways</h2>
            <ul className="space-y-4 text-lg">
              {project.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </div>
  )
}