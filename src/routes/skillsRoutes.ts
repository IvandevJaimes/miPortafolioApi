import { Router } from "express";
import { skillsController } from "../controllers/skillsController.js";
import { authenticate } from "../middleware/auth.js";
import { handleEmptyId } from "../middleware/handleEmptyId.js";

const router = Router();

router.get("/", skillsController.getAllCategories);
router.get("/with-skills", skillsController.getAllWithSkills);

// Categorías
router.post("/categories", authenticate, skillsController.createCategory);
router.put("/categories", handleEmptyId);
router.put("/categories/:id", authenticate, skillsController.updateCategory);
router.delete("/categories", handleEmptyId);
router.delete("/categories/:id", authenticate, skillsController.deleteCategory);

// Skills
router.post("/skills", authenticate, skillsController.createSkill);
router.put("/skills", handleEmptyId);
router.put("/skills/:id", authenticate, skillsController.updateSkill);
router.delete("/skills", handleEmptyId);
router.delete("/skills/:id", authenticate, skillsController.deleteSkill);

export default router;
