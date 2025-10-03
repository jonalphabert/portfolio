import { ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';

const MinimalCenteredFooter = () => {
  const navigation = [
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    // { name: 'Resume', href: '/resume' },
  ];

  const social = [
    { name: 'GitHub', href: 'https://github.com/jonalphabert', icon: Github },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/johnforjc/', icon: Linkedin },
    // { name: 'Twitter', href: 'https://twitter.com/yourusername', icon: Twitter },
  ];

  const legal = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Site Credits', href: '#' },
  ];

  return (
    <section className='bg-background flex flex-col items-center gap-14 py-8'>
      <nav className='container flex flex-col items-center gap-4'>
        <ul className='flex flex-wrap items-center justify-center gap-6'>
          {navigation.map((item) => (
            <li key={item.name}>
              <a href={item.href} className='font-medium transition-opacity hover:opacity-75'>
                {item.name}
              </a>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className='flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75'
                target='_blank'
                rel='noopener noreferrer'
              >
                {item.name} <ArrowUpRight className='size-4' />
              </a>
            </li>
          ))}
        </ul>
        <span className='text-muted-foreground text-sm'>Developed by: Jonathan Alphabert</span>
      </nav>
    </section>
  );
};

export { MinimalCenteredFooter };
