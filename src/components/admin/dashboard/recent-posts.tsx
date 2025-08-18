import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BlogPost } from '@/types';
import { Edit, Eye, Trash2 } from 'lucide-react';

export function RecentPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent post.</TableCaption>
          <TableHeader>
            <TableRow >
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className='font-semibold'>Status</TableHead>
              <TableHead className='font-semibold'>Views</TableHead>
              <TableHead className='font-semibold'>Date</TableHead>
              <TableHead className='font-semibold'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.blog_id}>
                <TableCell className="font-medium">{post.blog_title}</TableCell>
                <TableCell>
                  <Badge
                    variant={post.blog_status === 'published' ? 'default' : 'outline'}
                    className={post.blog_status === 'published' ? '' : 'bg-orange-400 text-white'}
                  >
                    {post.blog_status}
                  </Badge>
                </TableCell>
                <TableCell>{post.blog_views}</TableCell>
                <TableCell>{post.created_at}</TableCell>
                <TableCell>
                  <Button variant='ghost' size='sm' className='cursor-pointer'>
                    <Eye className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='sm' className='cursor-pointer'>
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button variant='ghost' size='sm' className='cursor-pointer'>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
