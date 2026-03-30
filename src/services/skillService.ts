import { pool } from "../database/index.js";
import { SkillCategory, Skill } from "../models/types.js";

export const skillService = {
  async getAll(): Promise<SkillCategory[]> {
    const [results] = await pool.query(
      "SELECT * FROM skill_categories ORDER BY display_order ASC",
    );
    return results as SkillCategory[];
  },

  async getAllWithSkills(): Promise<SkillCategory[]> {
    const [categories] = await pool.query(
      "SELECT * FROM skill_categories ORDER BY display_order ASC",
    ) as unknown as [SkillCategory[]];
    if (!categories.length) return [];
    const categoriesWithSkills = await Promise.all(
      categories.map(async (cat) => {
        const [skills] = await pool.query(
          "SELECT * FROM skills WHERE category_id = ? ORDER BY display_order ASC",
          [cat.id],
        ) as unknown as [Skill[]];
        return { ...cat, skills };
      }),
    );
    return categoriesWithSkills;
  },

  async getById(id: number): Promise<SkillCategory | null> {
    const [results] = await pool.query(
      "SELECT * FROM skill_categories WHERE id = ?",
      [id],
    );
    const categories = results as SkillCategory[];
    return categories[0] || null;
  },

  async createCategory(data: {
    name: string;
    label: string;
    display_order?: number;
  }): Promise<SkillCategory> {
    const [result] = await pool.query(
      "INSERT INTO skill_categories (name, label, display_order) VALUES (?, ?, ?)",
      [data.name, data.label, data.display_order || 0],
    );
    const newCategory = await this.getById((result as any).insertId);
    return newCategory!;
  },
  async updateCategory(
    id: number,
    data: { name?: string; label?: string; display_order?: number },
  ): Promise<SkillCategory | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    await pool.query(
      "UPDATE skill_categories SET name = ?, label = ?, display_order = ? WHERE id = ?",
      [
        data.name ?? existing.name,
        data.label ?? existing.label,
        data.display_order ?? existing.display_order,
        id,
      ],
    );
    return this.getById(id);
  },

  async deleteCategory(id: number): Promise<boolean> {
    const [result] = await pool.query(
      "DELETE FROM skill_categories WHERE id = ?",
      [id],
    );
    return (result as any).affectedRows > 0;
  },

  // Skills
  async createSkill(data: {
    category_id: number;
    name: string;
    description?: string;
    display_order?: number;
  }): Promise<Skill> {
    const [result] = await pool.query(
      "INSERT INTO skills (category_id, name, description, display_order) VALUES (?, ?, ?, ?)",
      [
        data.category_id,
        data.name,
        data.description || null,
        data.display_order || 0,
      ],
    );
    const [newSkill] = await pool.query("SELECT * FROM skills WHERE id = ?", [
      (result as any).insertId,
    ]) as unknown as [Skill[]];
    return newSkill[0];
  },
  async updateSkill(
    id: number,
    data: { name?: string; description?: string; display_order?: number },
  ): Promise<Skill | null> {
    const [existing] = await pool.query("SELECT * FROM skills WHERE id = ?", [
      id,
    ]) as unknown as [Skill[]];
    if (!existing.length) return null;
    await pool.query(
      "UPDATE skills SET name = ?, description = ?, display_order = ? WHERE id = ?",
      [
        data.name ?? existing[0].name,
        data.description ?? existing[0].description,
        data.display_order ?? existing[0].display_order,
        id,
      ],
    );
    const [updated] = await pool.query("SELECT * FROM skills WHERE id = ?", [
      id,
    ]) as unknown as [Skill[]];
    return updated[0];
  },
  async deleteSkill(id: number): Promise<boolean> {
    const [result] = await pool.query("DELETE FROM skills WHERE id = ?", [id]);
    return (result as any).affectedRows > 0;
  },
};
