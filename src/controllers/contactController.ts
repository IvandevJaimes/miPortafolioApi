import { Request, Response, NextFunction } from "express";
import { contactService } from "../services/contactService.js";
import { idValidator } from "../utils/idValidator";
import { AppError } from "../errors/AppError.js";
import { NotFoundError } from "../errors/AppError.js";
import { contactSchema } from "../services/contactService.js";

export const contactController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await contactService.getAll();
      res.json({ success: true, data: messages });
    } catch (error) {
      console.error("[CONTROLLER] getAll:", error);
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = idValidator(req.params.id);
      if (!id) {
        throw new AppError(400, "ID inválido");
      }
      const message = await contactService.getById(id);
      if (!message) {
        throw new NotFoundError("Mensaje");
      }
      res.json({ success: true, data: message });
    } catch (error) {
      console.error("[CONTROLLER] getById:", error);
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = contactSchema.parse(req.body);

      const message = await contactService.create(validated);
      res.status(201).json({ success: true, data: message });
    } catch (error: unknown) {
      const zodError = error as { name: string; errors: { message: string }[] };
      if (zodError.name === "ZodError") {
        return res.status(400).json({
          success: false,
          error: zodError.errors[0].message,
        });
      }
      console.error("[CONTROLLER] create:", error);
      next(error);
    }
  },

  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = idValidator(req.params.id);
      if (!id) {
        throw new AppError(400, "ID inválido");
      }
      const readed = await contactService.markAsRead(id);
      if (!readed) {
        throw new NotFoundError("Mensaje");
      }
      res
        .status(200)
        .json({ success: true, data: { message: "Mensaje actualizado" } });
    } catch (error) {
      console.error("[CONTROLLER] markAsRead:", error);
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = idValidator(req.params.id);
      if (!id) {
        throw new AppError(400, "ID inválido");
      }
      const deleted = await contactService.delete(id);
      if (!deleted) {
        throw new NotFoundError("Mensaje");
      }
      res
        .status(200)
        .json({ success: true, data: { message: "Mensaje eliminado" } });
    } catch (error) {
      console.error("[CONTROLLER] delete:", error);
      next(error);
    }
  },
};
