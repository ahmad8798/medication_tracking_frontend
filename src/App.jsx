import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { validateToken } from './features/auth/slices/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import store from './features/store';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MedicationsPage from './pages/MedicationsPage';
import MedicationDetailPage from './pages/MedicationDetailPage';
import MedicationFormPage from './pages/MedicationFormPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Route protection
import PrivateRoute from './components/common/PrivateRoute';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(validateToken());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="app-wrapper w-100 min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 w-100">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected routes for all authenticated users */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/medications" element={<MedicationsPage />} />
              <Route path="/medications/:id" element={<MedicationDetailPage />} />
            </Route>
            
            {/* Protected routes for doctors and admins */}
            <Route element={<PrivateRoute allowedRoles={['doctor', 'admin']} />}>
              <Route path="/medications/new" element={<MedicationFormPage />} />
              <Route path="/medications/:id/edit" element={<MedicationFormPage />} />
            </Route>
            
            {/* Protected routes for admins only */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
