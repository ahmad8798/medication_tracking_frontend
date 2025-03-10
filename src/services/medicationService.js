import api from './api';

// Service for medication-related API calls
const medicationService = {
  // Get all medications with optional filters
  getMedications: async (filters = {}) => {
    try {
      const response = await api.get('/medications', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch medications' };
    }
  },

  // Get a single medication by ID
  getMedicationById: async (id) => {
    try {
      const response = await api.get(`/medications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch medication details' };
    }
  },

  // Create a new medication
  createMedication: async (medicationData) => {
    try {
      const response = await api.post('/medications', medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create medication' };
    }
  },

  // Update an existing medication
  updateMedication: async (id, medicationData) => {
    try {
      const response = await api.put(`/medications/${id}`, medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update medication' };
    }
  },

  // Delete a medication
  deleteMedication: async (id) => {
    try {
      const response = await api.delete(`/medications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete medication' };
    }
  },

  // Log medication intake
  logMedicationIntake: async (_id, logData) => {
    try {
      const response = await api.post(`/medications/${_id}/log`, logData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to log medication intake' };
    }
  },

  // Get medication logs
  getMedicationLogs: async (id, filters = {}) => {
    try {
      const response = await api.get(`/medications/${id}/logs`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch medication logs' };
    }
  },
};

export default medicationService; 