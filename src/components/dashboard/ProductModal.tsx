
import React, { useState } from 'react';
import { Calendar, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdateStock: (productId: string, newStock: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onUpdateStock
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [editStock, setEditStock] = useState(product.currentStock.toString());

  // Mock data for different dates
  const getMockData = (date: Date) => {
    const dayOfMonth = date.getDate();
    const baseConsumed = dayOfMonth % 8 + 1;
    
    return {
      inStock: product.currentStock,
      consumed: baseConsumed,
      total: product.currentStock + baseConsumed
    };
  };

  const mockData = getMockData(selectedDate);

  const handleSaveStock = () => {
    const newStock = parseInt(editStock);
    if (!isNaN(newStock) && newStock >= 0) {
      onUpdateStock(product.id, newStock);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditStock(product.currentStock.toString());
    setIsEditing(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{product.icon}</span>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-6">
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
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Data for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">In Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Consumed Today</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <Input
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-20"
                            type="number"
                            min="0"
                          />
                        ) : (
                          <span className="text-lg font-medium">{mockData.inStock}</span>
                        )}
                        <span className="text-gray-600">{product.unit}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-lg font-medium">{mockData.consumed}</span>
                      <span className="text-gray-600 ml-1">{product.unit}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-lg font-medium">{mockData.total}</span>
                      <span className="text-gray-600 ml-1">{product.unit}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSaveStock} className="bg-green-600 hover:bg-green-700">
                  Save Stock
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit3 size={16} className="mr-2" />
                Adjust Stock
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
