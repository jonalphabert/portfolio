import { StatsCard } from '@/components/admin/dashboard/stats-card';
import { RecentPosts } from '@/components/admin/dashboard/recent-posts';
import { QuickActions } from '@/components/admin/dashboard/quick-actions';
import { FileText, Edit, Eye, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className='space-y-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome back! Here&apos;s what&apos;s happening with your blog.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Posts'
          value={12}
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
          color='default'
        />
        <StatsCard
          title='Published'
          value={9}
          icon={Eye}
          trend={{ value: 12, isPositive: true }}
          color='success'
        />
        <StatsCard title='Drafts' value={3} icon={Edit} color='warning' />
        <StatsCard
          title='Total Views'
          value={2847}
          icon={TrendingUp}
          trend={{ value: 23, isPositive: true }}
          color='default'
        />
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <RecentPosts />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
