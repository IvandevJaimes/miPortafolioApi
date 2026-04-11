import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config/index";
import { errorHandler } from "./middleware/errorHandler";
import projectsRouter from "./routes/projectsRoutes";
import profileRouter from "./routes/profileRoutes";
import authRouter from "./routes/authRoutes";
import skillsRouter from "./routes/skillsRoutes";
import contactRouter from "./routes/contactRoutes";

const app = express();

app.use(helmet());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: "Demasiadas peticiones, intenta más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: "Demasiados intentos de login, intenta más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//app.use(generalLimiter);
app.use("/auth", authLimiter);

app.use("/projects", projectsRouter);
app.use("/profile", profileRouter);
app.use("/auth", authRouter);
app.use("/skills", skillsRouter);
app.use("/contact", contactRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Ruta no encontrada" });
});

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {});
export default app;
