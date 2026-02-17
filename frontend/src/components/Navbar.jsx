import React from 'react';
import { BellIcon, SearchIcon, UserIcon } from 'lucide-react';

export function Navbar({ title, user }) {
  // Default user if not logged in
  const displayUser = user || { name: 'Guest', role: 'GUEST' };
  
  return (
    <header className="h-16 bg-white border-b border-warm-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-warm-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-warm-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-full transition-colors">
          <SearchIcon className="w-5 h-5" />
        </button>
        <button className="p-2 text-warm-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-full transition-colors relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-terracotta-600 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-warm-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-warm-900">{displayUser.name}</p>
            <p className="text-xs text-warm-500 capitalize">{displayUser.role?.toLowerCase() || 'Guest'}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-700 border-2 border-white shadow-sm">
            {displayUser.avatar ? (
              <img
                src={displayUser.avatar}
                alt={displayUser.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="font-semibold text-sm">
                {displayUser.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
