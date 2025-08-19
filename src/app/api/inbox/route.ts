import { NextRequest, NextResponse } from "next/server";
import { InboxService } from "@/services/inboxService";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
    
        const filters = {
            search: searchParams.get('search') || undefined,
            page: parseInt(searchParams.get('page') || '1'),
            limit: parseInt(searchParams.get('limit') || '10')
        };

        const inbox = await InboxService.getInbox(filters);
        return NextResponse.json(inbox);
    } catch (error: unknown) {
        console.error('Get inbox error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}