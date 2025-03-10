import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import medicationService from '../../../services/medicationService';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  medications: [],
  medication: null,
  logs: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

// Async thunks
export const getMedications = createAsyncThunk(
  'medications/getMedications',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await medicationService.getMedications(filters);
      return response;
    } catch (error) {
      const message = error.message || 'Failed to fetch medications';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getMedicationById = createAsyncThunk(
  'medications/getMedicationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await medicationService.getMedicationById(id);
      return response;
    } catch (error) {
      const message = error.message || 'Failed to fetch medication details';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createMedication = createAsyncThunk(
  'medications/createMedication',
  async (medicationData, { rejectWithValue }) => {
    try {
      const response = await medicationService.createMedication(medicationData);
      toast.success('Medication created successfully!');
      return response;
    } catch (error) {
      const message = error.message || 'Failed to create medication';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateMedication = createAsyncThunk(
  'medications/updateMedication',
  async ({ id, medicationData }, { rejectWithValue }) => {
    try {
      const response = await medicationService.updateMedication(id, medicationData);
      toast.success('Medication updated successfully!');
      return response;
    } catch (error) {
      const message = error.message || 'Failed to update medication';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteMedication = createAsyncThunk(
  'medications/deleteMedication',
  async (id, { rejectWithValue }) => {
    try {
      const response = await medicationService.deleteMedication(id);
      toast.success('Medication deleted successfully!');
      return { id, response };
    } catch (error) {
      const message = error.message || 'Failed to delete medication';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logMedicationIntake = createAsyncThunk(
  'medications/logMedicationIntake',
  async ({ _id, logData }, { rejectWithValue }) => {
    try {
      const response = await medicationService.logMedicationIntake(_id, logData);
      toast.success('Medication intake logged successfully!');
      return response;
    } catch (error) {
      const message = error.message || 'Failed to log medication intake';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getMedicationLogs = createAsyncThunk(
  'medications/getMedicationLogs',
  async ({ id, filters }, { rejectWithValue }) => {
    try {
      const response = await medicationService.getMedicationLogs(id, filters);
      return response;
    } catch (error) {
      const message = error.message || 'Failed to fetch medication logs';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Medications slice
const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    resetMedicationState: (state) => {
      state.medication = null;
      state.error = null;
      state.isLoading = false;
    },
    resetMedicationsState: (state) => {
      state.medications = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Medications
      .addCase(getMedications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMedications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medications = action.payload.medications;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.total,
        };
      })
      .addCase(getMedications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Medication by ID
      .addCase(getMedicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMedicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medication = action.payload.medication;
      })
      .addCase(getMedicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Medication
      .addCase(createMedication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMedication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medications.push(action.payload.medication);
      })
      .addCase(createMedication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Medication
      .addCase(updateMedication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMedication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medication = action.payload.medication;
        
        // Update in the list if it exists
        const index = state.medications.findIndex(
          (med) => med._id === action.payload.medication._id
        );
        if (index !== -1) {
          state.medications[index] = action.payload.medication;
        }
      })
      .addCase(updateMedication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete Medication
      .addCase(deleteMedication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMedication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medications = state.medications.filter(
          (med) => med._id !== action.payload.id
        );
        if (state.medication && state.medication._id === action.payload.id) {
          state.medication = null;
        }
      })
      .addCase(deleteMedication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Log Medication Intake
      .addCase(logMedicationIntake.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logMedicationIntake.fulfilled, (state, action) => {
        state.isLoading = false;
        // If we have logs loaded, add the new log to the beginning
        if (state.logs.length > 0) {
          state.logs.unshift(action.payload.log);
        }
      })
      .addCase(logMedicationIntake.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Medication Logs
      .addCase(getMedicationLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMedicationLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logs = action.payload.logs;
      })
      .addCase(getMedicationLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMedicationState, resetMedicationsState } = medicationsSlice.actions;
export default medicationsSlice.reducer; 