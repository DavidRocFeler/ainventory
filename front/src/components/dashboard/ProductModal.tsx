import React, { useState, useEffect } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Edit3, X } from 'lucide-react';
import { Input } from '../ui/input';
import { IProductInventoryUpdate, IProductModalProps } from '@/types/product';
import { format } from 'date-fns';
import { updateProduct } from '@/server/product.api';
import { isSameDay } from 'date-fns';

const ProductModal: React.FC<IProductModalProps> = ({product, onClose, selectedDate, refreshData}) => { 
  const [loading, setLoading] = useState(false);
  const [isEditingIncoming, setIsEditingIncoming] = useState(false);
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  
  // Estados para los valores temporales de edición
  const [tempInstock, setTempInstock] = useState(product.instock?.toString() || '0');
  const [tempIncoming, setTempIncoming] = useState(product.incoming?.toString() || '0');
  const [tempTotal, setTempTotal] = useState(product.total?.toString() || '0');

  const [currentProduct, setCurrentProduct] = useState(product);

  const isCurrentDate = (selectedDate: Date) => {
    return isSameDay(selectedDate, new Date());
  };

  useEffect(() => {
    setCurrentProduct(product);
    setTempInstock(product.instock?.toString() || '0');
    setTempIncoming(product.incoming?.toString() || '0');
    setTempTotal(product.total?.toString() || '0');
  }, [product]);

  const validateTotal = (totalValue: string, instock: number, incoming: number): boolean => {
    const total = parseInt(totalValue) || 0;
    const maxAllowed = instock + incoming;
    return total <= maxAllowed;
  }

  const validateInventory = (instock: string, incoming: string, total: string): boolean => {
    const instockNum = parseInt(instock) || 0;
    const incomingNum = parseInt(incoming) || 0;
    const totalNum = parseInt(total) || 0;
    
    // Validación 1: El total no puede ser mayor que la suma de instock + incoming
    if (totalNum > (instockNum + incomingNum)) {
      alert("Closed amount cannot be greater than In Stock + Incoming");
      return false;
    }
    
    // Validación 2: El total no puede ser negativo
    if (totalNum < 0) {
      alert("Closed amount cannot be negative");
      return false;
    }
    
    return true;
  };

  const handleUpdateProduct = async (field: 'instock' | 'incoming' | 'total', value: string) => {
    try {
      // Validación para total
      if (field === 'total') {
        const isValidTotal = validateTotal(value, product.instock || 0, product.incoming || 0);
        if (!isValidTotal) {
          alert("Cannot enter a value greater than Incoming + Instock");
          return;
        }
      }
      
      // Validación general de inventario
      const newInstock = field === 'instock' ? value : tempInstock;
      const newIncoming = field === 'incoming' ? value : tempIncoming;
      const newTotal = field === 'total' ? value : tempTotal;
      
      if (!validateInventory(newInstock, newIncoming, newTotal)) {
        return;
      }

      setLoading(true);
      
      const updateDataProduct: Partial<IProductInventoryUpdate> = {
        updated_at: selectedDate.toISOString(),
      };
      
      if (field === 'instock') {
        updateDataProduct.instock = parseInt(value) || 0;
      } else if (field === 'incoming') {
        updateDataProduct.incoming = parseInt(value) || 0;
      } else if (field === 'total') {
        updateDataProduct.total = parseInt(value) || 0;
      }

      setLoading(true);
    
      // Versión corregida - declaración única de updateData
      const updateData: IProductInventoryUpdate = {
        updated_at: selectedDate.toISOString(),
        [field]: parseInt(value) || 0
      };

      await updateProduct(product.product_id, updateData);
      
      // Actualización optimista
      setCurrentProduct(prev => ({
        ...prev,
        instock: field === 'instock' ? parseInt(value) || 0 : prev.instock,
        incoming: field === 'incoming' ? parseInt(value) || 0 : prev.incoming,
        total: field === 'total' ? parseInt(value) || 0 : prev.total
      }));
      
      // Refrescar datos en segundo plano
      await refreshData(selectedDate);
      
      // Cerrar modos de edición
      setIsEditingStock(false);
      setIsEditingIncoming(false);
      setIsEditingTotal(false);
      
      onClose();

    } catch (error) {
      // console.error('Error updating product:', error);
      alert('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (field: 'instock' | 'incoming' | 'total') => {
    if (field === 'instock') {
      setTempInstock(product.instock?.toString() || '0');
      setIsEditingStock(false);
    } else if (field === 'incoming') {
      setTempIncoming(product.incoming?.toString() || '0');
      setIsEditingIncoming(false);
    } else if (field === 'total') {
      setTempTotal(product.total?.toString() || '0');
      setIsEditingTotal(false);
    }
  };

  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[90%] h-[30rem] overflow-x-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <img src={product.icon} alt={product.name} />
            <h2 className="text-2xl ml-5 font-bold text-gray-900">{product.name}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="overflow-x-hidden">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Data for {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-[25rem] sm:w-full mt-[3rem]">
                  <thead> 
                    <tr className="border-b border-gray-200 ">
                      <th className="text-center font-semibold text-gray-700 pb-5">In Stock</th>
                      <th className="text-center font-semibold text-gray-700 pb-5">Incoming</th>
                      <th className="text-center font-semibold text-gray-700 pb-5">Consumed</th>
                      <th className="text-center font-semibold text-gray-700 pb-5">Closed</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 ">

                      {/* IN STOCK COLUMN */}
                      <td className="px-4 py-4 flex justify-center">
                        <div>
                          {isEditingStock ? (
                            <div className='w-fit'>
                              <Input
                                value={tempInstock}
                                onChange={(e) => {
                                  // Permite solo números o campo vacío
                                  const value = e.target.value === '' ? '' : e.target.value.replace(/\D/g, '');
                                  setTempInstock(value);
                                }}
                                className="w-20 mx-auto mb-4"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                disabled={loading}
                              />
                         
                              <div className='flex flex-row'>
                                <Button 
                                  className='rounded-l-xl rounded-r-[0px]' 
                                  size="sm"
                                  onClick={() => handleUpdateProduct('instock', tempInstock || '0')}
                                  disabled={loading || tempInstock === '' || isNaN(parseInt(tempInstock))}
                                >
                                  {loading ? 'Saving...' : 'Save'}
                                </Button>

                                <Button 
                                  className='rounded-r-xl rounded-l-[0px]' 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleCancelEdit('instock')}
                                  disabled={loading}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-col justify-center mt-[0.4rem]'>
                              <div className='flex justify-center items-center'>
                                <p>{currentProduct.instock}</p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsEditingStock(true)}
                                  disabled={loading || !isCurrentDate(selectedDate)}
                                >
                                  <Edit3 size={14} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* INCOMING COLUMN */}
                      <td className="py-4 px-4">
                        <div>
                          {isEditingIncoming ? (
                            <div className='w-fit mx-auto'>
                              <Input
                                 value={tempIncoming}
                                 onChange={(e) => {
                                   // Permite solo números o campo vacío
                                   const value = e.target.value === '' ? '' : e.target.value.replace(/\D/g, '');
                                   setTempIncoming(value);
                                 }}
                                 className="w-20 mx-auto mb-4"
                                 type="text"
                                 inputMode="numeric"
                                 pattern="[0-9]*"
                                 disabled={loading}
                              />
                              <div className='flex flex-row'>
                                <Button 
                                  className='rounded-l-xl rounded-r-[0px]' 
                                  size="sm"
                                  onClick={() => handleUpdateProduct('incoming', tempIncoming || '0')}
                                  disabled={loading || tempIncoming === '' || isNaN(parseInt(tempIncoming))}
                                >
                                  {loading ? 'Saving...' : 'Save'}
                                </Button>

                                <Button 
                                  className='rounded-r-xl rounded-l-[0px]' 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleCancelEdit('incoming')}
                                  disabled={loading}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-col justify-center mt-[0.4rem]'>
                              <div className='flex justify-center items-center'>
                                <p>{currentProduct.incoming}</p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsEditingIncoming(true)}
                                  disabled={loading || !isCurrentDate(selectedDate)}
                                >
                                  <Edit3 size={14} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* CONSUMED COLUMN (Read-only) */}
                      <td className="py-4 px-4 flex justify-center">
                        <div className='flex'>
                          <p>{product.consumed}</p>
                          <span className="text-gray-600 ml-1">{product.unit}</span>
                        </div>
                      </td>

                      {/* TOTAL COLUMN */}
                      <td className="py-4 px-4">
                        <div>
                          {isEditingTotal ? (
                             <div className='w-fit mx-auto'>
                              <Input
                                 value={tempTotal}
                                 onChange={(e) => {
                                   // Permite solo números o campo vacío
                                   const value = e.target.value === '' ? '' : e.target.value.replace(/\D/g, '');
                                   setTempTotal(value);
                                 }}
                                 className="w-20 mx-auto mb-4"
                                 type="text"
                                 inputMode="numeric"
                                 pattern="[0-9]*"
                                 disabled={loading}
                              />
                              <div className='flex flex-row'>
                                <Button 
                                  className='rounded-l-xl rounded-r-[0px]' 
                                  size="sm"
                                  onClick={() => handleUpdateProduct('total', tempTotal || '0')}
                                  disabled={loading || tempTotal === '' || isNaN(parseInt(tempTotal))}
                                >
                                  {loading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button 
                                  className='rounded-r-xl rounded-l-[0px]' 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleCancelEdit('total')}
                                  disabled={loading}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-col justify-center mt-[0.4rem]'>
                              <div className='flex justify-center items-center'>
                                <p>{currentProduct.total}</p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsEditingTotal(true)}
                                  disabled={loading || !isCurrentDate(selectedDate)}
                                >
                                  <Edit3 size={14} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;