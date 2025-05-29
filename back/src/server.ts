import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes";

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Rutas principales
app.use(router);

// ✅ Ruta de prueba para Render (IMPORTANTE para evitar error 502)
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend running successfully 🚀" });
});

// ✅ Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
});

export default app;
