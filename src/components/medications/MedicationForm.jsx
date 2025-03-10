import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getFormattedDateForInput } from '../../utils/dateUtils';
import { getPatients } from '../../features/users/slices/usersSlice';
import { createMedication, updateMedication } from '../../features/medications/slices/medicationsSlice';
import Loader from '../common/Loader';
import { 
  FaPills, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaClipboardList, 
  FaToggleOn, 
  FaToggleOff,
  FaSave,
  FaInfoCircle
} from 'react-icons/fa';

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Medication name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: Yup.string(),
  dosage: Yup.string()
    .required('Dosage is required'),
  frequency: Yup.string()
    .required('Frequency is required'),
  startDate: Yup.date()
    .required('Start date is required'),
  endDate: Yup.date()
    .min(
      Yup.ref('startDate'),
      'End date must be after start date'
    ),
  instructions: Yup.string(),
  patient: Yup.string()
    .required('Patient is required'),
  isActive: Yup.boolean(),
});

const MedicationForm = ({ medication = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading: medicationLoading } = useSelector((state) => state.medications);
  const { users, isLoading: usersLoading } = useSelector((state) => state.users);
  const [formError, setFormError] = useState(null);
  const [patients, setPatients] = useState([]);
  
  const isEditMode = !!medication;

  // Fetch patients (users with role 'patient')
  useEffect(() => {
    dispatch(getPatients())
      .unwrap()
      .then(() => {
        // Success is handled in the selector
      })
      .catch((error) => {
        setFormError('Failed to load patients: ' + error);
      });
  }, [dispatch]);

  // Filter users to get only patients
  useEffect(() => {
    if (users && users.length > 0) {
      setPatients(users);
    }
  }, [users]);

  // Initial form values
  const initialValues = {
    name: medication?.name || '',
    description: medication?.description || '',
    dosage: medication?.dosage || '',
    frequency: medication?.frequency || '',
    startDate: medication?.startDate ? getFormattedDateForInput(medication.startDate) : '',
    endDate: medication?.endDate ? getFormattedDateForInput(medication.endDate) : '',
    instructions: medication?.instructions || '',
    patient: medication?.patient?._id || '',
    isActive: medication?.isActive !== undefined ? medication.isActive : true,
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setFormError(null);
    
    try {
      if (isEditMode) {
        await dispatch(updateMedication({
          id: medication._id,
          medicationData: values,
        })).unwrap();
      } else {
        await dispatch(createMedication(values)).unwrap();
      }
      navigate('/medications');
    } catch (err) {
      setFormError(err || `Failed to ${isEditMode ? 'update' : 'create'} medication`);
    } finally {
      setSubmitting(false);
    }
  };

  if (usersLoading) {
    return <Loader size="lg" className="my-5" />;
  }

  return (
    <Card 
      className="border-0 rounded-lg overflow-hidden"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
    >
      <Card.Header 
        className="py-4 px-4 border-0"
        style={{ 
          background: 'linear-gradient(135deg, #4a6bff 0%, #2948ff 100%)'
        }}
      >
        <div className="d-flex align-items-center">
          <div 
            className="icon-container me-3 rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              width: '48px', 
              height: '48px' 
            }}
          >
            <FaPills size={20} color="white" />
          </div>
          <h3 className="mb-0 text-white">
            {isEditMode ? 'Edit Medication' : 'Prescribe New Medication'}
          </h3>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4 p-md-5">
        {formError && (
          <Alert 
            variant="danger" 
            className="mb-4 rounded-lg border-0"
            style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545' }}
          >
            {formError}
          </Alert>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Form.Label className="fw-medium text-secondary">Medication Name</Form.Label>
                <div className="input-group">
                  <div className="input-group-text bg-light border-end-0 text-secondary">
                    <FaPills />
                  </div>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && errors.name}
                    placeholder="Enter medication name"
                    className="py-2 border-start-0"
                    style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </div>

              <div className="mb-4">
                <Form.Label className="fw-medium text-secondary">Description</Form.Label>
                <div className="input-group">
                  <div className="input-group-text bg-light border-end-0 text-secondary">
                    <FaInfoCircle />
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && errors.description}
                    placeholder="Enter medication description"
                    className="py-2 border-start-0"
                    style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </div>

              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <Form.Label className="fw-medium text-secondary">Dosage</Form.Label>
                    <div className="input-group">
                      <div className="input-group-text bg-light border-end-0 text-secondary">
                        <FaPills />
                      </div>
                      <Form.Control
                        type="text"
                        name="dosage"
                        value={values.dosage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.dosage && errors.dosage}
                        placeholder="e.g., 500mg"
                        className="py-2 border-start-0"
                        style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.dosage}
                    </Form.Control.Feedback>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <Form.Label className="fw-medium text-secondary">Frequency</Form.Label>
                    <div className="input-group">
                      <div className="input-group-text bg-light border-end-0 text-secondary">
                        <FaClock />
                      </div>
                      <Form.Control
                        type="text"
                        name="frequency"
                        value={values.frequency}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.frequency && errors.frequency}
                        placeholder="e.g., Twice daily"
                        className="py-2 border-start-0"
                        style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.frequency}
                    </Form.Control.Feedback>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <Form.Label className="fw-medium text-secondary">Start Date</Form.Label>
                    <div className="input-group">
                      <div className="input-group-text bg-light border-end-0 text-secondary">
                        <FaCalendarAlt />
                      </div>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={values.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.startDate && errors.startDate}
                        className="py-2 border-start-0"
                        style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.startDate}
                    </Form.Control.Feedback>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <Form.Label className="fw-medium text-secondary">End Date</Form.Label>
                    <div className="input-group">
                      <div className="input-group-text bg-light border-end-0 text-secondary">
                        <FaCalendarAlt />
                      </div>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={values.endDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.endDate && errors.endDate}
                        className="py-2 border-start-0"
                        style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.endDate}
                    </Form.Control.Feedback>
                  </div>
                </Col>
              </Row>

              <div className="mb-4">
                <Form.Label className="fw-medium text-secondary">Instructions</Form.Label>
                <div className="input-group">
                  <div className="input-group-text bg-light border-end-0 text-secondary">
                    <FaClipboardList />
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="instructions"
                    value={values.instructions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.instructions && errors.instructions}
                    placeholder="Enter instructions for taking this medication"
                    className="py-2 border-start-0"
                    style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.instructions}
                </Form.Control.Feedback>
              </div>

              <div className="mb-4">
                <Form.Label className="fw-medium text-secondary">Patient</Form.Label>
                <div className="input-group">
                  <div className="input-group-text bg-light border-end-0 text-secondary">
                    <FaUser />
                  </div>
                  <Form.Select
                    name="patient"
                    value={values.patient}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.patient && errors.patient}
                    className="py-2 border-start-0"
                    style={{ borderRadius: '0 0.375rem 0.375rem 0' }}
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.patient}
                </Form.Control.Feedback>
              </div>

              <div className="mb-4">
                <div 
                  className={`status-toggle p-3 rounded-lg d-flex align-items-center justify-content-between ${values.isActive ? 'active' : 'inactive'}`}
                  style={{
                    border: `1px solid ${values.isActive ? '#d1f2e0' : '#e2e8f0'}`,
                    background: values.isActive ? 'rgba(56, 178, 123, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setFieldValue('isActive', !values.isActive)}
                >
                  <div className="d-flex align-items-center">
                    <div 
                      className="icon-container me-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        background: values.isActive ? 'rgba(56, 178, 123, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        width: '36px', 
                        height: '36px',
                        color: values.isActive ? '#38b27b' : '#718096'
                      }}
                    >
                      {values.isActive ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                    </div>
                    <div>
                      <div className="fw-medium" style={{ color: values.isActive ? '#38b27b' : '#718096' }}>
                        Status: {values.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <div className="small text-muted">
                        {values.isActive 
                          ? 'Medication is currently active and can be logged' 
                          : 'Medication is inactive and cannot be logged'}
                      </div>
                    </div>
                  </div>
                  <Form.Check
                    type="switch"
                    name="isActive"
                    checked={values.isActive}
                    onChange={handleChange}
                    className="d-none"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/medications')}
                  className="me-2 rounded-pill px-4"
                  disabled={isSubmitting || medicationLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-pill px-4 d-flex align-items-center"
                  disabled={isSubmitting || medicationLoading}
                  style={{ 
                    background: 'linear-gradient(135deg, #4a6bff 0%, #2948ff 100%)',
                    border: 'none'
                  }}
                >
                  {medicationLoading ? (
                    <Loader size="sm" className="mx-2" />
                  ) : (
                    <>
                      <FaSave className="me-2" /> {isEditMode ? 'Update' : 'Save'} Medication
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default MedicationForm; 