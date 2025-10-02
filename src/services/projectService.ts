import pool from '@/lib/db';
import { ProjectFilters, CreateProjectData, UpdateProjectData, Project, SQLParam } from '@/types';

interface ProjectQuery {
  project_id: string;
  project_title: string;
  project_description: string;
  project_slug: string;
  project_content: string;
  project_tech_stacks: string[];
  project_user_id: string;
  project_url: string;
  project_github: string;
  project_thumbnail: string;
  project_status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  created_at: string;
  published_at: string;
  updated_at: string;
  username: string;
  email: string;
  image_id?: string | undefined;
  image_path?: string | undefined;
  image_alt?: string | undefined;
}

export class ProjectService {
  static mapRowToProject(row: ProjectQuery): Project {
    return {
      project_id: row.project_id,
      project_title: row.project_title,
      project_description: row.project_description,
      project_slug: row.project_slug,
      project_content: row.project_content,
      project_tech_stacks: row.project_tech_stacks || [],
      project_user_id: row.project_user_id,
      project_url: row.project_url,
      project_github: row.project_github,
      project_thumbnail: row.project_thumbnail,
      project_status: row.project_status,
      project_views: 0,
      is_featured: row.is_featured || false,
      created_at: row.created_at,
      published_at: row.published_at,
      updated_at: row.updated_at,
      author: {
        username: row.username,
        email: row.email,
      },
      thumbnail: row.image_id ? {
        image_id: row.image_id,
        image_path: row.image_path || '',
        image_alt: row.image_alt || '',
      } : undefined,
    };
  }

  static async getProjects(filters: ProjectFilters = {}) {
    const { status, search, sort = 'latest', page = 1, limit = 10, featured } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.project_id, p.project_title, p.project_description, p.project_slug, p.project_content,
        p.project_tech_stacks, p.project_user_id, p.project_url, p.project_github, p.project_thumbnail,
        p.project_status, p.is_featured, p.created_at, p.published_at, p.updated_at,
        u.username, u.email,
        i.image_id, i.image_path, i.image_alt
      FROM project p
      JOIN user_admin u ON p.project_user_id = u.user_id
      LEFT JOIN image_uploaded i ON p.project_thumbnail::UUID = i.image_id
      WHERE p.deleted_at IS NULL
    `;

    const params: SQLParam[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND p.project_status = $${paramIndex}::VARCHAR`;
      params.push(status);
      paramIndex++;
    }

    if (featured !== undefined) {
      query += ` AND p.is_featured = $${paramIndex}::BOOLEAN`;
      params.push(featured);
      paramIndex++;
    }

