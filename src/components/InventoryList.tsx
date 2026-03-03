import React, { useState, useEffect } from 'react';
import { Filter, Trash2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItem } from '@/hooks/useInventory';
import EditItemDialog from './EditItemDialog';
import ViewItemDialog from './ViewItemDialog';

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
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.item_type === typeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'Low Stock': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
      case 'Out of Stock': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500 text-center">{t('inventory')}</h2>
      
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
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
            variant={showFilters ? "default" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl border-2 ${showFilters ? 'btn-rose' : 'border-rose-200 text-rose-500 dark:border-rose-800 dark:text-rose-400'}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('filters')}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="card-cute p-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-rose-400 uppercase tracking-wider">{t('category')}</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="rounded-xl border-2 border-rose-100">
                <SelectValue placeholder={t('all-categories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all-categories')}</SelectItem>
                <SelectItem value="Wiring Accessories">{t('cat-wiring')}</SelectItem>
                <SelectItem value="Protection Devices & Switchgear">{t('cat-protection')}</SelectItem>
                <SelectItem value="Lighting & Lamps">{t('cat-lighting')}</SelectItem>
                <SelectItem value="Conduit Fittings & Accessories">{t('cat-conduit')}</SelectItem>
                <SelectItem value="Cable Management & Fixings">{t('cat-cable')}</SelectItem>
                <SelectItem value="Solar & Power Conversion">{t('cat-solar')}</SelectItem>
                <SelectItem value="Wiring & Cables">{t('cat-wiring-cables')}</SelectItem>
                <SelectItem value="Tools & Power Equipment">{t('cat-tools')}</SelectItem>
                <SelectItem value="Lighting Mounts & Bases">{t('cat-lighting-mounts')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-rose-400 uppercase tracking-wider">{t('status')}</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-xl border-2 border-rose-100">
                <SelectValue placeholder={t('all-status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all-status')}</SelectItem>
                <SelectItem value="In Stock">{t('in-stock')}</SelectItem>
                <SelectItem value="Low Stock">{t('low-stock')}</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-rose-400 uppercase tracking-wider">{t('type')}</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="rounded-xl border-2 border-rose-100">
                <SelectValue placeholder={t('all-types')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all-types')}</SelectItem>
                <SelectItem value="None">{t('type-none')}</SelectItem>
                <SelectItem value="PVC">{t('type-pvc')}</SelectItem>
                <SelectItem value="Metal">{t('type-metal')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="w-full rounded-xl text-gray-400 hover:text-rose-500"
            >
              <X className="w-4 h-4 mr-2" />
              {t('clear')}
            </Button>
          </div>
        </div>
      )}

      <div className="card-cute overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-rose-50/50 dark:bg-rose-900/20">
              <TableRow>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('name')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('type')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('category')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('supplier')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('qty')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('status')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('description')}</TableHead>
                <TableHead className="font-bold text-rose-700 dark:text-rose-300 text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500 dark:text-gray-400">
                    {t('no-items')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors">
                    <TableCell className="font-semibold dark:text-gray-200">{item.item_name}</TableCell>
                    <TableCell className="dark:text-gray-300">{item.item_type}</TableCell>
                    <TableCell className="dark:text-gray-300">{item.category}</TableCell>
                    <TableCell className="dark:text-gray-300">{item.supplier || '-'}</TableCell>
                    <TableCell className="font-bold dark:text-gray-200">{item.quantity}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-gray-300 max-w-[200px] truncate" title={item.description}>
                      {item.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ViewItemDialog t={t} item={item} />
                        <EditItemDialog t={t} item={item} onUpdate={onUpdate} />
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