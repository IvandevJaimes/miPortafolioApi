import { Router } from "express";
import multer from "multer";
import { profileController } from "../controllers/profileController";
import { authenticate } from "../middleware/auth";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/", profileController.get);
router.put("/", authenticate, upload.any(), profileController.update);

export default router;
