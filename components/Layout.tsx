
import React from 'react';
import { User, UserRole, ThemeMode } from '../types';
import { LogOut, HeartHandshake, Home, Settings, ShieldCheck, User as UserIcon, Lock, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  onLogout: () => void;
  currentView: string;
  setView: (view: string) => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, currentView, setView, theme, onThemeToggle }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 flex flex-col pb-20 md:pb-0 transition-colors duration-500">
      {/* Navbar (Top) */}
      <nav className="bg-primary dark:bg-teal-900 text-white shadow-xl sticky top-0 z-50 py-1 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('dashboard')}>
              <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-all duration-300 backdrop-blur-md">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <span className="font-black text-2xl tracking-tight">صندوق العائلة</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-black text-lg ${currentView === 'dashboard' ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
              >
                <Home className="w-6 h-6" />
                <span>الرئيسية</span>
              </button>

              <button
                onClick={() => setView('settings')}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-black text-lg ${currentView === 'settings' || ['users', 'manage-projects', 'manage-admin'].includes(currentView) ? 'bg-white/20 shadow-inner ring-1 ring-white/30' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <ShieldCheck className="w-6 h-6" />
                <span>إدارة الصندوق</span>
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={onThemeToggle}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 ring-1 ring-white/20"
                title="تغيير المظهر"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-10 mt-auto border-t border-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/5 p-3 rounded-full">
              <HeartHandshake className="w-8 h-8 opacity-50" />
            </div>
          </div>
          <p className="text-base font-black mb-2">صندوق العائلة الخيري</p>
          <p className="text-sm font-bold opacity-40 leading-relaxed">منصة إلكترونية متكاملة لإدارة الأنشطة الخيرية والمساهمات العائلية.<br />جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-around items-center p-3 z-50 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] transition-colors duration-500">
        <button
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center justify-center p-3 w-full rounded-2xl transition-all duration-300 ${currentView === 'dashboard' ? 'text-primary bg-primary/10 dark:bg-teal-900/40 shadow-inner' : 'text-gray-400'}`}
        >
          <Home className="w-7 h-7" />
          <span className="text-xs font-black mt-1.5">الرئيسية</span>
        </button>

        <button
          onClick={() => setView('settings')}
          className={`flex flex-col items-center justify-center p-3 w-full rounded-2xl transition-all duration-300 ${currentView === 'settings' || ['users', 'manage-projects', 'manage-admin'].includes(currentView) ? 'text-primary bg-primary/10 dark:bg-teal-900/40 shadow-inner' : 'text-gray-400'}`}
        >
          <ShieldCheck className="w-7 h-7" />
          <span className="text-xs font-black mt-1.5">الإدارة</span>
        </button>
      </div>
    </div>
  );
};
