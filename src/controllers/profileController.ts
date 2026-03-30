import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { profileService } from '../services/profileService';
import { AppError } from '../errors/AppError';
import { uploadToCloudinary, uploadDocumentToCloudinary } from '../middleware/upload';

interface ProfileBody {
  current_password?: string;
  new_password?: string;
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
}

export const profileController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await profileService.get();
      
      if (!profile) {
        throw new AppError(404, 'Perfil no encontrado');
      }

      const { password: _password, ...profileWithoutPassword } = profile;
      
      res.json({ success: true, data: profileWithoutPassword });
    } catch (error) {
      console.error('[CONTROLLER] get:', error);
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as ProfileBody;

      const currentProfile = await profileService.get();
      
      if (!currentProfile) {
        throw new AppError(404, 'Perfil no encontrado');
      }

      // Verificar password actual si se quiere cambiar password
      if (body.new_password) {
        if (!body.current_password) {
          throw new AppError(400, 'Password actual requerida para cambiar password');
        }
        const isPasswordValid = await bcrypt.compare(body.current_password, currentProfile.password);
        if (!isPasswordValid) {
          throw new AppError(401, 'Password actual incorrecta');
        }
      }

      const previousCvUrl = currentProfile.cv;
      const previousImageUrl = currentProfile.image_url;

      let newImageUrl: string | undefined;
      let newCvUrl: string | undefined;

      if (req.files && Array.isArray(req.files)) {
        const imageFile = req.files.find(f => f.fieldname === 'image');
        
        if (imageFile?.buffer) {
          const tempPath = `/tmp/${imageFile.originalname}`;
          const fs = await import('fs');
          fs.writeFileSync(tempPath, imageFile.buffer);
          
          try {
            newImageUrl = await uploadToCloudinary(tempPath);
          } catch (cloudError) {
            console.error('[CONTROLLER] Error Cloudinary imagen:', cloudError);
            throw new AppError(500, 'Error al subir la imagen a Cloudinary');
          }
        }

        const cvFile = req.files.find(f => f.fieldname === 'cv');
        
        if (cvFile?.buffer) {
          const tempPath = `/tmp/${cvFile.originalname}`;
          const fs = await import('fs');
          fs.writeFileSync(tempPath, cvFile.buffer);
          
          try {
            newCvUrl = await uploadDocumentToCloudinary(tempPath);
          } catch (cloudError) {
            console.error('[CONTROLLER] Error Cloudinary CV:', cloudError);
            throw new AppError(500, 'Error al subir el CV a Cloudinary');
          }
        }
      }

      // Hashear la nueva password si se provee
      let hashedPassword: string | undefined;
      if (body.new_password) {
        hashedPassword = await bcrypt.hash(body.new_password, 10);
      }

      const updateData: {
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
        password?: string;
      } = {
        image_url: newImageUrl || body.image_url,
        presentation: body.presentation,
        github_link: body.github_link,
        linkedin: body.linkedin,
        gmail: body.gmail,
        instagram: body.instagram,
        x: body.x,
        fiverr: body.fiverr,
        phone: body.phone,
        cv: newCvUrl || body.cv,
        tags: body.tags
      };

      if (hashedPassword) {
        updateData.password = hashedPassword;
      }

      const profile = await profileService.update(updateData, previousCvUrl, previousImageUrl);
      
      if (!profile) {
        throw new AppError(404, 'Perfil no encontrado');
      }

      const { password: _password, ...profileWithoutPassword } = profile;
      
      res.json({ success: true, data: profileWithoutPassword });
    } catch (error) {
      console.error('[CONTROLLER] update:', error);
      next(error);
    }
  }
};
