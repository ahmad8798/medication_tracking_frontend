import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="login-page w-100 h-100 bg-light">
      <Container fluid className="h-100">
        <Row className="h-100 align-items-center justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5} className="mx-auto">
            <LoginForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage; 