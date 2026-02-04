import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Role } from '../../types';
import {
  LayoutDashboard,
  FileText,
  Upload,
  CreditCard,
  HelpCircle,
  Settings,
  GraduationCap,
  BarChart,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  role: Role;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, onLogout, isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', path: '/student/applications', icon: FileText },
    { name: 'Documents', path: '/student/documents', icon: Upload },
    { name: 'Payments', path: '/student/payments', icon: CreditCard },
    { name: 'Support', path: '/student/support', icon: HelpCircle },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = role === Role.ADMIN ? adminLinks : studentLinks;

  return (
    <div
      className={`bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className={`p-6 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${role === Role.ADMIN ? 'bg-orange-600' : 'bg-brand-600'}`}>
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="text-xl font-bold">UniApply</h1>
            <p className="text-xs text-slate-400 capitalize">{role.toLowerCase()} Portal</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              title={isCollapsed ? link.name : ''}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? role === Role.ADMIN ? 'bg-orange-600 text-white' : 'bg-brand-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={toggleSidebar}
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>

        <button
          onClick={onLogout}
          title={isCollapsed ? "Logout" : ""}
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};