// Check if a user has a specific role
export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role;
};

// Check if a user has any of the specified roles
export const hasAnyRole = (user, roles) => {
  if (!user) return false;
  return roles.includes(user.role);
};

// Check if a user is an admin
export const isAdmin = (user) => {
  return hasRole(user, 'admin');
};

// Check if a user is a doctor
export const isDoctor = (user) => {
  return hasRole(user, 'doctor');
};

// Check if a user is a nurse
export const isNurse = (user) => {
  return hasRole(user, 'nurse');
};

// Check if a user is a patient
export const isPatient = (user) => {
  return hasRole(user, 'patient');
};

// Check if a user is a healthcare provider (doctor or nurse)
export const isHealthcareProvider = (user) => {
  return hasAnyRole(user, ['doctor', 'nurse']);
};

// Check if a user can prescribe medications (admin or doctor)
export const canPrescribeMedications = (user) => {
  return hasAnyRole(user, ['admin', 'doctor']);
};

// Check if a user can view all medications (admin only)
export const canViewAllMedications = (user) => {
  return isAdmin(user);
};

// Check if a user can manage users (admin only)
export const canManageUsers = (user) => {
  return isAdmin(user);
}; 