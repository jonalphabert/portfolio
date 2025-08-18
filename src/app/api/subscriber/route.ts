import { NextRequest, NextResponse } from 'next/server';
import { SubscriberService } from '@/services/subscriberService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const [stats, subscribersData] = await Promise.all([
      SubscriberService.getSubscriberStats(),
      SubscriberService.getActiveSubscribers(page, limit)
    ]);

    return NextResponse.json({
      stats,
      subscribers: subscribersData.subscribers,
      total: subscribersData.total,
      pagination: {
        page,
        limit,
        total: subscribersData.total,
        totalPages: Math.ceil(subscribersData.total / limit)
      }
    });
  } catch (error: unknown) {
    console.error('Get subscribers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}