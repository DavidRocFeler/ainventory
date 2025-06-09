// src/helpers/preLoadInventories.ts
import { AppDataSource } from "../config/dataSource";
import { UserEntity } from "../entities/UserEntity";
import { ProductEntity } from "../entities/ProductEntity";
import { UserInventoryEntity } from "../entities/UserInventoryEntity";
import { InventoryItemsEntity } from "../entities/InventoryItemsEntity";

export const preLoadInventories = async () => {
  const userRepository = AppDataSource.getRepository(UserEntity);
  const productRepository = AppDataSource.getRepository(ProductEntity);
  const userInventoryRepository = AppDataSource.getRepository(UserInventoryEntity);
  const inventoryItemsRepository = AppDataSource.getRepository(InventoryItemsEntity);

  // Verificar si ya existen inventarios
  const existingInventories = await userInventoryRepository.find();
  
  if (existingInventories.length === 0) {
    console.log("⏳ Preloading inventories...");
    
    // Obtener todos los usuarios
    const users = await userRepository.find();
    
    // Obtener todos los productos
    const products = await productRepository.find();
    
    if (users.length === 0) {
      console.log("⚠️ No users found. Make sure to preload users first!");
      return;
    }
    
    if (products.length === 0) {
      console.log("⚠️ No products found. Make sure to preload products first!");
      return;
    }

    // Crear inventario para cada usuario
    for (const user of users) {
      console.log(`⏳ Creating inventory for user: ${user.email}`);
      
      // Crear el inventario principal del usuario
      const userInventory = userInventoryRepository.create({
        user: user
      });
      
      const savedInventory = await userInventoryRepository.save(userInventory);
      
      // Crear items de inventario para cada producto (inicializados en 0)
      const inventoryItems = products.map(product => 
        inventoryItemsRepository.create({
          inventory: savedInventory,
          product: product,
          instock: 0,
          incoming: 0,
          consumed: 0,
          total: 0
        })
      );
      
      // Guardar todos los items del inventario
      await inventoryItemsRepository.save(inventoryItems);
      
      console.log(`✅ Inventory created for ${user.email} with ${products.length} products`);
    }
    
    console.log("🎉 Inventories preloading completed");
  } else {
    console.log("ℹ️ Inventories already exist in database, skipping preload");
  }
};