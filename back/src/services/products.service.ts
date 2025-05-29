import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product.repository";

// Obtener todos los ítems del inventario
export const getInventoryService = async (): Promise<Product[]> => {
  const inventoryItems = await ProductRepository.find();
  return inventoryItems;
};

// Obtener ítems del inventario por categoría
export const getInventoryByCategoryService = async (
  category: 'wine' | 'beer' | 'spirits' | 'coffee' | 'other'
): Promise<Product[]> => {
  const inventoryByCategory = await ProductRepository.find({
    where: { category },
  });
  return inventoryByCategory;
};

// Crear un nuevo ítem en el inventario
export const createInventoryItemService = async (
  itemData: Partial<Product>
): Promise<Product> => {
  const newItem = ProductRepository.create({
    ...itemData,
    currentStock: itemData.currentStock || 0,
    incoming: itemData.incoming || 0,
    consumed: 0, // Inicialmente 0, se calculará después si es necesario
    total: itemData.total || 0,
  });
  return await ProductRepository.save(newItem);
};

// Actualizar un ítem del inventario
export const updateInventoryItemService = async (
  id: number, // Cambiado de string a number para coincidir con la entidad
  updates: Partial<Product>
): Promise<Product | null> => {
  const product = await ProductRepository.findOne({ where: { id } });
  if (!product) {
    return null;
  }

  // Actualizar campos editables
  if (updates.currentStock !== undefined) {
    product.currentStock = updates.currentStock;
  }
  if (updates.incoming !== undefined) {
    product.incoming = updates.incoming;
  }
  if (updates.total !== undefined) {
    product.total = updates.total;
  }

  // Calcular 'consumed' automáticamente
  product.consumed = product.currentStock + product.incoming - product.total;

  return await ProductRepository.save(product);
};

// Eliminar un ítem del inventario
export const deleteInventoryItemService = async (id: number): Promise<boolean> => {
  const product = await ProductRepository.findOneBy({ id });
  if (!product) {
    return false;
  }
  await ProductRepository.remove(product);
  return true;
};