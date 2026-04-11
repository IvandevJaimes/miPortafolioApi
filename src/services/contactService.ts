import { pool } from "../database/index.js";
import { ContactMessage } from "../models/types.js";
import { z } from "zod";

// Schema de validación con Zod
export const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").min(2).max(100),
  email: z.string().email("Email inválido").max(255),
  message: z.string().min(1, "El mensaje es requerido").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const contactService = {
  async getAll(): Promise<ContactMessage[]> {
    const [results] = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC",
    );
    return results as ContactMessage[];
  },

  async getById(id: number): Promise<ContactMessage | null> {
    const [results] = await pool.query(
      "SELECT * FROM contact_messages WHERE id = ?",
      [id],
    );
    const messages = results as ContactMessage[];
    return messages[0] || null;
  },

  async create(data: ContactInput): Promise<ContactMessage> {
    const [result] = await pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [data.name, data.email, data.message],
    );
    const newMessage = await this.getById((result as any).insertId);
    return newMessage!;
  },

  async markAsRead(id: number): Promise<ContactMessage | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    await pool.query(
      "UPDATE contact_messages SET readed_at = NOW() WHERE id = ?",
      [id],
    );
    return this.getById(id);
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query(
      "DELETE FROM contact_messages WHERE id = ?",
      [id],
    );
    return (result as any).affectedRows > 0;
  },
};
