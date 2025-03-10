import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { getMedicationById, resetMedicationState } from '../features/medications/slices/medicationsSlice';
import MedicationForm from '../components/medications/MedicationForm';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

const MedicationFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { medication, isLoading, error } = useSelector((state) => state.medications);
  const { user } = useSelector((state) => state.auth);
  
  const isEditMode = !!id;

  // Fetch medication details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(getMedicationById(id));
    }
    
    // Reset medication state when component unmounts
    return () => {
      dispatch(resetMedicationState());
    };
  }, [dispatch, id, isEditMode]);

  // Check if user has permission to edit this medication
  const canEditMedication = () => {
    if (!isEditMode) return true; // New medication
    if (!medication) return false; // No medication loaded yet
    
    // Admin can edit any medication
    if (user.role === 'admin') return true;
    
    // Doctor can only edit medications they prescribed
    if (user.role === 'doctor') {
      // Get the prescriber ID, handling both _id and id fields
      const prescriberId = medication.prescribedBy?._id || medication.prescribedBy?.id;
      const userId = user._id || user.id;
      
      // Convert both to strings for comparison to avoid object reference issues
      const prescriberIdStr = String(prescriberId);
      const userIdStr = String(userId);
      
      return prescriberIdStr === userIdStr;
    }
    
    return false;
  };

  if (isEditMode && isLoading && !medication) {
    return <Loader size="lg" className="my-5" />;
  }

  if (isEditMode && error) {
    return (
      <Alert
        type="error"
        message={error}
        onClose={() => dispatch({ type: 'medications/clearError' })}
      />
    );
  }

  if (isEditMode && !medication) {
    return (
      <Alert
        type="error"
        message="Medication not found or you don't have permission to edit it."
        onClose={() => navigate('/medications')}
      />
    );
  }

  if (isEditMode && !canEditMedication()) {
    return (
      <Alert
        type="error"
        message="You don't have permission to edit this medication."
        onClose={() => navigate('/medications')}
      />
    );
  }

  return (
    <Row className="justify-content-center">
      <Col md={10} lg={8}>
        <MedicationForm medication={isEditMode ? medication : null} />
      </Col>
    </Row>
  );
};

export default MedicationFormPage; 