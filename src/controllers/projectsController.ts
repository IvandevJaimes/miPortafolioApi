import { Request, Response, NextFunction } from "express";
import { projectService } from "../services/projectService.js";
import { NotFoundError } from "../errors/AppError.js";
import { uploadToCloudinary } from "../middleware/upload.js";
import { AppError } from "../errors/AppError.js";
import { idValidator } from "../utils/idValidator.js";

interface ProjectBody {
  title?: string;
  description?: string;
  github?: string;
  github_backend?: string;
  github_crud?: string;
  demo?: string;
  featured?: string | boolean;
  tags?: string | string[];
  alt?: string;
}

export const projectController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.path.endsWith('/') && req.path !== '/') {
        return res.status(400).json({ 
          success: false, 
          error: 'ID requerido' 
        });
      }
      
      const projects = await projectService.getAll();
      res.json({ success: true, data: projects });
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

      const project = await projectService.getById(id);

      if (!project) {
        throw new NotFoundError("Proyecto");
      }

      res.json({ success: true, data: project });
    } catch (error) {
      console.error("[CONTROLLER] getById:", error);
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as ProjectBody;
      const images: { url: string; alt: string }[] = [];

      if (req.files && Array.isArray(req.files)) {
        const imageFile = req.files.find((f) => f.fieldname === "image");

        if (imageFile?.buffer) {
          const tempPath = `/tmp/${imageFile.originalname}`;
          const fs = await import("fs");
          fs.writeFileSync(tempPath, imageFile.buffer);

          try {
            const cloudUrl = await uploadToCloudinary(tempPath);
            images.push({ url: cloudUrl, alt: body.alt || "" });
          } catch (cloudError) {
            console.error("[CONTROLLER] Error Cloudinary:", cloudError);
          }
        }
      }

      const parsedTags = body.tags
        ? Array.isArray(body.tags)
          ? body.tags
          : body.tags.split(",").map((t) => t.trim())
        : [];

      const title = body.title;
      if (!title) {
        throw new AppError(400, "El título es requerido");
      }

      const data = {
        title,
        description: body.description || undefined,
        github: body.github || undefined,
        github_backend: body.github_backend || undefined,
        github_crud: body.github_crud || undefined,
        demo: body.demo || undefined,
        featured: body.featured === "true" || body.featured === true,
        tags: parsedTags,
        images: images.length ? images : [],
      };

      const project = await projectService.create(data);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      console.error("[CONTROLLER] create:", error);
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = idValidator(req.params.id);

      if (id === null) {
        throw new AppError(400, "ID inválido");
      }

      const deleted = await projectService.delete(id);

      if (!deleted) {
        throw new NotFoundError("Proyecto");
      }

      res.json({ success: true, data: { message: "Proyecto eliminado" } });
    } catch (error) {
      console.error("[CONTROLLER] delete:", error);
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = idValidator(req.params.id);

      if (id === null) {
        throw new AppError(400, "ID inválido");
      }

      const body = req.body as ProjectBody;
      let tags: string[] | undefined;
      let images: { url: string; alt: string }[] | undefined;

      if (req.files && Array.isArray(req.files)) {
        const imageFile = req.files.find((f) => f.fieldname === "image");

        if (imageFile?.buffer) {
          const tempPath = `/tmp/${imageFile.originalname}`;
          const fs = await import("fs");
          fs.writeFileSync(tempPath, imageFile.buffer);

          try {
            const cloudUrl = await uploadToCloudinary(tempPath);
            images = [{ url: cloudUrl, alt: body.alt || "" }];
          } catch (cloudError) {
            console.error("[CONTROLLER] Error Cloudinary:", cloudError);
          }
        }
      }

      if (body.tags) {
        tags = Array.isArray(body.tags)
          ? body.tags
          : body.tags.split(",").map((t) => t.trim());
      }

      let featured: boolean | undefined;
      if (body.featured !== undefined) {
        featured =
          body.featured === "true" || body.featured === true
            ? true
            : body.featured === "false" || body.featured === false
              ? false
              : undefined;
      }

      const data = {
        title: body.title,
        description: body.description || undefined,
        github: body.github || undefined,
        github_backend: body.github_backend || undefined,
        github_crud: body.github_crud || undefined,
        demo: body.demo || undefined,
        featured,
        tags,
        images,
      };

      const project = await projectService.update(id, data);

      if (!project) {
        throw new NotFoundError("Proyecto");
      }

      res.json({ success: true, data: project });
    } catch (error) {
      console.error("[CONTROLLER] update:", error);
      next(error);
    }
  },
};
