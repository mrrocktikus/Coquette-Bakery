import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { InventoryItem } from '@/hooks/useInventory';

interface Props {
  t: (key: string) => string;
  item: InventoryItem;
  onUpdate: (id: string, updates: any) => void;
}

const EditItemDialog = ({ t, item, onUpdate }: Props) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_name: item.item_name,
    item_type: item.item_type,
    category: item.category,
    location: item.location,
    quantity: item.quantity,
    description: item.description,
    supplier: item.supplier || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(item.id, formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-2 border-rose-200">
        <DialogHeader>
          <DialogTitle className="playfair text-2xl text-rose-500">{t('edit')} {item.item_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('name')}</Label>
              <Input 
                value={formData.item_name}
                onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                className="rounded-xl border-2 border-rose-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('type')}</Label>
              <Select value={formData.item_type} onValueChange={(v) => setFormData({...formData, item_type: v})}>
                <SelectTrigger className="rounded-xl border-2 border-rose-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">{t('type-none')}</SelectItem>
                  <SelectItem value="PVC">{t('type-pvc')}</SelectItem>
                  <SelectItem value="Metal">{t('type-metal')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('category')}</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger className="rounded-xl border-2 border-rose-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
              <Label>{t('qty')}</Label>
              <Input 
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                className="rounded-xl border-2 border-rose-100"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('supplier')}</Label>
            <Input 
              value={formData.supplier}
              onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              className="rounded-xl border-2 border-rose-100"
              placeholder="Supplier name"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('description')}</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="rounded-xl border-2 border-rose-100 min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full h-12 rounded-xl btn-rose font-bold">
              {t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;