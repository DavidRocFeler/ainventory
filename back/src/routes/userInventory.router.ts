import { Router } from "express";
import {
  // getInventoryController,
  // getInventoryByCategoryController,
  updateItemController,
  // getInventoryItemDetailsController 
} from "../controllers/userInventory.controller";
import checkLogin from "../middlewares/checkLogin.middleware";

const router = Router();
router.use(checkLogin);

// Obtener todo el inventario del usuario logueado
// router.get("/", getInventoryController);

// Obtener ítems por categoría (ej: /category/wine)
// router.get("/category/:category", getInventoryByCategoryController);

// Detalles de un ítem específico (nuevo endpoint)
// router.get("/item/:itemId", getInventoryItemDetailsController);

// Actualizar un ítem (ej: stock)
router.put("/product/:productId", updateItemController);

export default router;