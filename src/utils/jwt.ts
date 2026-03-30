import jwt from "jsonwebtoken";
import { config } from "../config/index";

const jwtSecret = config.jwt.secret;

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const generateToken = (payload: object, expiresIn?: string) => {
  const exp = expiresIn || config.jwt.expiresIn;
  return jwt.sign(payload, jwtSecret, { expiresIn: exp } as jwt.SignOptions);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret);
};
