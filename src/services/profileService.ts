import { pool } from "../database/index.js";
import { DevProfile, UpdateResult } from "../models/types.js";
import { deleteFromCloudinary } from "../middleware/upload.js";

export const profileService = {
  async get(): Promise<DevProfile | null> {
    const [results] = await pool.query(
      "SELECT * FROM dev_profile LIMIT 1"
    );
    const profiles = results as DevProfile[];
    return profiles.length ? profiles[0] : null;
  },

  async update(
    data: {
      password?: string;
      image_url?: string;
      presentation?: string;
      github_link?: string;
      linkedin?: string;
      gmail?: string;
      instagram?: string;
      x?: string;
      fiverr?: string;
      phone?: string;
      cv?: string;
      tags?: string;
    },
    previousCvUrl?: string | null,
    previousImageUrl?: string | null
  ): Promise<DevProfile | null> {
    const updateFields: string[] = [];
    const updateValues: (string | null)[] = [];

    if (data.password !== undefined) {
      updateFields.push("password = ?");
      updateValues.push(data.password);
    }
    if (data.image_url !== undefined) {
      updateFields.push("image_url = ?");
      updateValues.push(data.image_url || null);
    }
    if (data.presentation !== undefined) {
      updateFields.push("presentation = ?");
      updateValues.push(data.presentation || null);
    }
    if (data.github_link !== undefined) {
      updateFields.push("github_link = ?");
      updateValues.push(data.github_link || null);
    }
    if (data.linkedin !== undefined) {
      updateFields.push("linkedin = ?");
      updateValues.push(data.linkedin || null);
    }
    if (data.gmail !== undefined) {
      updateFields.push("gmail = ?");
      updateValues.push(data.gmail || null);
    }
    if (data.instagram !== undefined) {
      updateFields.push("instagram = ?");
      updateValues.push(data.instagram || null);
    }
    if (data.x !== undefined) {
      updateFields.push("x = ?");
      updateValues.push(data.x || null);
    }
    if (data.fiverr !== undefined) {
      updateFields.push("fiverr = ?");
      updateValues.push(data.fiverr || null);
    }
    if (data.phone !== undefined) {
      updateFields.push("phone = ?");
      updateValues.push(data.phone || null);
    }
    if (data.cv !== undefined) {
      updateFields.push("cv = ?");
      updateValues.push(data.cv || null);
    }
    if (data.tags !== undefined) {
      updateFields.push("tags = ?");
      updateValues.push(data.tags || null);
    }

    if (updateFields.length === 0) {
      return await this.get();
    }

    const [result] = await pool.query(
      "UPDATE dev_profile SET " + updateFields.join(", ") + " WHERE profile_id = 1",
      updateValues
    );

    const updateResult = result as UpdateResult;
    if (updateResult.affectedRows === 0) {
      return null;
    }

    if (data.cv && previousCvUrl) {
      await deleteFromCloudinary(previousCvUrl);
    }

    if (data.image_url && previousImageUrl) {
      await deleteFromCloudinary(previousImageUrl);
    }

    return await this.get();
  }
};
