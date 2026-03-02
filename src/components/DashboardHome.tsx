import React from 'react';
import { Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { InventoryItem, StockMovement } from '@/hooks/useInventory';
import Overview from './Overview';

interface Props {
  t: (key: string) => string;
  inventory: InventoryItem[];
  movements: StockMovement[];
}

const DashboardHome = ({ t, inventory, movements }: Props) => {
  const stats = [
    { 
      label: t('total'), 
      value: inventory.length, 
      icon: Package, 
      color: 'from-pink-400 to-rose-400' 
    },
    { 
      label: t('in-stock'), 
      value: inventory.filter(i => i.status === 'In Stock').length, 
      icon: CheckCircle, 
      color: 'from-green-400 to-emerald-500' 
    },
    { 
      label: t('low-stock'), 
      value: inventory.filter(i => i.status !== 'In Stock').length, 
      icon: AlertTriangle, 
      color: 'from-orange-400 to-amber-500' 
    },
  ];

  const recentMovements = [...movements].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500 text-center">{t('dashboard')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="card-cute p-8 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-500 font-semibold mb-1 dark:text-gray-400">{stat.label}</h3>
            <p className="playfair text-4xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <Overview t={t} inventory={inventory} />

      <div className="card-cute p-8">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-rose-500" />
          <h3 className="playfair text-xl font-bold text-rose-500">{t('recent')}</h3>
        </div>
        
        <div className="space-y-4">
          {recentMovements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity recorded</p>
          ) : (
            recentMovements.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                  m.movement_type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {m.movement_type.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-200">{m.item_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {m.movement_type === 'in' ? t('stock-in') : t('stock-out')}: {m.quantity}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;