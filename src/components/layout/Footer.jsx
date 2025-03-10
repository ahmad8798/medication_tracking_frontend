import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light py-3 mt-auto">
      <Container>
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Medication Tracking System. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 