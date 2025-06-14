import { Router } from "express";
import usersRouter from "./users.router";
import productsRouter from "./products.router";
import userInventoryRouter from "./userInventory.router";
import inventoryHistoryRouter from "./inventoryHistory.router";

const router = Router();

router.use((req, res, next) => {
    console.log(`🚨 MAIN ROUTER: ${req.method} ${req.originalUrl}`);
    next();
});

router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/user-inventory", userInventoryRouter);
router.use("/inventory-history", inventoryHistoryRouter);

export default router;