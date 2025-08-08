import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  status: 'published' | 'draft';
  views: number;
  createdAt: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications',
    status: 'published',
    views: 1250,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Modern CSS Techniques',
    status: 'draft',
    views: 0,
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'TypeScript Best Practices',
    status: 'published',
    views: 890,
    createdAt: '2024-01-13',
  },
];

export function RecentPosts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {mockPosts.map((post) => (
            <div key={post.id} className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex-1'>
                <h4 className='font-medium'>{post.title}</h4>
                <div className='mt-1 flex items-center gap-2'>
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status}
                  </Badge>
                  <span className='text-muted-foreground text-sm'>{post.views} views</span>
                  <span className='text-muted-foreground text-sm'>{post.createdAt}</span>
                </div>
              </div>
              <div className='flex gap-1'>
                <Button variant='ghost' size='sm' className='cursor-pointer'>
                  <Eye className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='sm' className='cursor-pointer'>
                  <Edit className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='sm' className='cursor-pointer'>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
