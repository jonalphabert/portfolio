import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check if admin exists first
    const checkQuery = 'SELECT COUNT(*) FROM user_admin';
    const checkResult = await pool.query(checkQuery);
    
    if (parseInt(checkResult.rows[0].count) === 0) {
      return NextResponse.json(
        { error: 'No admin found. Please setup first.' },
        { status: 404 }
      );
    }

    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      );
    }

    const query = `
      SELECT user_id, username, email, password 
      FROM user_admin 
      WHERE username = $1 OR email = $1
    `;
    
    const result = await pool.query(query, [usernameOrEmail]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { 
        userId: user.user_id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}