import pool from '@/lib/db';
import { SQLParam } from '@/types';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface Image {
  image_id: string;
  image_name: string;
  image_path: string;
  image_size: number;
  image_type: string;
  image_alt: string;
  created_at: string;
  updated_at: string;
}

export interface ImageFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface UploadResult {
  image_id: string;
  image_name: string;
  image_path: string;
  image_size: number;
  image_type: string;
}

export class ImageService {
  static async getImages(filters: ImageFilters = {}) {
    const { search, page = 1, limit = 15 } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT image_id, image_name, image_path, image_size, image_type, 
             image_alt, created_at, updated_at
      FROM image_uploaded 
      WHERE deleted_at IS NULL
    `;

    const params: SQLParam[] = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (image_name ILIKE $${paramIndex} OR image_alt ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async uploadFromUrl(url: string, fileName: string, alt?: string) {
    try {
      // Upload to Cloudinary from URL
      const uploadResult = await cloudinary.uploader.upload(url, {
        folder: 'portfolio',
        public_id: fileName,
        resource_type: 'auto'
      });

      // Save to database
      const query = `
        INSERT INTO image_uploaded (image_name, image_path, image_size, image_type, image_alt)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING image_id, image_name, image_path, image_size, image_type
      `;

      const result = await pool.query(query, [
        fileName,
        uploadResult.secure_url,
        uploadResult.bytes,
        uploadResult.format,
        alt || fileName
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to upload from URL: ${error}`);
    }
  }

  static async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, alt?: string) {
    try {
      // Convert buffer to base64 for Cloudinary
      const base64File = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(base64File, {
        folder: 'portfolio',
        public_id: fileName,
        resource_type: 'auto'
      });

      // Save to database
      const query = `
        INSERT INTO image_uploaded (image_name, image_path, image_size, image_type, image_alt)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING image_id, image_name, image_path, image_size, image_type
      `;

      const result = await pool.query(query, [
        fileName,
        uploadResult.secure_url,
        uploadResult.bytes,
        uploadResult.format,
        alt || fileName
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  static async deleteImage(imageId: string) {
    const query = `
      UPDATE image_uploaded 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE image_id = $1 AND deleted_at IS NULL
      RETURNING image_id
    `;

    const result = await pool.query(query, [imageId]);
    return result.rows[0] || null;
  }
}