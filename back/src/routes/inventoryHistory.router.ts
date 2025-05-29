import { Router } from "express";
import {
  getInventoryHistoryByDate,
  getInventoryHistoryLast30Days,
  createDailySnapshot
} from "../controllers/inventoryHistory.controller";
import checkLogin from "../middlewares/checkLogin.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(checkLogin);

// Obtener historial por fecha específica
router.get("/by-date", getInventoryHistoryByDate);

// Obtener historial de los últimos 30 días
router.get("/last-30-days", getInventoryHistoryLast30Days);

// Crear snapshot manual (principalmente para testing)
router.post("/create-snapshot", createDailySnapshot);

export default router;