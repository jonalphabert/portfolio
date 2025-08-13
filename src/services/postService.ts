import pool from '@/lib/db';

export interface Post {
  blog_id: string;
  blog_title: string;
  blog_slug: string;
  blog_content: string;
  blog_tags: string[];
  blog_status: 'draft' | 'published' | 'archived';
  blog_views: number;
  blog_likes: number;
  blog_description: string;
  created_at: string;
  published_at: string | null;
  updated_at: string;
  author: {
    username: string;
    email: string;
  };
  categories: {
    category_id: string;
    category_name: string;
    category_slug: string;
  }[];
  thumbnail?: {
    image_id: string;
    image_path: string;
    image_alt: string;
  };
}

export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  blog_description: string;
  tags?: string[];
  user_id: string;
  category_ids?: string[];
  thumbnail_image_id?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  blog_description?: string;
  tags?: string[];
  category_ids?: string[];
  thumbnail_image_id?: string;
}

export interface PostFilters {
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  page?: number;
  limit?: number;
}

export class PostService {
  static async getPosts(filters: PostFilters = {}) {
    const { category, status, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        b.blog_id, b.blog_title, b.blog_slug, b.blog_content, b.blog_description, b.blog_tags,
        b.blog_status, b.blog_views, b.blog_likes, b.thumbnail_id, b.created_at, 
        b.published_at, b.updated_at,
        u.username, u.email,
        i.image_id, i.image_path, i.image_alt,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'category_id', c.category_id,
              'category_name', c.category_name,
              'category_slug', c.category_slug
            )
          ) FILTER (WHERE c.category_id IS NOT NULL), 
          '[]'
        ) as categories
      FROM blog b
      JOIN user_admin u ON b.blog_user_id = u.user_id
      LEFT JOIN image_uploaded i ON b.thumbnail_id = i.image_id
      LEFT JOIN blog_category bc ON b.blog_id = bc.blog_id
      LEFT JOIN category c ON bc.category_id = c.category_id AND c.deleted_at IS NULL
      WHERE b.deleted_at IS NULL
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND b.blog_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (category) {
      query += ` AND EXISTS (
        SELECT 1 FROM blog_category bc 
        JOIN category c ON bc.category_id = c.category_id 
        WHERE bc.blog_id = b.blog_id AND c.category_slug = $${paramIndex}
      )`;
      params.push(category);
      paramIndex++;
    }

    query += ` GROUP BY b.blog_id, u.username, u.email, i.image_id, i.image_path, i.image_alt
               ORDER BY b.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows.map(this.mapRowToPost);
  }

  static async getPostBySlug(slug: string) {
    const query = `
      SELECT 
        b.blog_id, b.blog_title, b.blog_slug, b.blog_content, b.blog_description, b.blog_tags,
        b.blog_status, b.blog_views, b.blog_likes, b.thumbnail_id, b.created_at, 
        b.published_at, b.updated_at,
        u.username, u.email,
        i.image_id, i.image_path, i.image_alt,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'category_id', c.category_id,
              'category_name', c.category_name,
              'category_slug', c.category_slug
            )
          ) FILTER (WHERE c.category_id IS NOT NULL), 
          '[]'
        ) as categories
      FROM blog b
      JOIN user_admin u ON b.blog_user_id = u.user_id
      LEFT JOIN image_uploaded i ON b.thumbnail_id = i.image_id
      LEFT JOIN blog_category bc ON b.blog_id = bc.blog_id
      LEFT JOIN category c ON bc.category_id = c.category_id AND c.deleted_at IS NULL
      WHERE b.blog_slug = $1 AND b.deleted_at IS NULL
      GROUP BY b.blog_id, u.username, u.email, i.image_id, i.image_path, i.image_alt
    `;

    const result = await pool.query(query, [slug]);
    return result.rows.length > 0 ? this.mapRowToPost(result.rows[0]) : null;
  }

  static async createPost(data: CreatePostData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert blog post
      const blogQuery = `
        INSERT INTO blog (blog_title, blog_slug, blog_content, blog_description, blog_tags, blog_user_id, blog_status, thumbnail_id)
        VALUES ($1, $2, $3, $4, $5, $6, 'draft', $7)
        RETURNING blog_id, blog_title, blog_slug, blog_content, blog_description, blog_tags, blog_status, thumbnail_id, created_at
      `;
      
      const blogResult = await client.query(blogQuery, [
        data.title,
        data.slug,
        data.content,
        data.blog_description,
        data.tags || [],
        data.user_id,
        data.thumbnail_image_id || null
      ]);
      
      const blog = blogResult.rows[0];
      
      // Insert categories if provided
      if (data.category_ids && data.category_ids.length > 0) {
        for (const categoryId of data.category_ids) {
          await client.query(
            'INSERT INTO blog_category (blog_id, category_id) VALUES ($1, $2)',
            [blog.blog_id, categoryId]
          );
        }
      }
      
      await client.query('COMMIT');
      return blog;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updatePost(slug: string, data: UpdatePostData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const fields = [];
      const params = [];
      let paramIndex = 1;

      if (data.title) {
        fields.push(`blog_title = $${paramIndex}`);
        params.push(data.title);
        paramIndex++;
      }

      if (data.content) {
        fields.push(`blog_content = $${paramIndex}`);
        params.push(data.content);
        paramIndex++;
      }
      
      if (data.blog_description !== undefined) {
        fields.push(`blog_description = $${paramIndex}`);
        params.push(data.blog_description);
        paramIndex++;
      }

      if (data.tags) {
        fields.push(`blog_tags = $${paramIndex}`);
        params.push(data.tags);
        paramIndex++;
      }
      
      if (data.thumbnail_image_id !== undefined) {
        fields.push(`thumbnail_id = $${paramIndex}`);
        params.push(data.thumbnail_image_id);
        paramIndex++;
      }

      if (fields.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const query = `
        UPDATE blog 
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE blog_slug = $${paramIndex} AND deleted_at IS NULL
        RETURNING blog_id, blog_title, blog_slug, blog_status, updated_at
      `;

      params.push(slug);
      const result = await client.query(query, params);
      const blog = result.rows[0];
      
      if (!blog) {
        await client.query('ROLLBACK');
        return null;
      }
      
      // Update categories if provided
      if (data.category_ids) {
        // Delete existing categories
        await client.query('DELETE FROM blog_category WHERE blog_id = $1', [blog.blog_id]);
        
        // Insert new categories
        for (const categoryId of data.category_ids) {
          await client.query(
            'INSERT INTO blog_category (blog_id, category_id) VALUES ($1, $2)',
            [blog.blog_id, categoryId]
          );
        }
      }
      
      await client.query('COMMIT');
      return blog;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updatePostStatus(slug: string, status: 'draft' | 'published' | 'archived') {
    const query = `
      UPDATE blog 
      SET blog_status = $1, 
          published_at = CASE WHEN $1 = 'published' THEN CURRENT_TIMESTAMP ELSE published_at END,
          updated_at = CURRENT_TIMESTAMP
      WHERE blog_slug = $2 AND deleted_at IS NULL
      RETURNING blog_id, blog_title, blog_slug, blog_status, published_at, updated_at
    `;

    const result = await pool.query(query, [status, slug]);
    return result.rows[0] || null;
  }

  static async archivePost(slug: string) {
    return this.updatePostStatus(slug, 'archived');
  }

  static async checkSlugAvailability(slug: string) {
    const query = 'SELECT blog_id FROM blog WHERE blog_slug = $1 AND deleted_at IS NULL';
    const result = await pool.query(query, [slug]);
    return result.rows.length === 0;
  }

  private static mapRowToPost(row: any): Post {
    return {
      blog_id: row.blog_id,
      blog_title: row.blog_title,
      blog_slug: row.blog_slug,
      blog_content: row.blog_content,
      blog_description: row.blog_description || '',
      blog_tags: row.blog_tags || [],
      blog_status: row.blog_status,
      blog_views: row.blog_views,
      blog_likes: row.blog_likes,
      created_at: row.created_at,
      published_at: row.published_at,
      updated_at: row.updated_at,
      author: {
        username: row.username,
        email: row.email
      },
      categories: Array.isArray(row.categories) ? row.categories : [],
      ...(row.image_id && {
        thumbnail: {
          image_id: row.image_id,
          image_path: row.image_path,
          image_alt: row.image_alt
        }
      })
    };
  }
}