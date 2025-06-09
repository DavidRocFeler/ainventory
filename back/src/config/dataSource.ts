import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./envs";
dotenv.config();

import { UserEntity } from "../entities/UserEntity";
import { CredentialEntity } from "../entities/CredentialEntity";
import { ProductEntity } from "../entities/ProductEntity";
import { UserInventoryEntity } from "../entities/UserInventoryEntity";
import { InventoryHistoryEntity } from "../entities/InventoryHistoryEntity";
import { InventoryItemsEntity } from "../entities/InventoryItemsEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  dropSchema: true,
  logging: false,
  entities: [
    UserEntity,           // Base (no depende de otras)
    CredentialEntity,     // Depende de User
    ProductEntity,        // Base (puede depender de User pero es opcional)
    UserInventoryEntity,  // Depende de User
    InventoryItemsEntity, // Depende de UserInventory y Product
    InventoryHistoryEntity // Depende de InventoryItems
  ],
  subscribers: [],
  migrations: [],
});