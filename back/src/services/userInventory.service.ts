import { UserInventoryRepository } from "../repositories/userInventory.repository";
import { UserRepository } from "../repositories/user.repository";
import { ProductRepository } from "../repositories/product.repository";
import { CreateUserInventoryDto } from "../dtos/createUserInventoryDto";
import { UpdateUserInventoryDto } from "../dtos/updateInventoryUserDto";
import { UserInventory } from "../entities/UserInventory";

// Obtener todo el inventario de un usuario
export const getUserInventoryService = async (userId: number): Promise<UserInventory[]> => {
  return await UserInventoryRepository.findByUserId(userId);
};

// Obtener inventario por categoría
export const getUserInventoryByCategoryService = async (
  userId: number, 
  category: string
): Promise<UserInventory[]> => {
  return await UserInventoryRepository.findByUserAndCategory(userId, category);
};

// Crear o inicializar inventario de un producto para un usuario
export const createUserInventoryService = async (
  data: CreateUserInventoryDto
): Promise<UserInventory> => {
  // Verificar si ya existe
  const existing = await UserInventoryRepository.findByUserAndProduct(
    data.userId, 
    data.productId
  );
  
  if (existing) {
    throw new Error("El inventario para este producto ya existe");
  }

  // Obtener usuario y producto
  const user = await UserRepository.findOneBy({ id: data.userId });
  const product = await ProductRepository.findOneBy({ id: data.productId });

  if (!user || !product) {
    throw new Error("Usuario o producto no encontrado");
  }

  const userInventory = UserInventoryRepository.create({
    user,
    product,
    currentStock: data.currentStock || 0,
    incoming: data.incoming || 0,
    consumed: data.consumed || 0,
    total: data.total || 0
  });

  return await UserInventoryRepository.save(userInventory);
};

// Actualizar inventario
export const updateUserInventoryService = async (
  userId: number,
  productId: number,
  data: UpdateUserInventoryDto
): Promise<UserInventory> => {
  const userInventory = await UserInventoryRepository.findByUserAndProduct(userId, productId);
  
  if (!userInventory) {
    throw new Error("Inventario no encontrado");
  }

  // Actualizar solo los campos enviados
  Object.assign(userInventory, data);

  // Si se actualiza algún valor, recalcular el total
  if (data.currentStock !== undefined || data.incoming !== undefined || data.consumed !== undefined) {
    userInventory.total = userInventory.currentStock + userInventory.incoming - userInventory.consumed;
  }

  return await UserInventoryRepository.save(userInventory);
};

// Inicializar inventario para un nuevo usuario (crear registros con todos los productos)
export const initializeUserInventoryService = async (userId: number): Promise<void> => {
  const user = await UserRepository.findOneBy({ id: userId });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const products = await ProductRepository.find();
  
  for (const product of products) {
    const existing = await UserInventoryRepository.findByUserAndProduct(userId, product.id);
    
    if (!existing) {
      const userInventory = UserInventoryRepository.create({
        user,
        product,
        currentStock: 0,
        incoming: 0,
        consumed: 0,
        total: 0
      });
      
      await UserInventoryRepository.save(userInventory);
    }
  }
};