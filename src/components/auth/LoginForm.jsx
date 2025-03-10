import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { login, resetAuthState } from '../../features/auth/slices/authSlice';
import Loader from '../common/Loader';

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
    <Card className="shadow border-0">
      <Card.Body className="p-4">
        <h2 className="text-center mb-4 text-primary">Login to Your Account</h2>
        
        {formError && (
          <Alert variant="danger" className="mb-4">
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
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && errors.email}
                  placeholder="Enter your email"
                  className="py-2"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && errors.password}
                  placeholder="Enter your password"
                  className="py-2"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3 py-2 text-white fw-medium"
                disabled={isSubmitting || isLoading}
                style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
              >
                {isLoading ? <Loader size="sm" className="mx-auto" /> : 'Login'}
              </Button>
              
              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none text-primary fw-medium">
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