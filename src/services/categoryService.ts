import pool from '@/lib/db';

export interface Category {
  category_id: string;
  category_name: string;
  category_slug: string;
  category_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryFilters {
  search?: string;
  limit?: number;
}

export class CategoryService {
  static async getCategories(filters: CategoryFilters = {}) {
    const { search, limit = 5 } = filters;

    let query = `
      SELECT category_id, category_name, category_slug, category_description, created_at, updated_at
      FROM category 
      WHERE deleted_at IS NULL
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND category_name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY category_name ASC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async createCategory(data: CreateCategoryData) {
    const query = `
      INSERT INTO category (category_name, category_slug, category_description)
      VALUES ($1, $2, $3)
      RETURNING category_id, category_name, category_slug, category_description, created_at
    `;

    const result = await pool.query(query, [
      data.name,
      data.slug,
      data.description || null
    ]);

    return result.rows[0];
  }

  static generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}