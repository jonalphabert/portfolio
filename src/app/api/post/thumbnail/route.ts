import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { blog_id, image_id } = await request.json();

    if (!blog_id || !image_id) {
      return NextResponse.json(
        { error: 'blog_id and image_id are required' },
        { status: 400 }
      );
    }

    // Delete existing thumbnail
    await pool.query('DELETE FROM blog_image_thumbnail WHERE blog_id = $1', [blog_id]);

    // Insert new thumbnail
    const query = `
      INSERT INTO blog_image_thumbnail (blog_id, image_id)
      VALUES ($1, $2)
      RETURNING blog_id, image_id
    `;

    const result = await pool.query(query, [blog_id, image_id]);

    return NextResponse.json(result.rows[0]);
  } catch (error: unknown) {
    console.error('Set thumbnail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}