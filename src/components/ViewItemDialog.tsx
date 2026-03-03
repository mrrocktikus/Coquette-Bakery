"use client";

import React from 'react';
import { Eye, Package, MapPin, Tag, Info, Calendar, Truck, Hash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/hooks/useInventory';

interface Props {
  t: (key: string) => string;
  item: InventoryItem;
}

const ViewItemDialog = ({ t, item }: Props) => {
  const DetailRow = ({ icon: Icon, label, value, color = "text-rose-500" }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/30 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
      <div className={`p-2 rounded-xl bg-white dark:bg-card shadow-sm ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border-2 border-rose-200 p-0 overflow-hidden">
        <div className="rose-gradient p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl float-animation">
            <Package className="w-10 h-10 text-rose-500" />
          </div>
          <DialogTitle className="playfair text-3xl font-bold text-rose-700">{item.item_name}</DialogTitle>
          <p className="text-rose-600 font-medium mt-1">{item.category}</p>
        </div>
        
        <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow icon={Hash} label={t('qty')} value={item.quantity} />
            <DetailRow 
              icon={Tag} 
              label={t('status')} 
              value={item.status} 
              color={item.status === 'In Stock' ? 'text-green-500' : 'text-orange-500'} 
            />
            <DetailRow icon={Info} label={t('type')} value={item.item_type} />
            <DetailRow icon={MapPin} label={t('location')} value={item.location} />
            <DetailRow icon={Truck} label={t('supplier')} value={item.supplier} />
            <DetailRow icon={Calendar} label="Registered On" value={new Date(item.created_at).toLocaleDateString()} />
          </div>
          
          <div className="p-6 rounded-2xl bg-rose-50/30 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">{t('description')}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
              {item.description || 'No description provided for this item.'}
            </p>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 dark:bg-card/50 border-t border-rose-100 dark:border-rose-900/20 flex justify-center">
          <Button variant="outline" className="rounded-xl border-2 border-rose-200 text-rose-500 px-8" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}))}>
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewItemDialog;