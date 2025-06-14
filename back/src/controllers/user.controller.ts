import { Request, Response } from "express";
import { catchedController } from "../utils/catchedController";
import {
  loginUserService,
  registerUserService,
} from "../services/user.service";
import { 
  getUserInventoryService, 
  initializeUserInventoryService 
} from "../services/userInventory.service"; // ✅ AGREGAR

export const registerUser = catchedController(
  async (req: Request, res: Response) => {
    const { email, password, name, address, phone } = req.body;
    const newUser = await registerUserService({
      email,
      password,
      name,
      address,
      phone,
    });
    res.status(201).send(newUser);
  }
);

export const login = catchedController(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await loginUserService({ email, password });
  
  // ✅ NUEVO: Verificar si el usuario tiene inventario inicializado
  try {
    const userInventory = await getUserInventoryService(user.user.id);
    
    if (userInventory.length === 0) {
      console.log(`🔧 Inicializando inventario para usuario ${user.user.email}...`);
      await initializeUserInventoryService(user.user.id);
      console.log(`✅ Inventario inicializado correctamente`);
    }
  } catch (error) {
    console.error("Error al verificar/inicializar inventario:", error);
    // No bloqueamos el login si falla la inicialización
  }
  
  res.status(200).send({
    login: true,
    user: user.user,
    token: user.token,
  });
});