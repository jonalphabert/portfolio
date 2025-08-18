import { NextRequest, NextResponse } from 'next/server';
import { SubscriberService } from '@/services/subscriberService';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    const subscriber = await SubscriberService.createSubscriber({name, email});
    return NextResponse.json(subscriber);
  } catch (error: unknown) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
