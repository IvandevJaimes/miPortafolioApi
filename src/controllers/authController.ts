import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { profileService } from '../services/profileService';
import { generateToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

interface LoginBody {
  password: string;
}

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as LoginBody;

      if (!body.password) {
        throw new AppError(400, 'Password requerida');
      }

      const profile = await profileService.get();

      if (!profile) {
        throw new AppError(404, 'Perfil no encontrado');
      }

      const isPasswordValid = await bcrypt.compare(body.password, profile.password);
      if (!isPasswordValid) {
        throw new AppError(401, 'Password incorrecta');
      }

      const token = generateToken({ 
        profile_id: profile.profile_id 
      });

      const { password: _password, ...profileWithoutPassword } = profile;

      res.json({ 
        success: true, 
        data: {
          token,
          profile: profileWithoutPassword
        }
      });
    } catch (error) {
      console.error('[CONTROLLER] login:', error);
      next(error);
    }
  }
};
