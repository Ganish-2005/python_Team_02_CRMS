import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  CalendarIcon,
  MonitorIcon,
  BookOpenIcon,
  BeakerIcon,
  BuildingIcon,
  ClockIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingAPI } from '../services/api';

export function BookingsListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingAPI.getAll();
      setBookings(data.results || data);
    } catch (err) {
      setError('Failed to load bookings');
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
        return CalendarIcon;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500';
      case 'PENDING':
        return 'bg-amber-500';
      case 'REJECTED':
        return 'bg-red-500';
      default:
        return 'bg-warm-400';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-warm-100 text-warm-600';
    }
  };

  if (loading) {
    return (
      <Layout title="Bookings">
        <div className="flex items-center justify-center h-64">
          <div className="text-warm-500">Loading bookings...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Bookings">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Bookings">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-warm-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-1.5 bg-terracotta-50 text-terracotta-700 rounded-lg text-sm font-medium shadow-sm">
              Upcoming
            </button>
            <button className="px-4 py-1.5 text-warm-500 hover:text-warm-900 rounded-lg text-sm font-medium transition-colors">
              Past
            </button>
            <button className="px-4 py-1.5 text-warm-500 hover:text-warm-900 rounded-lg text-sm font-medium transition-colors">
              All
            </button>
          </div>
        </div>

        <Link
          to="/bookings/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          New Booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-warm-200 p-12 text-center">
          <p className="text-warm-500 mb-4">No bookings found</p>
          <Link
            to="/bookings/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create First Booking
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => {
            const Icon = getIcon(booking.resource_type);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row"
              >
                <div
                  className={`w-full md:w-1.5 h-1.5 md:h-auto ${getStatusColor(
                    booking.status
                  )} flex-shrink-0`}
                />

                <div className="p-5 flex-1 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="h-12 w-12 rounded-xl bg-cream-50 flex items-center justify-center text-terracotta-600 border border-warm-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-warm-900">{booking.resource_name}</h3>
                      <p className="text-xs text-warm-500">{booking.resource_type?.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col justify-center">
                      <span className="text-xs text-warm-400 uppercase tracking-wider font-medium mb-1">
                        Booked By
                      </span>
                      <span className="text-sm font-medium text-warm-800">{booking.user_name}</span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="text-xs text-warm-400 uppercase tracking-wider font-medium mb-1">
                        Booking Date
                      </span>
                      <div className="flex items-center text-sm font-medium text-warm-800">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-terracotta-500" />
                        {formatDate(booking.booking_date)}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="text-xs text-warm-400 uppercase tracking-wider font-medium mb-1">
                        Time Slot
                      </span>
                      <div className="flex items-center text-sm text-warm-600">
                        <ClockIcon className="w-3.5 h-3.5 mr-1.5 text-warm-400" />
                        {booking.time_slot}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end min-w-[120px] mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-warm-100">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
