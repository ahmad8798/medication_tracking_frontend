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
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <h2 className="text-center mb-4">
          {isEditMode ? 'Edit Medication' : 'Prescribe New Medication'}
        </h2>
        
        {formError && (
          <Alert variant="danger" className="mb-4">
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
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Medication Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && errors.name}
                  placeholder="Enter medication name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.description && errors.description}
                  placeholder="Enter medication description"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dosage</Form.Label>
                    <Form.Control
                      type="text"
                      name="dosage"
                      value={values.dosage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.dosage && errors.dosage}
                      placeholder="e.g., 500mg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dosage}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frequency</Form.Label>
                    <Form.Control
                      type="text"
                      name="frequency"
                      value={values.frequency}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.frequency && errors.frequency}
                      placeholder="e.g., Twice daily"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.frequency}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={values.startDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.startDate && errors.startDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={values.endDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.endDate && errors.endDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="instructions"
                  value={values.instructions}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.instructions && errors.instructions}
                  placeholder="Enter instructions for taking this medication"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.instructions}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Patient</Form.Label>
                <Form.Select
                  name="patient"
                  value={values.patient}
                  onChange={(e) => {
                    // Ensure we're setting the patient ID, not the display text
                    handleChange({
                      target: {
                        name: 'patient',
                        value: e.target.value
                      }
                    });
                  }}
                  onBlur={handleBlur}
                  isInvalid={touched.patient && errors.patient}
                  disabled={isEditMode} // Can't change patient in edit mode
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name} ({patient.email})
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.patient}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  label="Active"
                  checked={values.isActive}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isSubmitting || medicationLoading}
                >
                  {medicationLoading ? (
                    <Loader size="sm" className="mx-auto" />
                  ) : isEditMode ? (
                    'Update Medication'
                  ) : (
                    'Create Medication'
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => navigate('/medications')}
                >
                  Cancel
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