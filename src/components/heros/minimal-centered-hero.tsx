'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { X } from 'lucide-react';

const navigation = [
  { name: 'About', href: '#' },
  { name: 'Projects', href: '#' },
  { name: 'Skills', href: '#' },
  { name: 'Contact', href: '#' },
];

export function MinimalCenteredHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='bg-image-hero-section bg-background'>
      <header className='absolute inset-x-0 top-0 z-50'>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className='lg:hidden'>
          <div className='fixed inset-0 z-50' />
          <DialogPanel
            as='div'
            className='bg-background sm:ring-border fixed inset-y-0 right-0 z-50 w-full overflow-y-auto p-6 sm:max-w-sm sm:ring-1'
          >
            <div className='flex items-center justify-between'>
              <a href='#' className='-m-1.5 p-1.5'>
                <span className='sr-only'>Portfolio</span>
                <img
                  alt=''
                  src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
                  className='h-8 w-auto'
                />
              </a>
              <button
                type='button'
                onClick={() => setMobileMenuOpen(false)}
                className='text-muted-foreground -m-2.5 rounded-md p-2.5'
              >
                <span className='sr-only'>Close menu</span>
                <X aria-hidden='true' className='size-6' />
              </button>
            </div>
            <div className='mt-6 flow-root'>
              <div className='divide-border -my-6 divide-y'>
                <div className='space-y-2 py-6'>
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className='text-foreground hover:bg-surface -mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold'
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className='relative isolate px-6 pt-14 lg:px-8'>
        <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
          <div className='hidden sm:mb-8 sm:flex sm:justify-center'>
            <div className='text-muted-foreground ring-border hover:ring-muted relative rounded-full px-3 py-1 text-sm/6 ring-1'>
              Full Stack Developer{' '}
              <a href='#' className='text-accent font-semibold'>
                <span aria-hidden='true' className='absolute inset-0' />
                View my work <span aria-hidden='true'>&rarr;</span>
              </a>
            </div>
          </div>
          <div className='text-center'>
            <h1 className='text-foreground text-5xl font-semibold tracking-tight text-balance sm:text-7xl'>
              Jonathan Alphabert Sutanto
            </h1>
            <p className='text-muted-foreground mt-8 text-lg font-medium text-pretty sm:text-xl/8'>
              Building digital solutions with modern technologies. I create scalable web
              applications using React, Node.js, and cloud platforms to deliver exceptional user
              experiences.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <a
                href='#'
                className='bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:outline-accent rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2'
              >
                View Projects
              </a>
              <a href='#' className='text-foreground text-sm/6 font-semibold'>
                Download Resume <span aria-hidden='true'>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
