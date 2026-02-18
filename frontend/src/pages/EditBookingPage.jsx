import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingAPI, resourceAPI } from '../services/api';

export function EditBookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resources, setResources] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    resource: '',
    booking_date: '',
    time_slot: '09:00 - 10:00'
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    fetchData();
    fetchBooking();
  }, [id]);

  const fetchData = async () => {
    try {
      const resourcesData = await resourceAPI.getAll();
      setResources(resourcesData.results || resourcesData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const booking = await bookingAPI.getById(id);
      setFormData({
        user: booking.user,
        resource: booking.resource,
        booking_date: booking.booking_date,
        time_slot: booking.time_slot
      });
    } catch (err) {
      setError('Failed to load booking');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

    // Validate date is not in the past
    const selectedDate = new Date(formData.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Cannot book for previous days. Please select today or a future date.');
      setIsLoading(false);
      return;
    }
    
    // If booking for today, check if time slot is in the past
    if (selectedDate.getTime() === today.getTime()) {
      const timeSlotStart = formData.time_slot.split(' - ')[0];
      const [hours, minutes] = timeSlotStart.split(':').map(Number);
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Check if the time slot has already passed
      if (hours < currentHour || (hours === currentHour && minutes <= currentMinute)) {
        setError('Cannot book a past time slot. Please select a future time slot.');
        setIsLoading(false);
        return;
      }
    }
    
    try {
      await bookingAPI.update(id, formData);
      setSuccess('Booking updated successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);
    } catch (err) {
      // Handle specific validation errors
      if (err.message && err.message.includes('resource')) {
        setError('❌ This resource is already booked for the selected date and time slot. Please choose a different time or resource.');
      } else if (err.message && err.message.includes('user')) {
        setError('❌ You already have a booking at this time slot. One user cannot make two bookings at the same time.');
      } else {
        setError(err.message || 'Failed to update booking');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Edit Booking">
        <div className="flex items-center justify-center h-64">
          <div className="text-warm-500">Loading booking...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Booking">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/bookings')}
          className="flex items-center text-sm font-medium text-warm-500 hover:text-warm-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Bookings
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-warm-200 p-8"
        >
          <h2 className="text-xl font-bold text-warm-900 mb-6">Edit Booking Details</h2>

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
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Booking For</label>
                <div className="block w-full px-4 py-3 border border-warm-200 rounded-xl bg-warm-50 text-warm-900">
                  {currentUser?.name} ({currentUser?.email})
                </div>
                <p className="mt-1 text-xs text-warm-400">Automatically set to logged-in user</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Resource</label>
                <select
                  name="resource"
                  value={formData.resource}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select a resource</option>
                  {resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name} - {resource.type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Booking Date
                </label>
                <input
                  type="date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleChange}
                  min={getTodayDate()}
                  required
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                />
                <p className="mt-1 text-xs text-warm-400">Cannot select previous days</p>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Time Slot</label>
                <select
                  name="time_slot"
                  value={formData.time_slot}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all bg-white"
                >
                  <option>08:00 - 09:00</option>
                  <option>09:00 - 10:00</option>
                  <option>10:00 - 11:00</option>
                  <option>11:00 - 12:00</option>
                  <option>12:00 - 13:00</option>
                  <option>13:00 - 14:00</option>
                  <option>14:00 - 15:00</option>
                  <option>15:00 - 16:00</option>
                  <option>16:00 - 17:00</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-warm-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/bookings')}
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
                {isLoading ? 'Updating...' : 'Update Booking'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
