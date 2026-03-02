import React from 'react';
import { InventoryItem } from '@/hooks/useInventory';

interface Props {
  t: (key: string) => string;
  inventory: InventoryItem[];
}

const Overview = ({ t, inventory }: Props) => {
  const categories = inventory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = {
    'In Stock': inventory.filter(i => i.status === 'In Stock').length,
    'Low Stock': inventory.filter(i => i.status === 'Low Stock').length,
    'Out of Stock': inventory.filter(i => i.status === 'Out of Stock').length,
  };

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500 text-center">{t('overview')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-cute p-8">
          <h3 className="playfair text-xl font-bold text-rose-500 mb-6">{t('breakdown')}</h3>
          <div className="space-y-4">
            {Object.entries(categories).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data available</p>
            ) : (
              Object.entries(categories).map(([cat, qty]) => (
                <div key={cat} className="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                  <span className="font-semibold text-gray-700">{cat}</span>
                  <span className="px-4 py-1 bg-rose-200 text-rose-700 rounded-full font-bold">{qty}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-cute p-8">
          <h3 className="playfair text-xl font-bold text-rose-500 mb-6">{t('stock-status')}</h3>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const colors = {
                'In Stock': 'bg-green-50 border-green-200 text-green-700',
                'Low Stock': 'bg-orange-50 border-orange-200 text-orange-700',
                'Out of Stock': 'bg-red-50 border-red-200 text-red-700'
              };
              return (
                <div key={status} className={`flex items-center justify-between p-4 rounded-2xl border ${colors[status as keyof typeof colors]}`}>
                  <span className="font-semibold">{status}</span>
                  <span className="px-4 py-1 rounded-full font-bold bg-white/50">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;