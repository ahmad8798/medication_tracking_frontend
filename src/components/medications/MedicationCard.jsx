import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate, getDaysRemaining, isPastDate } from '../../utils/dateUtils';
import { canPrescribeMedications } from '../../utils/authUtils';

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

  return (
    <Card className="h-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Badge bg={getBadgeVariant()}>{getStatusText()}</Badge>
        {endDate && isActive && !isExpired && (
          <Badge bg="info">{daysRemaining} days left</Badge>
        )}
      </Card.Header>
      <Card.Body>
        <Card.Title className="mb-3">{name}</Card.Title>
        <Card.Text as="div">
          <div className="mb-2">
            <strong>Dosage:</strong> {dosage}
          </div>
          <div className="mb-2">
            <strong>Frequency:</strong> {frequency}
          </div>
          <div className="mb-2">
            <strong>Start Date:</strong> {formatDate(startDate)}
          </div>
          {endDate && (
            <div className="mb-2">
              <strong>End Date:</strong> {formatDate(endDate)}
            </div>
          )}
          {patient && (
            <div className="mb-2">
              <strong>Patient:</strong> {patient.name}
            </div>
          )}
          {prescribedBy && (
            <div className="mb-2">
              <strong>Prescribed By:</strong> {prescribedBy.name}
            </div>
          )}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white border-top-0">
        <div className="d-flex flex-column gap-2">
          <Link 
            to={`/medications/${_id}`} 
            className="btn btn-outline-primary w-100"
          >
            View Details
          </Link>
          
          {isActive && !isExpired && onLogIntake && (
            <Button 
              variant="primary" 
              className="w-100"
              onClick={() => onLogIntake(_id)}
            >
              Log Intake
            </Button>
          )}
          
          {canPrescribeMedications(currentUser) && (
            <>
              <Link 
                to={`/medications/${_id}/edit`} 
                className="btn btn-outline-secondary w-100"
              >
                Edit
              </Link>
              
              {onDelete && (
                <Button 
                  variant="outline-danger" 
                  className="w-100"
                  onClick={() => onDelete(_id)}
                >
                  Delete
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