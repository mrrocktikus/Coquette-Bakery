"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Download, Upload, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { showSuccess, showError } from '@/utils/toast';

interface Props {
  t: (key: string) => string;
  isDark: boolean;
  onToggleDark: () => void;
}

const SettingsSection = ({ t, isDark, onToggleDark }: Props) => {
  const [name, setName] = useState('Ling Chung Seng');
  const [email, setEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    const savedEmail = localStorage.getItem('user_email');
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSave = () => {
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    showSuccess(t('profile-success'));
  };

  const handleExport = () => {
    const data = {
      bakery_inventory: localStorage.getItem('bakery_inventory'),
      bakery_movements: localStorage.getItem('bakery_movements'),
      bakery_maintenance: localStorage.getItem('bakery_maintenance'),
      user_name: localStorage.getItem('user_name'),
      user_email: localStorage.getItem('user_email'),
      export_date: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coquette_bakery_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSuccess(t('backup-success'));
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Basic validation
        if (!data.bakery_inventory && !data.user_name) {
          throw new Error('Invalid format');
        }

        if (data.bakery_inventory) localStorage.setItem('bakery_inventory', data.bakery_inventory);
        if (data.bakery_movements) localStorage.setItem('bakery_movements', data.bakery_movements);
        if (data.bakery_maintenance) localStorage.setItem('bakery_maintenance', data.bakery_maintenance);
        if (data.user_name) localStorage.setItem('user_name', data.user_name);
        if (data.user_email) localStorage.setItem('user_email', data.user_email);

        showSuccess(t('restore-success'));
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        showError(t('restore-error'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500">{t('settings')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="card-cute p-8">
          <h3 className="playfair text-xl font-bold text-rose-500 mb-8">{t('profile')}</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 dark:text-gray-200">
                <Shield className="w-4 h-4 text-rose-400" />
                {t('user-id')}
              </Label>
              <Input value="2504040656" readOnly className="rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-rose-100 dark:border-rose-900 dark:text-gray-300" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 dark:text-gray-200">
                <User className="w-4 h-4 text-rose-400" />
                {t('name')}
              </Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-2 border-rose-200 dark:border-rose-800 dark:bg-rose-900/10 dark:text-gray-200" 
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 dark:text-gray-200">
                <Mail className="w-4 h-4 text-rose-400" />
                {t('email')}
              </Label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="rounded-xl border-2 border-rose-200 dark:border-rose-800 dark:bg-rose-900/10 dark:text-gray-200" 
              />
            </div>

            <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-rose-100 dark:border-rose-900">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-gray-800 dark:text-gray-200">Dark Mode</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Toggle dark theme for comfortable viewing</p>
                </div>
                <Switch checked={isDark} onCheckedChange={onToggleDark} />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full h-12 rounded-xl btn-rose font-bold text-lg">
              {t('save')}
            </Button>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="card-cute p-8">
          <div className="flex items-center gap-2 mb-8">
            <Database className="w-6 h-6 text-rose-500" />
            <h3 className="playfair text-xl font-bold text-rose-500">{t('backup-restore')}</h3>
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border-2 border-rose-100 dark:border-rose-900/20">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{t('export-data')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('export-desc')}</p>
                </div>
                <Button onClick={handleExport} variant="outline" className="w-full h-12 rounded-xl border-2 border-rose-200 text-rose-500 hover:bg-rose-50">
                  <Download className="w-4 h-4 mr-2" />
                  {t('export-data')}
                </Button>
              </div>
            </div>

            <div className="p-6 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border-2 border-rose-100 dark:border-rose-900/20">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{t('import-data')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('import-desc')}</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImport} 
                  accept=".json" 
                  className="hidden" 
                />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full h-12 rounded-xl border-2 border-rose-200 text-rose-500 hover:bg-rose-50">
                  <Upload className="w-4 h-4 mr-2" />
                  {t('import-data')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;