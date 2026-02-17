import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  UsersIcon,
  CalendarIcon,
  BoxIcon,
  LogOutIcon,
  PlusCircleIcon
} from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      section: 'Overview',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboardIcon }
      ]
    },
    {
      section: 'Management',
      items: [
        { name: 'Users', path: '/users', icon: UsersIcon },
        { name: 'Resources', path: '/resources', icon: BoxIcon }
      ]
    },
    {
      section: 'Scheduling',
      items: [
        { name: 'Bookings', path: '/bookings', icon: CalendarIcon }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-cream-50 border-r border-warm-200 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-warm-200 bg-white/50 backdrop-blur-sm">
        <div className="h-8 w-8 bg-terracotta-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <CalendarIcon className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-warm-900 tracking-tight">
          CampusRMS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navItems.map((group) => (
          <div key={group.section}>
            <h3 className="px-3 text-xs font-semibold text-warm-400 uppercase tracking-wider mb-2">
              {group.section}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    isActive(item.path)
                      ? 'bg-terracotta-50 text-terracotta-700'
                      : 'text-warm-600 hover:bg-white hover:text-warm-900 hover:shadow-sm'
                  }`}
                >
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-terracotta-600 rounded-r-full" />
                  )}
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive(item.path)
                        ? 'text-terracotta-600'
                        : 'text-warm-400 group-hover:text-terracotta-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-warm-200 bg-cream-50">
        <Link
          to="/bookings/add"
          className="flex items-center justify-center gap-2 w-full bg-terracotta-600 hover:bg-terracotta-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors shadow-sm mb-4"
        >
          <PlusCircleIcon className="w-4 h-4" />
          <span>New Booking</span>
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-warm-500 hover:bg-warm-100 hover:text-warm-900 transition-colors"
        >
          <LogOutIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
