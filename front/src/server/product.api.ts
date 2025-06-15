// src/server/product.api.ts
import type { IProductInventoryUpdate } from '@/types/product';
import { useAuthStore } from "@/stores/auth.store"; // ✅ Agrega esta importación
import { IInventoryHistoryItem, IInventoryHistoryResponse} from '@/types/inventory';

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Cambia esta función para usar Zustand
const getAuthToken = (): string | null => {
  return useAuthStore.getState().token; // ✅ Mismo sistema que auth.api.ts
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  // console.log('🔍 Token obtenido del store:', token); // Debug temporal
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// PATCH - Actualizar producto
export const updateProduct = async (
  productId: number, 
  productData: Partial<IProductInventoryUpdate>
): Promise<IProductInventoryUpdate> => {
  // 🔍 LOGS DETALLADOS
  // console.log('=== UPDATE PRODUCT DEBUG START ===');
  // console.log('1. id received:', productId);
  // console.log('2. productData received:', productData);
  // console.log('3. URL constructed:', `${API_BASE_URL}/user-inventory/product/${productId}`);
  // console.log('4. Headers:', getAuthHeaders());
  // console.log('5. Body to send:', JSON.stringify(productData));
  
  const response = await fetch(`${API_URL}/user-inventory/product/${productId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  
  // console.log('6. Response status:', response.status);
  // console.log('7. Response ok:', response.ok);
  
  if (!response.ok) {
    throw new Error('Error al actualizar producto');
  }
  
  const result = await response.json();
  // console.log('8. Response data:', result);
  // console.log('=== UPDATE PRODUCT DEBUG END ===');
  
  return result;
};

// Función para obtener el historial de inventario por fecha
export const getInventoryHistory = async (date: Date | string): Promise<IInventoryHistoryItem[]> => {
  // Formateo correcto que respeta la zona horaria local
  const dateParam = typeof date === 'string' ? date : 
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  const timestamp = new Date().getTime();
  
  const response = await fetch(`${API_URL}/inventory-history/inventory?date=${dateParam}&_t=${timestamp}`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial de inventario');
  }

  const result: IInventoryHistoryResponse = await response.json();
  
  if (!result.success) {
    throw new Error('La respuesta del servidor no fue exitosa');
  }

  return result.data;
};

