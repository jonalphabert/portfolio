import { RecentPosts } from '@/components/admin/dashboard/recent-posts';
import { QuickActions } from '@/components/admin/dashboard/quick-actions';
import PostOverview from '@/components/admin/dashboard/post-overview';
import SubscriberOverview from '@/components/admin/dashboard/subscriber-overview';
import { RecentSubs } from '@/components/admin/dashboard/recent-subs';
import { Metadata } from 'next';
import { BlogPost, PostStat, Subscriber, SubscriberStat } from '@/types';

interface DashboardData {
  posts: BlogPost[];
  subscribers: Subscriber[];
  postStat: PostStat;
  subscriberStat: SubscriberStat;
}

async function getBlogPost(): Promise<DashboardData | null > {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/dashboard`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();

    const recentPost = data.posts.posts || [];
    const recentSubscriber = data.subscribers.subsriber || [];
    const postStat = data.postStat;
    const subscriberStat = data.subscriberStat;

    return {
      posts: recentPost,
      subscribers: recentSubscriber,
      postStat,
      subscriberStat
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Admin Dashboard | Portfolio Website`,
    description: 'Admin Dashboard for Portfolio Website',
    openGraph: {
      title: `Admin Dashboard | Portfolio Website`,
    description: 'Admin Dashboard for Portfolio Website',
    },
    twitter: {
      title: `Admin Dashboard | Portfolio Website`,
    description: 'Admin Dashboard for Portfolio Website',
    },
  };
}

export default async function AdminDashboard() {
  const dashboardData = await getBlogPost();

  if(!dashboardData) {
    return (
      <div className='space-y-6 p-6'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>Blog Management Dashboard</h1>
          <p className='text-muted-foreground'>
            Welcome back! Here&apos;s what&apos;s happening with your blog.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>Blog Management Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome back! Here&apos;s what&apos;s happening with your blog.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />


      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Post Section */}
        <div className='lg:col-span-2 grid grid-cols-1 gap-6'>
          <PostOverview postStat={dashboardData.postStat}/>
          <RecentPosts posts={dashboardData.posts}/>
        </div>
        <div className='grid grid-cols-1 gap-6'>
          <SubscriberOverview subscriberStat={dashboardData.subscriberStat}/>
          <RecentSubs subscribers={dashboardData.subscribers}/>
        </div>
      </div>

    </div>
  );
}
