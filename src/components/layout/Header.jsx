import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { logout } from '../../features/auth/slices/authSlice';
import { 
  isAdmin, 
  canPrescribeMedications 
} from '../../utils/authUtils';
import { FaPills, FaHome, FaUserMd, FaUsers, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

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
      expand="lg" 
      expanded={expanded}
      onToggle={setExpanded}
      className="navbar-custom shadow-sm py-2 mb-4"
      style={{
        background: 'linear-gradient(135deg, #4a6bff 0%, #2948ff 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/"
          className="d-flex align-items-center"
        >
          <div 
            className="brand-icon me-2 rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              width: '38px', 
              height: '38px' 
            }}
          >
            <FaPills size={20} color="white" />
          </div>
          <span className="fw-bold text-white">Medication Tracker</span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="border-0 shadow-none"
          style={{ color: 'white' }}
        />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              onClick={() => setExpanded(false)}
              className="text-white d-flex align-items-center mx-1"
            >
              <FaHome className="me-1" /> Home
            </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/medications" 
                  onClick={() => setExpanded(false)}
                  className="text-white d-flex align-items-center mx-1"
                >
                  <FaPills className="me-1" /> Medications
                </Nav.Link>
                
                {canPrescribeMedications(user) && (
                  <Nav.Link 
                    as={Link} 
                    to="/medications/new" 
                    onClick={() => setExpanded(false)}
                    className="text-white d-flex align-items-center mx-1"
                  >
                    <FaUserMd className="me-1" /> Prescribe
                  </Nav.Link>
                )}
                
                {isAdmin(user) && (
                  <Nav.Link 
                    as={Link} 
                    to="/users" 
                    onClick={() => setExpanded(false)}
                    className="text-white d-flex align-items-center mx-1"
                  >
                    <FaUsers className="me-1" /> Users
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <div className="d-inline-flex align-items-center">
                    <div 
                      className="user-avatar me-2 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        width: '32px', 
                        height: '32px' 
                      }}
                    >
                      <FaUserCircle size={18} color="white" />
                    </div>
                    <span className="text-white">{user?.name || 'User'}</span>
                  </div>
                } 
                id="user-dropdown"
                align="end"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item 
                  as={Link} 
                  to="/profile" 
                  onClick={() => setExpanded(false)}
                  className="d-flex align-items-center"
                >
                  <FaUserCircle className="me-2" /> Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item 
                  onClick={() => { handleLogout(); setExpanded(false); }}
                  className="d-flex align-items-center text-danger"
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex">
                <Button 
                  as={Link} 
                  to="/login" 
                  onClick={() => setExpanded(false)}
                  variant="outline-light"
                  size="sm"
                  className="me-2 d-flex align-items-center"
                >
                  <FaSignInAlt className="me-1" /> Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  onClick={() => setExpanded(false)}
                  variant="light"
                  size="sm"
                  className="d-flex align-items-center"
                >
                  <FaUserPlus className="me-1" /> Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 