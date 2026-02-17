import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

export function Layout({ children, title }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Navbar title={title} user={currentUser} />

        <main className="flex-1 p-6 sm:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
