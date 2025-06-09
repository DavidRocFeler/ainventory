import { IInventoryHistoryItem } from "./inventory";

export interface IProductModalProps {
  product: IInventoryHistoryItem;
  onClose: () => void;
  upDateProductProps?: IProductInventoryUpdate;
  selectedDate: Date; // Ya está definido
  refreshData: (date: Date) => Promise<void>; 
}

export interface IProductInventoryUpdate {
  instock?: number;    // Opcional (Partial)
  incoming?: number;   // Opcional (Partial)
  total?: number;      // Opcional (Partial)
  updated_at: string;  // Obligatorio (ISO string)
}
