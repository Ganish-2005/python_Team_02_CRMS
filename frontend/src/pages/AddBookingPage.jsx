import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  MonitorIcon,
  BookOpenIcon,
  BeakerIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  BoxIcon
} from 'lucide-react';
import { bookingAPI, resourceAPI } from '../services/api';

export function AddBookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      // Automatically set the user in formData
      setFormData(prev => ({
        ...prev,
        user: user.id
      }));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resourcesData = await resourceAPI.getAll();
      setResources(resourcesData.results || resourcesData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const getIconForType = (type) => {
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

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/bookings');
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate date is not in the past
    const selectedDate = new Date(formData.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('❌ Cannot book for previous days. Please select today or a future date.');
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setError('❌ Cannot book a past time slot. Please select a future time slot.');
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    
    try {
      await bookingAPI.create(formData);
      setSuccess('Booking created successfully! Redirecting...');
      
      // Navigate after showing success message
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
        setError(err.message || 'Failed to create booking. Please try again.');
      }
      setIsLoading(false);
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectedResource = resources.find(r => r.id === parseInt(formData.resource));

  const steps = [
    { number: 1, title: 'Select Resource' },
    { number: 2, title: 'Pick Date & Time' },
    { number: 3, title: 'Confirm' }
  ];

  return (
    <Layout title="New Booking">
      <div className="max-w-4xl mx-auto">
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

        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-warm-200 -z-10 rounded-full" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-terracotta-600 -z-10 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />

            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center gap-2 bg-cream-50 px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors duration-300 ${step >= s.number ? 'bg-terracotta-600 border-terracotta-100 text-white' : 'bg-white border-warm-200 text-warm-400'}`}>
                  {step > s.number ? <CheckIcon className="w-5 h-5" /> : s.number}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${step >= s.number ? 'text-terracotta-700' : 'text-warm-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-warm-200 p-8 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-xl font-bold text-warm-900 mb-6">Which resource would you like to book?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((resource) => {
                    const Icon = getIconForType(resource.type);
                    return (
                      <div key={resource.id} onClick={() => setFormData({ ...formData, resource: resource.id })} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.resource === resource.id ? 'border-terracotta-500 bg-terracotta-50 shadow-sm' : 'border-warm-100 hover:border-terracotta-200 hover:bg-cream-50'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg ${formData.resource === resource.id ? 'bg-white text-terracotta-600' : 'bg-warm-100 text-warm-500'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {formData.resource === resource.id && (
                            <div className="h-5 w-5 bg-terracotta-600 rounded-full flex items-center justify-center">
                              <CheckIcon className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-warm-900">{resource.name}</h3>
                        <p className="text-sm text-warm-500">{resource.type}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-xl font-bold text-warm-900 mb-6">Select Date & Time Slot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Booking For</label>
                    <div className="block w-full px-4 py-3 border border-warm-200 rounded-xl bg-warm-50 text-warm-900">
                      {currentUser?.name} ({currentUser?.email})
                    </div>
                    <p className="mt-1 text-xs text-warm-400">Automatically set to logged-in user</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Booking Date</label>
                    <input 
                      type="date" 
                      value={formData.booking_date} 
                      onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })} 
                      min={new Date().toISOString().split('T')[0]}
                      required 
                      className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all" 
                    />
                    <p className="mt-1 text-xs text-warm-400">Cannot select previous days</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Time Slot</label>
                    <select value={formData.time_slot} onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })} className="block w-full px-4 py-3 border border-warm-200 rounded-xl text-warm-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all bg-white">
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
              </motion.div>
            )}

            {step === 3 && selectedResource && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-xl font-bold text-warm-900 mb-6">Confirm Booking Details</h2>
                <div className="bg-cream-50 rounded-xl p-6 border border-warm-200 max-w-2xl">
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-warm-200">
                    <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center text-terracotta-600 shadow-sm border border-warm-100">
                      {React.createElement(getIconForType(selectedResource.type), { className: "w-7 h-7" })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-warm-900">{selectedResource.name}</h3>
                      <p className="text-warm-500">{selectedResource.type} • {selectedResource.location}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs font-semibold text-warm-400 uppercase tracking-wider block mb-1">Booked By</span>
                      <div className="text-warm-900 font-medium">{currentUser?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-warm-400 uppercase tracking-wider block mb-1">Date</span>
                      <div className="flex items-center text-warm-900 font-medium">
                        <CalendarIcon className="w-4 h-4 mr-2 text-terracotta-500" />
                        {formData.booking_date || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-warm-400 uppercase tracking-wider block mb-1">Time Slot</span>
                      <div className="flex items-center text-warm-900 font-medium">
                        <ClockIcon className="w-4 h-4 mr-2 text-terracotta-500" />
                        {formData.time_slot}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-8 mt-4 border-t border-warm-100">
            <button onClick={handleBack} className="flex items-center px-6 py-2.5 border border-warm-200 rounded-xl text-sm font-medium text-warm-600 hover:bg-warm-50 transition-colors">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button onClick={step === 3 ? handleConfirm : handleNext} disabled={(step === 1 && !formData.resource) || (step === 2 && !formData.booking_date) || isLoading} className="flex items-center px-6 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Creating...' : (step === 3 ? 'Confirm Booking' : 'Next Step')}
              {step !== 3 && !isLoading && <ArrowRightIcon className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
