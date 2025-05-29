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
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false }  // ✅ Para Render
    : false,                         // Para desarrollo local
  entities: [User, Credential, Product, UserInventory, InventoryHistory],
  subscribers: [],
  migrations: [],
});