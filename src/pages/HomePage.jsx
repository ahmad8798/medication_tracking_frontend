import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { canPrescribeMedications } from '../utils/authUtils';

const HomePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Medication Tracking System</h1>
        <p className="lead">
          A comprehensive solution for managing and tracking medications
        </p>
      </div>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Track Medications</Card.Title>
              <Card.Text>
                Keep track of all your medications in one place. View dosage, frequency, and important dates.
              </Card.Text>
              <div className="mt-auto">
                {isAuthenticated ? (
                  <Link to="/medications" className="btn btn-primary">
                    View Medications
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-primary">
                    Login to Start
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Log Medication Intake</Card.Title>
              <Card.Text>
                Record when you take your medications to maintain an accurate history and ensure adherence.
              </Card.Text>
              <div className="mt-auto">
                {isAuthenticated ? (
                  <Link to="/medications" className="btn btn-primary">
                    Log Intake
                  </Link>
                ) : (
                  <Link to="/register" className="btn btn-primary">
                    Register Now
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Prescribe Medications</Card.Title>
              <Card.Text>
                Healthcare providers can prescribe medications and monitor patient adherence.
              </Card.Text>
              <div className="mt-auto">
                {isAuthenticated && canPrescribeMedications(user) ? (
                  <Link to="/medications/new" className="btn btn-primary">
                    Prescribe Medication
                  </Link>
                ) : (
                  <Button variant="primary" disabled>
                    For Healthcare Providers
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="bg-light p-4 rounded-3 mb-4">
        <h2>About the System</h2>
        <p>
          The Medication Tracking System is designed to help patients, doctors, and nurses manage
          medications effectively. With features for prescription management, intake logging, and
          adherence tracking, it provides a complete solution for medication management.
        </p>
        <p>
          This system supports different user roles with appropriate access controls:
        </p>
        <ul>
          <li><strong>Patients</strong> can view their medications and log intake</li>
          <li><strong>Nurses</strong> can view assigned patients' medications and help log intake</li>
          <li><strong>Doctors</strong> can prescribe medications and monitor patient adherence</li>
          <li><strong>Administrators</strong> have full system access for management</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage; 