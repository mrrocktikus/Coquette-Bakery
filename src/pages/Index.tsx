import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { showSuccess } from '@/utils/toast';

const Index = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'role' | 'login' | 'signup' | 'forgot'>('role');
  const [role, setRole] = useState<'staff' | 'student' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (selectedRole: 'staff' | 'student') => {
    setRole(selectedRole);
    setView('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
      setIsLoading(false);
      showSuccess('Welcome back to Coquette Bakery!');
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f9f5f2] dark:bg-[#1a1a2e]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-card rounded-[40px] shadow-2xl w-full max-w-5xl overflow-hidden border-2 border-[#e8a0b0] flex flex-col md:flex-row"
      >
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 rose-gradient w-1/2">
          <motion.img 
            src="https://i.imgur.com/IyEvnDs.png" 
            alt="Coquette Bakery" 
            className="w-56 h-56 rounded-[50px] mb-6 float-animation shadow-lg object-cover"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          />
          <h1 className="playfair text-4xl font-bold text-rose-700 text-center mb-2">Coquette Bakery</h1>
          <p className="playfair text-2xl italic text-rose-700 text-center mb-2 font-light">Sweet, Classy, Coquette.</p>
          <p className="text-sm text-rose-700 text-center font-semibold">Inventory Management System</p>
        </div>

        {/* Right Side - Forms */}
        <div className="p-8 md:p-12 flex-1 flex flex-col justify-center min-h-[600px]">
          <AnimatePresence mode="wait">
            {view === 'role' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome!</h2>
                  <p className="text-gray-600 dark:text-gray-400">Are you a Staff or Student?</p>
                </div>
                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={() => handleRoleSelect('staff')}
                    className="h-16 rounded-2xl btn-rose text-lg font-bold"
                  >
                    Staff
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleRoleSelect('student')}
                    className="h-16 rounded-2xl border-2 border-[#e8a0b0] text-gray-700 dark:text-gray-200 text-lg font-bold hover:bg-rose-50"
                  >
                    Student
                  </Button>
                </div>
              </motion.div>
            )}

            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Button variant="ghost" size="icon" onClick={() => setView('role')}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Log In</h2>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{role === 'staff' ? 'Staff ID' : 'Student ID'}</Label>
                    <Input placeholder="Enter your ID" className="rounded-xl border-2 border-[#e8a0b0]" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input placeholder="Enter username" className="rounded-xl border-2 border-[#e8a0b0]" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter password" 
                        className="rounded-xl border-2 border-[#e8a0b0] pr-10" 
                        required 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                    </div>
                    <button type="button" onClick={() => setView('forgot')} className="text-sm text-rose-500 font-semibold">Forgot Password?</button>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl btn-rose font-bold" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account? <button type="button" onClick={() => setView('signup')} className="text-rose-500 font-bold">Create Account</button>
                  </p>
                </form>
              </motion.div>
            )}

            {view === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Button variant="ghost" size="icon" onClick={() => setView('login')}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</h2>
                </div>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label>{role === 'staff' ? 'Staff ID' : 'Student ID'}</Label>
                    <Input placeholder="Enter your ID" className="rounded-xl border-2 border-[#e8a0b0]" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input placeholder="Choose username" className="rounded-xl border-2 border-[#e8a0b0]" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="Create password" className="rounded-xl border-2 border-[#e8a0b0]" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="Confirm password" className="rounded-xl border-2 border-[#e8a0b0]" required />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl btn-rose font-bold">Create Account</Button>
                  <p className="text-center text-sm text-gray-600">
                    Already have an account? <button type="button" onClick={() => setView('login')} className="text-rose-500 font-bold">Log In</button>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;