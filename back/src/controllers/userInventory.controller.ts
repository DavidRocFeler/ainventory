import { Response } from "express";
import { catchedController } from "../utils/catchedController";
import {
  getUserInventoryService,
  getUserInventoryByCategoryService,
  createUserInventoryService,
  updateUserInventoryService,
  initializeUserInventoryService
} from "../services/userInventory.service";

// Obtener todo el inventario del usuario autenticado
export const getUserInventory = catchedController(
  async (req: any, res: Response) => {
    const userId = req.user?.userId;  // ✅ CAMBIO: userId en lugar de id
    
    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const inventory = await getUserInventoryService(userId);
    res.json(inventory);
  }
);

// Obtener inventario por categoría
export const getUserInventoryByCategory = catchedController(
  async (req: any, res: Response) => {
    const userId = req.user?.userId;  // ✅ CAMBIO: userId en lugar de id
    const { category } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const inventory = await getUserInventoryByCategoryService(userId, category);
    res.json(inventory);
  }
);

// Actualizar inventario de un producto específico
export const updateUserInventory = catchedController(
  async (req: any, res: Response) => {
    const userId = req.user?.userId;  // ✅ CAMBIO: userId en lugar de id
    const { productId } = req.params;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const updatedInventory = await updateUserInventoryService(
      userId,
      Number(productId),
      updates
    );

    res.json(updatedInventory);
  }
);

// Inicializar inventario para un usuario (crear todos los productos en 0)
export const initializeUserInventory = catchedController(
  async (req: any, res: Response) => {
    const userId = req.user?.userId;  // ✅ CAMBIO: userId en lugar de id

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    await initializeUserInventoryService(userId);
    res.json({ message: "Inventario inicializado correctamente" });
  }
);