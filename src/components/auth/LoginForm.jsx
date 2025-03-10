import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { login, resetAuthState } from '../../features/auth/slices/authSlice';
import Loader from '../common/Loader';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

// Validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);
  const [formError, setFormError] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Reset auth state when component unmounts
    return () => {
      dispatch(resetAuthState());
    };
  }, [isAuthenticated, navigate, dispatch]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setFormError(null);
    
    try {
      await dispatch(login(values)).unwrap();
      navigate('/');
    } catch (err) {
      setFormError(err || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card 
      className="border-0 rounded-lg overflow-hidden"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
    >
      <Card.Body className="p-4 p-md-5">
        <h2 className="text-center mb-4 text-primary">Login to Your Account</h2>
        
        {formError && (
          <Alert 
            variant="danger" 
            className="mb-4 rounded-lg border-0"
            style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545' }}
          >
            {formError}
          </Alert>
        )}
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium text-secondary">Email</Form.Label>
                <div className="input-group">
                  <div className="input-group-text bg-light border-end-0 text-secondary">
                    <FaEnvelope />
                  </div>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                    placeholder="Enter your email"
                    className="py-2 border-start-0"
                    style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium text-secondary">Password</Form.Label>
                <div className="input-group">
                  <div className="input-group-text bg-light border-end-0 text-secondary">
                    <FaLock />
                  </div>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && errors.password}
                    placeholder="Enter your password"
                    className="py-2 border-start-0"
                    style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3 py-2 text-white fw-medium rounded-pill d-flex align-items-center justify-content-center"
                disabled={isSubmitting || isLoading}
                style={{ 
                  background: 'linear-gradient(135deg, #4a6bff 0%, #2948ff 100%)',
                  border: 'none',
                  height: '48px'
                }}
              >
                {isLoading ? (
                  <Loader size="sm" className="mx-auto" />
                ) : (
                  <>
                    <FaSignInAlt className="me-2" /> Sign In
                  </>
                )}
              </Button>
              
              <div className="text-center mt-4">
                <p className="mb-0 text-secondary">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-decoration-none fw-medium"
                    style={{ color: '#4a6bff' }}
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default LoginForm; 