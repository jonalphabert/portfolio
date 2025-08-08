import { Metadata } from 'next';
import Link from 'next/link';
import { Settings, FileText, Users, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio',
  description: 'Admin dashboard for managing portfolio content',
};

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-background min-h-screen'>
      <div className='flex'>
        {/* Sidebar */}
        <aside className='bg-muted min-h-screen w-64 border-r'>
          <div className='p-6'>
            <Link href='/' className='text-xl font-bold'>
              Portfolio Admin
            </Link>
          </div>
          <nav className='px-4'>
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
        </aside>

        {/* Main Content */}
        <main className='h-screen flex-1 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}
