import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, SaveIcon, CheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';

export function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    status: 'ACTIVE',
    password: ''
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await userAPI.getById(id);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        password: '' // Don't populate password
      });
    } catch (err) {
      setError('Failed to load user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (!password) return []; // Password is optional for updates
    
    const errors = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter (A-Z)');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter (a-z)');
    }
    if (!/\d/.test(password)) {
      errors.push('One number (0-9)');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('One special character (!@#$%^&*...)');
    }
    
    return errors;
  };

  const passwordErrors = formData.password ? validatePassword(formData.password) : [];
  const isPasswordValid = !formData.password || passwordErrors.length === 0;

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
    setSuccess('');
    
    // Validate password strength if password is provided
    if (formData.password && !isPasswordValid) {
      setError('Password does not meet the requirements. Please check below.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Only include password if it's been changed
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await userAPI.update(id, updateData);
      setSuccess('User updated successfully! Redirecting...');
      
      // Navigate after showing success message
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Edit User">
        <div className="flex items-center justify-center h-64">
          <div className="text-warm-500">Loading user...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit User">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center text-sm font-medium text-warm-500 hover:text-warm-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Users
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-warm-200 p-8"
        >
          <h2 className="text-xl font-bold text-warm-900 mb-6">Edit User Details</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="e.g. Jane Cooper"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="jane@university.edu"
                />
                <p className="mt-1 text-xs text-warm-400">Must be unique</p>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Role</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="Enter new password (optional)"
                />
                {formData.password && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-blue-900 mb-2">Password must contain:</p>
                    <ul className="space-y-1">
                      {passwordErrors.length === 0 ? (
                        <li className="text-xs text-emerald-700 flex items-center">
                          <CheckIcon className="w-3 h-3 mr-1" /> All requirements met!
                        </li>
                      ) : (
                        passwordErrors.map((err, idx) => (
                          <li key={idx} className="text-xs text-red-700 flex items-center">
                            <span className="mr-1">✗</span> {err}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-warm-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/users')}
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
                {isLoading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
