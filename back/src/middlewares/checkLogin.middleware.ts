//back/src/middlewares/checkLogin.middleware.ts
import { NextFunction, Request, Response } from "express";
import { ClientError } from "../utils/errors";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";

const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
  console.log("🔍 CheckLogin middleware ejecutándose");
  console.log("🔍 Headers recibidos:", req.headers);
  console.log("🔍 Body recibido:", req.body);
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No hay token o formato incorrecto");
    return next(new ClientError("Token is required or invalid format", 401));
  }

  const token = authHeader.split(" ")[1];
  console.log("🔍 Token extraído:", token);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).user = decoded;
    console.log("✅ Token Check OK");
    next();
  } catch (error) {
    console.log("❌ Token inválido:", error);
    return next(new ClientError("Invalid token", 401));
  }
};

export default checkLogin;