export type IProductCategory = 'wine' | 'beer' | 'liqueur' | 'soda' | 'water' | 'drinks-o' | "drinks" | 'others';

export interface IInventoryHistoryItem {
  item_id: number;
  product_id: number;
  name: string;
  unit: string;
  icon: string;
  category: IProductCategory;
  history_id: number | null;
  record_date: string | null;
  instock: number;
  incoming: number;
  consumed: number;
  total: number;
}

// Definimos el tipo de respuesta esperada
export interface IInventoryHistoryResponse {
  success: boolean;
  data: IInventoryHistoryItem[];
}