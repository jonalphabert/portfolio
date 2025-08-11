import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Settings, Users } from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    title: 'New Blog Post',
    description: 'Create a new blog post',
    icon: Plus,
    href: '/admin/blog/editor',
    color: 'bg-accent text-accent-foreground',
  },
  {
    title: 'Manage Posts',
    description: 'View and edit existing posts',
    icon: FileText,
    href: '/admin/blog',
    color: 'bg-muted text-muted-foreground',
  },
  {
    title: 'Settings',
    description: 'Configure site settings',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-muted text-muted-foreground',
  },
  {
    title: 'Users',
    description: 'Manage user accounts',
    icon: Users,
    href: '/admin/users',
    color: 'bg-muted text-muted-foreground',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-3'>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant='outline'
                  className='flex h-auto w-full cursor-pointer flex-col items-start gap-2 p-4'
                >
                  <div className={`rounded-lg p-2 ${action.color}`}>
                    <Icon className='h-4 w-4' />
                  </div>
                  <div className='text-left'>
                    <div className='text-sm font-medium'>{action.title}</div>
                    <div className='text-muted-foreground text-xs'>{action.description}</div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
