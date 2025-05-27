
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onAddProduct: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddProduct }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Casa Sarda Dashboard Inventory Bar
        </h1>
        
        <Button
          onClick={onAddProduct}
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-full h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus size={24} />
        </Button>
      </div>
    </header>
  );
};
