import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { logout } from '../../features/auth/slices/authSlice';
import { 
  isAdmin, 
  canPrescribeMedications 
} from '../../utils/authUtils';

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <Navbar 
      bg="primary" 
      variant="dark" 
      expand="lg" 
      expanded={expanded}
      onToggle={setExpanded}
      className="mb-4"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Medication Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/medications" onClick={() => setExpanded(false)}>
                  Medications
                </Nav.Link>
                
                {canPrescribeMedications(user) && (
                  <Nav.Link as={Link} to="/medications/new" onClick={() => setExpanded(false)}>
                    Prescribe Medication
                  </Nav.Link>
                )}
                
                {isAdmin(user) && (
                  <Nav.Link as={Link} to="/users" onClick={() => setExpanded(false)}>
                    Users
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={user?.name || 'User'} 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile" onClick={() => setExpanded(false)}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => { handleLogout(); setExpanded(false); }}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={() => setExpanded(false)}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 