"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Download, Upload, Database, Palette, History, Building2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { showSuccess, showError } from '@/utils/toast';
import { AuditLog } from '@/hooks/useInventory';

interface Props {
  t: (key: string) => string;
  isDark: boolean;
  onToggleDark: () => void;
}

const SettingsSection = ({ t, isDark, onToggleDark }: Props) => {
  const [name, setName] = useState('Ling Chung Seng');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('Coquette Bakery');
  const [logo, setLogo] = useState('https://i.imgur.com/IyEvnDs.png');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    const savedEmail = localStorage.getItem('user_email');
    const savedCompany = localStorage.getItem('company_name');
    const savedLogo = localStorage.getItem('company_logo');
    const savedLogs = localStorage.getItem('bakery_audit_logs');

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedCompany) setCompanyName(savedCompany);
    if (savedLogo) setLogo(savedLogo);
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    showSuccess(t('profile-success'));
  };

  const handleSaveTheme = () => {
    localStorage.setItem('company_name', companyName);
    localStorage.setItem('company_logo', logo);
    showSuccess(t('theme-success'));
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setLogo(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    const data = {
      bakery_inventory: localStorage.getItem('bakery_inventory'),
      bakery_movements: localStorage.getItem('bakery_movements'),
      bakery_maintenance: localStorage.getItem('bakery_maintenance'),
      bakery_audit_logs: localStorage.getItem('bakery_audit_logs'),
      user_name: localStorage.getItem('user_name'),
      user_email: localStorage.getItem('user_email'),
      company_name: localStorage.getItem('company_name'),
      company_logo: localStorage.getItem('company_logo'),
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

        if (data.bakery_inventory) localStorage.setItem('bakery_inventory', data.bakery_inventory);
        if (data.bakery_movements) localStorage.setItem('bakery_movements', data.bakery_movements);
        if (data.bakery_maintenance) localStorage.setItem('bakery_maintenance', data.bakery_maintenance);
        if (data.bakery_audit_logs) localStorage.setItem('bakery_audit_logs', data.bakery_audit_logs);
        if (data.user_name) localStorage.setItem('user_name', data.user_name);
        if (data.user_email) localStorage.setItem('user_email', data.user_email);
        if (data.company_name) localStorage.setItem('company_name', data.company_name);
        if (data.company_logo) localStorage.setItem('company_logo', data.company_logo);

        showSuccess(t('restore-success'));
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        showError(t('restore-error'));
      }
    };
    reader.readAsText(file);
  };

  // Common container class for all settings boxes to ensure same size and centering
  const settingsBoxClass = "card-cute p-8 max-w-4xl mx-auto w-full";

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500 text-center">{t('settings')}</h2>
      
      <Tabs defaultValue="profile" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-rose-50/50 dark:bg-rose-900/10 p-1 rounded-2xl border-2 border-rose-100 dark:border-rose-900/20">
            <TabsTrigger value="profile" className="rounded-xl px-6 data-[state=active]:btn-rose">
              <User className="w-4 h-4 mr-2" />
              {t('profile')}
            </TabsTrigger>
            <TabsTrigger value="theme" className="rounded-xl px-6 data-[state=active]:btn-rose">
              <Palette className="w-4 h-4 mr-2" />
              {t('theme-customization')}
            </TabsTrigger>
            <TabsTrigger value="audit" className="rounded-xl px-6 data-[state=active]:btn-rose">
              <History className="w-4 h-4 mr-2" />
              {t('audit-logs')}
            </TabsTrigger>
            <TabsTrigger value="backup" className="rounded-xl px-6 data-[state=active]:btn-rose">
              <Database className="w-4 h-4 mr-2" />
              {t('backup-restore')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <div className={settingsBoxClass}>
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
                <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border-2 border-rose-200 dark:border-rose-800 dark:bg-rose-900/10 dark:text-gray-200" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 dark:text-gray-200">
                  <Mail className="w-4 h-4 text-rose-400" />
                  {t('email')}
                </Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="rounded-xl border-2 border-rose-200 dark:border-rose-800 dark:bg-rose-900/10 dark:text-gray-200" />
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
              <Button onClick={handleSaveProfile} className="w-full h-12 rounded-xl btn-rose font-bold text-lg">
                {t('save')}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="theme">
          <div className={settingsBoxClass}>
            <h3 className="playfair text-xl font-bold text-rose-500 mb-8">{t('theme-customization')}</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 dark:text-gray-200">
                  <Building2 className="w-4 h-4 text-rose-400" />
                  {t('company-name')}
                </Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="rounded-xl border-2 border-rose-200 dark:border-rose-800 dark:bg-rose-900/10 dark:text-gray-200" />
              </div>
              <div className="space-y-4">
                <Label className="flex items-center gap-2 dark:text-gray-200">
                  <ImageIcon className="w-4 h-4 text-rose-400" />
                  {t('upload-logo')}
                </Label>
                <div className="flex items-center gap-6 p-6 bg-rose-50/30 dark:bg-rose-900/10 rounded-2xl border-2 border-dashed border-rose-200 dark:border-rose-800">
                  <img src={logo} alt="Logo Preview" className="w-20 h-20 rounded-2xl object-cover shadow-md" />
                  <div className="flex-1">
                    <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                    <Button onClick={() => logoInputRef.current?.click()} variant="outline" className="w-full h-12 rounded-xl border-2 border-rose-200 text-rose-500 hover:bg-rose-50">
                      <Upload className="w-4 h-4 mr-2" />
                      {t('upload-logo')}
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveTheme} className="w-full h-12 rounded-xl btn-rose font-bold text-lg">
                {t('save')}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className={settingsBoxClass}>
            <h3 className="playfair text-xl font-bold text-rose-500 mb-8">{t('audit-logs')}</h3>
            <div className="overflow-hidden rounded-2xl border-2 border-rose-100 dark:border-rose-900">
              <Table>
                <TableHeader className="bg-rose-50/50 dark:bg-rose-900/20">
                  <TableRow>
                    <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('log-action')}</TableHead>
                    <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('log-details')}</TableHead>
                    <TableHead className="font-bold text-rose-700 dark:text-rose-300">{t('log-time')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No logs recorded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    auditLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors">
                        <TableCell className="font-bold text-rose-600 dark:text-rose-400">{log.action}</TableCell>
                        <TableCell className="dark:text-gray-300">{log.details}</TableCell>
                        <TableCell className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="backup">
          <div className={settingsBoxClass}>
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
                  <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full h-12 rounded-xl border-2 border-rose-200 text-rose-500 hover:bg-rose-50">
                    <Upload className="w-4 h-4 mr-2" />
                    {t('import-data')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;