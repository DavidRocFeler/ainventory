import React, { useState, useEffect } from 'react';
import { Calendar, X, Edit3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format, isToday, isFuture, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import type { Product } from '@/types/product';
import { 
  updateUserInventory, 
  getInventoryHistoryByDate,
  type UserInventoryItem 
} from '@/server/product.api';

interface ProductModalProps {
  product: Product;
  inventoryItem?: {  // ✅ Agregar datos del inventario
    currentStock: number;
    incoming: number;
    consumed: number;
    total: number;
  };
  onClose: () => void;
  onUpdateStock: (productId: string, updatedData: {
    currentStock: number;
    incoming: number;
    consumed: number;
    total: number;
  }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  inventoryItem,  // ✅ Recibir inventoryItem
  onClose,
  onUpdateStock
}) => {
  // Usar los valores del inventario si existen, si no usar 0
  const initialStock = inventoryItem?.currentStock ?? product.currentStock ?? 0;
  const initialIncoming = inventoryItem?.incoming ?? 0;
  const initialTotal = inventoryItem?.total ?? 0;
  const initialConsumed = inventoryItem?.consumed ?? 0;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [isEditingIncoming, setIsEditingIncoming] = useState(false);
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  
  const [editStock, setEditStock] = useState(initialStock.toString());
  const [editIncoming, setEditIncoming] = useState(initialIncoming.toString());
  const [editTotal, setEditTotal] = useState(initialTotal.toString());
  const [isTotalManuallyModified, setIsTotalManuallyModified] = useState(false);
  
  const [displayData, setDisplayData] = useState({
    currentStock: initialStock,
    incoming: initialIncoming,
    consumed: initialConsumed,
    total: initialTotal
  });

  // ... resto del código igual ...

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Verificar si la fecha seleccionada es hoy
  const isDateToday = isToday(selectedDate);

  // Cargar datos según la fecha seleccionada
  // Cargar datos según la fecha seleccionada
  useEffect(() => {
    const loadDataForDate = async () => {
      if (isDateToday) {
        // Si es hoy, usar los datos del inventoryItem (no del product)
        setDisplayData({
          currentStock: inventoryItem?.currentStock || 0,  // ✅ Usar inventoryItem
          incoming: inventoryItem?.incoming || 0,          // ✅ Usar inventoryItem
          consumed: inventoryItem?.consumed || 0,          // ✅ Usar inventoryItem
          total: inventoryItem?.total || 0                 // ✅ Usar inventoryItem
        });
        setEditStock((inventoryItem?.currentStock || 0).toString());
        setEditIncoming((inventoryItem?.incoming || 0).toString());
        setEditTotal((inventoryItem?.total || 0).toString());
      } else {
        // Si es día pasado, cargar del historial
        setLoading(true);
        try {
          const history = await getInventoryHistoryByDate(selectedDate);
          const productHistory = history.find(h => h.product.id === Number(product.id));
          
          if (productHistory) {
            setDisplayData({
              currentStock: productHistory.currentStock,
              incoming: productHistory.incoming,
              consumed: productHistory.consumed,
              total: productHistory.total
            });
          } else {
            // No hay datos históricos
            setDisplayData({
              currentStock: 0,
              incoming: 0,
              consumed: 0,
              total: 0
            });
          }
        } catch (error) {
          console.error('Error loading history:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDataForDate();
  }, [selectedDate, isDateToday, product, inventoryItem]); // ✅ Agregar inventoryItem a las dependencias

  // Calcular consumed automáticamente
  const calculateConsumed = (stock: number, incoming: number, total: number) => {
    return Math.max(0, stock + incoming - total);
  };

// Guardar cambios en stock
const handleSaveStock = async () => {
  const newStock = parseInt(editStock);
  if (isNaN(newStock) || newStock < 0) {
    alert('The stock must be a valid number greater than or equal to 0');
    return;
  }

  setSaving(true);
  try {
    const newTotal = isTotalManuallyModified
      ? displayData.total
      : newStock + displayData.incoming;
    
    const consumed = isTotalManuallyModified
      ? calculateConsumed(newStock, displayData.incoming, displayData.total)
      : 0;

    // ✅ ASEGURAR QUE TODOS LOS VALORES SEAN NÚMEROS
    const updateData = {
      currentStock: Number(newStock),        // ✅ Convertir a número
      incoming: Number(displayData.incoming), // ✅ Convertir a número
      total: Number(newTotal),               // ✅ Convertir a número
      consumed: Number(consumed)             // ✅ Convertir a número
    };

    console.log('🔍 Enviando datos:', updateData); // Debug

    await updateUserInventory(product.id, updateData);
    
    setDisplayData(updateData);
    setEditTotal(newTotal.toString());
    
    // ✅ PASAR DATOS CORRECTOS AL COMPONENTE PADRE
    onUpdateStock(product.id, updateData);
    
    setIsEditingStock(false);
  } catch (error) {
    console.error('Error updating stock:', error);
    alert('Error updating stock');
  } finally {
    setSaving(false);
  }
};

// Guardar cambios en incoming
const handleSaveIncoming = async () => {
  const newIncoming = parseInt(editIncoming);
  if (isNaN(newIncoming) || newIncoming < 0) {
    alert('Incoming must be a valid number greater than or equal to 0');
    return;
  }

  setSaving(true);
  try {
    const newTotal = isTotalManuallyModified
      ? displayData.total
      : displayData.currentStock + newIncoming;
    
    const consumed = isTotalManuallyModified
      ? calculateConsumed(displayData.currentStock, newIncoming, displayData.total)
      : 0;

    // ✅ ASEGURAR QUE TODOS LOS VALORES SEAN NÚMEROS
    const updateData = {
      currentStock: Number(displayData.currentStock), // ✅ Convertir a número
      incoming: Number(newIncoming),                  // ✅ Convertir a número
      total: Number(newTotal),                        // ✅ Convertir a número
      consumed: Number(consumed)                      // ✅ Convertir a número
    };

    console.log('🔍 Enviando datos:', updateData); // Debug

    await updateUserInventory(product.id, updateData);
    
    setDisplayData(updateData);
    setEditTotal(newTotal.toString());
    
    // ✅ PASAR DATOS CORRECTOS AL COMPONENTE PADRE
    onUpdateStock(product.id, updateData);
    
    setIsEditingIncoming(false);
  } catch (error) {
    console.error('Error updating incoming:', error);
    alert('Error updating incoming');
  } finally {
    setSaving(false);
  }
};

// Guardar cambios en total
const handleSaveTotal = async () => {
  const newTotal = parseInt(editTotal);
  const maxTotal = displayData.currentStock + displayData.incoming;
  
  if (isNaN(newTotal) || newTotal < 0) {
    alert('Total must be a valid number greater than or equal to 0');
    return;
  }
  
  if (newTotal > maxTotal) {
    alert(`Total cannot be greater than Stock + Incoming (${maxTotal})`);
    return;
  }

  setSaving(true);
  try {
    setIsTotalManuallyModified(true);
    
    const consumed = calculateConsumed(displayData.currentStock, displayData.incoming, newTotal);
    
    // ✅ ASEGURAR QUE TODOS LOS VALORES SEAN NÚMEROS
    const updateData = {
      currentStock: Number(displayData.currentStock), // ✅ Convertir a número
      incoming: Number(displayData.incoming),         // ✅ Convertir a número
      total: Number(newTotal),                        // ✅ Convertir a número
      consumed: Number(consumed)                      // ✅ Convertir a número
    };

    console.log('🔍 Enviando datos:', updateData); // Debug

    await updateUserInventory(product.id, updateData);
    
    setDisplayData(updateData);
    
    // ✅ PASAR DATOS CORRECTOS AL COMPONENTE PADRE
    onUpdateStock(product.id, updateData);
    
    setIsEditingTotal(false);
  } catch (error) {
    console.error('Error updating total:', error);
    alert('Error updating total');
  } finally {
    setSaving(false);
  }
};

// También agrega este useEffect para resetear isTotalManuallyModified cuando cambie la fecha
useEffect(() => {
  setIsTotalManuallyModified(false);
}, [selectedDate]);

  // Generar PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text(product.name, 20, 20);
    
    // Fecha
    doc.setFontSize(12);
    doc.text(`Date: ${format(selectedDate, "MMMM d, yyyy")}`, 20, 35);
    
    // Tabla de datos
    doc.setFontSize(14);
    doc.text('Inventory Report', 20, 55);
    
    doc.setFontSize(12);
    const startY = 70;
    const lineHeight = 10;
    
    doc.text(`In Stock: ${displayData.currentStock} ${product.unit}`, 20, startY);
    doc.text(`Incoming: ${displayData.incoming} ${product.unit}`, 20, startY + lineHeight);
    doc.text(`Consumed Today: ${displayData.consumed} ${product.unit}`, 20, startY + lineHeight * 2);
    doc.text(`Total: ${displayData.total} ${product.unit}`, 20, startY + lineHeight * 3);
    
    // Guardar
    doc.save(`${product.name}_${format(selectedDate, "yyyy-MM-dd")}.pdf`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[100%] max-h-[100vh] overflow-x-hidden">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <img src={product.icon} alt={product.name} />
            <h2 className="text-2xl ml-5 font-bold text-gray-900">{product.name}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-6 overflow-x-hidden">
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => isFuture(date)} // Deshabilitar días futuros
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              onClick={handleDownloadPDF} 
              variant="outline"
              disabled={loading}
            >
              <Download size={16} className="mr-2" />
              <span className="hidden min-[400px]:inline">Download PDF</span>
            </Button>
          </div>

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
                      {/* In Stock */}
                      <td className="px-4 py-4">
                        <div>
                          {isEditingStock && isDateToday ? (
                            <div className='w-fit'>
                              <Input
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                className="w-20 mx-auto mb-4"
                                type="number"
                                min="0"
                                disabled={saving}
                              />
                              <div className='flex flex-row'>
                                <Button className='rounded-l-xl rounded-r-[0px]' size="sm" onClick={handleSaveStock} disabled={saving}>
                                  Save
                                </Button>
                                <Button className='rounded-r-xl rounded-l-[0px]' size="sm" variant="outline" onClick={() => {
                                  setEditStock(displayData.currentStock.toString());
                                  setIsEditingStock(false);
                                }}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-col justify-center mt-[0.4rem]'>
                              <div className='flex justify-center'>
                                <span className="text-lg font-medium">{displayData.currentStock}</span>   

                              </div>
                              {isDateToday && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsEditingStock(true)}
                                  disabled={saving}
                                >
                                  <Edit3 size={14} />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Incoming */}
                      <td className="py-4 px-4">
                        <div>
                          {isEditingIncoming && isDateToday ? (
                            <div className='w-fit mx-auto'>
                              <Input
                                value={editIncoming}
                                onChange={(e) => setEditIncoming(e.target.value)}
                                className="w-20 mx-auto mb-4"
                                type="number"
                                min="0"
                                disabled={saving}
                              />
                              <div className='flex flex-row'>
                              <Button className='rounded-l-xl rounded-r-[0px]' size="sm" onClick={handleSaveIncoming} disabled={saving}>
                                Save
                              </Button>
                              <Button className='rounded-r-xl rounded-l-[0px]' size="sm" variant="outline" onClick={() => {
                                setEditIncoming(displayData.incoming.toString());
                                setIsEditingIncoming(false);
                              }}>
                                Cancel
                              </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-col mt-[0.4rem] justify-center'>
                              <div className=' flex justify-center'>
                                <span className="text-lg font-medium">{displayData.incoming}</span>
                              
                              </div>
                              {isDateToday && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsEditingIncoming(true)}
                                  disabled={saving}
                                >
                                  <Edit3 size={14} />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Consumed - Solo lectura */}
                      <td className="py-4 px-4">
                        <div className='w-fit pt-[0.3px] space-y-[5px] mx-auto flex flex-col items-center'>
                        <span className="text-lg font-medium">{displayData.consumed}</span>
                        <span className="text-gray-600 ml-1">{product.unit}</span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4">
                        <div>
                          {isEditingTotal && isDateToday ? (
                             <div className='w-fit mx-auto'>
                              <Input
                                value={editTotal}
                                onChange={(e) => setEditTotal(e.target.value)}
                                className="w-20 mx-auto mb-4"
                                type="number"
                                min="0"
                                disabled={saving}
                              />
                              <div className='flex flex-row'>
                              <Button className='rounded-l-xl rounded-r-[0px]' size="sm" onClick={handleSaveTotal} disabled={saving}>
                                Save
                              </Button>
                              <Button className='rounded-r-xl rounded-l-[0px]' size="sm" variant="outline" onClick={() => {
                                setEditTotal(displayData.total.toString());
                                setIsEditingTotal(false);
                              }}>
                                Cancel
                              </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-col mt-[0.5rem] justify-center'>
                              <div className='flex justify-center'>
                              <span className="text-lg font-medium">{displayData.total}</span>
                              </div>
                              {isDateToday && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setIsEditingTotal(true)}
                                  disabled={saving}
                                >
                                  <Edit3 size={14} />
                                </Button>
                              )}
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