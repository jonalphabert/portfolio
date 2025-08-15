import { Github, Linkedin, Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from '@/components/forms/contact-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Portfolio',
  description: 'Get in touch with me for project collaborations, job opportunities, or just to say hello. Let\'s connect and build something amazing together.',
  openGraph: {
    title: 'Contact | Portfolio',
    description: 'Get in touch with me for project collaborations, job opportunities, or just to say hello. Let\'s connect and build something amazing together.',
  },
};

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/developer',
    color: 'hover:text-gray-900',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/in/developer',
    color: 'hover:text-blue-600',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/developer',
    color: 'hover:text-pink-600',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@developer',
    color: 'hover:text-red-600',
  },
  {
    name: 'TikTok',
    icon: FaTiktok,
    url: 'https://tiktok.com/@developer',
    color: 'hover:text-black',
  },
];

export default function ContactPage() {
  return (
    <div className='min-h-screen py-20'>
      <div className='container mx-auto max-w-6xl px-4'>
        <div className='mb-16 text-center'>
          <h1 className='mb-6 text-4xl font-bold md:text-6xl'>Get In Touch</h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            Have a project in mind or just want to chat? I&apos;d love to hear from you. Let&apos;s connect
            and build something amazing together.
          </p>
        </div>

        <div className='grid grid-cols-1 items-start gap-12 lg:grid-cols-2'>
          <div className='space-y-8'>
            <div>
              <h2 className='mb-6 text-2xl font-bold'>Let&apos;s Connect</h2>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <Mail className='text-primary h-6 w-6' />
                  <div>
                    <p className='font-medium'>Email</p>
                    <a
                      href='mailto:hello@developer.com'
                      className='text-muted-foreground hover:text-foreground'
                    >
                      hello@developer.com
                    </a>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <MapPin className='text-primary h-6 w-6' />
                  <div>
                    <p className='font-medium'>Location</p>
                    <p className='text-muted-foreground'>San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-6 text-xl font-semibold'>Follow Me</h3>
              <div className='flex gap-4'>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`bg-muted text-muted-foreground rounded-full p-3 transition-colors ${social.color} hover:bg-background hover:border-border border`}
                    aria-label={social.name}
                  >
                    <social.icon className='h-6 w-6' />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Card>
            <CardContent className='p-8'>
              <h2 className='mb-6 text-2xl font-bold'>Send a Message</h2>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
