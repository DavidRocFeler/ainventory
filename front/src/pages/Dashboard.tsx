import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { ProductGrid } from '@/components/dashboard/ProductGrid';
import ProductModal from '@/components/dashboard/ProductModal';
import { AddProductModal } from '@/components/dashboard/AddProductModal';
import { getInventoryHistory,  } from '@/server/product.api';
import { IInventoryHistoryItem, IProductCategory } from '@/types/inventory';
import { getProductOrderMap } from '@/config/productOrder';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Search, TrendingDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@radix-ui/react-select';

type StockFilter = 'none' | 'menor';

const Dashboard = () => {
  const [products, setProducts] = useState<IInventoryHistoryItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IInventoryHistoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateLoading, setDateLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<IProductCategory | 'all'>('all');
  
  // Nuevos estados para los filtros adicionales
  const [stockFilter, setStockFilter] = useState<StockFilter>('none');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Función para filtrar productos por todos los criterios (CONFINADOS)
  const getFilteredProducts = () => {
    // console.log('Aplicando filtros confinados...');
    let filtered = [...products];

    // 1. Filtro por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
      // console.log(`Filtro por categoría ${categoryFilter}:`, filtered.length);
    }

    // 2. Filtro por búsqueda (nombre del producto)
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // console.log(`Filtro por búsqueda "${searchTerm}":`, filtered.length);
    }

    // 3. Filtro por stock menor (total <= 10)
    if (stockFilter === 'menor') {
      filtered = filtered.filter(product => product.total <= 10);
      // console.log(`Filtro Stock Menor (total <= 10):`, filtered.length);
    }

    // console.log('Productos filtrados finales:', filtered);
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const handleAddProduct = (newProduct: Omit<IInventoryHistoryItem, 'item_id'>) => {
    const product: IInventoryHistoryItem = {
      ...newProduct,
      item_id: Math.random(),
      history_id: null,
      record_date: null,
      instock: 0,
      incoming: 0,
      consumed: 0,
      total: 0
    };
    setProducts([...products, product]);
    setIsAddModalOpen(false);
  };

  const loadInventoryData = async (date: Date) => {
    // console.log('loadInventoryData llamado con fecha:', date);
    // console.log('Fecha formateada para API:', format(date, 'yyyy-MM-dd'));
    try {
      setLoading(true);
      setCategoryFilter('all');
      setStockFilter('none');
      setSearchTerm('');
      setIsSearchExpanded(false);
      setDateLoading(true);
      const inventoryHistory = await getInventoryHistory(date);
      // console.log('Datos recibidos de API:', inventoryHistory);
      
      if (!Array.isArray(inventoryHistory)) {
        throw new Error('Unexpected response format');
      }

      const orderMap = getProductOrderMap();
      const sortedInventory = [...inventoryHistory].sort((a, b) => {
        const orderA = orderMap.get(a.name) ?? 999;
        const orderB = orderMap.get(b.name) ?? 999;
        return orderA - orderB;
      });

      setProducts(sortedInventory);
      setError(null);
    } catch (err) {
      // console.error('Error en loadInventoryData:', err);
      setError(`Error loading inventory: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(new Date(date));
      // console.log('Fecha traida:', setSelectedDate)
    }
  };
  
  useEffect(() => {
    // console.log('useEffect ejecutándose para fecha:', selectedDate);
    loadInventoryData(selectedDate);
    // console.log('useEffect ejecutándose - selectedDate:', selectedDate);
    // console.log('useEffect - timestamp:', selectedDate.getTime());
  }, [selectedDate.getTime()]); 

  const handleDownloadCSV = () => {
    const headers = [
      'Product', 
      'In Stock', 
      'Incoming', 
      'Consumed', 
      'Total', 
      'Unity', 
      'Category'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        `"${product.name}"`,
        product.instock,
        product.incoming,
        product.consumed,
        product.total,
        `"${product.unit}"`,
        `"${product.category}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download', 
      `inventory_${format(selectedDate, 'yyyy-MM-dd')}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProductClick = (product: IInventoryHistoryItem) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };


  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setCategoryFilter('all');
    setStockFilter('none');
    setSearchTerm('');
    setIsSearchExpanded(false);
  };

  // Función para manejar el toggle de la búsqueda
  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchTerm('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E7E1BC]">
        <div className="text-lg">Inventory download...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E7E1BC]">
        <div className="text-lg text-red-600">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E7E1BC] pb-[5rem]">
      <Header onAddProduct={() => setIsAddModalOpen(true)} />
      
      <main className="container mx-auto px-4 pt-1">

        <div className="custom-scrollbar flex items-center gap-x-2 mt-[7rem] mb-[1.2rem] relative overflow-x-auto pb-[0.5rem]">
          
          {/* Búsqueda dinámica con lupa deslizante */}
          <div className="flex relative items-center">

            <div className={`flex items-center bg-white rounded-md transition-all duration-300 ease-in-out ${
              isSearchExpanded ? 'mr-1' : 'mr-0'
            }`}>
              <button
                onClick={toggleSearch}
                className={`px-[0.70rem] py-[0.71rem] bg-white rounded-md shadow-sm hover:bg-gray-50 transition-all duration-300 flex items-center justify-center ${
                  isSearchExpanded ? 'rounded-r-none border-r-0' : 'rounded-md'
                }`}
              >
                <Search size={16} className="text-gray-600" />
              </button>
              
              <div className={`overflow-hidden transition-all border-none duration-300 ease-in-out ${
                isSearchExpanded ? 'ml-0 w-48 opacity-100' : 'w-0 opacity-0'
              }`}>
                <input
                  type="text"
                  placeholder="Search Product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-[0.55rem] rounded-r-md focus:outline-none focus:ring-0 text-sm bg-white"
                />
              </div>
        
            </div>

            {/* Botón de filtro por stock menor */}
            <div className="flex gap-2 ml-2">
              <Button
                onClick={() => setStockFilter(stockFilter === 'menor' ? 'none' : 'menor')}
                variant={stockFilter === 'menor' ? 'default' : 'outline'}
                className={`transition-colors ${
                  stockFilter === 'menor' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                }`}
              >
                <TrendingDown size={16} className="mr-1" />
                Minior Stock
              </Button>
            </div>
            
            <div className='ml-2'>
              <Select 
                value={categoryFilter} 
                onValueChange={(value: IProductCategory | 'all') => setCategoryFilter(value)}
              >
                <SelectTrigger 
                className="w-[180px] py-[0.465rem] bg-white rounded-md shadow-sm outline-none focus:ring-0 focus:ring-offset-0 focus:outline-none data-[state=open]:rounded-b-none">
                  <div className="w-full flex justify-around items-center">
                    <span className="text-gray-700">
                      {categoryFilter === 'all' ? 'All categories' : 
                      categoryFilter === 'wine' ? 'Wine' :
                      categoryFilter === 'beer' ? 'Beers' :
                      categoryFilter === 'soda' ? 'Soda' :
                      categoryFilter === 'water' ? 'Water' : 
                      categoryFilter === 'liqueur' ? 'Liqueur':
                      categoryFilter === 'drinks-o' ? 'Drinks-o':
                      categoryFilter === 'drinks' ? 'Drinks':
                      categoryFilter === 'others' ? 'Others' :
                      'Others'}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-gray-400" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </SelectTrigger>
                
                <SelectContent 
                  className="w-[180px] bg-white rounded-md rounded-t-none shadow-lg border-none"
                  position="popper" // ← Clave para el posicionamiento correcto
                  sideOffset={4} // Ajuste fino de posición
                  align="start" // Alineación con el trigger
                  style={{
                    width: "var(--radix-select-trigger-width)", zIndex:'9999' // Mismo ancho que el trigger
                  }}
                >
                  <SelectItem 
                    value="all"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center focus:bg-gray-100 focus:text-black focus:outline-none"
                  >
                    <span className="ml-2">All categories</span>
                  </SelectItem>
                  <SelectItem 
                    value="wine"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center focus:bg-gray-100 focus:text-black focus:outline-none"
                  >
                    <span className="ml-2">Wine</span>
                  </SelectItem>
                  <SelectItem 
                    value="beer"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center focus:bg-gray-100 focus:text-black focus:outline-none"
                  >
                    <span className="ml-2">Beers</span>
                  </SelectItem>
                  <SelectItem 
                    value="soda"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center focus:bg-gray-100 focus:text-black focus:outline-none"
                  >
                    <span className="ml-2">Soda</span>
                  </SelectItem>
                  <SelectItem 
                    value="water"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center focus:bg-gray-100 focus:text-black focus:outline-none"
                  >
                    <span className="ml-2">Water</span>
                  </SelectItem>
                  <SelectItem 
                    value="liqueur"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center focus:bg-gray-100 focus:text-black focus:outline-none"
                  >
                    <span className="ml-2">Liqueur</span>
                  </SelectItem>
                  <SelectItem 
                    value="drinks-o"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center focus:bg-gray-100 focus:text-black focus:outline-none"
                  >
                    <span className="ml-2">Drinks 0</span>
                  </SelectItem>
                  <SelectItem 
                    value="others"
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center focus:bg-gray-100 focus:text-black focus:outline-none"
                  >
                    <span className="ml-2">Others</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2 ml-auto relative">
            {/* Botón para limpiar filtros */}
            {(categoryFilter !== 'all' || stockFilter !== 'none' || searchTerm) && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:bg-gray-50 py-[1.2rem]"
              >
                <X size={14} className="mr-1" />
                Clean filters
              </Button>
            )}

            <Button 
              onClick={handleDownloadCSV}
              variant="outline"
            >
              <Download size={16} className="mr-2" />
              Export Google Sheet
            </Button>

        
            <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    History Calendar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 absolute right-[-5.6rem]">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
            </Popover>       
        

          </div>
        </div>

        {/* Mostrar información de filtros activos */}
        {(categoryFilter !== 'all' || stockFilter !== 'none' || searchTerm) && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Filters activated:</span>
                {categoryFilter !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs">
                    Category: {categoryFilter}
                  </span>
                )}
                {stockFilter === 'menor' && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs">
                    Minior Stock (≤ 10)
                  </span>
                )}
                {searchTerm && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs">
                    Search: "{searchTerm}"
                  </span>
                )}
              </div>
              <div className="text-sm text-blue-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>
          </div>
        )}

        <ProductGrid
          products={filteredProducts}
          onProductClick={handleProductClick}
          selectedDate={selectedDate}
        />     
      </main>
      
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          refreshData={loadInventoryData} 
          selectedDate={selectedDate}
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