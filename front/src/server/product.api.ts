// src/server/product.api.ts
import type { Product } from '@/types/product';
import { useAuthStore } from "@/stores/auth.store"; // ✅ Agrega esta importación

const API_BASE_URL = 'http://localhost:3002';

// ✅ Cambia esta función para usar Zustand
const getAuthToken = (): string | null => {
  return useAuthStore.getState().token; // ✅ Mismo sistema que auth.api.ts
};

// Helper para headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  console.log('🔍 Token obtenido del store:', token); // Debug temporal
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// GET /inventory - Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/inventory`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }

  return response.json();
};

// GET /inventory/category/:category - Obtener productos por categoría
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products/inventory/category/${category}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error al obtener productos de la categoría ${category}`);
  }

  return response.json();
};

// POST /inventory - Crear nuevo producto
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/inventory`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Error al crear producto');
  }

  return response.json();
};

// PATCH /inventory/:id - Actualizar producto
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/inventory/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar producto');
  }

  return response.json();
};

// DELETE /inventory/:id - Eliminar producto
export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/inventory/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al eliminar producto');
  }
};

// Función específica para actualizar solo el stock
export const updateProductStock = async (id: string, newStock: number): Promise<Product> => {
  return updateProduct(id, { currentStock: newStock });
};

// Tipo para UserInventory (incluye el producto)
export interface UserInventoryItem {
  id: number;
  product: Product;
  currentStock: number;
  incoming: number;
  consumed: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// GET /user-inventory - Obtener todo el inventario del usuario
export const getUserInventory = async (): Promise<UserInventoryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/user-inventory`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener inventario del usuario');
  }

  return response.json();
};

// GET /user-inventory/category/:category - Obtener inventario por categoría
export const getUserInventoryByCategory = async (category: string): Promise<UserInventoryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/user-inventory/category/${category}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error al obtener inventario de la categoría ${category}`);
  }

  return response.json();
};

// PATCH /user-inventory/product/:productId - Actualizar inventario de un producto
export const updateUserInventory = async (
  productId: string | number, // ← Acepta ambos tipos
  updates: {
    currentStock?: number;
    incoming?: number;
    consumed?: number;
    total?: number;
  }
): Promise<UserInventoryItem> => {
  const response = await fetch(`${API_BASE_URL}/user-inventory/product/${productId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar inventario');
  }

  return response.json();
};

// Función específica para actualizar solo el stock del usuario
export const updateUserInventoryStock = async (productId: string, newStock: number): Promise<UserInventoryItem> => {
  return updateUserInventory(productId, { currentStock: newStock });
};

// ============ INVENTORY HISTORY ENDPOINTS ============

// GET /inventory-history/by-date?date=YYYY-MM-DD
export const getInventoryHistoryByDate = async (date: Date): Promise<any[]> => {
  const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  const response = await fetch(`${API_BASE_URL}/inventory-history/by-date?date=${dateStr}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener historial');
  }

  return response.json();
};

// GET /inventory-history/last-30-days
export const getInventoryHistoryLast30Days = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/inventory-history/last-30-days`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener historial de los últimos 30 días');
  }

  return response.json();
};