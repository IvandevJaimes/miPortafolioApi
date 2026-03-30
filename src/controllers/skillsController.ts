import { Request, Response, NextFunction } from "express";
import { skillService } from "../services/skillService";
import { AppError } from "../errors/AppError.js";
export const skillsController = {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await skillService.getAll();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },
  async getAllWithSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await skillService.getAllWithSkills();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, label, display_order } = req.body;
      if (!name || !label) {
        throw new AppError(400, "Nombre y label son requeridos");
      }
      const category = await skillService.createCategory({
        name,
        label,
        display_order,
      });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, label, display_order } = req.body;
      const category = await skillService.updateCategory(Number(id), {
        name,
        label,
        display_order,
      });
      if (!category) throw new AppError(404, "Categoría no encontrada");
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  },
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await skillService.deleteCategory(Number(id));
      if (!deleted) throw new AppError(404, "Categoría no encontrada");
      res.json({ success: true, message: "Categoría eliminada" });
    } catch (error) {
      next(error);
    }
  },
  async createSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { category_id, name, description, display_order } = req.body;
      if (!category_id || !name) {
        throw new AppError(400, "category_id y name son requeridos");
      }
      const skill = await skillService.createSkill({
        category_id,
        name,
        description,
        display_order,
      });
      res.status(201).json({ success: true, data: skill });
    } catch (error) {
      next(error);
    }
  },
  async updateSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description, display_order } = req.body;
      const skill = await skillService.updateSkill(Number(id), {
        name,
        description,
        display_order,
      });
      if (!skill) throw new AppError(404, "Skill no encontrado");
      res.json({ success: true, data: skill });
    } catch (error) {
      next(error);
    }
  },
  async deleteSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await skillService.deleteSkill(Number(id));
      if (!deleted) throw new AppError(404, "Skill no encontrado");
      res.json({ success: true, message: "Skill eliminado" });
    } catch (error) {
      next(error);
    }
  },
};
