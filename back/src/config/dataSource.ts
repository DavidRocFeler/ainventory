import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

import { User } from "../entities/User";
import { Credential } from "../entities/Credential";
import { Product } from "../entities/Product";
import { UserInventory } from "../entities/UserInventory";
import { InventoryHistory } from "../entities/InventoryHistory";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,           // ✅ localhost
  port: parseInt(process.env.DB_PORT || "5432"), // ✅ 5432
  username: process.env.DB_USER,       // ✅ macbook
  password: process.env.DB_PASSWORD,   // ✅ rdpalominop1997
  database: process.env.DB_NAME,       // ✅ ainventory
  synchronize: false,
  dropSchema: false,
  logging: false,
  ssl: true, // ✅ Sin SSL para DB local
  entities: [User, Credential, Product, UserInventory, InventoryHistory],
  subscribers: [],
  migrations: [],
});