import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItem, StockMovement } from '@/hooks/useInventory';

interface Props {
  t: (key: string) => string;
  inventory: InventoryItem[];
  movements: StockMovement[];
  onAddMovement: (m: any) => void;
  onDeleteMovement: (id: string) => void;
}

const StockManagement = ({ t, inventory, movements, onAddMovement, onDeleteMovement }: Props) => {
  const [stockIn, setStockIn] = useState({ itemId: '', qty: 0 });
  const [stockOut, setStockOut] = useState({ itemId: '', qty: 0 });

  const handleStockIn = () => {
    const item = inventory.find(i => i.id === stockIn.itemId);
    if (!item || stockIn.qty <= 0) return;
    onAddMovement({
      item_name: item.item_name,
      movement_type: 'in',
      quantity: stockIn.qty,
      original_item_id: item.id
    });
    setStockIn({ itemId: '', qty: 0 });
  };

  const handleStockOut = () => {
    const item = inventory.find(i => i.id === stockOut.itemId);
    if (!item || stockOut.qty <= 0) return;
    onAddMovement({
      item_name: item.item_name,
      movement_type: 'out',
      quantity: stockOut.qty,
      original_item_id: item.id
    });
    setStockOut({ itemId: '', qty: 0 });
  };

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500">{t('stock')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stock In */}
        <div className="card-cute p-8">
          <div className="flex items-center gap-3 mb-6">
            <ArrowUpCircle className="w-8 h-8 text-green-500" />
            <h3 className="playfair text-xl font-bold text-rose-500">{t('stock-in')}</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('select')}</Label>
              <Select value={stockIn.itemId} onValueChange={(v) => setStockIn({...stockIn, itemId: v})}>
                <SelectTrigger className="rounded-xl border-2 border-rose-200">
                  <SelectValue placeholder={t('choose-item')} />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.item_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('qty')}</Label>
              <Input 
                type="number" 
                value={stockIn.qty || ''} 
                onChange={(e) => setStockIn({...stockIn, qty: parseInt(e.target.value) || 0})}
                className="rounded-xl border-2 border-rose-200"
              />
            </div>
            <Button onClick={handleStockIn} className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold">
              {t('add')}
            </Button>
          </div>
        </div>

        {/* Stock Out */}
        <div className="card-cute p-8">
          <div className="flex items-center gap-3 mb-6">
            <ArrowDownCircle className="w-8 h-8 text-red-500" />
            <h3 className="playfair text-xl font-bold text-rose-500">{t('stock-out')}</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('select')}</Label>
              <Select value={stockOut.itemId} onValueChange={(v) => setStockOut({...stockOut, itemId: v})}>
                <SelectTrigger className="rounded-xl border-2 border-rose-200">
                  <SelectValue placeholder={t('choose-item')} />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.item_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('qty')}</Label>
              <Input 
                type="number" 
                value={stockOut.qty || ''} 
                onChange={(e) => setStockOut({...stockOut, qty: parseInt(e.target.value) || 0})}
                className="rounded-xl border-2 border-rose-200"
              />
            </div>
            <Button onClick={handleStockOut} className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold">
              {t('remove')}
            </Button>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card-cute p-8">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-6 h-6 text-rose-500" />
          <h3 className="playfair text-xl font-bold text-rose-500">{t('history')}</h3>
        </div>
        <div className="space-y-4">
          {[...movements].reverse().map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-4 bg-rose-50/30 rounded-2xl border border-rose-100">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                m.movement_type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {m.movement_type.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{m.item_name}</p>
                <p className="text-xs text-gray-500">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right mr-4">
                <p className="font-bold text-rose-600">{m.movement_type === 'in' ? '+' : '-'}{m.quantity}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDeleteMovement(m.id)}
                className="text-rose-400 hover:text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockManagement;