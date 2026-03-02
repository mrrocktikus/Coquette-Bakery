import React, { useState, useEffect } from 'react';
import { Filter, Trash2, Edit, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InventoryItem } from '@/hooks/useInventory';

interface Props {
  t: (key: string) => string;
  inventory: InventoryItem[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  externalSearchTerm?: string;
}

const InventoryList = ({ t, inventory, onDelete, onUpdate, externalSearchTerm = '' }: Props) => {
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  const filteredItems = inventory.filter(item => 
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'Low Stock': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
      case 'Out of Stock': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="playfair text-3xl font-bold text-rose-500">{t('inventory')}</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
            <Input 
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-2 border-rose-200 dark:border-rose-800 dark:bg-rose-900/10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-xl border-2 border-rose-200 text-rose-500 dark:border-rose-800 dark:text-rose-400"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('filters')}
          </Button>
        </div>
      </div>

      <div className="card-cute overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-rose-50/50 dark:bg-rose-900/20">
              <TableRow>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('name')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('type')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('category')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('qty')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('status')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300 text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400">
                    {t('no-items')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors">
                    <TableCell className="font-semibold dark:text-gray-200">{item.item_name}</TableCell>
                    <TableCell className="dark:text-gray-300">{item.item_type}</TableCell>
                    <TableCell className="dark:text-gray-300">{item.category}</TableCell>
                    <TableCell className="font-bold dark:text-gray-200">{item.quantity}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDelete(item.id)}
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;