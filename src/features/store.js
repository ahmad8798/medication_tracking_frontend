import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slices/authSlice';
import medicationsReducer from './medications/slices/medicationsSlice';
import usersReducer from './users/slices/usersSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    medications: medicationsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 