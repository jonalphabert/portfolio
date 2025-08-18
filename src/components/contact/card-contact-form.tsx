'use client';

import React, { useState } from 'react';
import { Github, Linkedin, Mail, MapPin, Loader2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Recaptcha } from '@/components/forms/recaptcha';
import { toast } from 'sonner';
import { stat } from 'fs';
import Link from 'next/link';

const CardContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // honeypot field
  });
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '', website: formData.website });
        setRecaptchaToken('');
        toast.success('Message sent successfully!');
      } else {
        toast.error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                    <Link className='md:flex text-foreground' href='https://www.linkedin.com/in/johnforjc/'>
                      <span className='flex'>
                        <Linkedin className='text-accent mr-3 h-5 w-5' />
                        <span className='mr-2 font-bold'>LinkedIn:</span>
                      </span>
                      <span className='text-foreground/80 underline'>/in/johnforjc/</span>
                    </Link>
                  </li>
                  <li className='block items-center md:flex'>
                    <Link className='md:flex text-foreground' href='https://github.com/jonalphabert'>
                      <span className='flex'>
                        <Github className='text-accent mr-3 h-5 w-5' />
                        <span className='mr-2 font-bold'>GitHub:</span>
                      </span>
                      <span className='text-foreground/80 underline'>jonalphabert</span>
                    </Link>
                  </li>
                  <li className='block items-center md:flex'>
                    <span className='flex'>
                      <MapPin className='text-accent mr-3 h-5 w-5' />
                      <span className='mr-2 font-bold'>Location:</span>
                    </span>
                    <span className='text-foreground/80'>Surabaya. ID</span>
                  </li>
                </ul>
                <p className='text-muted-foreground leading-relaxed'>
                  I&apos;m always open to discussing new opportunities, interesting projects, and
                  potential collaborations. Let&apos;s connect and build something amazing together.
                </p>
              </div>
              <form onSubmit={handleSubmit} className='mt-6 flex h-auto flex-col gap-2 space-y-3 md:pl-3'>
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Name' 
                  className='bg-background p-6'
                  disabled={isLoading}
                  required
                />
                <Input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Email' 
                  className='bg-background p-6'
                  disabled={isLoading}
                  required
                />
                <Input 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder='Subject' 
                  className='bg-background p-6'
                  disabled={isLoading}
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder='Message'
                  className='bg-background border-input min-h-32 resize-y rounded-md border p-6'
                  disabled={isLoading}
                  required
                />
                
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />
                
                <div className='flex justify-start py-2'>
                  <Recaptcha
                    onVerify={handleRecaptchaVerify}
                    onExpire={() => setRecaptchaToken('')}
                  />
                </div>

                <Button 
                  type="submit"
                  className='h-10 w-fit cursor-pointer'
                  disabled={isLoading || !recaptchaToken}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Message
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export { CardContactForm };
