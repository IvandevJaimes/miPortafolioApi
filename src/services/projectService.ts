import { pool } from "../database/index.js";
import {
  Project,
  ProjectTag,
  ProjectImage,
  ProjectWithDetails,
  InsertResult,
  DeleteResult,
} from "../models/types.js";
import { deleteFromCloudinary } from "../middleware/upload.js";

export const projectService = {
  async getAll(): Promise<ProjectWithDetails[]> {
    const [results] = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC",
    );
    const projects = results as Project[];

    if (!projects.length) return [];

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const [tagResults] = await pool.query(
          "SELECT * FROM project_tags WHERE project_id = ?",
          [project.project_id],
        );
        const tags = tagResults as ProjectTag[];

        const [imgResults] = await pool.query(
          "SELECT * FROM project_images WHERE project_id = ?",
          [project.project_id],
        );
        const images = imgResults as ProjectImage[];

        return { ...project, tags, images };
      }),
    );

    return projectsWithDetails;
  },

  async getById(id: number): Promise<ProjectWithDetails | null> {
    const [results] = await pool.query(
      "SELECT * FROM projects WHERE project_id = ?",
      [id],
    );
    const projects = results as Project[];

    if (!projects.length) return null;

    const project = projects[0];

    const [tagResults] = await pool.query(
      "SELECT * FROM project_tags WHERE project_id = ?",
      [id],
    );
    const tags = tagResults as ProjectTag[];

    const [imgResults] = await pool.query(
      "SELECT * FROM project_images WHERE project_id = ?",
      [id],
    );
    const images = imgResults as ProjectImage[];

    return { ...project, tags, images };
  },

  async create(data: {
    title: string;
    description?: string;
    github?: string;
    github_backend?: string;
    demo?: string;
    featured?: boolean;
    tags?: string[];
    images?: { url: string; alt: string }[];
  }): Promise<Project> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO projects (title, description, github, github_backend, demo, featured) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.title,
          data.description || null,
          data.github || null,
          data.github_backend || null,
          data.demo || null,
          data.featured || false,
        ],
      );

      const insertResult = result as InsertResult;
      const projectId = insertResult.insertId;

      if (data.tags?.length) {
        const tagPlaceholders = data.tags.map(() => '(?, ?)').join(', ');
        const tagParams = data.tags.flatMap(tag => [projectId, tag]);
        await connection.query(
          `INSERT INTO project_tags (project_id, tag) VALUES ${tagPlaceholders}`,
          tagParams,
        );
      }

      if (data.images?.length) {
        for (const img of data.images) {
          await connection.query(
            "INSERT INTO project_images (project_id, url, alt) VALUES (?, ?, ?)",
            [projectId, img.url, img.alt],
          );
        }
      }

      await connection.commit();

      const [newResults] = await pool.query(
        "SELECT * FROM projects WHERE project_id = ?",
        [projectId],
      );
      return (newResults as Project[])[0];
    } catch (error) {
      await connection.rollback();
      console.error("[SERVICE] create:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  async delete(id: number): Promise<boolean> {
    const connection = await pool.getConnection();

    try {
      const [imgResults] = await connection.query(
        "SELECT url FROM project_images WHERE project_id = ?",
        [id],
      );
      const images = imgResults as { url: string }[];

      await connection.beginTransaction();

      for (const img of images) {
        await deleteFromCloudinary(img.url);
      }

      await connection.query(
        "DELETE FROM project_images WHERE project_id = ?",
        [id],
      );

      await connection.query(
        "DELETE FROM project_tags WHERE project_id = ?",
        [id],
      );

      const [result] = await connection.query(
        "DELETE FROM projects WHERE project_id = ?",
        [id],
      );

      await connection.commit();
      const deleteResult = result as DeleteResult;
      return deleteResult.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error("[SERVICE] delete:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      github?: string;
      github_backend?: string;
      demo?: string;
      featured?: boolean;
      tags?: string[];
      images?: { url: string; alt: string }[];
    },
  ): Promise<ProjectWithDetails | null> {
    const connection = await pool.getConnection();

    try {
      const [existing] = await connection.query(
        "SELECT * FROM projects WHERE project_id = ?",
        [id],
      );
      const projects = existing as Project[];
      if (!projects.length) {
        return null;
      }

      await connection.beginTransaction();

      const updateFields: string[] = [];
      const updateValues: (string | boolean | null)[] = [];

      if (data.title !== undefined) {
        updateFields.push("title = ?");
        updateValues.push(data.title);
      }
      if (data.description !== undefined) {
        updateFields.push("description = ?");
        updateValues.push(data.description || null);
      }
      if (data.github !== undefined) {
        updateFields.push("github = ?");
        updateValues.push(data.github || null);
      }
      if (data.github_backend !== undefined) {
        updateFields.push("github_backend = ?");
        updateValues.push(data.github_backend || null);
      }
      if (data.demo !== undefined) {
        updateFields.push("demo = ?");
        updateValues.push(data.demo || null);
      }
      if (data.featured !== undefined) {
        updateFields.push("featured = ?");
        updateValues.push(data.featured);
      }

      if (updateFields.length > 0) {
        updateValues.push(String(id));
        await connection.query(
          "UPDATE projects SET " + updateFields.join(", ") + " WHERE project_id = ?",
          updateValues,
        );
      }

      if (data.tags !== undefined) {
        await connection.query("DELETE FROM project_tags WHERE project_id = ?", [id]);
        if (data.tags.length) {
          const tagPlaceholders = data.tags.map(() => '(?, ?)').join(', ');
          const tagParams = data.tags.flatMap(tag => [id, tag]);
          await connection.query(
            `INSERT INTO project_tags (project_id, tag) VALUES ${tagPlaceholders}`,
            tagParams,
          );
        }
      }

      if (data.images && data.images.length) {
        for (const img of data.images) {
          await connection.query(
            "INSERT INTO project_images (project_id, url, alt) VALUES (?, ?, ?)",
            [id, img.url, img.alt],
          );
        }
      }

      await connection.commit();

      return await this.getById(id);
    } catch (error) {
      await connection.rollback();
      console.error("[SERVICE] update:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
};
