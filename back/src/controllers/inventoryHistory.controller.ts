import { Request, Response } from "express";
import { 
    getItemHistoryService,
    createSnapshotService, 
    getFullUserHistoryService
} from "../services/inventoryHistory.service";
import { DateSchema, ItemHistorySchema } from "../schemas/history.schema"; // Validaciones con Zod

// Historial de inventario por rango de fechas
export const getFullUserHistoryController = async (req: Request, res: Response) => {
    try {
      const { date } = DateSchema.parse(req.query);
      const userId = (req as any).user.userId;
      const targetDate = new Date(date);
      const fullHistory = await getFullUserHistoryService(userId, targetDate);
      res.json({
        success: true,
        data: fullHistory
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };
  

// Historial de un ítem específico
export const getItemHistoryController = async (req: Request, res: Response) => {
    try {
        const { itemId } = ItemHistorySchema.parse(req.params);

        const userId = (req as any).user
        
        const history = await getItemHistoryService(userId, Number(itemId));
        
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Error al obtener historial"
        });
    }
};

// Crear snapshot manual
export const createSnapshotController = async (req: Request, res: Response) => {
    try {

        const userId = (req as any).user
        await createSnapshotService(userId);
        
        res.json({
            success: true,
            message: "Snapshot creado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear snapshot"
        });
    }
};