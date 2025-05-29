import { AppDataSource } from "../config/dataSource";
import { InventoryHistory } from "../entities/InventoryHistory";
import { Between } from "typeorm";

export const InventoryHistoryRepository = AppDataSource.getRepository(InventoryHistory).extend({
  // Obtener historial de un día específico
  async findByUserAndDate(userId: number, date: Date): Promise<InventoryHistory[]> {
    return this.find({
      where: {
        user: { id: userId },
        date: date
      },
      relations: ["product"],
      order: { product: { name: "ASC" } }
    });
  },

  // Obtener historial de los últimos 30 días
  async findLast30Days(userId: number): Promise<InventoryHistory[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return this.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate)
      },
      relations: ["product"],
      order: { 
        date: "DESC",
        product: { name: "ASC" } 
      }
    });
  },

  // Obtener historial de un producto específico en un rango de fechas
  async findByProductAndDateRange(
    userId: number, 
    productId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<InventoryHistory[]> {
    return this.find({
      where: {
        user: { id: userId },
        product: { id: productId },
        date: Between(startDate, endDate)
      },
      order: { date: "DESC" }
    });
  }
});