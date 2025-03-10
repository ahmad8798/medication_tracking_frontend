import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import { 
  getMedicationById, 
  getMedicationLogs,
  deleteMedication 
} from '../features/medications/slices/medicationsSlice';
import { formatDate, formatDateTime, isPastDate } from '../utils/dateUtils';
import { canPrescribeMedications } from '../utils/authUtils';
import MedicationLogForm from '../components/medications/MedicationLogForm';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

const MedicationDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { medication, logs, isLoading, error } = useSelector((state) => state.medications);
  
  const [showLogForm, setShowLogForm] = useState(false);

  // Fetch medication details and logs when component mounts
  useEffect(() => {
    dispatch(getMedicationById(id));
    dispatch(getMedicationLogs({ id, filters: {} }));
  }, [dispatch, id]);

  // Handle medication deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      dispatch(deleteMedication(id))
        .unwrap()
        .then(() => {
          navigate('/medications');
        })
        .catch((err) => {
          console.error('Failed to delete medication:', err);
        });
    }
  };

  // Determine if medication is active, expired, or upcoming
  const isExpired = medication?.endDate && isPastDate(medication.endDate);
  
  // Determine status badge color and text
  const getBadgeVariant = () => {
    if (!medication?.isActive) return 'secondary';
    if (isExpired) return 'danger';
    return 'success';
  };
  
  const getStatusText = () => {
    if (!medication?.isActive) return 'Inactive';
    if (isExpired) return 'Expired';
    return 'Active';
  };

  if (isLoading && !medication) {
    return <Loader size="lg" className="my-5" />;
  }

  if (error) {
    return (
      <Alert
        type="error"
        message={error}
        onClose={() => dispatch({ type: 'medications/clearError' })}
      />
    );
  }

  if (!medication) {
    return (
      <div className="text-center my-5">
        <h3>Medication not found</h3>
        <p>The medication you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/medications" className="btn btn-primary mt-3">
          Back to Medications
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{medication.name}</h1>
        <div>
          <Link to="/medications" className="btn btn-outline-secondary me-2">
            Back to List
          </Link>
          {canPrescribeMedications(user) && (
            <>
              <Link to={`/medications/${id}/edit`} className="btn btn-outline-primary me-2">
                Edit
              </Link>
              <Button variant="outline-danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Medication Details</h5>
              <Badge bg={getBadgeVariant()}>{getStatusText()}</Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Dosage:</strong> {medication.dosage}</p>
                  <p><strong>Frequency:</strong> {medication.frequency}</p>
                  <p><strong>Start Date:</strong> {formatDate(medication.startDate)}</p>
                  {medication.endDate && (
                    <p><strong>End Date:</strong> {formatDate(medication.endDate)}</p>
                  )}
                </Col>
                <Col md={6}>
                  <p><strong>Patient:</strong> {medication.patient?.name}</p>
                  <p><strong>Prescribed By:</strong> {medication.prescribedBy?.name}</p>
                  <p><strong>Status:</strong> {medication.isActive ? 'Active' : 'Inactive'}</p>
                </Col>
              </Row>
              {medication.description && (
                <>
                  <h6 className="mt-3">Description</h6>
                  <p>{medication.description}</p>
                </>
              )}
              {medication.instructions && (
                <>
                  <h6 className="mt-3">Instructions</h6>
                  <p>{medication.instructions}</p>
                </>
              )}
            </Card.Body>
            <Card.Footer>
              {medication.isActive && !isExpired && (
                <Button 
                  variant="success" 
                  onClick={() => setShowLogForm(true)}
                >
                  Log Medication Intake
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Medication Logs</h5>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <Loader size="md" />
              ) : logs.length === 0 ? (
                <p className="text-center">No logs recorded yet.</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>{formatDateTime(log.takenAt)}</td>
                        <td>
                          <Badge
                            bg={
                              log.status === 'taken'
                                ? 'success'
                                : log.status === 'missed'
                                ? 'danger'
                                : 'warning'
                            }
                          >
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
            {logs.length > 0 && (
              <Card.Footer>
                <Link to={`/medications/${id}/logs`} className="btn btn-outline-primary btn-sm">
                  View All Logs
                </Link>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Medication Log Form Modal */}
      {showLogForm && (
        <MedicationLogForm
          medicationId={id}
          show={showLogForm}
          onHide={() => setShowLogForm(false)}
        />
      )}
    </div>
  );
};

export default MedicationDetailPage; 