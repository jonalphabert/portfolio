'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, FileText, Users, BarChart3, LogOut, BriefcaseBusiness, Inbox } from 'lucide-react';
import { useAuth } from '@/store/auth';

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Projects', href: '/admin/project', icon: BriefcaseBusiness },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Inbox', href: '/admin/inbox', icon: Inbox },
  { name: 'Subscribers', href: '/admin/subscriber', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className='bg-muted flex min-h-screen w-64 flex-col border-r'>
      <div className='p-6'>
        <Link href='/' className='text-xl font-bold'>
          Portfolio Admin
        </Link>
      </div>
      <nav className='flex-1 px-4'>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className='text-muted-foreground hover:text-foreground hover:bg-background mb-1 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors'
            >
              <Icon className='h-4 w-4' />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className='border-t p-4'>
        <button
          onClick={handleLogout}
          className='text-muted-foreground hover:text-foreground hover:bg-background flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer'
        >
          <LogOut className='h-4 w-4' />
          Logout
        </button>
      </div>
    </aside>
  );
}
