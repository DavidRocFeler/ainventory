import { Request, Response } from "express";
import { catchedController } from "../utils/catchedController";
import {
  getInventoryService,
  getInventoryByCategoryService,
  createInventoryItemService,
  updateInventoryItemService,
  deleteInventoryItemService,
} from "../services/products.service"; // Nombres actualizados para reflejar inventario

// Obtener todos los ítems del inventario
export const getInventory = catchedController(
  async (req: Request, res: Response) => {
    console.log("🚨 LLEGÓ AL CONTROLADOR getInventory");
    const inventoryItems = await getInventoryService();
    res.json(inventoryItems);
  }
);

// Obtener ítems del inventario por categoría (usando valor de enum, no ID numérico)
export const getInventoryByCategory = catchedController(
  async (
    req: Request<{ category: 'wine' | 'beer' | 'spirits' | 'coffee' | 'other' }>,
    res: Response
  ) => {
    const { category } = req.params;
    const inventoryByCategory = await getInventoryByCategoryService(category);
    res.json(inventoryByCategory);
  }
);

// Crear un nuevo ítem en el inventario
export const createInventoryItem = catchedController(
  async (req: Request, res: Response) => {
    const newItemData = req.body; // Datos del nuevo producto (name, currentStock, incoming, total, unit, icon, category)
    const newItem = await createInventoryItemService(newItemData);
    res.status(201).json(newItem);
  }
);

// Actualizar un ítem del inventario
export const updateInventoryItem = catchedController(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const updatedItem = await updateInventoryItemService(Number(id), updates); // Convierte a number
    if (!updatedItem) {
      return res.status(404).json({ error: "Ítem no encontrado" });
    }
    res.json(updatedItem);
  }
);

// Eliminar un ítem del inventario
export const deleteInventoryItem = catchedController(
  async (req: Request<{ id: string }>, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const { id } = req.params;
    const deleted = await deleteInventoryItemService(Number(id)); // Convierte string a number
    if (!deleted) {
      return res.status(404).json({ error: "Ítem no encontrado" });
    }
    res.json({ message: "Ítem eliminado con éxito" });
  }
);