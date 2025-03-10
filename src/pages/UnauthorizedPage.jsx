import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const UnauthorizedPage = () => {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="display-1 text-danger mb-4">403</h1>
          <h2 className="mb-4">Access Denied</h2>
          <p className="lead mb-5">
            You do not have permission to access this page. Please contact your administrator
            if you believe this is an error.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            Go to Homepage
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default UnauthorizedPage; 