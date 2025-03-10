# Medication Tracking System - Frontend

This is the frontend application for the Medication Tracking System, a comprehensive solution for managing and tracking medications. The application is built with React, Redux Toolkit, and Bootstrap/Tailwind CSS.

## Features

- User authentication (login, register, profile management)
- Role-based access control (admin, doctor, nurse, patient)
- Medication management (create, view, update, delete)
- Medication intake logging
- User management (for administrators)
- Responsive design for all devices

## Tech Stack

- **React**: UI library
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Axios**: API requests
- **Bootstrap & Tailwind CSS**: Styling
- **Formik & Yup**: Form handling and validation
- **React Toastify**: Notifications
- **JWT Decode**: Token handling

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components
│   └── medications/    # Medication-related components
├── features/           # Redux Toolkit slices
│   ├── auth/           # Authentication state
│   ├── medications/    # Medications state
│   └── users/          # Users state
├── pages/              # Page components
├── services/           # API services
├── utils/              # Utility functions
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Configuration

The application is configured to connect to the backend API at `http://localhost:7000/api`. If your backend is running on a different URL, update the `baseURL` in `src/services/api.js`.

## User Roles and Permissions

The application supports four user roles with different permissions:

- **Admin**: Full access to all features, including user management
- **Doctor**: Can create and manage prescriptions, view patient data
- **Nurse**: Can view medications and log medication intake
- **Patient**: Can view own medications and log own medication intake

## Build for Production

To build the application for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
