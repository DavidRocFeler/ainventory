// services/inventory.service.ts
import { InventoryRepository } from '../repositories/userInventory.repository';

export class InventoryService {
  private repository = new InventoryRepository();

  

  async updateInventoryItem(
    userId: number,
    productId: number,
    updates: { instock?: number; incoming?: number; total?: number; updated_at: Date }
  ) {
    // 0. calcular total

    // 1. Buscar ítem
    const item = await this.repository.findItemByUserAndProduct(userId, productId);
    if (!item) throw new Error("Producto no encontrado en tu inventario");

    // 2. Aplicar actualizaciones
    if (updates.instock !== undefined) item.instock = updates.instock;
    if (updates.incoming !== undefined) item.incoming = updates.incoming;
    
    // 3. Validar y calcular total/consumed
    if (updates.total !== undefined) {
      // Validar que el nuevo total no exceda el stock total
      const stockSum = item.instock + item.incoming;
      if (updates.total > stockSum) {
          throw new Error(`El total no puede ser mayor a ${stockSum} (instock + incoming)`);
      }
      // Solo permitir modificación manual del total si no coincide con ninguna condición automática
      item.total = updates.total;
      item.consumed = stockSum - item.total;
    } else if (updates.instock !== undefined || updates.incoming !== undefined) {
      // Solo calcular automáticamente el total si coincide con alguna de las condiciones permitidas
      const stockSum = item.instock + item.incoming;
      const newTotal = item.instock + item.incoming;
      
      // Verificar si el total actual coincide con alguna condición permitida
      const isAutoTotal = (item.total === item.incoming) || 
                        (item.total === item.instock) || 
                        (item.total === (item.instock + item.incoming));
      
      // Solo actualizar automáticamente el total si coincide con las condiciones o si nunca se ha establecido
      if (isAutoTotal || item.total === undefined) {
          item.total = newTotal;
      }
      // El consumed siempre se calcula así
      item.consumed = (item.instock + item.incoming) - item.total;
    }

    // 4. Guardar con histórico
    await this.repository.saveItemWithHistory(item, {
      item,
      record_date: updates.updated_at,
      instock: item.instock,
      incoming: item.incoming,
      consumed: item.consumed,
      total: item.total,
    });

    return item;
  }
}