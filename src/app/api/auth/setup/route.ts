import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = 'SELECT COUNT(*) FROM user_admin';
    const result = await pool.query(query);
    const hasAdmin = parseInt(result.rows[0].count) > 0;

    if (hasAdmin) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: 'Setup available' });
  } catch (error) {
    console.error('Setup check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const checkQuery = 'SELECT COUNT(*) FROM user_admin';
    const checkResult = await pool.query(checkQuery);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const insertQuery = `
      INSERT INTO user_admin (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING user_id, username, email
    `;

    const result = await pool.query(insertQuery, [username, email, hashedPassword]);
    const user = result.rows[0];

    return NextResponse.json({
      message: 'Admin setup successful',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }
    
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}