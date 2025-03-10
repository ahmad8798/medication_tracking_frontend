import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { logMedicationIntake } from '../../features/medications/slices/medicationsSlice';
import Loader from '../common/Loader';

// Validation schema
const validationSchema = Yup.object().shape({
  status: Yup.string()
    .required('Status is required')
    .oneOf(['taken', 'missed', 'postponed'], 'Invalid status'),
  notes: Yup.string(),
  takenAt: Yup.date()
    .required('Date and time is required'),
});

const MedicationLogForm = ({ medicationId, show, onHide }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.medications);
  const [formError, setFormError] = useState(null);

  // Get current date and time in ISO format for the input
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  // Initial form values
  const initialValues = {
    status: 'taken',
    notes: '',
    takenAt: getCurrentDateTime(),
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setFormError(null);
    
    console.log('Submitting log with:', {
      medicationId,
      values
    });
    
    try {
      await dispatch(logMedicationIntake({
        _id: medicationId,
        logData: values,
      })).unwrap();
      
      resetForm();
      onHide();
    } catch (err) {
      console.error('Error logging medication:', err);
      setFormError(err || 'Failed to log medication intake');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Log Medication Intake</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formError && (
          <div className="alert alert-danger mb-3">{formError}</div>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.status && errors.status}
                >
                  <option value="taken">Taken</option>
                  <option value="missed">Missed</option>
                  <option value="postponed">Postponed</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.status}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="takenAt"
                  value={values.takenAt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.takenAt && errors.takenAt}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.takenAt}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.notes && errors.notes}
                  placeholder="Add any notes about this medication intake"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.notes}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={onHide}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? <Loader size="sm" /> : 'Save Log'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default MedicationLogForm; 