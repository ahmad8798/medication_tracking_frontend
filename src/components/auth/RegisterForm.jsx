import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { register, resetAuthState } from '../../features/auth/slices/authSlice';
import Loader from '../common/Loader';
import { FaUser, FaEnvelope, FaLock, FaUserMd, FaUserCheck } from 'react-icons/fa';

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .required('Role is required')
    .oneOf(['patient', 'doctor', 'nurse'], 'Invalid role selected'),
});

const RegisterForm = () => {
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
    
    // Remove confirmPassword before sending to API
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...userData } = values;
    
    try {
      await dispatch(register(userData)).unwrap();
      navigate('/');
    } catch (err) {
      setFormError(err || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Role options with icons
  const roleOptions = [
    { value: 'patient', label: 'Patient', icon: <FaUser size={16} /> },
    { value: 'doctor', label: 'Doctor', icon: <FaUserMd size={16} /> },
    { value: 'nurse', label: 'Nurse', icon: <FaUserMd size={16} /> }
  ];

  return (
    <Card 
      className="border-0 rounded-lg overflow-hidden"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
    >
      <Card.Body className="p-4 p-md-5">
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
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'patient',
          }}
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
                <Form.Label className="fw-medium text-secondary">Full Name</Form.Label>
                <div className="input-group">
                  <div className="input-group-text bg-light border-end-0 text-secondary">
                    <FaUser />
                  </div>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && errors.name}
                    placeholder="Enter your full name"
                    className="py-2 border-start-0"
                    style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

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

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium text-secondary">Confirm Password</Form.Label>
                <div className="input-group">
                  <div className="input-group-text bg-light border-end-0 text-secondary">
                    <FaLock />
                  </div>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.confirmPassword && errors.confirmPassword}
                    placeholder="Confirm your password"
                    className="py-2 border-start-0"
                    style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium text-secondary">Role</Form.Label>
                <div className="role-selector">
                  {roleOptions.map(option => (
                    <div 
                      key={option.value}
                      className={`role-option p-3 mb-2 rounded-lg d-flex align-items-center ${values.role === option.value ? 'selected' : ''}`}
                      style={{
                        border: `1px solid ${values.role === option.value ? '#4a6bff' : '#e2e8f0'}`,
                        background: values.role === option.value ? 'rgba(74, 107, 255, 0.05)' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => {
                        const event = { target: { name: 'role', value: option.value } };
                        handleChange(event);
                      }}
                    >
                      <div 
                        className="icon-container me-3 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          background: values.role === option.value ? 'rgba(74, 107, 255, 0.1)' : '#f8f9fa',
                          width: '36px', 
                          height: '36px',
                          color: values.role === option.value ? '#4a6bff' : '#718096',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {option.icon}
                      </div>
                      <div>
                        <div className="fw-medium" style={{ color: values.role === option.value ? '#4a6bff' : '#2d3748' }}>
                          {option.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Form.Control
                  type="hidden"
                  name="role"
                  value={values.role}
                  isInvalid={touched.role && errors.role}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Note: Role selection is for demonstration purposes. In a real application, 
                  healthcare provider roles would require verification.
                </Form.Text>
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
                    <FaUserCheck className="me-2" /> Create Account
                  </>
                )}
              </Button>
              
              <div className="text-center mt-4">
                <p className="mb-0 text-secondary">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-decoration-none fw-medium"
                    style={{ color: '#4a6bff' }}
                  >
                    Login here
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

export default RegisterForm; 