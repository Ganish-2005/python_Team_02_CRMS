import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { resourceAPI } from '../services/api';

export function AddResourcePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'LAB',
    capacity: '',
    status: 'AVAILABLE',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await resourceAPI.create({
        ...formData,
        capacity: parseInt(formData.capacity)
      });
      alert('Resource created successfully!');
      navigate('/resources');
    } catch (err) {
      setError(err.message || 'Failed to create resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Add New Resource">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/resources')}
          className="flex items-center text-sm font-medium text-warm-500 hover:text-warm-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Resources
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-warm-200 p-8"
        >
          <h2 className="text-xl font-bold text-warm-900 mb-6">Resource Details</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Resource Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="e.g. Physics Lab 101"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="LAB">Lab</option>
                  <option value="CLASSROOM">Classroom</option>
                  <option value="EVENT_HALL">Event Hall</option>
                  <option value="COMPUTER">Computer</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="e.g. 30"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="e.g. Science Block, 1st Floor"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-warm-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/resources')}
                className="px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-warm-600 hover:bg-warm-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 transition-all disabled:opacity-50"
              >
                <SaveIcon className="w-4 h-4" />
                {isLoading ? 'Creating...' : 'Create Resource'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
