// repositories/inventory.repository.ts
import { AppDataSource } from '../config/dataSource';
import { InventoryItemsEntity } from '../entities/InventoryItemsEntity';
import { InventoryHistoryEntity } from '../entities/InventoryHistoryEntity';
import { Between } from 'typeorm';

export class InventoryRepository {
  private itemRepo = AppDataSource.getRepository(InventoryItemsEntity);
  private historyRepo = AppDataSource.getRepository(InventoryHistoryEntity);

  async findItemByUserAndProduct(userId: number, productId: number) {
    return this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.inventory', 'inventory')
      .leftJoinAndSelect('inventory.user', 'user')
      .leftJoinAndSelect('item.product', 'product')
      .where('user.id = :userId AND product.product_id = :productId', { userId, productId })
      .getOne();
  }

  async saveItemWithHistory(item: InventoryItemsEntity, history: Partial<InventoryHistoryEntity>) {
    await AppDataSource.transaction(async (manager) => {
      // 1. Guardar el item
      await manager.save(InventoryItemsEntity, item);
      
      // 2. Verificar si ya existe historial para esta fecha
      if (!history.record_date) {
        throw new Error('record_date es requerido');
      }
      
      const targetDate = new Date(history.record_date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const existingHistory = await manager
        .getRepository(InventoryHistoryEntity)
        .findOne({
          where: {
            item: { item_id: item.item_id },
            record_date: Between(startOfDay, endOfDay)
          }
        });
      
      if (existingHistory) {
        // Actualizar el existente
        Object.assign(existingHistory, history);
        await manager.save(InventoryHistoryEntity, existingHistory);
      } else {
        // Crear nuevo
        await manager.save(InventoryHistoryEntity, history);
      }
      
      // 3. ✅ ELIMINAR todos los registros futuros para que se regeneren automáticamente
      const futureDate = new Date(targetDate);
      futureDate.setDate(futureDate.getDate() + 1); // Día siguiente
      futureDate.setHours(0, 0, 0, 0);
      
      console.log(`🗑️ Eliminando registros futuros para item ${item.item_id} desde ${futureDate}`);
      
      await manager
        .getRepository(InventoryHistoryEntity)
        .createQueryBuilder()
        .delete()
        .where("item_id = :itemId", { itemId: item.item_id })
        .andWhere("record_date >= :futureDate", { futureDate })
        .execute();
      
      console.log(`✅ Registros futuros eliminados para item ${item.item_id}`);
    });
  }
}