// src/controllers/userInventory.controller.ts
import { Request, Response } from "express";
import { InventoryService } from "../services/userInventory.service";

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

    // Delegar al servicio
    const service = new InventoryService();
    const updatedItem = await service.updateInventoryItem(userId, Number(productId), {
      instock,
      incoming,
      total,
      updated_at: updateDate,
    });

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
// Inicializar inventario (actualizado)
// export const initializeInventoryController = async (req: Request, res: Response) => {
//   try {

//     const userId = (req as any).user

//     // Obtener o crear el inventario del usuario
//     let inventory = await inventoryRepository.findOne({ 
//       where: { user: { id: userId } }
//     });

//     if (!inventory) {
//       inventory = new UserInventoryEntity();
//       inventory.user = { id: userId } as any;
//       await inventoryRepository.save(inventory);
//     }

//     // Obtener todos los productos globales
//     const globalProducts = await productRepository.find({ 
//       where: { is_global: true } 
//     });

//     // Crear ítems de inventario para cada producto global que no exista
//     let createdCount = 0;
//     for (const product of globalProducts) {
//       const existingItem = await inventoryItemsRepository.findOne({
//         where: { 
//           inventory: { inventory_id: inventory.inventory_id },
//           product: { product_id: product.product_id }
//         }
//       });

//       if (!existingItem) {
//         const newItem = new InventoryItemsEntity();
//         newItem.inventory = inventory;
//         newItem.product = product;
//         newItem.instock = 0;
//         newItem.incoming = 0;
//         newItem.consumed = 0;
//         newItem.total = 0;
        
//         await inventoryItemsRepository.save(newItem);
//         createdCount++;
//       }
//     }

//     res.json({
//       success: true,
//       message: "Inventario inicializado correctamente",
//       data: {
//         inventory_id: inventory.inventory_id,
//         items_created: createdCount
//       }
//     });
//   } catch (error) {
//     console.error("Error al inicializar inventario:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Error interno del servidor" 
//     });
//   }
// };