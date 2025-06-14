import { InventoryHistoryRepository } from "../repositories/inventoryHistory.repository";
import { UserInventoryRepository } from "../repositories/userInventory.repository";
import { InventoryHistory } from "../entities/InventoryHistory";

// Obtener historial de un día específico
export const getInventoryHistoryByDateService = async (
  userId: number,
  date: Date
): Promise<InventoryHistory[]> => {
  return await InventoryHistoryRepository.findByUserAndDate(userId, date);
};

// Obtener historial de los últimos 30 días
export const getInventoryHistoryLast30DaysService = async (
  userId: number
): Promise<InventoryHistory[]> => {
  return await InventoryHistoryRepository.findLast30Days(userId);
};

// Crear snapshot del día (esto se ejecutaría con un cron job al final del día)
export const createDailySnapshotService = async (userId: number): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Verificar si ya existe el snapshot de hoy
  const existingSnapshot = await InventoryHistoryRepository.findByUserAndDate(userId, today);
  
  if (existingSnapshot.length > 0) {
    throw new Error("Ya existe un snapshot para este día");
  }

  // Obtener el inventario actual del usuario
  const currentInventory = await UserInventoryRepository.findByUserId(userId);

  // Crear un registro histórico por cada producto
  for (const inventory of currentInventory) {
    const historyRecord = InventoryHistoryRepository.create({
      user: inventory.user,
      product: inventory.product,
      date: today,
      currentStock: inventory.currentStock,
      incoming: inventory.incoming,
      consumed: inventory.consumed,
      total: inventory.total
    });

    await InventoryHistoryRepository.save(historyRecord);
  }
};

// Crear snapshot para todos los usuarios (para cron job)
export const createDailySnapshotForAllUsersService = async (): Promise<void> => {
  const allInventory = await UserInventoryRepository.find({
    relations: ["user", "product"]
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Agrupar por usuario
  const inventoryByUser = new Map<number, typeof allInventory>();
  
  allInventory.forEach(inventory => {
    const userId = inventory.user.id;
    if (!inventoryByUser.has(userId)) {
      inventoryByUser.set(userId, []);
    }
    inventoryByUser.get(userId)!.push(inventory);
  });

  // Crear snapshot para cada usuario
  for (const [userId, userInventories] of inventoryByUser) {
    // Verificar si ya existe snapshot
    const existingSnapshot = await InventoryHistoryRepository.findByUserAndDate(userId, today);
    
    if (existingSnapshot.length === 0) {
      for (const inventory of userInventories) {
        const historyRecord = InventoryHistoryRepository.create({
          user: inventory.user,
          product: inventory.product,
          date: today,
          currentStock: inventory.currentStock,
          incoming: inventory.incoming,
          consumed: inventory.consumed,
          total: inventory.total
        });

        await InventoryHistoryRepository.save(historyRecord);
      }
    }
  }
};