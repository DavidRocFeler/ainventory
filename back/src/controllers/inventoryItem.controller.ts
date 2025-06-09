import { Request, Response } from "express";
import { InventoryItemsEntity } from "../entities/InventoryItemsEntity";
import { UserInventoryEntity } from "../entities/UserInventoryEntity";
import { ProductEntity } from "../entities/ProductEntity";
import { AppDataSource } from "../config/dataSource";

// Inicializar repositorios
const inventoryItemsRepo = AppDataSource.getRepository(InventoryItemsEntity);
const inventoryRepo = AppDataSource.getRepository(UserInventoryEntity);
const productRepo = AppDataSource.getRepository(ProductEntity);

// Controlador para obtener ítems de un inventario específico
export const getInventoryItems = async (req: Request, res: Response) => {
  try {
    const { inventoryId } = req.params;

    const inventory = await inventoryRepo.findOne({
      where: { inventory_id: Number(inventoryId) },
      relations: ["items", "items.product"], // Incluir productos relacionados
    });

    if (!inventory) {
      return res.status(404).json({ message: "Inventario no encontrado" });
    }

    res.status(200).json(inventory.items);
  } catch (error) {
    console.error("Error al obtener ítems:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para añadir un producto a un inventario
export const addItemToInventory = async (req: Request, res: Response) => {
  try {
    const { inventoryId, productId, instock, incoming, consumed } = req.body;

    // Validar existencia de inventario y producto
    const [inventory, product] = await Promise.all([
      inventoryRepo.findOneBy({ inventory_id: Number(inventoryId) }),
      productRepo.findOneBy({ product_id: Number(productId) }),
    ]);

    if (!inventory || !product) {
      return res.status(404).json({ message: "Inventario o producto no encontrado" });
    }

    // Crear nuevo ítem
    const newItem = inventoryItemsRepo.create({
      inventory,
      product,
      instock: instock || 0,
      incoming: incoming || 0,
      consumed: consumed || 0,
      total: (instock || 0) + (incoming || 0) - (consumed || 0),
    });

    await inventoryItemsRepo.save(newItem);

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error al añadir ítem:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para actualizar un ítem (ej: ajustar stock)
export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { instock, incoming, consumed } = req.body;

    const item = await inventoryItemsRepo.findOneBy({ item_id: Number(itemId) });

    if (!item) {
      return res.status(404).json({ message: "Ítem no encontrado" });
    }

    // Actualizar campos
    item.instock = instock ?? item.instock;
    item.incoming = incoming ?? item.incoming;
    item.consumed = consumed ?? item.consumed;
    item.total = item.instock + item.incoming - item.consumed;

    await inventoryItemsRepo.save(item);

    res.status(200).json(item);
  } catch (error) {
    console.error("Error al actualizar ítem:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para eliminar un ítem
export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const result = await inventoryItemsRepo.delete({ item_id: Number(itemId) });

    if (result.affected === 0) {
      return res.status(404).json({ message: "Ítem no encontrado" });
    }

    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Error al eliminar ítem:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};