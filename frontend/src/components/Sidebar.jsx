import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  UsersIcon,
  CalendarIcon,
  BoxIcon,
  LogOutIcon,
  PlusCircleIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { authAPI } from '../services/api';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser && currentUser.role === 'ADMIN';
  const isStaff = currentUser && currentUser.role === 'STAFF';
  const canManageResources = isAdmin || isStaff;
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      // Call logout API to set user status to INACTIVE
      if (currentUser && currentUser.id) {
        await authAPI.logout(currentUser.id);
      }
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      // Clear localStorage and redirect regardless of API success
      localStorage.removeItem('user');
      navigate('/login');
      window.location.reload();
    }
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
        ...(isAdmin ? [{ name: 'Users', path: '/users', icon: UsersIcon }] : []),
        ...(canManageResources ? [{ name: 'Resources', path: '/resources', icon: BoxIcon }] : [])
      ]
    },
    {
      section: 'Scheduling',
      items: [
        { name: 'Bookings', path: '/bookings', icon: CalendarIcon }
      ]
    }
  ].filter(section => section.items.length > 0); // Remove empty sections

  return (
    <aside className="w-64 bg-cream-50 border-r border-warm-200 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-warm-200 bg-white/50 backdrop-blur-sm">
        <div className="h-8 w-8 bg-terracotta-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <CalendarIcon className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-warm-900 tracking-tight">
            CampusRMS
          </span>
          {isAdmin && (
            <span className="text-xs text-terracotta-600 font-medium flex items-center gap-1">
              <ShieldCheckIcon className="w-3 h-3" />
              Admin Panel
            </span>
          )}
          {isStaff && (
            <span className="text-xs text-blue-600 font-medium">
              Staff Portal
            </span>
          )}
        </div>
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
        {/* Show different buttons based on user role */}
        {canManageResources ? (
          <Link
            to="/resources/add"
            className="flex items-center justify-center gap-2 w-full bg-terracotta-600 hover:bg-terracotta-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors shadow-sm mb-4"
          >
            <PlusCircleIcon className="w-4 h-4" />
            <span>Add Resource</span>
          </Link>
        ) : (
          <Link
            to="/bookings/add"
            className="flex items-center justify-center gap-2 w-full bg-terracotta-600 hover:bg-terracotta-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors shadow-sm mb-4"
          >
            <PlusCircleIcon className="w-4 h-4" />
            <span>New Booking</span>
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-warm-500 hover:bg-warm-100 hover:text-warm-900 transition-colors"
        >
          <LogOutIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
