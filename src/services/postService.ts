import pool from '@/lib/db';
import { PostFilters, CreatePostData, UpdatePostData, SQLParam, Category } from '@/types';

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

export class PostService {
  static async getPosts(filters: PostFilters = {}) {
    const { category, status, search, sort = 'latest', page = 1, limit = 10 } = filters;
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

    const params: SQLParam[] = [];
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

    if (search) {
      query += ` AND (b.blog_title ILIKE $${paramIndex} OR b.blog_content ILIKE $${paramIndex} OR b.blog_description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` GROUP BY b.blog_id, u.username, u.email, i.image_id, i.image_path, i.image_alt`;

    // Add sorting
    switch (sort) {
      case 'oldest':
        query += ` ORDER BY b.created_at ASC`;
        break;
      case 'popular':
        query += ` ORDER BY b.blog_views DESC`;
        break;
      case 'latest':
      default:
        query += ` ORDER BY b.created_at DESC`;
        break;
    }

    // Get total count with separate simpler query
    let countQuery = `
      SELECT COUNT(DISTINCT b.blog_id) as total
      FROM blog b
      JOIN user_admin u ON b.blog_user_id = u.user_id
      LEFT JOIN blog_category bc ON b.blog_id = bc.blog_id
      LEFT JOIN category c ON bc.category_id = c.category_id AND c.deleted_at IS NULL
      WHERE b.deleted_at IS NULL
    `;
    
    const countParams: SQLParam[] = [];
    let countParamIndex = 1;
    
    if (status) {
      countQuery += ` AND b.blog_status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    if (category) {
      countQuery += ` AND EXISTS (
        SELECT 1 FROM blog_category bc2 
        JOIN category c2 ON bc2.category_id = c2.category_id 
        WHERE bc2.blog_id = b.blog_id AND c2.category_slug = $${countParamIndex}
      )`;
      countParams.push(category);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (b.blog_title ILIKE $${countParamIndex} OR b.blog_content ILIKE $${countParamIndex} OR b.blog_description ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const posts = result.rows.map(this.mapRowToPost);

    return { posts, total };
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
      SET blog_status = $1::VARCHAR, 
          published_at = CASE WHEN $1::VARCHAR = 'published' THEN CURRENT_TIMESTAMP ELSE published_at END,
          updated_at = CURRENT_TIMESTAMP
      WHERE blog_slug = $2::VARCHAR AND deleted_at IS NULL
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

  static async getRelatedPosts(currentSlug: string, limit: number = 3) {
    const query = `
      WITH current_post AS (
        SELECT 
          ARRAY_AGG(DISTINCT bc.category_id) FILTER (WHERE bc.category_id IS NOT NULL) AS category_ids,
          b.blog_tags
        FROM blog b
        LEFT JOIN blog_category bc ON b.blog_id = bc.blog_id
        WHERE b.blog_slug = $1 AND b.deleted_at IS NULL
        GROUP BY b.blog_id, b.blog_tags
      ),
      blog_with_categories AS (
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
          ) AS categories,
          ARRAY_AGG(DISTINCT bc2.category_id) FILTER (WHERE bc2.category_id IS NOT NULL) AS all_category_ids
        FROM blog b
        JOIN user_admin u ON b.blog_user_id = u.user_id
        LEFT JOIN image_uploaded i ON b.thumbnail_id = i.image_id
        LEFT JOIN blog_category bc2 ON b.blog_id = bc2.blog_id
        LEFT JOIN category c ON bc2.category_id = c.category_id AND c.deleted_at IS NULL
        WHERE b.blog_slug != $1 
          AND b.blog_status = 'published' 
          AND b.deleted_at IS NULL
        GROUP BY b.blog_id, u.username, u.email, i.image_id, i.image_path, i.image_alt
      ),
      ranking_calc AS (
        SELECT 
          bwc.*,
          (
            -- Category matching
            COALESCE(cat_match.match_count * 3, 0) +
            -- Tag matching
            COALESCE(tag_match.match_count, 0)
          ) AS ranking
        FROM blog_with_categories bwc
        CROSS JOIN current_post cp
        LEFT JOIN LATERAL (
          SELECT COUNT(*) AS match_count
          FROM unnest(bwc.all_category_ids) AS post_cat
          WHERE post_cat = ANY(cp.category_ids)
        ) AS cat_match ON TRUE
        LEFT JOIN LATERAL (
          SELECT COUNT(*) AS match_count
          FROM unnest(bwc.blog_tags) AS post_tag
          WHERE post_tag = ANY(cp.blog_tags)
        ) AS tag_match ON TRUE
      )
      SELECT *
      FROM ranking_calc
      ORDER BY ranking DESC, created_at DESC
      LIMIT $2;
    `;

    const result = await pool.query(query, [currentSlug, limit]);
    return result.rows.map(this.mapRowToPost);
  }

  static async incrementViews(slug: string) {
    const query = `
      UPDATE blog 
      SET blog_views = blog_views + 1, updated_at = CURRENT_TIMESTAMP
      WHERE blog_slug = $1 AND deleted_at IS NULL
      RETURNING blog_views
    `;

    const result = await pool.query(query, [slug]);
    return result.rows[0]?.blog_views || 0;
  }

  static async getPostStats() {
    // Get total post
    const getTotalPost = `
      SELECT COUNT(*) as count
      FROM blog 
      WHERE deleted_at IS NULL
    `;
    const getTotalPostResult = await pool.query(getTotalPost);

    // Get total post
    const getPublishedTotalPost = `
      SELECT COUNT(*) as count
      FROM blog 
      WHERE deleted_at IS NULL AND blog_status = 'published'
    `;
    const getPublishedPostResult = await pool.query(getPublishedTotalPost);

    // Get total post
    const getDraftTotalPost = `
      SELECT COUNT(*) as count
      FROM blog 
      WHERE deleted_at IS NULL AND blog_status = 'draft'
    `;
    const getDraftPostResult = await pool.query(getDraftTotalPost);

    // Get total view post
    const getTotalViewsPost = `
      SELECT SUM(blog_views) as count
      FROM blog 
      WHERE deleted_at IS NULL
    `;
    const getTotalViewsPostResult = await pool.query(getTotalViewsPost);

    return {
      totalPost: parseInt(getTotalPostResult.rows[0].count),
      publishedPost: parseInt(getPublishedPostResult.rows[0].count),
      draftPost: parseInt(getDraftPostResult.rows[0].count),
      totalViews: parseInt(getTotalViewsPostResult.rows[0].count)
    };
  }

  private static mapRowToPost(row: PostQuery): Post {
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

interface PostQuery{
  blog_id: string;
  blog_title: string;
  blog_slug: string;
  blog_content: string;
  blog_description: string;
  blog_tags: string[];
  blog_status: 'draft' | 'published' | 'archived';
  blog_views: number;
  blog_likes: number;
  created_at: string;
  published_at: string | null;
  updated_at: string;
  username: string;
  email: string;
  categories: Category[];
  image_id: string;
  image_path: string;
  image_alt: string;
}