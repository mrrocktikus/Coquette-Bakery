import React, { useState, useEffect } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { showSuccess } from '@/utils/toast';

interface Props {
  t: (key: string) => string;
  isDark: boolean;
  onToggleDark: () => void;
}

const SettingsSection = ({ t, isDark, onToggleDark }: Props) => {
  const [name, setName] = useState('Ling Chung Seng');
  const [email, setEmail] = useState('');

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

  return (
    <div className="space-y-8">
      <h2 className="playfair text-3xl font-bold text-rose-500">{t('settings')}</h2>
      
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
    </div>
  );
};

export default SettingsSection;