    if (search) {
      query += ` AND (p.project_title ILIKE $${paramIndex} OR p.project_description ILIKE $${paramIndex} OR p.project_content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add sorting
    switch (sort) {
      case 'oldest':
        query += ` ORDER BY p.created_at ASC`;
        break;
      case 'popular':
        query += ` ORDER BY p.created_at DESC`;
        break;
      case 'latest':
      default:
        query += ` ORDER BY p.created_at DESC`;
        break;
    }

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT p.project_id) as total
      FROM project p
      JOIN user_admin u ON p.project_user_id = u.user_id
      WHERE p.deleted_at IS NULL
    `;
    
    const countParams: SQLParam[] = [];
    let countParamIndex = 1;
    
    if (status) {
      countQuery += ` AND p.project_status = $${countParamIndex}::VARCHAR`;
      countParams.push(status);
      countParamIndex++;
    }

    if (featured !== undefined) {
      countQuery += ` AND p.is_featured = $${countParamIndex}::BOOLEAN`;
      countParams.push(featured);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (p.project_title ILIKE $${countParamIndex} OR p.project_description ILIKE $${countParamIndex} OR p.project_content ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const projects = result.rows.map(this.mapRowToProject);

    return { projects, total };
  }

  static async getProjectBySlug(slug: string) {
    const query = `
      SELECT 
        p.project_id, p.project_title, p.project_description, p.project_slug, p.project_content,
        p.project_tech_stacks, p.project_user_id, p.project_url, p.project_github, p.project_thumbnail,
        p.project_status, p.is_featured, p.created_at, p.published_at, p.updated_at,
        u.username, u.email,
        i.image_id, i.image_path, i.image_alt
      FROM project p
      JOIN user_admin u ON p.project_user_id = u.user_id
      LEFT JOIN image_uploaded i ON p.project_thumbnail::UUID = i.image_id
      WHERE p.project_slug = $1 AND p.deleted_at IS NULL
    `;

    const result = await pool.query(query, [slug]);
    return result.rows.length > 0 ? this.mapRowToProject(result.rows[0]) : null;
  }

  static async createProject(data: CreateProjectData) {
    if (data.description && data.description.length > 255) {
      throw new Error('Project description must be 255 characters or less');
    }
    
    const query = `
      INSERT INTO project (
        project_title, project_slug, project_description, project_content, 
        project_tech_stacks, project_user_id, project_url, project_github, project_thumbnail
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING project_id, project_title, project_slug, project_status, created_at
    `;

    const result = await pool.query(query, [
      data.title,
      data.slug,
      data.description,
      data.content,
      data.tech_stacks,
      data.user_id,
      data.project_url,
      data.project_github,
      data.project_thumbnail,
    ]);

    return result.rows[0];
  }

  static async updateProject(slug: string, data: UpdateProjectData) {
    if (data.description && data.description.length > 255) {
      throw new Error('Project description must be 255 characters or less');
    }
    
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.title) {
      fields.push(`project_title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }

    if (data.description) {
      fields.push(`project_description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }

    if (data.content) {
      fields.push(`project_content = $${paramIndex}`);
      values.push(data.content);
      paramIndex++;
    }

    if (data.tech_stacks) {
      fields.push(`project_tech_stacks = $${paramIndex}`);
      values.push(data.tech_stacks);
      paramIndex++;
    }

    if (data.project_url !== undefined) {
      fields.push(`project_url = $${paramIndex}`);
      values.push(data.project_url);
      paramIndex++;
    }

    if (data.project_github !== undefined) {
      fields.push(`project_github = $${paramIndex}`);
      values.push(data.project_github);
      paramIndex++;
    }

    if (data.project_thumbnail !== undefined) {
      fields.push(`project_thumbnail = $${paramIndex}`);
      values.push(data.project_thumbnail);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE project 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE project_slug = $${paramIndex} AND deleted_at IS NULL
      RETURNING project_id, project_title, project_slug, project_status, updated_at
    `;

    values.push(slug);
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async updateProjectStatus(slug: string, status: 'draft' | 'published' | 'archived') {
    const query = `
      UPDATE project 
      SET project_status = $1::VARCHAR, 
          published_at = CASE WHEN $1::VARCHAR = 'published' THEN CURRENT_TIMESTAMP ELSE published_at END,
          updated_at = CURRENT_TIMESTAMP
      WHERE project_slug = $2::VARCHAR AND deleted_at IS NULL
      RETURNING project_id, project_title, project_slug, project_status, published_at, updated_at
    `;

    const result = await pool.query(query, [status, slug]);
    return result.rows[0] || null;
  }

  static async toggleFeatured(slug: string) {
    const query = `
      UPDATE project 
      SET is_featured = NOT is_featured, updated_at = CURRENT_TIMESTAMP
      WHERE project_slug = $1 AND deleted_at IS NULL
      RETURNING project_id, project_title, project_slug, is_featured, updated_at
    `;

    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  static async checkSlugAvailability(slug: string) {
    const query = 'SELECT project_id FROM project WHERE project_slug = $1 AND deleted_at IS NULL';
    const result = await pool.query(query, [slug]);
    return result.rows.length === 0;
  }
}