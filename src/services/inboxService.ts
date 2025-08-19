import pool from '@/lib/db';
import { SQLParam } from '@/types';

interface InboxFilters {
    search?: string;
    page?: number;
    limit?: number;
}

export class InboxService {
    static async getInbox(filters: InboxFilters = {}) {
        const { search, page = 1, limit = 10 } = filters;
        console.log('filters', filters);
        const offset = (page - 1) * limit;

        let query = `
            SELECT 
                contact_id, contact_name, contact_email, contact_subject, contact_content, 
                contact_created_at
            FROM contact_message
            WHERE contact_deleted_at IS NULL
        `;

        let queryCount = `
            SELECT COUNT(*)
            FROM contact_message
            WHERE contact_deleted_at IS NULL
        `;

        const params: SQLParam[] = [];
        const paramsCount: SQLParam[] = [];
        let paramIndex = 1;

        if (search) {
            query += ` AND (contact_name ILIKE $${paramIndex} OR contact_email ILIKE $${paramIndex} OR contact_subject ILIKE $${paramIndex})`;
            queryCount += ` AND (contact_name ILIKE $${paramIndex} OR contact_email ILIKE $${paramIndex} OR contact_subject ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramsCount.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY contact_created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);
        const resultCount = await pool.query(queryCount, paramsCount);

        const total = parseInt(resultCount.rows[0].count);
        const totalPages = Math.ceil(total / limit);

        return { inbox: result.rows, pagination: { page, limit, total, totalPages } };
    }
}