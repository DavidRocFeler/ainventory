import { Router } from "express";
import {
  getItemHistoryController,
  createSnapshotController,
  getFullUserHistoryController
} from "../controllers/inventoryHistory.controller";
import checkLogin from "../middlewares/checkLogin.middleware";

const router = Router();
router.use(checkLogin);

// Historial por rango de fechas (ej: ?start=2024-01-01&end=2024-01-31)
// Historial de inventario por rango de fechas
router.get("/inventory", getFullUserHistoryController); 

// Historial de un ítem específico (nuevo endpoint)
router.get("/item/:itemId", getItemHistoryController);

// Crear snapshot (para testing o procesos automatizados)
router.post("/snapshot", createSnapshotController);

export default router;