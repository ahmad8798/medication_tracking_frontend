import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import { canPrescribeMedications } from '../utils/authUtils';
import { FaPills, FaClipboardCheck, FaUserMd, FaInfoCircle, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Card background colors
  const cardColors = [
    { bg: '#f0f7ff', icon: '#4a6bff', border: '#d6e4ff' },
    { bg: '#f0fff4', icon: '#38b27b', border: '#d1f2e0' },
    { bg: '#fff4f0', icon: '#e67e56', border: '#ffe0d6' }
  ];

  return (
    <Container>
      <div className="text-center mb-5 py-4">
        <h1 className="display-4 mb-3 fw-bold" style={{ color: '#2d3748' }}>Medication Tracking System</h1>
        <p className="lead" style={{ color: '#4a5568', maxWidth: '700px', margin: '0 auto' }}>
          A comprehensive solution for managing and tracking medications with ease and precision
        </p>
      </div>

      <Row className="mb-5 g-4">
        <Col md={4}>
          <Card 
            className="h-100 border-0 rounded-lg overflow-hidden" 
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: cardColors[0].bg,
              borderLeft: `4px solid ${cardColors[0].border}`
            }}
          >
            <Card.Body className="d-flex flex-column p-4">
              <div 
                className="icon-container mb-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  background: `${cardColors[0].icon}20`, 
                  width: '60px', 
                  height: '60px' 
                }}
              >
                <FaPills size={24} color={cardColors[0].icon} />
              </div>
              <Card.Title className="fw-bold mb-3" style={{ color: '#2d3748' }}>Track Medications</Card.Title>
              <Card.Text className="mb-4" style={{ color: '#4a5568' }}>
                Keep track of all your medications in one place. View dosage, frequency, and important dates.
              </Card.Text>
              <div className="mt-auto">
                {isAuthenticated ? (
                  <Link 
                    to="/medications" 
                    className="btn btn-primary rounded-pill d-inline-flex align-items-center"
                  >
                    View Medications <FaArrowRight className="ms-2" />
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="btn btn-primary rounded-pill d-inline-flex align-items-center"
                  >
                    Login to Start <FaArrowRight className="ms-2" />
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card 
            className="h-100 border-0 rounded-lg overflow-hidden" 
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: cardColors[1].bg,
              borderLeft: `4px solid ${cardColors[1].border}`
            }}
          >
            <Card.Body className="d-flex flex-column p-4">
              <div 
                className="icon-container mb-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  background: `${cardColors[1].icon}20`, 
                  width: '60px', 
                  height: '60px' 
                }}
              >
                <FaClipboardCheck size={24} color={cardColors[1].icon} />
              </div>
              <Card.Title className="fw-bold mb-3" style={{ color: '#2d3748' }}>Log Medication Intake</Card.Title>
              <Card.Text className="mb-4" style={{ color: '#4a5568' }}>
                Record when you take your medications to maintain an accurate history and ensure adherence.
              </Card.Text>
              <div className="mt-auto">
                {isAuthenticated ? (
                  <Link 
                    to="/medications" 
                    className="btn btn-success rounded-pill d-inline-flex align-items-center"
                    style={{ background: cardColors[1].icon, borderColor: cardColors[1].icon }}
                  >
                    Log Intake <FaArrowRight className="ms-2" />
                  </Link>
                ) : (
                  <Link 
                    to="/register" 
                    className="btn btn-success rounded-pill d-inline-flex align-items-center"
                    style={{ background: cardColors[1].icon, borderColor: cardColors[1].icon }}
                  >
                    Register Now <FaArrowRight className="ms-2" />
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card 
            className="h-100 border-0 rounded-lg overflow-hidden" 
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              background: cardColors[2].bg,
              borderLeft: `4px solid ${cardColors[2].border}`
            }}
          >
            <Card.Body className="d-flex flex-column p-4">
              <div 
                className="icon-container mb-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  background: `${cardColors[2].icon}20`, 
                  width: '60px', 
                  height: '60px' 
                }}
              >
                <FaUserMd size={24} color={cardColors[2].icon} />
              </div>
              <Card.Title className="fw-bold mb-3" style={{ color: '#2d3748' }}>Prescribe Medications</Card.Title>
              <Card.Text className="mb-4" style={{ color: '#4a5568' }}>
                Healthcare providers can prescribe medications and monitor patient adherence.
              </Card.Text>
              <div className="mt-auto">
                {isAuthenticated && canPrescribeMedications(user) ? (
                  <Link 
                    to="/medications/new" 
                    className="btn rounded-pill d-inline-flex align-items-center"
                    style={{ 
                      background: cardColors[2].icon, 
                      borderColor: cardColors[2].icon,
                      color: 'white'
                    }}
                  >
                    Prescribe Medication <FaArrowRight className="ms-2" />
                  </Link>
                ) : (
                  <Button 
                    variant="secondary" 
                    disabled 
                    className="rounded-pill d-inline-flex align-items-center"
                  >
                    For Healthcare Providers <FaUserMd className="ms-2" />
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div 
        className="p-4 rounded-lg mb-4" 
        style={{ 
          background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f4f9 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid #e9ecef'
        }}
      >
        <div className="d-flex align-items-center mb-3">
          <FaInfoCircle size={24} className="me-2 text-primary" />
          <h2 className="mb-0" style={{ color: '#2d3748' }}>About the System</h2>
        </div>
        <p style={{ color: '#4a5568' }}>
          The Medication Tracking System is designed to help patients, doctors, and nurses manage
          medications effectively. With features for prescription management, intake logging, and
          adherence tracking, it provides a complete solution for medication management.
        </p>
        <p style={{ color: '#4a5568' }}>
          This system supports different user roles with appropriate access controls:
        </p>
        <Row className="g-3 mt-2">
          <Col md={6}>
            <div 
              className="p-3 rounded-lg d-flex align-items-center" 
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <div 
                className="icon-container me-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  background: 'rgba(74, 107, 255, 0.1)', 
                  width: '40px', 
                  height: '40px' 
                }}
              >
                <FaPills size={18} color="#4a6bff" />
              </div>
              <div>
                <h6 className="mb-1" style={{ color: '#2d3748' }}>Patients</h6>
                <p className="mb-0 small" style={{ color: '#4a5568' }}>View medications and log intake</p>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div 
              className="p-3 rounded-lg d-flex align-items-center" 
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <div 
                className="icon-container me-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  background: 'rgba(56, 178, 123, 0.1)', 
                  width: '40px', 
                  height: '40px' 
                }}
              >
                <FaClipboardCheck size={18} color="#38b27b" />
              </div>
              <div>
                <h6 className="mb-1" style={{ color: '#2d3748' }}>Nurses</h6>
                <p className="mb-0 small" style={{ color: '#4a5568' }}>Help patients log medication intake</p>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div 
              className="p-3 rounded-lg d-flex align-items-center" 
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <div 
                className="icon-container me-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  background: 'rgba(230, 126, 86, 0.1)', 
                  width: '40px', 
                  height: '40px' 
                }}
              >
                <FaUserMd size={18} color="#e67e56" />
              </div>
              <div>
                <h6 className="mb-1" style={{ color: '#2d3748' }}>Doctors</h6>
                <p className="mb-0 small" style={{ color: '#4a5568' }}>Prescribe medications and monitor adherence</p>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div 
              className="p-3 rounded-lg d-flex align-items-center" 
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <div 
                className="icon-container me-3 rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  background: 'rgba(74, 85, 104, 0.1)', 
                  width: '40px', 
                  height: '40px' 
                }}
              >
                <FaUserMd size={18} color="#4a5568" />
              </div>
              <div>
                <h6 className="mb-1" style={{ color: '#2d3748' }}>Administrators</h6>
                <p className="mb-0 small" style={{ color: '#4a5568' }}>Full system access for management</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default HomePage; 