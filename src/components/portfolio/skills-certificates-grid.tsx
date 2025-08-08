'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Code2,
  Database,
  Wrench,
  Cloud,
  Award,
  ExternalLink,
  CheckCircle,
  Calendar,
} from 'lucide-react';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface SkillCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: Skill[];
}

interface Certificate {
  name: string;
  issuer: string;
  date: string;
  verified: boolean;
  link?: string;
}

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: Code2,
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'Next.js', level: 'Advanced' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'JavaScript', level: 'Expert' },
      { name: 'HTML/CSS', level: 'Expert' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: Database,
    skills: [
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Python', level: 'Intermediate' },
      { name: 'PostgreSQL', level: 'Advanced' },
      { name: 'MongoDB', level: 'Intermediate' },
      { name: 'GraphQL', level: 'Intermediate' },
      { name: 'REST APIs', level: 'Advanced' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Frameworks',
    icon: Wrench,
    skills: [
      { name: 'Git', level: 'Advanced' },
      { name: 'Docker', level: 'Intermediate' },
      { name: 'Webpack', level: 'Intermediate' },
      { name: 'Jest', level: 'Advanced' },
      { name: 'Prisma', level: 'Advanced' },
      { name: 'Figma', level: 'Intermediate' },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    icon: Cloud,
    skills: [
      { name: 'AWS', level: 'Intermediate' },
      { name: 'Vercel', level: 'Advanced' },
      { name: 'GitHub Actions', level: 'Intermediate' },
      { name: 'Netlify', level: 'Advanced' },
      { name: 'Railway', level: 'Intermediate' },
      { name: 'Supabase', level: 'Advanced' },
    ],
  },
];

const certificates: Certificate[] = [
  {
    name: 'Flutter Masterclass (from Novice to Ninja)',
    issuer: 'Udemy',
    date: '2025',
    verified: true,
    link: 'ude.my/UC-80aae670-a289-44c7-91b9-85cad7867cb8',
  },
  {
    name: 'Google UX Design',
    issuer: 'Coursera',
    date: '2024',
    verified: true,
    link: 'https://coursera.org/share/3df244d96707c37818c9d77f7d88b356',
  },
  {
    name: 'Backend Developement and APIs',
    issuer: 'freeCodeCamp',
    date: '2023',
    verified: true,
    link: 'https://freecodecamp.org/certification/johnforjc_5/back-end-development-and-apis',
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-muted text-muted-foreground';
    case 'Intermediate':
      return 'bg-accent/10 text-accent';
    case 'Advanced':
      return 'bg-success/10 text-success';
    case 'Expert':
      return 'bg-primary text-primary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function SkillsCertificatesGrid() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredCategories =
    activeTab === 'all'
      ? skillCategories
      : skillCategories.filter((category) => category.id === activeTab);

  return (
    <section className='bg-surface py-24'>
      <div className='container max-w-7xl'>
        {/* Header */}
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-4xl font-bold'>Certifications</h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            A comprehensive overview of my technical expertise, tools I work with, and professional
            certifications I&apos;ve earned throughout my journey.
          </p>
        </div>

        {/* Skills Section */}
        {/* <div className='mb-20'>
          <h3 className='mb-8 text-2xl font-bold'>Technical Skills</h3>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-8'>
            <TabsList className='grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='frontend'>Frontend</TabsTrigger>
              <TabsTrigger value='backend'>Backend</TabsTrigger>
              <TabsTrigger value='tools'>Tools</TabsTrigger>
              <TabsTrigger value='cloud'>Cloud</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className='mt-8'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {filteredCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Card
                      key={category.id}
                      className='bg-background border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                    >
                      <CardHeader className='pb-4'>
                        <div className='mb-2 flex items-center gap-3'>
                          <div className='bg-accent/10 rounded-lg p-2'>
                            <IconComponent className='text-accent h-5 w-5' />
                          </div>
                          <CardTitle className='text-lg'>{category.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          {category.skills.map((skill) => (
                            <div key={skill.name} className='flex items-center justify-between'>
                              <span className='text-sm font-medium'>{skill.name}</span>
                              <Badge
                                variant='secondary'
                                className={`text-xs ${getLevelColor(skill.level)}`}
                              >
                                {skill.level}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div> */}

        {/* Certificates Section */}
        <div>
          {/* <div className='mb-8 flex items-center gap-3'>
            <Award className='text-accent h-6 w-6' />
            <h3 className='text-2xl font-bold'>Professional Certifications</h3>
          </div> */}

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {certificates.map((cert, index) => (
              <Card
                key={index}
                className='bg-background border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                <CardHeader className='pb-4'>
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='mb-2 text-lg leading-tight'>{cert.name}</CardTitle>
                      <CardDescription className='text-sm'>{cert.issuer}</CardDescription>
                    </div>
                    {cert.verified && (
                      <CheckCircle className='text-success mt-1 h-5 w-5 flex-shrink-0' />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between'>
                    <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                      <Calendar className='h-4 w-4' />
                      <span>{cert.date}</span>
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        className='text-accent hover:text-accent/80 flex items-center gap-1 text-sm transition-colors'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <span>Verify</span>
                        <ExternalLink className='h-3 w-3' />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
