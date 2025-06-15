// repositories/userInventory.repository.ts
import { AppDataSource } from '../config/dataSource';
import { InventoryItemsEntity } from '../entities/InventoryItemsEntity';
import { InventoryHistoryEntity } from '../entities/InventoryHistoryEntity';
import { Between } from 'typeorm';

const itemRepository = AppDataSource.getRepository(InventoryItemsEntity);

export const findItemByUserAndProductRespository = async (
  userId: number,
  productId: number
): Promise<InventoryItemsEntity | null> => {
  return itemRepository
    .createQueryBuilder('item')
    .leftJoinAndSelect('item.inventory', 'inventory')
    .leftJoinAndSelect('inventory.user', 'user')
    .leftJoinAndSelect('item.product', 'product')
    .where('user.id = :userId AND product.product_id = :productId', { userId, productId })
    .getOne();
};

export const saveItemWithHistoryRepository = async (
  item: InventoryItemsEntity,
  history: Partial<InventoryHistoryEntity>
): Promise<void> => {
  await AppDataSource.transaction(async (manager) => {
    await manager.save(InventoryItemsEntity, item);
    
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
      Object.assign(existingHistory, history);
      await manager.save(InventoryHistoryEntity, existingHistory);
    } else {
      await manager.save(InventoryHistoryEntity, history);
    }
    
    const futureDate = new Date(targetDate);
    futureDate.setDate(futureDate.getDate() + 1);
    futureDate.setHours(0, 0, 0, 0);
    
    await manager
      .getRepository(InventoryHistoryEntity)
      .createQueryBuilder()
      .delete()
      .where("item_id = :itemId", { itemId: item.item_id })
      .andWhere("record_date >= :futureDate", { futureDate })
      .execute();
  });
};