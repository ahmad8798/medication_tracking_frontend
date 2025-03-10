import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RegisterForm from '../components/auth/RegisterForm';
import { FaUserPlus } from 'react-icons/fa';

const RegisterPage = () => {
  return (
    <div 
      className="register-page w-100 min-vh-100 d-flex align-items-center justify-content-center"
      style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        padding: '2rem 0' 
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5} className="mx-auto">
            <div className="text-center mb-4">
              <div 
                className="icon-container mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  background: 'linear-gradient(135deg, #4a6bff 0%, #2948ff 100%)', 
                  width: '70px', 
                  height: '70px',
                  boxShadow: '0 4px 20px rgba(74, 107, 255, 0.3)'
                }}
              >
                <FaUserPlus size={32} color="white" />
              </div>
              <h1 className="fw-bold mb-1" style={{ color: '#2d3748' }}>Create Account</h1>
              <p className="text-muted">Join the Medication Tracker system</p>
            </div>
            <RegisterForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage; 