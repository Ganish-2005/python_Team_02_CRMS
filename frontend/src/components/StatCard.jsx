import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatCard({ title, value, icon: Icon, trend, color, delay = 0 }) {
  const colorStyles = {
    terracotta: 'bg-terracotta-50 text-terracotta-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-warm-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-warm-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-warm-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="flex items-center text-xs">
          <span
            className={`flex items-center font-medium ${
              trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trend.direction === 'up' ? (
              <ArrowUpIcon className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownIcon className="w-3 h-3 mr-1" />
            )}
            {trend.value}
          </span>
          <span className="text-warm-400 ml-1.5">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}
