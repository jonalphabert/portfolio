import pool from '@/lib/db';

export class SubscriberService {
  static async getSubscriberStats() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Get new subscribers in last month
    const newSubscribersQuery = `
      SELECT COUNT(*) as count
      FROM subscription 
      WHERE subscription_created_at >= $1 AND subscription_deleted_at IS NULL
    `;
    const newSubscribersResult = await pool.query(newSubscribersQuery, [oneMonthAgo]);

    // Get unsubscribed in last month
    const unsubscribedQuery = `
      SELECT COUNT(*) as count
      FROM subscription 
      WHERE subscription_deleted_at >= $1
    `;
    const unsubscribedResult = await pool.query(unsubscribedQuery, [oneMonthAgo]);

    // Get total active subscribers
    const activeSubscribersQuery = `
      SELECT COUNT(*) as count
      FROM subscription 
      WHERE subscription_deleted_at IS NULL
    `;
    const activeSubscribersResult = await pool.query(activeSubscribersQuery);

    return {
      newSubscribers: parseInt(newSubscribersResult.rows[0].count),
      unsubscribed: parseInt(unsubscribedResult.rows[0].count),
      activeSubscribers: parseInt(activeSubscribersResult.rows[0].count)
    };
  }

  static async getActiveSubscribers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        subscription_id,
        subscription_name,
        subscription_email,
        subscription_created_at,
        subscription_updated_at
      FROM subscription 
      WHERE subscription_deleted_at IS NULL
      ORDER BY subscription_created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM subscription 
      WHERE subscription_deleted_at IS NULL
    `;

    const [result, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery)
    ]);

    return {
      subscribers: result.rows,
      total: parseInt(countResult.rows[0].total)
    };
  }

  static async createSubscriber({name, email}: {name: string, email: string}) {
    const query = `
      INSERT INTO subscription (
        subscription_name, 
        subscription_email, 
        subscription_created_at
      ) VALUES ($1, $2, NOW())
      RETURNING subscription_id
    `;

    const result = await pool.query(query, [name, email])

    return result.rows[0];
  }
}