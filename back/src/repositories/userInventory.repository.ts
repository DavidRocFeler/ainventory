import { AppDataSource } from "../config/dataSource";
import { UserInventory } from "../entities/UserInventory";

export const UserInventoryRepository = AppDataSource.getRepository(UserInventory).extend({
  // Buscar inventario por usuario y producto
  async findByUserAndProduct(userId: number, productId: number): Promise<UserInventory | null> {
    return this.findOne({
      where: {
        user: { id: userId },
        product: { id: productId }
      },
      relations: ["user", "product"]
    });
  },

  // Obtener todo el inventario de un usuario
  async findByUserId(userId: number): Promise<UserInventory[]> {
    return this.find({
      where: { user: { id: userId } },
      relations: ["product"],
      order: { product: { name: "ASC" } }
    });
  },

  // Obtener inventario por categoría
  async findByUserAndCategory(userId: number, category: string): Promise<UserInventory[]> {
    return this.find({
      where: { 
        user: { id: userId },
        product: { category: category as any }
      },
      relations: ["product"],
      order: { product: { name: "ASC" } }
    });
  }
});