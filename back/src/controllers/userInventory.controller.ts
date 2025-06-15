// src/controllers/userInventory.controller.ts
import { Request, Response } from "express";
import { updateInventoryItemService  } from "../services/userInventory.service"; // Asegúrate de que la importación sea correcta

export const updateItemController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { productId } = req.params;
    const { instock, incoming, total, updated_at } = req.body;

    // Validación básica
    if (!updated_at) {
      return res.status(400).json({
        success: false,
        message: "El campo 'updated_at' es obligatorio",
      });
    }

    const updateDate = new Date(updated_at);
    if (isNaN(updateDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Formato de fecha inválido en 'updated_at'",
      });
    }

    // Llamar directamente a la función del servicio
    const updatedItem = await updateInventoryItemService(
      userId,
      Number(productId),
      {
        instock,
        incoming,
        total,
        updated_at: updateDate,
      }
    );

    // Respuesta
    res.json({
      success: true,
      data: {
        product_id: updatedItem.product.product_id,
        instock: updatedItem.instock,
        incoming: updatedItem.incoming,
        consumed: updatedItem.consumed,
        total: updatedItem.total,
        updated_at: updated_at,
      },
    });

  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor",
    });
  }
};