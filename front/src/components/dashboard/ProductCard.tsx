import React from 'react';
import { useState, useEffect } from 'react';
import { IInventoryHistoryItem } from '@/types/inventory';
import { format } from 'date-fns';

interface ProductCardProps {
  product: IInventoryHistoryItem;
  inventoryItem?: {  // ✅ Agregar datos del inventario
    currentStock: number;
    incoming: number;
    consumed: number;
    total: number;
  };
  onClick: () => void;
  selectedDate: Date;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, inventoryItem, onClick, selectedDate }) => {

  const displayValue = inventoryItem?.total ?? product.total;
  
  const getStockColor = (stock: number) => {
    if (stock <= 5) return 'text-red-600';
    if (stock <= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:scale-[102%] md:hover:scale-105 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <img src={product.icon} alt={product.name} />
        <span className={`text-lg font-semibold ${getStockColor(displayValue)}`}>
          {displayValue}
        </span>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">
        {product.name}
      </h3>
      
      <div className="text-gray-600 text-sm flex flex-row">
        {displayValue} {product.unit} left

        <p className='ml-auto'>
          {format(selectedDate, "MMMM d, yyyy")}
        </p>
      </div>
    </div>
  );
};