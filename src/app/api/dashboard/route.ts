import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/services/postService';
import { SubscriberService } from '@/services/subscriberService';

export async function GET(req: NextRequest) {
    try{
        const resultRecentPost = PostService.getPosts({limit: 5, sort: 'latest'});
        const resultSubscriber = SubscriberService.getActiveSubscribers();
        const resultPostStat = PostService.getPostStats();
        const resultSubscriberStat = SubscriberService.getSubscriberStats();

        const [posts, subscribers, postStat, subscriberStat] = await Promise.all([resultRecentPost, resultSubscriber, resultPostStat, resultSubscriberStat]);
        return NextResponse.json({posts, subscribers, postStat, subscriberStat});
    } catch (error: unknown) {
        console.error('Get dashboard error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}