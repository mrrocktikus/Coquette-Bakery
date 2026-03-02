import React, { useState } from 'react';
import { FileText, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/hooks/useInventory';

interface Props {
  t: (key: string) => string;
  inventory: InventoryItem[];
}

const Reports = ({ t, inventory }: Props) => {
  const [report, setReport] = useState<{ title: string; content: string } | null>(null);

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

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500">{t('reports')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-cute p-8 space-y-6">
          <h3 className="playfair text-xl font-bold text-rose-500">Inventory Reports</h3>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={generateFullReport}
              className="w-full h-14 rounded-2xl border-2 border-rose-200 text-gray-700 hover:bg-rose-50 flex justify-between px-6"
            >
              <span>{t('full-report')}</span>
              <FileText className="w-5 h-5 text-rose-500" />
            </Button>
            <Button 
              variant="outline" 
              onClick={generateLowStockReport}
              className="w-full h-14 rounded-2xl border-2 border-orange-200 text-gray-700 hover:bg-orange-50 flex justify-between px-6"
            >
              <span>{t('low-stock-report')}</span>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </Button>
          </div>
        </div>

        {report && (
          <div className="card-cute p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">{report.title}</h3>
              <Button variant="ghost" size="icon" className="text-rose-500">
                <Download className="w-5 h-5" />
              </Button>
            </div>
            <div className="bg-rose-50/50 p-4 rounded-2xl border-2 border-rose-100 min-h-[200px] whitespace-pre-wrap text-sm text-gray-600">
              {report.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;