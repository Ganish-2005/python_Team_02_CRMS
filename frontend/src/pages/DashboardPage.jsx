import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { StatCard } from '../components/StatCard';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  UsersIcon,
  BoxIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI, resourceAPI, bookingAPI } from '../services/api';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalResources: 0,
    totalUsers: 0,
    pendingBookings: 0,
    myBookings: 0,
    myPendingBookings: 0,
    myApprovedBookings: 0,
    myRejectedBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const [bookings, resources, users] = await Promise.all([
        bookingAPI.getAll(),
        resourceAPI.getAll(),
        userAPI.getAll()
      ]);

      const bookingsData = bookings.results || bookings;
      const resourcesData = resources.results || resources;
      const usersData = users.results || users;

      const pendingCount = bookingsData.filter(b => b.status === 'PENDING').length;

      // Calculate user-specific stats
      let myBookingsData = [];
      if (user) {
        myBookingsData = bookingsData.filter(b => b.user === user.id);
      }

      setStats({
        totalBookings: bookingsData.length,
        totalResources: resourcesData.length,
        totalUsers: usersData.length,
        pendingBookings: pendingCount,
        myBookings: myBookingsData.length,
        myPendingBookings: myBookingsData.filter(b => b.status === 'PENDING').length,
        myApprovedBookings: myBookingsData.filter(b => b.status === 'APPROVED').length,
        myRejectedBookings: myBookingsData.filter(b => b.status === 'REJECTED').length
      });

      // Get recent bookings for students
      if (user && user.role === 'STUDENT') {
        setRecentBookings(myBookingsData.slice(0, 5));
      } else {
        setRecentBookings(bookingsData.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-warm-500">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  // Student Dashboard
  if (currentUser && currentUser.role === 'STUDENT') {
    return (
      <Layout title="Dashboard">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-warm-900">Welcome back, {currentUser.name}!</h1>
          <p className="text-warm-500">Here's your booking overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="My Bookings"
            value={stats.myBookings.toString()}
            icon={CalendarIcon}
            color="terracotta"
            delay={0.1}
          />
          <StatCard
            title="Pending"
            value={stats.myPendingBookings.toString()}
            icon={ClockIcon}
            color="amber"
            delay={0.2}
          />
          <StatCard
            title="Approved"
            value={stats.myApprovedBookings.toString()}
            icon={CheckCircleIcon}
            color="emerald"
            delay={0.3}
          />
          <StatCard
            title="Rejected"
            value={stats.myRejectedBookings.toString()}
            icon={XCircleIcon}
            color="red"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-warm-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-warm-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/bookings/add"
                className="flex items-center justify-between p-4 bg-terracotta-50 hover:bg-terracotta-100 rounded-xl border border-terracotta-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-terracotta-600 rounded-lg">
                    <PlusIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-warm-900">New Booking</h3>
                    <p className="text-sm text-warm-600">Book a resource</p>
                  </div>
                </div>
                <span className="text-terracotta-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/bookings"
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-warm-900">My Bookings</h3>
                    <p className="text-sm text-warm-600">View all bookings</p>
                  </div>
                </div>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/resources"
                className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <BoxIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-warm-900">Browse Resources</h3>
                    <p className="text-sm text-warm-600">See available resources</p>
                  </div>
                </div>
                <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-warm-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-warm-900">Recent Bookings</h2>
              <Link to="/bookings" className="text-sm text-terracotta-600 hover:text-terracotta-700 font-medium">
                View all
              </Link>
            </div>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-warm-500 mb-4">No bookings yet</p>
                <Link
                  to="/bookings/add"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create First Booking
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-3 bg-cream-50 rounded-lg border border-warm-100">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-warm-900 text-sm">{booking.resource_name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          booking.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : booking.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs text-warm-500">
                      {booking.booking_date} • {booking.time_slot}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Staff/Admin Dashboard
  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warm-900">Welcome back, {currentUser?.name || 'Admin'}!</h1>
        <p className="text-warm-500">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toString()}
          icon={CalendarIcon}
          color="terracotta"
          delay={0.1}
        />
        <StatCard
          title="Total Resources"
          value={stats.totalResources.toString()}
          icon={BoxIcon}
          color="amber"
          delay={0.2}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={UsersIcon}
          color="emerald"
          delay={0.3}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingBookings.toString()}
          icon={ClockIcon}
          color="blue"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-warm-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-warm-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link
              to="/bookings"
              className="flex items-center justify-between p-4 bg-terracotta-50 hover:bg-terracotta-100 rounded-xl border border-terracotta-200 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-terracotta-600 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warm-900">Pending Approvals</h3>
                  <p className="text-sm text-warm-600">{stats.pendingBookings} bookings waiting</p>
                </div>
              </div>
              <span className="text-terracotta-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/users/add"
              className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <UsersIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warm-900">Add User</h3>
                  <p className="text-sm text-warm-600">Create new user account</p>
                </div>
              </div>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/resources/add"
              className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <BoxIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warm-900">Add Resource</h3>
                  <p className="text-sm text-warm-600">Add new resource</p>
                </div>
              </div>
              <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-warm-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-warm-900">Recent Bookings</h2>
            <Link to="/bookings" className="text-sm text-terracotta-600 hover:text-terracotta-700 font-medium">
              View all
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-warm-500">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="p-3 bg-cream-50 rounded-lg border border-warm-100">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-warm-900 text-sm">{booking.resource_name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        booking.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : booking.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-warm-500">
                    {booking.user_name} • {booking.booking_date} • {booking.time_slot}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
