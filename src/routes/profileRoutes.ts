import { Router } from 'express';
import multer from 'multer';
import { profileController } from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', authenticate, profileController.get);
router.put('/', authenticate, upload.any(), profileController.update);

export default router;
