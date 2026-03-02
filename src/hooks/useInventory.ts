import { useState, useEffect } from 'react';
import { showSuccess, showError } from '@/utils/toast';

export interface InventoryItem {
  id: string;
  item_name: string;
  item_type: string;
  category: string;
  location: string;
  quantity: number;
  description: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  created_at: string;
}

export interface StockMovement {
  id: string;
  item_name: string;
  movement_type: 'in' | 'out';
  quantity: number;
  original_item_id: string;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  equipment_name: string;
  issue_type: string;
  description: string;
  created_at: string;
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('bakery_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('bakery_movements');
    return saved ? JSON.parse(saved) : [];
  });

  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(() => {
    const saved = localStorage.getItem('bakery_maintenance');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bakery_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('bakery_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('bakery_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  const getStatus = (qty: number): InventoryItem['status'] => {
    if (qty === 0) return 'Out of Stock';
    if (qty < 10) return 'Low Stock';
    return 'In Stock';
  };

  const addItem = (item: Omit<InventoryItem, 'id' | 'status' | 'created_at'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      status: getStatus(item.quantity),
      created_at: new Date().toISOString(),
    };
    setInventory(prev => [...prev, newItem]);
    showSuccess(`"${item.item_name}" registered successfully!`);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        if (updates.quantity !== undefined) {
          updated.status = getStatus(updates.quantity);
        }
        return updated;
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    showSuccess('Item deleted successfully');
  };

  const addMovement = (movement: Omit<StockMovement, 'id' | 'created_at'>) => {
    const item = inventory.find(i => i.id === movement.original_item_id);
    if (!item) return;

    const newQty = movement.movement_type === 'in' 
      ? item.quantity + movement.quantity 
      : item.quantity - movement.quantity;

    if (newQty < 0) {
      showError('Insufficient stock');
      return;
    }

    updateItem(item.id, { quantity: newQty });
    
    const newMovement: StockMovement = {
      ...movement,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    setMovements(prev => [...prev, newMovement]);
    showSuccess(`Stock ${movement.movement_type} recorded`);
  };

  const addMaintenance = (request: Omit<MaintenanceRequest, 'id' | 'created_at'>) => {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    setMaintenance(prev => [...prev, newRequest]);
    showSuccess('Maintenance request submitted');
  };

  const deleteMaintenance = (id: string) => {
    setMaintenance(prev => prev.filter(m => m.id !== id));
  };

  const deleteMovement = (id: string) => {
    const movement = movements.find(m => m.id === id);
    if (!movement) return;

    const item = inventory.find(i => i.id === movement.original_item_id);
    if (item) {
      const restoredQty = movement.movement_type === 'in' 
        ? item.quantity - movement.quantity 
        : item.quantity + movement.quantity;
      updateItem(item.id, { quantity: Math.max(0, restoredQty) });
    }

    setMovements(prev => prev.filter(m => m.id !== id));
    showSuccess('Movement record deleted and stock restored');
  };

  return {
    inventory,
    movements,
    maintenance,
    addItem,
    updateItem,
    deleteItem,
    addMovement,
    deleteMovement,
    addMaintenance,
    deleteMaintenance
  };
}