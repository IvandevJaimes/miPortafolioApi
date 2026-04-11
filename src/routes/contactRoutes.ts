import { Router } from "express";
import { contactController } from "../controllers/contactController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, contactController.getAll);
router.get("/:id", authenticate, contactController.getById);
router.post("/", contactController.create);
router.put("/:id/read", authenticate, contactController.markAsRead);
router.delete("/:id", authenticate, contactController.delete);

export default router;
