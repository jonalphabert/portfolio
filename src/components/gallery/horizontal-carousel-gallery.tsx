'use client';

import { ArrowLeft, ArrowRight, Github, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { CarouselApi } from '@/components/ui/carousel';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Link from 'next/link';
import Image from 'next/image';

export interface HorizontalCarouselGalleryItem {
  id: string;
  title: string;
  slug: string;
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



const HorizontalCarouselGallery = ({
  title = 'Featured Projects',
  description = 'A showcase of innovative applications and systems built with modern technologies. Each project demonstrates unique solutions to real-world challenges.',
  items,
  viewAllText = 'View All Projects',
  viewAllHref = '/projects',
}: HorizontalCarouselGalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projects, setProjects] = useState<HorizontalCarouselGalleryItem[]>(items || []);
  const [loading, setLoading] = useState(!items);

  useEffect(() => {
    if (!items) {
      fetchFeaturedProjects();
    }
  }, [items]);

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/guest/project?featured=true&limit=5');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <CarouselItem key={i} className='max-w-[320px] pl-[20px] lg:max-w-[360px]'>
                  <div className='group cursor-pointer rounded-xl'>
                    <div className='group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-2xl md:aspect-5/4 lg:aspect-16/9 bg-muted animate-pulse'>
                      <div className='absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-white md:p-8'>
                        <div className='mb-3 flex flex-wrap gap-2'>
                          <div className='h-6 w-16 bg-white/20 rounded-full animate-pulse' />
                          <div className='h-6 w-20 bg-white/20 rounded-full animate-pulse' />
                        </div>
                        <div className='mb-2 pt-2 h-6 w-3/4 bg-white/20 rounded animate-pulse' />
                        <div className='mb-6 h-4 w-full bg-white/20 rounded animate-pulse' />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : (
              projects.map((item) => (
              <CarouselItem key={item.id} className='max-w-[320px] pl-[20px] lg:max-w-[360px]'>
                <div className='group cursor-pointer rounded-xl'>
                  <div className='group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-2xl md:aspect-5/4 lg:aspect-16/9'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={480}
                      height={320}
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
                        <Link
                          href={`/projects/${item.slug}`}
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20'
                        >
                          <ExternalLink className='size-4' />
                          View Project
                        </Link>
                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20'
                          >
                            <Github className='size-4' />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export { HorizontalCarouselGallery };
