import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  t: (key: string) => string;
  onAdd: (item: any) => void;
}

const RegisterItem = ({ t, onAdd }: Props) => {
  const [formData, setFormData] = useState({
    item_name: '',
    item_type: '',
    category: '',
    location: '',
    quantity: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item_name || !formData.category) return;
    onAdd(formData);
    setFormData({
      item_name: '',
      item_type: '',
      category: '',
      location: '',
      quantity: 0,
      description: ''
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500">{t('register-item')}</h2>
      
      <div className="card-cute p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{t('name')}</Label>
              <Input 
                value={formData.item_name}
                onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                placeholder="e.g., Copper Wire" 
                className="rounded-xl border-2 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('type')}</Label>
              <Select onValueChange={(v) => setFormData({...formData, item_type: v})}>
                <SelectTrigger className="rounded-xl border-2 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">{t('type-none')}</SelectItem>
                  <SelectItem value="PVC">{t('type-pvc')}</SelectItem>
                  <SelectItem value="Metal">{t('type-metal')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{t('category')}</Label>
              <Select onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger className="rounded-xl border-2 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800">
                  <SelectValue placeholder="Select Category" />
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
              <Label>{t('location')}</Label>
              <Select onValueChange={(v) => setFormData({...formData, location: v})}>
                <SelectTrigger className="rounded-xl border-2 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electrical Store">{t('loc-electrical')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('qty')}</Label>
            <Input 
              type="number"
              value={formData.quantity === 0 ? '' : formData.quantity}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({...formData, quantity: val === '' ? 0 : parseInt(val)});
              }}
              placeholder="0"
              className="rounded-xl border-2 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('description')}</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Add any additional details..."
              className="rounded-xl border-2 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800 min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl btn-rose font-bold text-lg">
            {t('register')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterItem;