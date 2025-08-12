import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = 'SELECT COUNT(*) FROM user_admin';
    const result = await pool.query(query);
    const hasAdmin = parseInt(result.rows[0].count) > 0;

    return NextResponse.json({ hasAdmin });
  } catch (error) {
    console.error('Check setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}