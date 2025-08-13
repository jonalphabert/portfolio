import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { blog_id, category_id } = await request.json();

    if (!blog_id || !category_id) {
      return NextResponse.json(
        { error: 'blog_id and category_id are required' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO blog_category (blog_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT (blog_id, category_id) DO NOTHING
      RETURNING blog_id, category_id
    `;

    const result = await pool.query(query, [blog_id, category_id]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Save blog category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}