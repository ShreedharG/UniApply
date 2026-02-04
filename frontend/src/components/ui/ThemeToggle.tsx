import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "light"
            ? "bg-white dark:bg-slate-600 text-amber-500 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "system"
            ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
        aria-label="System Mode"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === "dark"
            ? "bg-white dark:bg-slate-600 text-brand-400 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}