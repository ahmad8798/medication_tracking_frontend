import api from './api';

// Service for user-related API calls
const userService = {
  // Get all users with optional filters (admin only)
  getUsers: async (filters = {}) => {
    try {
      const response = await api.get('/users', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Get a single user by ID (admin only)
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  },

  // Update a user's role (admin only)
  updateUserRole: async (id, role) => {
    try {
      const response = await api.patch(`/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user role' };
    }
  },

  // Toggle a user's active status (admin only)
  toggleUserStatus: async (id, isActive) => {
    try {
      const response = await api.patch(`/users/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user status' };
    }
  },

  // Get patients (for doctors and admins)
  getPatients: async () => {
    try {
      const response = await api.get('/users/patients');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch patients' };
    }
  },
};

export default userService; 