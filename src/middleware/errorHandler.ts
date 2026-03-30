import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

interface MySQLError {
  code?: string;
  name?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  void next;
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  const mysqlErr = err as MySQLError;

  if (mysqlErr.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: 'Ya existe un registro con esos datos'
    });
  }

  if (mysqlErr.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Datos inválidos'
    });
  }

  if (mysqlErr.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      error: 'El registro referencia algo que no existe'
    });
  }

  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
};
