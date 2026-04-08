import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import StudentDashboard from './Pages/StudentDashboard';
import StudentFeedback from './Pages/StudentFeedback';
import CoursesPage from './Pages/CoursesPage';
import AdminDashboard from './Pages/AdminDashboard';
import AdminCourses from './Pages/AdminCourses';
import AdminReports from './Pages/AdminReports';
import AdminStudents from './Pages/AdminStudents';
import SubmitFeedback from './Pages/SubmitFeedback';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import { getCurrentUser, isAuthenticated } from './utils/auth';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showFooter = location.pathname === '/';
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();
  const dashboardPath = currentUser?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  useEffect(() => {
    if (!authenticated) return;

    const handlePopState = () => {
      navigate(dashboardPath, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [authenticated, dashboardPath, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={authenticated ? <Navigate to={dashboardPath} replace /> : <Home />} />
          <Route path="/login" element={authenticated ? <Navigate to={dashboardPath} replace /> : <Login />} />
          <Route path="/signup" element={authenticated ? <Navigate to={dashboardPath} replace /> : <Signup />} />

          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/feedback"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/feedback/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SubmitFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-form"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Navigate to="/admin/courses" replace />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to={authenticated ? dashboardPath : '/'} replace />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppLayout />
    </Router>
  );
}

export default App;