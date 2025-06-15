import { AppDataSource } from "../config/dataSource";
import { ProductEntity } from "../entities/ProductEntity";

export const ProductRepository = AppDataSource.getRepository(ProductEntity);