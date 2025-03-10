import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Form, Button, Alert as BootstrapAlert } from 'react-bootstrap';
import { validateToken } from '../features/auth/slices/authSlice';
import Loader from '../components/common/Loader';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch user profile when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(validateToken());
    }
  }, [dispatch, user]);

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real application, you would dispatch an action to update the profile
    // For this demo, we'll just simulate a successful update
    setUpdateSuccess(true);
    setUpdateError(null);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'doctor':
        return 'Doctor';
      case 'nurse':
        return 'Nurse';
      case 'patient':
        return 'Patient';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <BootstrapAlert variant="danger" className="my-4">
        {error}
      </BootstrapAlert>
    );
  }

  if (!user) {
    return (
      <BootstrapAlert variant="warning" className="my-4">
        Unable to load profile. Please try again later.
      </BootstrapAlert>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">My Profile</h1>
      
      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">Profile Information</h5>
            </Card.Header>
            <Card.Body>
              {updateSuccess && (
                <BootstrapAlert variant="success" className="mb-4">
                  Profile updated successfully!
                </BootstrapAlert>
              )}
              
              {updateError && (
                <BootstrapAlert variant="danger" className="mb-4">
                  {updateError}
                </BootstrapAlert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    value={getRoleDisplayName(formData.role)}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Role can only be changed by an administrator.
                  </Form.Text>
                </Form.Group>
                
                <Button variant="primary" type="submit" className="text-white">
                  Update Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Account Information</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Account ID:</strong> {user.id}</p>
              <p><strong>Account Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Role:</strong> {getRoleDisplayName(user.role)}</p>
              
              <div className="mt-4">
                <h6>Change Password</h6>
                <Button variant="outline-secondary" size="sm">
                  Change Password
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage; 