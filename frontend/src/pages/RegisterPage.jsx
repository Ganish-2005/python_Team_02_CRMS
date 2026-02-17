import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  PhoneIcon,
  ArrowRightIcon,
  CheckIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    password: '',
    confirmPassword: ''
  });

  const validatePassword = (password) => {
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
  const isPasswordValid = passwordErrors.length === 0;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password strength
    if (!isPasswordValid) {
      setError('Password does not meet the requirements. Please check below.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
        status: 'ACTIVE'
      };
      
      await userAPI.create(userData);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cream-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-terracotta-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-terracotta-200">
            <CalendarIcon className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-warm-900 mb-2">Create an Account</h1>
          <p className="text-warm-500">Join the Campus Resource Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="student@university.edu"
                />
              </div>
              <p className="mt-1 text-xs text-warm-400">Must be a unique email address</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-warm-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-warm-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">
                  Confirm
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-warm-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-warm-200 rounded-xl text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {formData.password && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <>
                  Register <ArrowRightIcon className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-warm-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-terracotta-600 hover:text-terracotta-500">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
