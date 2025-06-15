// back/src/routers/products.router.ts
import { Router } from "express";
import { getAllProductsController } from "../controllers/product.controller";

const router = Router();

/**
 * Endpoint PÚBLICO para obtener todos los productos precargados
 * Accesible tanto para Sarda, Test como cualquier usuario
 * Sin necesidad de autenticación
 */
router.get("/", getAllProductsController);

// Eliminamos todas las otras rutas (POST, PATCH, DELETE)
// ya que los productos solo se crean manualmente en el back

export default router;