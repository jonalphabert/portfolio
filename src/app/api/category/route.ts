import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/services/categoryService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '5')
    };

    const categories = await CategoryService.getCategories(filters);
    
    return NextResponse.json({ categories });
  } catch (error: unknown) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const slug = CategoryService.generateSlug(name);
    
    const category = await CategoryService.createCategory({
      name,
      slug,
      description
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}