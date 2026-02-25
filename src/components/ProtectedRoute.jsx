import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const isAuth = isAuthenticated();
    const user = getCurrentUser();

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If role not allowed, redirect to their respective dashboard
        return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
    }

    return children;
};

export default ProtectedRoute;
