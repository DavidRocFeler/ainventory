// services/inventory.service.ts
import { InventoryItemsEntity } from '../entities/InventoryItemsEntity';
import { findItemByUserAndProductRespository, saveItemWithHistoryRepository } from '../repositories/userInventory.repository';

export const updateInventoryItemService = async (
  userId: number,
  productId: number,
  updates: { instock?: number; incoming?: number; total?: number; updated_at: Date }
): Promise<InventoryItemsEntity> => {
  // 1. Buscar ítem
  const item = await findItemByUserAndProductRespository(userId, productId);
  if (!item) {
    throw new Error("Producto no encontrado en tu inventario");
  }

  // 2. Aplicar actualizaciones
  const updatedItem = { ...item };
  
  if (updates.instock !== undefined) {
    updatedItem.instock = updates.instock;
  }
  
  if (updates.incoming !== undefined) {
    updatedItem.incoming = updates.incoming;
  }
  
  // 3. Validar y calcular total/consumed
  const stockSum = updatedItem.instock + updatedItem.incoming;

  if (updates.total !== undefined) {
    // Validar que el nuevo total no exceda el stock total
    if (updates.total > stockSum) {
      throw new Error(`El total no puede ser mayor a ${stockSum} (instock + incoming)`);
    }
    updatedItem.total = updates.total;
    updatedItem.consumed = stockSum - updatedItem.total;
  } else if (updates.instock !== undefined || updates.incoming !== undefined) {
    // Calcular automáticamente el total si coincide con condiciones permitidas
    const newTotal = updatedItem.instock + updatedItem.incoming;
    
    const isAutoTotal = (
      updatedItem.total === updatedItem.incoming ||
      updatedItem.total === updatedItem.instock ||
      updatedItem.total === (updatedItem.instock + updatedItem.incoming)
    );
    
    if (isAutoTotal || updatedItem.total === undefined) {
      updatedItem.total = newTotal;
    }
    updatedItem.consumed = stockSum - updatedItem.total;
  }

  // 4. Guardar con histórico
  await saveItemWithHistoryRepository(updatedItem, {
    item: updatedItem,
    record_date: updates.updated_at,
    instock: updatedItem.instock,
    incoming: updatedItem.incoming,
    consumed: updatedItem.consumed,
    total: updatedItem.total,
  });

  return updatedItem;
};
