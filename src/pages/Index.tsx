
import React, { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { ProductGrid } from '@/components/dashboard/ProductGrid';
import { ProductModal } from '@/components/dashboard/ProductModal';
import { AddProductModal } from '@/components/dashboard/AddProductModal';
import { mockProducts } from '@/data/mockProducts';
import type { Product } from '@/types/product';

const Index = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, currentStock: newStock }
        : product
    ));
    setSelectedProduct(prev => prev ? { ...prev, currentStock: newStock } : null);
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
    };
    setProducts([...products, product]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E7E1BC' }}>
      <Header onAddProduct={() => setIsAddModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <ProductGrid 
          products={products} 
          onProductClick={handleProductClick} 
        />
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onUpdateStock={handleUpdateStock}
        />
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
};

export default Index;
