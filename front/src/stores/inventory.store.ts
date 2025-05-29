// src/store/inventoryStore.ts
import { create } from 'zustand';

interface InventoryState {
  productTotals: Record<string, number>; // productId -> total
  updateProductTotal: (productId: string, total: number) => void;
  getProductTotal: (productId: string) => number;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  productTotals: {},
  
  updateProductTotal: (productId: string, total: number) => {
    set((state) => ({
      productTotals: {
        ...state.productTotals,
        [productId]: total
      }
    }));
  },
  
  getProductTotal: (productId: string) => {
    return get().productTotals[productId] || 0;
  }
}));