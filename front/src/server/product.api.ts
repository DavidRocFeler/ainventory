// src/server/product.api.ts
import type { IProductInventoryUpdate } from '@/types/product';
import { useAuthStore } from "@/stores/auth.store"; // ✅ Agrega esta importación
import { format } from 'date-fns';
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
    method: 'PUT',
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


// GET /inventory-history/by-date?date=YYYY-MM-DD
export const getInventoryHistoryByDate = async (date: Date): Promise<any[]> => {
  const dateStr = format(date, 'yyyy-MM-dd'); // ✅ Usar format de date-fns
  const response = await fetch(`${API_URL}/inventory-history/by-date?date=${dateStr}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener historial');
  }

  return response.json();
};

// GET /proucts - Obtener todos los productos /// check 
// export const getProducts = async (): Promise<UserInventoryItem[]> => {
//   const response = await fetch(`${API_BASE_URL}/products/inventory`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });

//   if (!response.ok) {
//     throw new Error('Error al obtener productos');
//   }

//   return response.json();
// };


// GET /user-inventory - Obtener todo el inventario del usuario ////// check
// export const getUserInventory = async (): Promise<UserInventoryItem[]> => {
//   console.log('🚀 Iniciando petición a user-inventory...');
  
//   const response = await fetch(`${API_BASE_URL}/user-inventory`, {
//     method: 'GET',
//     headers: {
//       ...getAuthHeaders(),
//       'Cache-Control': 'no-cache',
//       'Pragma': 'no-cache'
//     },
//     cache: 'no-store'
//   });
  
//   console.log(`📊 Respuesta del servidor: ${response.status} ${response.statusText}`);
  
//   if (response.status === 304) {
//     console.log('⚠️ Respuesta 304 - datos no modificados');
//     throw new Error('Datos no modificados - revisar configuración de cache');
//   }
  
//   if (!response.ok) {
//     throw new Error(`Error al obtener inventario: ${response.status} ${response.statusText}`);
//   }
  
//   const rawData = await response.json();
//   console.log('📥 Datos raw recibidos:', rawData);
//   console.log('📥 Tipo de datos:', typeof rawData);
//   console.log('📥 Es array?:', Array.isArray(rawData));
  
//   // ✅ ARREGLADO: Manejo seguro de la respuesta
//   let data: UserInventoryResponse;
//   let items: UserInventoryItem[];
  
//   // Si la respuesta ya es un array (API devuelve directamente los items)
//   if (Array.isArray(rawData)) {
//     console.log('📋 Respuesta es array directo');
//     items = rawData;
//   } 
//   // Si la respuesta tiene la estructura esperada {success, data: {items}}
//   else if (rawData && rawData.data && Array.isArray(rawData.data.items)) {
//     console.log('📋 Respuesta tiene estructura completa');
//     data = rawData as UserInventoryResponse;
//     items = data.data.items;
//   }
//   // Si la respuesta tiene items directamente en data
//   else if (rawData && Array.isArray(rawData.data)) {
//     console.log('📋 Items están en rawData.data');
//     items = rawData.data;
//   }
//   // Fallback - intentar usar rawData directamente
//   else {
//     console.log('⚠️ Estructura de respuesta inesperada, intentando fallback');
//     console.log('🔍 rawData:', rawData);
    
//     // Intentar encontrar el array en cualquier lugar
//     if (rawData && rawData.items && Array.isArray(rawData.items)) {
//       items = rawData.items;
//     } else {
//       throw new Error(`Estructura de respuesta inesperada. Recibido: ${JSON.stringify(rawData)}`);
//     }
//   }
  
//   console.log('✅ Items finales:', items);
//   console.log('🔢 Cantidad de items:', items?.length || 0);
  
//   // Validar que items es un array
//   if (!Array.isArray(items)) {
//     throw new Error(`Se esperaba un array pero se recibió: ${typeof items}`);
//   }
  
//   return items;
// };


// GET /inventory/category/:category - Obtener productos por categoría
// export const getProductsByCategory = async (category: string): Promise<UserInventoryItem[]> => {
//   const response = await fetch(`${API_BASE_URL}/products/inventory/category/${category}`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });

//   if (!response.ok) {
//     throw new Error(`Error al obtener productos de la categoría ${category}`);
//   }

//   return response.json();
// };





// DELETE /inventory/:id - Eliminar producto
// export const deleteProduct = async (id: string): Promise<void> => {
//   const response = await fetch(`${API_BASE_URL}/products/inventory/${id}`, {
//     method: 'DELETE',
//     headers: getAuthHeaders(),
//   });

//   if (!response.ok) {
//     throw new Error('Error al eliminar producto');
//   }
// };

// Función específica para actualizar solo el stock
// export const updateProductStock = async (id: string, newStock: number): Promise<Product> => {
//   return updateProduct(id, { currentStock: newStock });
// };

// GET /user-inventory/category/:category - Obtener inventario por categoría
// export const getUserInventoryByCategory = async (category: string): Promise<UserInventoryItem[]> => {
//   const response = await fetch(`${API_BASE_URL}/user-inventory/category/${category}`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });

//   if (!response.ok) {
//     throw new Error(`Error al obtener inventario de la categoría ${category}`);
//   }

//   return response.json();
// };

// PATCH /user-inventory/product/:productId - Actualizar inventario de un producto
// export const updateUserInventory = async (
//   productId: string | number,
//   updates: {
//     currentStock?: number;
//     incoming?: number;
//     consumed?: number;
//     total?: number;
//   },
//   date?: Date
// ): Promise<UserInventoryItem> => {
//   // Construir la URL base
//   let url = `${API_BASE_URL}/user-inventory/product/${productId}`;
  
//   // Preparar el cuerpo de la solicitud con tipos explícitos
//   const body: {
//     currentStock?: number;
//     incoming?: number;
//     consumed?: number;
//     total?: number;
//     date?: string;
//   } = { ...updates };
  
//   // Manejo de fechas con validación
//   if (date) {
//     if (!(date instanceof Date)) {
//       throw new Error('El parámetro date debe ser una instancia de Date');
//     }
    
//     const dateStr = format(date, 'yyyy-MM-dd');
//     body.date = dateStr;
    
//     // Solo añadir a query si no es hoy
//     if (!isToday(date)) {
//       url += `?date=${dateStr}`;
//     }
//   }

//   const response = await fetch(url, {
//     method: 'PATCH',
//     headers: getAuthHeaders(),
//     body: JSON.stringify(body),
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || 'Error al actualizar inventario');
//   }

//   return response.json() as Promise<UserInventoryItem>;
// };

// Función específica para actualizar solo el stock del usuario
// export const updateUserInventoryStock = async (productId: string, newStock: number): Promise<UserInventoryItem> => {
//   return updateUserInventory(productId, { currentStock: newStock });
// };

// ============ INVENTORY HISTORY ENDPOINTS ============


// GET /inventory-history/last-30-days
// export const getInventoryHistoryLast30Days = async (): Promise<any[]> => {
//   const response = await fetch(`${API_BASE_URL}/inventory-history/last-30-days`, {
//     method: 'GET',
//     headers: getAuthHeaders(),
//   });

//   if (!response.ok) {
//     throw new Error('Error al obtener historial de los últimos 30 días');
//   }

//   return response.json();
// };

