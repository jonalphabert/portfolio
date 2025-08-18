import pool from '@/lib/db';

export class ContactService {
  static async createContact(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const query = `
      INSERT INTO contact_message (
        contact_name, 
        contact_email, 
        contact_subject, 
        contact_content,
        contact_created_at
      ) VALUES ($1, $2, $3, $4, NOW())
      RETURNING contact_id
    `;

    const result = await pool.query(query, [
      data.name,
      data.email,
      data.subject,
      data.message
    ]);

    return result.rows[0];
  }

  static async verifyRecaptcha(token: string): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return false;
    }

    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      });

      const data = await response.json();
      console.log('ReCAPTCHA verification result:', data);
      return data.success; // Score threshold for v3
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }
}