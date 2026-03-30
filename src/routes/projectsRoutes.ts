import { Router } from "express";
import multer from "multer";
import { projectController } from "../controllers/projectsController.js";
import { authenticate } from "../middleware/auth.js";
import { validateId } from "../middleware/validateId.js";
import { handleEmptyId } from "../middleware/handleEmptyId.js";

const router = Router({ strict: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Rutas con ID (deben estar primero para coincidir)
router.get("/project/:id", validateId, projectController.getById);
router.put(
  "/project/:id",
  authenticate,
  validateId,
  upload.any(),
  projectController.update,
);
router.delete(
  "/project/:id",
  authenticate,
  validateId,
  projectController.delete,
);

router.get("/project", handleEmptyId);
router.get("/project/", handleEmptyId);
router.put("/project", handleEmptyId);
router.put("/project/", handleEmptyId);
router.delete("/project", handleEmptyId);
router.delete("/project/", handleEmptyId);

router.get("/", projectController.getAll);
router.post("/", authenticate, upload.any(), projectController.create);

export default router;
