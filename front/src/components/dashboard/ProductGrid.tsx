import React from 'react';
import { ProductCard } from './ProductCard';
import { IInventoryHistoryItem } from '@/types/inventory';

interface ProductGridProps {
  products: IInventoryHistoryItem[];
  inventoryData?: Record<string, {  // ✅ Agregar mapa de datos de inventario
    currentStock: number;
    incoming: number;
    consumed: number;
    total: number;
  }>;
  onProductClick: (product: IInventoryHistoryItem) => void;
  selectedDate: Date; 
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  selectedDate,
  onProductClick
}) => {
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.item_id}
            product={product}
            selectedDate={selectedDate} 
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
};