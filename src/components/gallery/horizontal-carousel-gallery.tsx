'use client';

import { ArrowLeft, ArrowRight, Github, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

export interface HorizontalCarouselGalleryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  githubUrl?: string;
  technologies: string[];
}

export interface HorizontalCarouselGalleryProps {
  title?: string;
  description?: string;
  items?: HorizontalCarouselGalleryItem[];
  viewAllText?: string;
  viewAllHref?: string;
}

const data = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce solution with real-time inventory, payment integration, and admin dashboard. Built for scalability and performance.',
    href: 'https://demo-ecommerce.example.com',
    githubUrl: 'https://github.com/username/ecommerce-platform',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
  },
  {
    id: 'ai-dashboard',
    title: 'AI Analytics Dashboard',
    description:
      'Machine learning dashboard for data visualization and predictive analytics. Features real-time data processing and custom model training.',
    href: 'https://ai-dashboard.example.com',
    githubUrl: 'https://github.com/username/ai-dashboard',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
  },
  {
    id: 'mobile-fitness-app',
    title: 'Fitness Tracking App',
    description:
      'Cross-platform mobile app for workout tracking, nutrition monitoring, and social fitness challenges. Over 10K active users.',
    href: 'https://fitness-app.example.com',
    githubUrl: 'https://github.com/username/fitness-app',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['React Native', 'Firebase', 'TypeScript', 'Expo'],
  },
  {
    id: 'blockchain-voting',
    title: 'Blockchain Voting System',
    description:
      'Decentralized voting platform ensuring transparency and security. Smart contracts handle vote validation and immutable record keeping.',
    href: 'https://blockchain-voting.example.com',
    githubUrl: 'https://github.com/username/blockchain-voting',
    image:
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['Solidity', 'Web3.js', 'Next.js', 'Ethereum'],
  },
  {
    id: 'real-time-chat',
    title: 'Real-Time Chat Platform',
    description:
      'Scalable messaging platform with end-to-end encryption, file sharing, and video calls. Supports thousands of concurrent users.',
    href: 'https://chat-platform.example.com',
    githubUrl: 'https://github.com/username/chat-platform',
    image:
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['Socket.io', 'Redis', 'MongoDB', 'Express'],
  },
];

const HorizontalCarouselGallery = ({
  title = 'Featured Projects',
  description = 'A showcase of innovative applications and systems built with modern technologies. Each project demonstrates unique solutions to real-world challenges.',
  items = data,
  viewAllText = 'View All Projects',
  viewAllHref = '/projects',
}: HorizontalCarouselGalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on('select', updateSelection);
    return () => {
      carouselApi.off('select', updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className='bg-surface py-32'>
      <div className='container'>
        <div className='mb-8 flex items-end justify-between md:mb-14 lg:mb-16'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-3xl font-medium md:text-4xl lg:text-5xl'>{title}</h2>
            <p className='text-muted-foreground max-w-lg'>{description}</p>
          </div>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              className='text-accent hover:text-accent-foreground hover:bg-accent hidden sm:inline-flex'
              asChild
            >
              <a href={viewAllHref}>
                {viewAllText}
                <ArrowRight className='ml-2 size-4' />
              </a>
            </Button>
            <div className='hidden shrink-0 gap-2 md:flex'>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                  carouselApi?.scrollPrev();
                }}
                disabled={!canScrollPrev}
                className='disabled:pointer-events-auto'
              >
                <ArrowLeft className='size-5' />
              </Button>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                  carouselApi?.scrollNext();
                }}
                disabled={!canScrollNext}
                className='disabled:pointer-events-auto'
              >
                <ArrowRight className='size-5' />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className='ml-0 2xl:mr-[max(0rem,calc(50vw-700px))] 2xl:ml-[max(8rem,calc(50vw-700px))]'>
            {items.map((item) => (
              <CarouselItem key={item.id} className='max-w-[320px] pl-[20px] lg:max-w-[360px]'>
                <div className='group cursor-pointer rounded-xl'>
                  <div className='group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-2xl md:aspect-5/4 lg:aspect-16/9'>
                    <img
                      src={item.image}
                      alt={item.title}
                      className='absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                    <div className='absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-white md:p-8'>
                      <div className='mb-3 flex flex-wrap gap-2'>
                        {item.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className='rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm'
                          >
                            {tech}
                          </span>
                        ))}
                        {item.technologies.length > 3 && (
                          <span className='rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm'>
                            +{item.technologies.length - 3}
                          </span>
                        )}
                      </div>
                      <div className='mb-2 pt-2 text-xl font-semibold md:mb-3 md:pt-2 lg:pt-2'>
                        {item.title}
                      </div>
                      <div className='mb-6 line-clamp-2 text-sm opacity-90 md:mb-8 lg:mb-6'>
                        {item.description}
                      </div>
                      <div className='flex gap-3'>
                        <a
                          href={item.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20'
                        >
                          View Project
                          <ExternalLink className='size-4' />
                        </a>
                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/20'
                          >
                            <Github className='size-4' />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export { HorizontalCarouselGallery };
