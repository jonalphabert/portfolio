import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '@/services/contactService';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requests per 15 minutes per IP
    const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000);
    
    if (!rateLimitResult.success) {
      const resetTime = new Date(rateLimitResult.resetTime).toISOString();
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          resetTime 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime
          }
        }
      );
    }

    const { name, email, subject, message, recaptchaToken, website } = await request.json();

    // Honeypot check - if filled, it's likely a bot
    if (website) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      );
    }

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification required' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const isValidRecaptcha = await ContactService.verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to database
    const result = await ContactService.createContact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    return NextResponse.json({
      message: 'Message sent successfully',
      contactId: result.contact_id
    });
  } catch (error: unknown) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}