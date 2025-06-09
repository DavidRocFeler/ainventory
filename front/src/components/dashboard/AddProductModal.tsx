import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IInventoryHistoryItem } from '@/types/inventory';
import { LogoutButton } from '../LoggoutButton';
import { useNavigate } from 'react-router-dom'; // ✅ Agregar

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<IInventoryHistoryItem, 'id'>) => void;
}

const categoryIcons = {
  wine: '🍷',
  beer: '🍺',
  spirits: '🥃',
  coffee: '☕',
  other: '📦'
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const navigate = useNavigate(); // ✅ Agregar
  const [formData, setFormData] = useState({
    name: '',
    currentStock: '',
    unit: 'bottles',
    category: 'other' as keyof typeof categoryIcons
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ NUEVO: Redirigir a /support en lugar de agregar producto
    onClose(); // Cerrar modal
    navigate('/support'); // Redirigir a support
  };

  const handleClose = () => {
    setFormData({
      name: '',
      currentStock: '',
      unit: 'bottles',
      category: 'other'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Red Wine Malbec"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value: keyof typeof categoryIcons) => 
              setFormData({ ...formData, category: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wine">🍷 Wine</SelectItem>
                <SelectItem value="beer">🍺 Beer</SelectItem>
                <SelectItem value="spirits">🥃 Spirits</SelectItem>
                <SelectItem value="coffee">☕ Coffee</SelectItem>
                <SelectItem value="other">📦 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Current Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => 
                setFormData({ ...formData, unit: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottles">Bottles</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="units">Units</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Product
            </Button>
            <LogoutButton/>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
