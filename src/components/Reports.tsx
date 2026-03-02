import React, { useState } from 'react';
import { FileText, AlertCircle, Download, Wrench, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItem, MaintenanceRequest } from '@/hooks/useInventory';

interface Props {
  t: (key: string) => string;
  inventory: InventoryItem[];
  maintenance: MaintenanceRequest[];
  onAddMaintenance: (req: any) => void;
  onDeleteMaintenance: (id: string) => void;
}

const Reports = ({ t, inventory, maintenance, onAddMaintenance, onDeleteMaintenance }: Props) => {
  const [report, setReport] = useState<{ title: string; content: string } | null>(null);
  const [maintForm, setMaintForm] = useState({ equipment: '', type: '', desc: '' });

  const generateFullReport = () => {
    const content = inventory.map(i => `${i.item_name}: ${i.quantity} (${i.status})`).join('\n');
    setReport({ title: t('full-report'), content });
  };

  const generateLowStockReport = () => {
    const lowStock = inventory.filter(i => i.status !== 'In Stock');
    const content = lowStock.length > 0 
      ? lowStock.map(i => `${i.item_name}: ${i.quantity} (${i.status})`).join('\n')
      : 'No low stock items found.';
    setReport({ title: t('low-stock-report'), content });
  };

  const handleMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintForm.equipment || !maintForm.type) return;
    onAddMaintenance({
      equipment_name: maintForm.equipment,
      issue_type: maintForm.type,
      description: maintForm.desc
    });
    setMaintForm({ equipment: '', type: '', desc: '' });
  };

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500">{t('reports')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory Reports */}
        <div className="space-y-8">
          <div className="card-cute p-8 space-y-6">
            <h3 className="playfair text-xl font-bold text-rose-500">Inventory Reports</h3>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={generateFullReport}
                className="w-full h-14 rounded-2xl border-2 border-rose-200 text-gray-700 dark:text-gray-200 hover:bg-rose-50 flex justify-between px-6"
              >
                <span>{t('full-report')}</span>
                <FileText className="w-5 h-5 text-rose-500" />
              </Button>
              <Button 
                variant="outline" 
                onClick={generateLowStockReport}
                className="w-full h-14 rounded-2xl border-2 border-orange-200 text-gray-700 dark:text-gray-200 hover:bg-orange-50 flex justify-between px-6"
              >
                <span>{t('low-stock-report')}</span>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </Button>
            </div>
          </div>

          {report && (
            <div className="card-cute p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">{report.title}</h3>
                <Button variant="ghost" size="icon" className="text-rose-500">
                  <Download className="w-5 h-5" />
                </Button>
              </div>
              <div className="bg-rose-50/50 dark:bg-rose-900/10 p-4 rounded-2xl border-2 border-rose-100 dark:border-rose-900/20 min-h-[200px] whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
                {report.content}
              </div>
            </div>
          )}
        </div>

        {/* Maintenance & Complaints */}
        <div className="space-y-8">
          <div className="card-cute p-8">
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="w-6 h-6 text-rose-500" />
              <h3 className="playfair text-xl font-bold text-rose-500">{t('maintenance')}</h3>
            </div>
            <form onSubmit={handleMaintSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('equipment')}</Label>
                <Select value={maintForm.equipment} onValueChange={(v) => setMaintForm({...maintForm, equipment: v})}>
                  <SelectTrigger className="rounded-xl border-2 border-rose-200">
                    <SelectValue placeholder={t('choose-item')} />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map(item => (
                      <SelectItem key={item.id} value={item.item_name}>{item.item_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('issue-type')}</Label>
                <Select value={maintForm.type} onValueChange={(v) => setMaintForm({...maintForm, type: v})}>
                  <SelectTrigger className="rounded-xl border-2 border-rose-200">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">{t('maintenance-type')}</SelectItem>
                    <SelectItem value="Complaint">{t('complaint-type')}</SelectItem>
                    <SelectItem value="Repair">{t('repair-type')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('description')}</Label>
                <Textarea 
                  value={maintForm.desc}
                  onChange={(e) => setMaintForm({...maintForm, desc: e.target.value})}
                  placeholder="Describe the issue..."
                  className="rounded-xl border-2 border-rose-200"
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl btn-rose font-bold">
                {t('submit-request')}
              </Button>
            </form>
          </div>

          <div className="card-cute p-8">
            <h3 className="playfair text-lg font-bold text-rose-500 mb-4">{t('recent-requests')}</h3>
            <div className="space-y-3">
              {maintenance.length === 0 ? (
                <p className="text-gray-400 text-center py-4 text-sm">No requests yet</p>
              ) : (
                [...maintenance].reverse().map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-3 bg-rose-50/30 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/20">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{m.equipment_name}</p>
                      <p className="text-xs text-rose-500 font-semibold">{m.issue_type}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteMaintenance(m.id)} className="text-gray-400 hover:text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;