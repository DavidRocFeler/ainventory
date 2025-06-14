import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./envs";
dotenv.config();

import { User } from "../entities/User";
import { Credential } from "../entities/Credential";
import { Product } from "../entities/Product";
import { UserInventory } from "../entities/UserInventory";
import { InventoryHistory } from "../entities/InventoryHistory";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  entities: [User, Credential, Product, UserInventory, InventoryHistory],
  subscribers: [],
  migrations: [],
});