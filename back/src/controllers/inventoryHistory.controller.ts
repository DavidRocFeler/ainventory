import { Response } from "express";
import { catchedController } from "../utils/catchedController";
import {
  getInventoryHistoryByDateService,
  getInventoryHistoryLast30DaysService,
  createDailySnapshotService
} from "../services/inventoryHistory.service";

// Obtener historial de una fecha específica
export const getInventoryHistoryByDate = catchedController(
  async (req: any, res: Response) => {
    const userId = req.user?.userId;  // ✅ CAMBIO: userId en lugar de id
    const { date } = req.query;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!date) {
      return res.status(400).json({ error: "Fecha requerida" });
    }

    const dateObj = new Date(date as string);
    dateObj.setHours(0, 0, 0, 0);

    const history = await getInventoryHistoryByDateService(userId, dateObj);
    res.json(history);
  }
);

// Obtener historial de los últimos 30 días
export const getInventoryHistoryLast30Days = catchedController(
  async (req: any, res: Response) => {
    const userId = req.user?.userId;  // ✅ CAMBIO: userId en lugar de id

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const history = await getInventoryHistoryLast30DaysService(userId);
    res.json(history);
  }
);

// Crear snapshot manual del día actual (opcional, principalmente para testing)
export const createDailySnapshot = catchedController(
  async (req: any, res: Response) => {
    const userId = req.user?.userId;  // ✅ CAMBIO: userId en lugar de id

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    await createDailySnapshotService(userId);
    res.json({ message: "Snapshot del día creado correctamente" });
  }
);