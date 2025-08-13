import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '@/services/imageService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '15')
    };

    const images = await ImageService.getImages(filters);
    
    return NextResponse.json({
      images,
      pagination: {
        page: filters.page,
        limit: filters.limit
      }
    });
  } catch (error: unknown) {
    console.error('Get images error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploadType = formData.get('type') as string;

    if (uploadType === 'url') {
      const url = formData.get('url') as string;
      const fileName = formData.get('fileName') as string;
      const alt = formData.get('alt') as string;

      if (!url || !fileName) {
        return NextResponse.json(
          { error: 'URL and fileName are required' },
          { status: 400 }
        );
      }

      const result = await ImageService.uploadFromUrl(url, fileName, alt);
      return NextResponse.json(result, { status: 201 });

    } else if (uploadType === 'file') {
      const file = formData.get('file') as File;
      const alt = formData.get('alt') as string;

      if (!file) {
        return NextResponse.json(
          { error: 'File is required' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name.split('.')[0];
      
      const result = await ImageService.uploadFile(buffer, fileName, file.type, alt);
      return NextResponse.json(result, { status: 201 });

    } else {
      return NextResponse.json(
        { error: 'Invalid upload type. Use "url" or "file"' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Upload image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}