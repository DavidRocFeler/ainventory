import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { ProductGrid } from '@/components/dashboard/ProductGrid';
import { ProductModal } from '@/components/dashboard/ProductModal';
import { AddProductModal } from '@/components/dashboard/AddProductModal';
import { 
  getUserInventory, 
  updateUserInventoryStock,
  type UserInventoryItem 
} from '@/server/product.api';
import type { Product } from '@/types/product';
import { getProductOrderMap } from '@/config/productOrder';

const Dashboard = () => {
  const [inventoryItems, setInventoryItems] = useState<UserInventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ NUEVO: Estado para el inventario mapeado
  const [inventoryData, setInventoryData] = useState<Record<string, {
    currentStock: number;
    incoming: number;
    consumed: number;
    total: number;
  }>>({});

  useEffect(() => {
    const loadUserInventory = async () => {
      try {
        setLoading(true);
        const userInventory = await getUserInventory();
        
        // ✅ NUEVO: Obtener el mapa de orden
        const orderMap = getProductOrderMap();
        
        // ✅ NUEVO: Ordenar el inventario según tu configuración
        const sortedInventory = [...userInventory].sort((a, b) => {
          const orderA = orderMap.get(a.product.name) ?? 999;
          const orderB = orderMap.get(b.product.name) ?? 999;
          return orderA - orderB;
        });
        
        setInventoryItems(sortedInventory);
        
        // ✅ Crear productos para el grid (ya ordenados)
        const productsWithUserStock = sortedInventory.map(item => ({
          ...item.product,
          currentStock: item.currentStock,
          incoming: item.incoming,
          consumed: item.consumed,
          total: item.total
        }));
        
        // ✅ Crear mapa de inventario
        const inventoryMap: Record<string, any> = {};
        sortedInventory.forEach(item => {
          inventoryMap[item.product.id.toString()] = {
            currentStock: item.currentStock,
            incoming: item.incoming,
            consumed: item.consumed,
            total: item.total
          };
        });
        setInventoryData(inventoryMap);
        
        setProducts(productsWithUserStock);
        setError(null);
      } catch (err) {
        console.error('Error al cargar inventario:', err);
        setError('Error al cargar inventario del usuario');
      } finally {
        setLoading(false);
      }
    };

    loadUserInventory();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleUpdateStock = async (productId: string, updatedData: {
    currentStock: number;
    incoming: number;
    consumed: number;
    total: number;
  }) => {
    try {
      // Actualizar inventoryItems
      setInventoryItems(prevItems => 
        prevItems.map(item => 
          item.product.id.toString() === productId 
            ? { 
                ...item, 
                currentStock: updatedData.currentStock,
                incoming: updatedData.incoming,
                consumed: updatedData.consumed,
                total: updatedData.total
              }
            : item
        )
      );
      
      // ✅ NUEVO: Actualizar inventoryData
      setInventoryData(prev => ({
        ...prev,
        [productId]: updatedData
      }));
      
      // Actualizar products
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { 
                ...product, 
                currentStock: updatedData.currentStock,
                incoming: updatedData.incoming,
                consumed: updatedData.consumed,
                total: updatedData.total
              }
            : product
        )
      );
      
      if (selectedProduct?.id === productId) {
        setSelectedProduct(prev => prev ? { 
          ...prev, 
          currentStock: updatedData.currentStock,
          incoming: updatedData.incoming,
          consumed: updatedData.consumed,
          total: updatedData.total
        } : null);
      }
      
    } catch (error) {
      console.error('Error al actualizar inventario:', error);
      alert('Error al actualizar el inventario');
    }
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
    };
    setProducts([...products, product]);
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E7E1BC' }}>
        <div className="text-lg">Download inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E7E1BC' }}>
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E7E1BC' }}>
      <Header onAddProduct={() => setIsAddModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <ProductGrid 
          products={products} 
          inventoryData={inventoryData}  // ✅ NUEVO: Pasar inventoryData
          onProductClick={handleProductClick} 
        />
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          inventoryItem={inventoryData[selectedProduct.id]}  // ✅ Usar inventoryData
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

export default Dashboard;