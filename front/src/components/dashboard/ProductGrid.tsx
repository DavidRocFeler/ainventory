import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  inventoryData?: Record<string, {  // ✅ Agregar mapa de datos de inventario
    currentStock: number;
    incoming: number;
    consumed: number;
    total: number;
  }>;
  onProductClick: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  inventoryData,  // ✅ Recibir inventoryData
  onProductClick 
}) => {
  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            inventoryItem={inventoryData?.[product.id]}  // ✅ Pasar el inventoryItem correspondiente
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
};