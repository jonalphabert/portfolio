'use client';

import { Menu, X, Download } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const NAV_LOGO = {
  url: '/',
  title: 'JONATHAN',
};
const NAV_ITEMS = [
  { name: 'Home', link: '/' },
  { name: 'Projects', link: '/projects' },
  { name: 'Blog', link: '/blog' },
  { name: 'Contact', link: '/contact' },
];

const AnimatedIndicatorNavbar = () => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(() => {
    const currentItem = NAV_ITEMS.find(
      (item) => item.link === pathname || (item.link !== '/' && pathname.startsWith(item.link))
    );
    return currentItem ? currentItem.name : NAV_ITEMS[0].name;
  });

  useEffect(() => {
    const currentItem = NAV_ITEMS.find(
      (item) => item.link === pathname || (item.link !== '/' && pathname.startsWith(item.link))
    );
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [pathname]);

  const indicatorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = document.querySelector(`[data-nav-item="${activeItem}"]`) as HTMLElement;

      if (activeEl && indicatorRef.current && menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const itemRect = activeEl.getBoundingClientRect();

        indicatorRef.current.style.width = `${itemRect.width}px`;
        indicatorRef.current.style.left = `${itemRect.left - menuRect.left}px`;
      }
    };
    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeItem]);

  return (
    <section className='sticky top-0 z-10 bg-white py-4'>
      <nav className='container flex items-center justify-between'>
        {/* Left WordMark */}
        <a href={NAV_LOGO.url} className='flex items-center gap-2'>
          <span className='text-lg font-semibold tracking-tighter'>{NAV_LOGO.title}</span>
        </a>

        <NavigationMenu className='hidden lg:block'>
          <NavigationMenuList
            ref={menuRef}
            className='flex items-center gap-6 rounded-4xl px-8 py-3'
          >
            {NAV_ITEMS.map((item) => (
              <React.Fragment key={item.name}>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    data-nav-item={item.name}
                    onClick={() => setActiveItem(item.name)}
                    href={item.link}
                    className={`hover:text-foreground focus:text-foreground relative cursor-pointer p-0 text-sm font-medium hover:bg-transparent focus:bg-transparent ${
                      activeItem === item.name ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </React.Fragment>
            ))}
            {/* Active Indicator */}
            <div
              ref={indicatorRef}
              className='absolute bottom-2 flex h-1 items-center justify-center px-2 transition-all duration-300'
            >
              <div className='bg-foreground h-0.5 w-full rounded-t-none transition-all duration-300' />
            </div>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Popover */}
        <MobileNav activeItem={activeItem} setActiveItem={setActiveItem} />

        {/* <div className='hidden items-center gap-2 lg:flex'>
          <Button
            variant='outline'
            size='sm'
            className='h-10 cursor-pointer py-2.5 text-sm font-normal'
          >
            <Download className='mr-2 h-4 w-4' />
            Resume
          </Button>
        </div> */}
      </nav>
    </section>
  );
};

export { AnimatedIndicatorNavbar };

const AnimatedHamburger = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className='group relative h-6 w-6'>
      <div className='absolute inset-0'>
        <Menu
          className={`text-muted-foreground group-hover:text-foreground absolute transition-all duration-300 ${
            isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`}
        />
        <X
          className={`text-muted-foreground group-hover:text-foreground absolute transition-all duration-300 ${
            isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
          }`}
        />
      </div>
    </div>
  );
};

const MobileNav = ({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (item: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='block lg:hidden'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <AnimatedHamburger isOpen={isOpen} />
        </PopoverTrigger>

        <PopoverContent
          align='end'
          className='relative -top-4 -left-4 block w-screen max-w-md overflow-hidden rounded-xl p-0 lg:hidden'
        >
          <ul className='bg-background text-foreground w-full py-4'>
            {NAV_ITEMS.map((navItem, idx) => (
              <li key={idx}>
                <a
                  href={navItem.link}
                  onClick={() => setActiveItem(navItem.name)}
                  className={`text-foreground flex items-center border-l-[3px] px-6 py-4 text-sm font-medium transition-all duration-75 ${
                    activeItem === navItem.name
                      ? 'border-foreground text-foreground'
                      : 'text-muted-foreground hover:text-foreground border-transparent'
                  }`}
                >
                  {navItem.name}
                </a>
              </li>
            ))}
            {/* <li className='flex flex-col px-7 py-2'>
              <Button variant='secondary' className='cursor-pointer'>
                <Download className='mr-2 h-4 w-4' />
                Resume
              </Button>
            </li> */}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};
