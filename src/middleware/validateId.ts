import { Request, Response, NextFunction } from "express";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const idString = Array.isArray(id) ? id[0] : id;

  if (!idString || idString.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "ID requerido",
    });
  }

  if (isNaN(Number(idString))) {
    return res.status(400).json({
      success: false,
      error: "ID debe ser un número",
    });
  }

  next();
};
