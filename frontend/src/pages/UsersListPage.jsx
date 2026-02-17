import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MoreHorizontalIcon,
  SearchIcon,
  FilterIcon,
  PhoneIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';

export function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAll();
      setUsers(data.results || data);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesStatus = filterStatus === 'ALL' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <Layout title="Users">
        <div className="flex items-center justify-center h-64">
          <div className="text-warm-500">Loading users...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Users">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Users">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-warm-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent bg-white shadow-sm"
            placeholder="Search by name, email, or phone..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-warm-200 rounded-xl text-sm font-medium text-warm-600 bg-white hover:bg-warm-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
            </select>
            <FilterIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-warm-200 rounded-xl text-sm font-medium text-warm-600 bg-white hover:bg-warm-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <FilterIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none" />
          </div>
          <Link
            to="/users/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add User
          </Link>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-warm-200 p-12 text-center">
          {users.length === 0 ? (
            <>
              <p className="text-warm-500 mb-4">No users found</p>
              <Link
                to="/users/add"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add First User
              </Link>
            </>
          ) : (
            <p className="text-warm-500">No users match your search criteria</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-warm-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-warm-100">
              <thead className="bg-warm-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-warm-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-warm-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-warm-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-warm-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-warm-500 uppercase tracking-wider"
                  >
                    Created At
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-warm-100">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-cream-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-700 font-medium text-sm border-2 border-white shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-warm-900">{user.name}</div>
                          <div className="text-sm text-warm-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-warm-700">
                        <PhoneIcon className="w-3 h-3 mr-2 text-warm-400" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'STAFF'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-purple-50 text-purple-700 border border-purple-100'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-warm-100 text-warm-600 border border-warm-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-warm-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-warm-400 hover:text-terracotta-600 transition-colors">
                        <MoreHorizontalIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white px-6 py-4 border-t border-warm-100 flex items-center justify-between">
            <div className="text-sm text-warm-500">
              Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> user{users.length !== 1 ? 's' : ''}
              {(searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL') && (
                <span className="ml-2 text-terracotta-600">
                  (filtered)
                </span>
              )}
            </div>
            {(searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('ALL');
                  setFilterStatus('ALL');
                }}
                className="text-sm text-terracotta-600 hover:text-terracotta-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
