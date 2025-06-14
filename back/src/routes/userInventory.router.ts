import { Router } from "express";
import {
  getUserInventory,
  getUserInventoryByCategory,
  updateUserInventory,
  initializeUserInventory
} from "../controllers/userInventory.controller";
import checkLogin from "../middlewares/checkLogin.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(checkLogin);

// Obtener todo el inventario del usuario
router.get("/", getUserInventory);

// Obtener inventario por categoría
router.get("/category/:category", getUserInventoryByCategory);

// Actualizar inventario de un producto
router.patch("/product/:productId", updateUserInventory);

// Inicializar inventario del usuario (crear todos los productos en 0)
router.post("/initialize", initializeUserInventory);

export default router;