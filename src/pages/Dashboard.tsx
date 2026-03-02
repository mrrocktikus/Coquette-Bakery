import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  List, 
  ArrowLeftRight, 
  FileText, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInventory } from '@/hooks/useInventory';
import { translations, Language } from '@/lib/translations';
import { showSuccess } from '@/utils/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Components for sections
import DashboardHome from '@/components/DashboardHome';
import RegisterItem from '@/components/RegisterItem';
import InventoryList from '@/components/InventoryList';
import StockManagement from '@/components/StockManagement';
import Reports from '@/components/Reports';
import SettingsSection from '@/components/SettingsSection';

interface Notification {
  id: string;
  message: string;
  time: Date;
  type: 'info' | 'success' | 'warning';
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const inventoryHook = useInventory();
  const t = (key: string) => translations[lang][key as keyof typeof translations['en']] || key;

  // Mock username for the welcome message
  const username = "Ling Chung Seng";

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      time: new Date(),
      type
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
  };

  const handleLogout = () => {
    showSuccess('Logged out successfully');
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'register', label: t('register-item'), icon: PlusCircle },
    { id: 'inventory', label: t('inventory'), icon: List },
    { id: 'stock', label: t('stock'), icon: ArrowLeftRight },
    { id: 'reports', label: t('reports'), icon: FileText },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const handleAddItem = (item: any) => {
    inventoryHook.addItem(item);
    addNotification(`New item registered: ${item.item_name}`, 'success');
  };

  const handleAddMovement = (movement: any) => {
    inventoryHook.addMovement(movement);
    const action = movement.movement_type === 'in' ? 'Added' : 'Removed';
    addNotification(`${action} ${movement.quantity} units of ${movement.item_name}`, 'info');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#f9f5f2] dark:bg-[#1a1a2e] transition-colors duration-300`}>
      {/* Navigation Header */}
      <nav className="bg-white dark:bg-card shadow-md border-b-2 border-[#e8a0b0] px-6 py-4 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src="https://i.imgur.com/IyEvnDs.png" 
              alt="Logo" 
              className="w-12 h-12 rounded-xl shadow-md object-cover float-animation" 
            />
            <div className="hidden sm:block">
              <h1 className="playfair text-xl font-bold text-rose-500">Coquette Bakery</h1>
              <p className="text-xs text-rose-400 font-semibold">Welcome, {username}!</p>
            </div>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
            <Input 
              placeholder={t('search')} 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (activeSection !== 'inventory') setActiveSection('inventory');
              }}
              className="pl-10 rounded-2xl border-2 border-[#e8a0b0] bg-rose-50/50 dark:bg-rose-900/10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setLang(lang === 'en' ? 'ms' : 'en')} className="text-rose-500">
              <Globe className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-rose-500">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-rose-500 relative">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 border-2 border-rose-100">
                <div className="p-2 border-b border-rose-50 mb-2 flex justify-between items-center">
                  <span className="font-bold text-rose-500">Notifications</span>
                  <Button variant="ghost" size="sm" onClick={() => setNotifications([])} className="text-xs text-gray-400">Clear</Button>
                </div>
                <div className="max-h-64 overflow-y-auto scrollbar-hide">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <DropdownMenuItem key={n.id} className="flex flex-col items-start p-3 rounded-xl mb-1 focus:bg-rose-50">
                        <span className="text-sm font-semibold text-gray-800">{n.message}</span>
                        <span className="text-xs text-gray-400">{n.time.toLocaleTimeString()}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={handleLogout} className="hidden md:flex border-2 border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl dark:border-rose-800 dark:text-rose-400">
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>

        {/* Centered Navigation Links */}
        <div className="max-w-[1400px] mx-auto mt-4 flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              onClick={() => setActiveSection(item.id)}
              className={`rounded-full px-6 whitespace-nowrap transition-all duration-300 ${
                activeSection === item.id 
                  ? "btn-rose" 
                  : "text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:text-rose-300 dark:hover:bg-rose-900/20"
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'dashboard' && (
              <DashboardHome 
                t={t} 
                inventory={inventoryHook.inventory} 
                movements={inventoryHook.movements} 
              />
            )}
            {activeSection === 'register' && (
              <RegisterItem 
                t={t} 
                onAdd={handleAddItem} 
              />
            )}
            {activeSection === 'inventory' && (
              <InventoryList 
                t={t} 
                inventory={inventoryHook.inventory} 
                onDelete={inventoryHook.deleteItem} 
                onUpdate={inventoryHook.updateItem}
                externalSearchTerm={searchTerm}
              />
            )}
            {activeSection === 'stock' && (
              <StockManagement 
                t={t} 
                inventory={inventoryHook.inventory} 
                movements={inventoryHook.movements} 
                onAddMovement={handleAddMovement} 
                onDeleteMovement={inventoryHook.deleteMovement} 
              />
            )}
            {activeSection === 'reports' && (
              <Reports 
                t={t} 
                inventory={inventoryHook.inventory} 
                maintenance={inventoryHook.maintenance}
                onAddMaintenance={inventoryHook.addMaintenance}
                onResolveMaintenance={inventoryHook.resolveMaintenance}
                onDeleteMaintenance={inventoryHook.deleteMaintenance}
              />
            )}
            {activeSection === 'settings' && (
              <SettingsSection 
                t={t} 
                isDark={isDark} 
                onToggleDark={toggleDarkMode} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;