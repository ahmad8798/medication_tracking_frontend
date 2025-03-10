import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, InputGroup, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMedications, deleteMedication } from '../features/medications/slices/medicationsSlice';
import MedicationCard from '../components/medications/MedicationCard';
import MedicationLogForm from '../components/medications/MedicationLogForm';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { canPrescribeMedications } from '../utils/authUtils';

const MedicationsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { medications, isLoading, error, pagination } = useSelector((state) => state.medications);
  
  const [filters, setFilters] = useState({
    active: true,
    search: '',
    page: 1,
    limit: 9,
  });
  
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState(null);

  // Fetch medications when component mounts or filters change
  useEffect(() => {
    dispatch(getMedications(filters));
  }, [dispatch, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
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

  // Handle medication deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      dispatch(deleteMedication(id));
    }
  };

  // Handle medication log
  const handleLogIntake = (id) => {
    setSelectedMedicationId(id);
    setShowLogForm(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Medications</h1>
        {canPrescribeMedications(user) && (
          <Link to="/medications/new" className="btn btn-primary">
            Prescribe New Medication
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search medications..."
                    />
                    <Button variant="primary" type="submit">
                      Search
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    id="activeFilter"
                    name="active"
                    label="Show active medications only"
                    checked={filters.active}
                    onChange={handleFilterChange}
                  />
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
          onClose={() => dispatch({ type: 'medications/clearError' })}
        />
      )}

      {/* Loading indicator */}
      {isLoading && <Loader size="lg" className="my-5" />}

      {/* Medications list */}
      {!isLoading && medications.length === 0 ? (
        <div className="text-center my-5">
          <h3>No medications found</h3>
          <p>Try adjusting your filters or add a new medication.</p>
        </div>
      ) : (
        <>
          <Row>
            {medications.map((medication) => (
              <Col key={medication.id} md={6} lg={4} className="mb-4">
                <MedicationCard
                  medication={medication}
                  currentUser={user}
                  onLogIntake={handleLogIntake}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Medication Log Form Modal */}
      {showLogForm && (
        <MedicationLogForm
          medicationId={selectedMedicationId}
          show={showLogForm}
          onHide={() => setShowLogForm(false)}
        />
      )}
    </div>
  );
};

export default MedicationsPage; 