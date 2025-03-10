import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate, getDaysRemaining, isPastDate } from '../../utils/dateUtils';
import { canPrescribeMedications } from '../../utils/authUtils';
import { FaPills, FaClock, FaCalendarAlt, FaUser, FaUserMd, FaInfoCircle, FaPen, FaTrashAlt } from 'react-icons/fa';

const MedicationCard = ({ medication, currentUser, onLogIntake, onDelete }) => {
  const {
    _id,
    name,
    dosage,
    frequency,
    startDate,
    endDate,
    isActive,
    patient,
    prescribedBy,
  } = medication;

  // Determine if medication is active, expired, or upcoming
  const isExpired = endDate && isPastDate(endDate);
  const daysRemaining = endDate ? getDaysRemaining(endDate) : null;
  
  // Determine status badge color and text
  const getBadgeVariant = () => {
    if (!isActive) return 'secondary';
    if (isExpired) return 'danger';
    return 'success';
  };
  
  const getStatusText = () => {
    if (!isActive) return 'Inactive';
    if (isExpired) return 'Expired';
    return 'Active';
  };

  // Get a background color based on medication status
  const getCardBorderColor = () => {
    if (!isActive) return '#6c757d';
    if (isExpired) return '#dc3545';
    return '#28a745';
  };

  return (
    <Card 
      className="h-100 border-0 rounded-lg overflow-hidden" 
      style={{ 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
        transition: 'all 0.3s ease',
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
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle me-2 d-flex align-items-center justify-content-center"
            style={{ 
              width: '32px', 
              height: '32px', 
              background: `${getCardBorderColor()}20` 
            }}
          >
            <FaPills color={getCardBorderColor()} />
          </div>
          <h5 className="mb-0 fw-bold">{name}</h5>
        </div>
        <Badge 
          bg={getBadgeVariant()} 
          pill
          className="px-3 py-2"
        >
          {getStatusText()}
        </Badge>
      </Card.Header>
      
      <Card.Body className="py-3">
        <div className="medication-details">
          <div className="detail-row d-flex align-items-center mb-2">
            <div className="icon-container me-2" style={{ width: '20px' }}>
              <FaPills className="text-muted" />
            </div>
            <div>
              <span className="text-muted me-1">Dosage:</span>
              <span className="fw-medium">{dosage}</span>
            </div>
          </div>
          
          <div className="detail-row d-flex align-items-center mb-2">
            <div className="icon-container me-2" style={{ width: '20px' }}>
              <FaClock className="text-muted" />
            </div>
            <div>
              <span className="text-muted me-1">Frequency:</span>
              <span className="fw-medium">{frequency}</span>
            </div>
          </div>
          
          <div className="detail-row d-flex align-items-center mb-2">
            <div className="icon-container me-2" style={{ width: '20px' }}>
              <FaCalendarAlt className="text-muted" />
            </div>
            <div>
              <span className="text-muted me-1">Start:</span>
              <span className="fw-medium">{formatDate(startDate)}</span>
            </div>
          </div>
          
          {endDate && (
            <div className="detail-row d-flex align-items-center mb-2">
              <div className="icon-container me-2" style={{ width: '20px' }}>
                <FaCalendarAlt className="text-muted" />
              </div>
              <div>
                <span className="text-muted me-1">End:</span>
                <span className="fw-medium">{formatDate(endDate)}</span>
                {endDate && isActive && !isExpired && (
                  <Badge bg="info" pill className="ms-2 px-2 py-1" style={{ fontSize: '0.7rem' }}>
                    {daysRemaining} days left
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {patient && (
            <div className="detail-row d-flex align-items-center mb-2">
              <div className="icon-container me-2" style={{ width: '20px' }}>
                <FaUser className="text-muted" />
              </div>
              <div>
                <span className="text-muted me-1">Patient:</span>
                <span className="fw-medium">{patient.name}</span>
              </div>
            </div>
          )}
          
          {prescribedBy && (
            <div className="detail-row d-flex align-items-center mb-2">
              <div className="icon-container me-2" style={{ width: '20px' }}>
                <FaUserMd className="text-muted" />
              </div>
              <div>
                <span className="text-muted me-1">Prescribed By:</span>
                <span className="fw-medium">{prescribedBy.name}</span>
              </div>
            </div>
          )}
        </div>
      </Card.Body>
      
      <Card.Footer 
        className="bg-white border-top-0 pt-0 pb-3"
      >
        <div className="d-flex flex-wrap gap-2">
          <Link 
            to={`/medications/${_id}`} 
            className="btn btn-outline-primary rounded-pill d-flex align-items-center justify-content-center"
            style={{ flex: '1', minWidth: '120px' }}
          >
            <FaInfoCircle className="me-1" /> Details
          </Link>
          
          {isActive && !isExpired && onLogIntake && (
            <Button 
              variant="primary" 
              className="rounded-pill d-flex align-items-center justify-content-center"
              style={{ flex: '1', minWidth: '120px' }}
              onClick={() => onLogIntake(_id)}
            >
              <FaPills className="me-1" /> Log Intake
            </Button>
          )}
          
          {canPrescribeMedications(currentUser) && (
            <>
              <Link 
                to={`/medications/${_id}/edit`} 
                className="btn btn-outline-secondary rounded-pill d-flex align-items-center justify-content-center"
                style={{ flex: '1', minWidth: '120px' }}
              >
                <FaPen className="me-1" /> Edit
              </Link>
              
              {onDelete && (
                <Button 
                  variant="outline-danger" 
                  className="rounded-pill d-flex align-items-center justify-content-center"
                  style={{ flex: '1', minWidth: '120px' }}
                  onClick={() => onDelete(_id)}
                >
                  <FaTrashAlt className="me-1" /> Delete
                </Button>
              )}
            </>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default MedicationCard; 