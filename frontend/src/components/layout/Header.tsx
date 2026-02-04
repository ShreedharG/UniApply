import React, { useState, useRef, useEffect } from 'react';
import { User, Bell, LogOut, ChevronDown } from 'lucide-react';
import { User as UserType, Role } from '../../types';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  user: UserType;
  isSidebarCollapsed: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, isSidebarCollapsed, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header 
      className={`h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 z-30 flex items-center justify-end px-6 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border dark:border-transparent ${user.role === Role.ADMIN ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'}`}>
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200 leading-none">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right transform">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-semibold">Signed in as</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${user.role === Role.ADMIN ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                >
                  <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};