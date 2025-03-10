import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import { 
  getMedicationById, 
  getMedicationLogs,
  deleteMedication 
} from '../features/medications/slices/medicationsSlice';
import { formatDate, formatDateTime, isPastDate, getDaysRemaining } from '../utils/dateUtils';
import { canPrescribeMedications } from '../utils/authUtils';
import MedicationLogForm from '../components/medications/MedicationLogForm';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { FaPills, FaClock, FaCalendarAlt, FaUser, FaUserMd, FaInfoCircle, FaPen, FaTrashAlt, FaArrowLeft, FaClipboardList, FaCheckCircle } from 'react-icons/fa';

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
  const daysRemaining = medication?.endDate ? getDaysRemaining(medication.endDate) : null;
  
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

  // Get a background color based on medication status
  const getCardBorderColor = () => {
    if (!medication?.isActive) return '#6c757d';
    if (isExpired) return '#dc3545';
    return '#28a745';
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
        <Link to="/medications" className="btn btn-primary mt-3 rounded-pill">
          <FaArrowLeft className="me-2" /> Back to Medications
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
            style={{ 
              width: '48px', 
              height: '48px', 
              background: `${getCardBorderColor()}20` 
            }}
          >
            <FaPills size={24} color={getCardBorderColor()} />
          </div>
          <h1 className="mb-0">{medication.name}</h1>
          <Badge 
            bg={getBadgeVariant()} 
            pill
            className="ms-3 px-3 py-2"
            style={{ fontSize: '0.9rem' }}
          >
            {getStatusText()}
          </Badge>
        </div>
        <div className="d-flex gap-2">
          <Link to="/medications" className="btn btn-outline-secondary rounded-pill d-flex align-items-center">
            <FaArrowLeft className="me-2" /> Back
          </Link>
          {canPrescribeMedications(user) && (
            <>
              <Link to={`/medications/${id}/edit`} className="btn btn-outline-primary rounded-pill d-flex align-items-center">
                <FaPen className="me-2" /> Edit
              </Link>
              <Button variant="outline-danger" className="rounded-pill d-flex align-items-center" onClick={handleDelete}>
                <FaTrashAlt className="me-2" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Row className="mb-4">
        <Col lg={8}>
          <Card 
            className="border-0 rounded-lg overflow-hidden mb-4" 
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
              borderLeft: `4px solid ${getCardBorderColor()}`
            }}
          >
            <Card.Header 
              className="d-flex justify-content-between align-items-center py-3"
              style={{ 
                background: 'white', 
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <FaInfoCircle className="me-2 text-primary" /> Medication Details
              </h5>
              {medication.endDate && medication.isActive && !isExpired && (
                <Badge bg="info" pill className="px-3 py-2">
                  {daysRemaining} days remaining
                </Badge>
              )}
            </Card.Header>
            <Card.Body className="py-4">
              <Row>
                <Col md={6}>
                  <div className="detail-row d-flex align-items-center mb-3">
                    <div className="icon-container me-2" style={{ width: '24px' }}>
                      <FaPills className="text-primary" />
                    </div>
                    <div>
                      <span className="text-muted me-1">Dosage:</span>
                      <span className="fw-medium">{medication.dosage}</span>
                    </div>
                  </div>
                  
                  <div className="detail-row d-flex align-items-center mb-3">
                    <div className="icon-container me-2" style={{ width: '24px' }}>
                      <FaClock className="text-primary" />
                    </div>
                    <div>
                      <span className="text-muted me-1">Frequency:</span>
                      <span className="fw-medium">{medication.frequency}</span>
                    </div>
                  </div>
                  
                  <div className="detail-row d-flex align-items-center mb-3">
                    <div className="icon-container me-2" style={{ width: '24px' }}>
                      <FaCalendarAlt className="text-primary" />
                    </div>
                    <div>
                      <span className="text-muted me-1">Start Date:</span>
                      <span className="fw-medium">{formatDate(medication.startDate)}</span>
                    </div>
                  </div>
                  
                  {medication.endDate && (
                    <div className="detail-row d-flex align-items-center mb-3">
                      <div className="icon-container me-2" style={{ width: '24px' }}>
                        <FaCalendarAlt className="text-primary" />
                      </div>
                      <div>
                        <span className="text-muted me-1">End Date:</span>
                        <span className="fw-medium">{formatDate(medication.endDate)}</span>
                      </div>
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  {medication.patient && (
                    <div className="detail-row d-flex align-items-center mb-3">
                      <div className="icon-container me-2" style={{ width: '24px' }}>
                        <FaUser className="text-primary" />
                      </div>
                      <div>
                        <span className="text-muted me-1">Patient:</span>
                        <span className="fw-medium">{medication.patient?.name}</span>
                      </div>
                    </div>
                  )}
                  
                  {medication.prescribedBy && (
                    <div className="detail-row d-flex align-items-center mb-3">
                      <div className="icon-container me-2" style={{ width: '24px' }}>
                        <FaUserMd className="text-primary" />
                      </div>
                      <div>
                        <span className="text-muted me-1">Prescribed By:</span>
                        <span className="fw-medium">{medication.prescribedBy?.name}</span>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
              
              {medication.description && (
                <div className="mt-4 p-3 rounded" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <h6 className="mb-2">Description</h6>
                  <p className="mb-0">{medication.description}</p>
                </div>
              )}
              
              {medication.instructions && (
                <div className="mt-3 p-3 rounded" style={{ background: 'rgba(0,123,255,0.05)', border: '1px dashed rgba(0,123,255,0.3)' }}>
                  <h6 className="mb-2 text-primary">Instructions</h6>
                  <p className="mb-0">{medication.instructions}</p>
                </div>
              )}
            </Card.Body>
            <Card.Footer className="bg-white py-3">
              {medication.isActive && !isExpired && (
                <Button 
                  variant="primary" 
                  onClick={() => setShowLogForm(true)}
                  className="rounded-pill d-flex align-items-center justify-content-center"
                  style={{ maxWidth: '250px' }}
                >
                  <FaCheckCircle className="me-2" /> Log Medication Intake
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card 
            className="border-0 rounded-lg overflow-hidden" 
            style={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Card.Header 
              className="py-3"
              style={{ 
                background: 'white', 
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <FaClipboardList className="me-2 text-primary" /> Medication Logs
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader size="md" />
                </div>
              ) : logs.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="mb-0 text-muted">No logs recorded yet.</p>
                </div>
              ) : (
                <div className="medication-logs">
                  <Table responsive hover className="mb-0">
                    <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
                      <tr>
                        <th className="px-3">Date & Time</th>
                        <th className="px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-3">{formatDateTime(log.takenAt)}</td>
                          <td className="px-3">
                            <Badge
                              bg={
                                log.status === 'taken'
                                  ? 'success'
                                  : log.status === 'missed'
                                  ? 'danger'
                                  : 'warning'
                              }
                              pill
                              className="px-2 py-1"
                            >
                              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
            {logs.length > 0 && (
              <Card.Footer className="bg-white py-3 text-center">
                <Link 
                  to={`/medications/${id}/logs`} 
                  className="btn btn-outline-primary btn-sm rounded-pill"
                >
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