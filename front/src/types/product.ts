
export interface Product {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  icon: string;
  category: 'wine' | 'beer' | 'spirits' | 'coffee' | 'other';
}

export interface DailyConsumption {
  date: string;
  consumed: number;
  inStock: number;
  total: number;
}
