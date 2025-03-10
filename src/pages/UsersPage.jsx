import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Form, 
  Button, 
  InputGroup, 
  Badge, 
  Modal 
} from 'react-bootstrap';
import { 
  getUsers, 
  updateUserRole, 
  toggleUserStatus 
} from '../features/users/slices/usersSlice';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error, pagination } = useSelector((state) => state.users);
  
  const [filters, setFilters] = useState({
    role: '',
    active: '',
    search: '',
    page: 1,
    limit: 10,
  });
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Fetch users when component mounts or filters change
  useEffect(() => {
    dispatch(getUsers(filters));
  }, [dispatch, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      ...filters,
      page: 1, // Reset to first page when searching
    });
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters({
      ...filters,
      page,
    });
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  // Handle role change
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const handleRoleChange = () => {
    if (selectedUser && newRole) {
      dispatch(updateUserRole({ id: selectedUser.id, role: newRole }))
        .unwrap()
        .then(() => {
          setShowRoleModal(false);
        })
        .catch((err) => {
          console.error('Failed to update user role:', err);
        });
    }
  };

  // Handle status toggle
  const handleStatusToggle = (user) => {
    if (window.confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`)) {
      dispatch(toggleUserStatus({ id: user.id, isActive: !user.isActive }));
    }
  };

  // Get role badge color
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'doctor':
        return 'primary';
      case 'nurse':
        return 'info';
      case 'patient':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div>
      <h1 className="mb-4">User Management</h1>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search by name or email..."
                    />
                    <Button variant="primary" type="submit">
                      Search
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="patient">Patient</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="active"
                    value={filters.active}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Error message */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => dispatch({ type: 'users/clearError' })}
        />
      )}

      {/* Loading indicator */}
      {isLoading && <Loader size="lg" className="my-5" />}

      {/* Users table */}
      {!isLoading && users.length === 0 ? (
        <div className="text-center my-5">
          <h3>No users found</h3>
          <p>Try adjusting your filters.</p>
        </div>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={getRoleBadgeVariant(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.isActive ? 'success' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => openRoleModal(user)}
                      >
                        Change Role
                      </Button>
                      <Button
                        variant={user.isActive ? 'outline-danger' : 'outline-success'}
                        size="sm"
                        onClick={() => handleStatusToggle(user)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
          <Card.Footer>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </Card.Footer>
        </Card>
      )}

      {/* Role Change Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                Change role for user: <strong>{selectedUser.name}</strong>
              </p>
              <Form.Group>
                <Form.Label>Select New Role</Form.Label>
                <Form.Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="patient">Patient</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRoleChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsersPage; 