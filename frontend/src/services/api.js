const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const error = await response.json();
        // Handle Django REST Framework validation errors
        if (error.phone) {
          errorMessage = Array.isArray(error.phone) ? error.phone[0] : error.phone;
        } else if (error.email) {
          errorMessage = Array.isArray(error.email) ? error.email[0] : error.email;
        } else if (error.name) {
          errorMessage = Array.isArray(error.name) ? error.name[0] : error.name;
        } else if (error.resource) {
          errorMessage = error.resource;
        } else if (error.user) {
          errorMessage = error.user;
        } else if (error.non_field_errors) {
          errorMessage = error.non_field_errors[0];
        } else if (error.error) {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.detail) {
          errorMessage = error.detail;
        } else {
          errorMessage = `Server error: ${response.status}`;
        }
      } catch (e) {
        errorMessage = `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    // Handle 204 No Content responses (common for DELETE operations)
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
    }
    throw error;
  }
};

// User API
export const userAPI = {
  getAll: () => apiCall('/users/'),
  getById: (id) => apiCall(`/users/${id}/`),
  create: (data) => apiCall('/users/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/users/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/users/${id}/`, { method: 'DELETE' }),
  getByStatus: (status) => apiCall(`/users/by_status/?status=${status}`),
};

// Resource API
export const resourceAPI = {
  getAll: () => apiCall('/resources/'),
  getById: (id) => apiCall(`/resources/${id}/`),
  create: (data) => apiCall('/resources/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/resources/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/resources/${id}/`, { method: 'DELETE' }),
  getAvailable: () => apiCall('/resources/available/'),
};

// Booking API
export const bookingAPI = {
  getAll: () => apiCall('/bookings/'),
  getById: (id) => apiCall(`/bookings/${id}/`),
  create: (data) => apiCall('/bookings/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/bookings/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/bookings/${id}/`, { method: 'DELETE' }),
  approve: (id) => apiCall(`/bookings/${id}/approve/`, { method: 'POST' }),
  reject: (id) => apiCall(`/bookings/${id}/reject/`, { method: 'POST' }),
  getUpcoming: () => apiCall('/bookings/upcoming/'),
};

// Auth API
export const authAPI = {
  login: (email, password) => apiCall('/login/', { 
    method: 'POST', 
    body: JSON.stringify({ email, password }) 
  }),
  logout: (user_id) => apiCall('/logout/', {
    method: 'POST',
    body: JSON.stringify({ user_id })
  }),
};

// Admin API
export const adminAPI = {
  getStats: () => apiCall('/admin/stats/'),
};
