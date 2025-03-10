import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { validateToken } from '../../features/auth/slices/authSlice';
import { hasAnyRole } from '../../utils/authUtils';
import Loader from './Loader';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && localStorage.getItem('token')) {
        setIsValidating(true);
        try {
          await dispatch(validateToken()).unwrap();
        } catch (error) {
          console.error('Token validation failed:', error);
        } finally {
          setIsValidating(false);
        }
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (isLoading || isValidating) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Loader />
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have any of the allowed roles
  if (allowedRoles.length > 0 && !hasAnyRole(user, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default PrivateRoute; 