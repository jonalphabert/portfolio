'use client';

import React from 'react';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CardContactForm = () => {
  return (
    <section className='bg-background py-32'>
      <div className='container'>
        <Card className='bg-muted w-full rounded-4xl border-none'>
          <CardContent className='relative overflow-hidden py-12 lg:px-18 lg:py-24'>
            <div className='grid grid-cols-1 items-end gap-8 md:grid-cols-2'>
              <div className='flex flex-col justify-center space-y-6'>
                <p className='text-muted-foreground text-sm font-semibold tracking-tight'>
                  DEVELOPER PORTFOLIO
                </p>
                <div className='bg-foreground relative flex size-30 items-center justify-center rounded-3xl p-2.5 shadow-xl'>
                  <div className='bg-background flex size-full items-center justify-center rounded-2xl p-4'>
                    <Avatar className='size-full'>
                      <AvatarImage
                        src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        alt='Developer headshot'
                        className='object-cover'
                      />
                      <AvatarFallback>DEV</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <h1 className='text-foreground text-5xl font-bold tracking-tighter'>
                  Let&apos;s work together
                </h1>

                <ul className='max-w-lg space-y-3 tracking-tight'>
                  <li className='block items-center md:flex'>
                    <span className='flex'>
                      <Mail className='text-accent mr-3 h-5 w-5' />
                      <span className='mr-2 font-bold'>Email:</span>
                    </span>
                    <span className='text-foreground/80 underline'>hello@developer.com</span>
                  </li>
                  <li className='block items-center md:flex'>
                    <span className='flex'>
                      <Linkedin className='text-accent mr-3 h-5 w-5' />
                      <span className='mr-2 font-bold'>LinkedIn:</span>
                    </span>
                    <span className='text-foreground/80 underline'>/in/developer</span>
                  </li>
                  <li className='block items-center md:flex'>
                    <span className='flex'>
                      <Github className='text-accent mr-3 h-5 w-5' />
                      <span className='mr-2 font-bold'>GitHub:</span>
                    </span>
                    <span className='text-foreground/80 underline'>github.com/developer</span>
                  </li>
                  <li className='block items-center md:flex'>
                    <span className='flex'>
                      <MapPin className='text-accent mr-3 h-5 w-5' />
                      <span className='mr-2 font-bold'>Location:</span>
                    </span>
                    <span className='text-foreground/80'>San Francisco, CA</span>
                  </li>
                </ul>
                <p className='text-muted-foreground leading-relaxed'>
                  I&apos;m always open to discussing new opportunities, interesting projects, and
                  potential collaborations. Let&apos;s connect and build something amazing together.
                </p>
              </div>
              <div className='mt-6 flex h-auto flex-col gap-2 space-y-3 md:pl-3'>
                <Input placeholder='Name' className='bg-background p-6' />
                <Input placeholder='Email' className='bg-background p-6' />
                <Input placeholder='Subject' className='bg-background p-6' />
                <textarea
                  placeholder='Message'
                  className='bg-background border-input min-h-32 resize-y rounded-md border p-6'
                />

                <Button className='h-10 w-fit cursor-pointer'>Send Message</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export { CardContactForm };
