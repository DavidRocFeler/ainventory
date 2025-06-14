import { Router } from "express";
import {
  getInventory,
  getInventoryByCategory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/product.controller";
import checkLogin from "../middlewares/checkLogin.middleware";

const router = Router();

router.use((req, res, next) => {
  console.log(`🚨 PRODUCTS ROUTER: ${req.method} ${req.url}`);
  next();
});

// Rutas para el inventario, protegidas por autenticación
router.get("/inventory", checkLogin, getInventory);
router.get("/inventory/category/:category", checkLogin, getInventoryByCategory);
router.post("/inventory", checkLogin, createInventoryItem);
router.patch("/inventory/:id", checkLogin, updateInventoryItem);
router.delete("/inventory/:id", checkLogin, deleteInventoryItem);

export default router;