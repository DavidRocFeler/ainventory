// back/src/controllers/product.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/dataSource";
import { ProductEntity } from "../entities/ProductEntity";

const productRepository = AppDataSource.getRepository(ProductEntity);

export const getAllProductsController = async (req: Request, res: Response) => {
    const products = await productRepository.find({
        select: ['product_id', 'name', 'unit', 'icon', 'category'],
        order: { name: 'ASC' } // Orden alfabético
    });
    res.json(products);
};