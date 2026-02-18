import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import {
  MonitorIcon,
  BookOpenIcon,
  BeakerIcon,
  BuildingIcon,
  MapPinIcon,
  PlusIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { resourceAPI } from '../services/api';

export function ResourcesListPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceAPI.getAll();
      setResources(data.results || data);
    } catch (err) {
      setError('Failed to load resources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'LAB':
        return BeakerIcon;
      case 'CLASSROOM':
        return BookOpenIcon;
      case 'EVENT_HALL':
        return BuildingIcon;
      case 'COMPUTER':
        return MonitorIcon;
      default:
        return BoxIcon;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Filter resources based on selected type
  const filteredResources = resources.filter(resource => {
    if (filterType === 'ALL') return true;
    return resource.type === filterType;
  });

  if (loading) {
    return (
      <Layout title="Resources">
        <div className="flex items-center justify-center h-64">
          <div className="text-warm-500">Loading resources...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Resources">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Resources">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 border rounded-xl text-sm font-medium shadow-sm whitespace-nowrap transition-colors ${
              filterType === 'ALL'
                ? 'bg-white border-warm-200 text-warm-900'
                : 'bg-transparent border-transparent text-warm-500 hover:text-warm-900 hover:bg-white/50'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterType('LAB')}
            className={`px-4 py-2 border rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === 'LAB'
                ? 'bg-white border-warm-200 text-warm-900 shadow-sm'
                : 'bg-transparent border-transparent text-warm-500 hover:text-warm-900 hover:bg-white/50'
            }`}
          >
            Lab
          </button>
          <button 
            onClick={() => setFilterType('CLASSROOM')}
            className={`px-4 py-2 border rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === 'CLASSROOM'
                ? 'bg-white border-warm-200 text-warm-900 shadow-sm'
                : 'bg-transparent border-transparent text-warm-500 hover:text-warm-900 hover:bg-white/50'
            }`}
          >
            Classroom
          </button>
          <button 
            onClick={() => setFilterType('EVENT_HALL')}
            className={`px-4 py-2 border rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === 'EVENT_HALL'
                ? 'bg-white border-warm-200 text-warm-900 shadow-sm'
                : 'bg-transparent border-transparent text-warm-500 hover:text-warm-900 hover:bg-white/50'
            }`}
          >
            Event Hall
          </button>
          <button 
            onClick={() => setFilterType('COMPUTER')}
            className={`px-4 py-2 border rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === 'COMPUTER'
                ? 'bg-white border-warm-200 text-warm-900 shadow-sm'
                : 'bg-transparent border-transparent text-warm-500 hover:text-warm-900 hover:bg-white/50'
            }`}
          >
            Computer
          </button>
        </div>

        <Link
          to="/resources/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm whitespace-nowrap ml-4"
        >
          <PlusIcon className="w-4 h-4" />
          Add Resource
        </Link>
      </div>

      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-warm-200 p-12 text-center">
          {resources.length === 0 ? (
            <>
              <p className="text-warm-500 mb-4">No resources found</p>
              <Link
                to="/resources/add"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add First Resource
              </Link>
            </>
          ) : (
            <p className="text-warm-500">No resources found for this type</p>
          )}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredResources.map((resource) => {
            const Icon = getIcon(resource.type);
            return (
              <motion.div
                key={resource.id}
                variants={item}
                className="bg-white rounded-xl border border-warm-200 p-6 hover:shadow-md hover:border-terracotta-200 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-cream-50 rounded-xl text-terracotta-600 group-hover:bg-terracotta-50 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      resource.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}
                  >
                    {resource.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-warm-900 mb-1">{resource.name}</h3>
                <p className="text-sm text-warm-500 mb-4">{resource.type.replace('_', ' ')}</p>

                <div className="pt-4 border-t border-warm-100 flex flex-col gap-2">
                  <div className="flex items-center text-xs text-warm-500">
                    <MapPinIcon className="w-3.5 h-3.5 mr-2 text-warm-400" />
                    {resource.location || 'No location'}
                  </div>
                  <div className="flex items-center text-xs text-warm-500">
                    <span className="w-3.5 h-3.5 mr-2 flex items-center justify-center text-[10px] font-bold border border-warm-300 rounded-full text-warm-400">
                      C
                    </span>
                    {resource.capacity} capacity
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </Layout>
  );
}
