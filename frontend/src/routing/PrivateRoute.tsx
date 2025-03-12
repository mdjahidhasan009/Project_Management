import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {useAppSelector} from "../redux/hooks";

// Upgraded PrivateRoute for React Router v6
const PrivateRoute = ({ children, ...rest }: { children: React.ReactNode }) => {
    const authSlice = useAppSelector(state => state.auth);
    const auth = authSlice || {};
    const location = useLocation();

    // Redirect to home if not authenticated
    if (!auth.isAuthenticated && !auth.loading) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    // Pass all remaining props to children if it's a valid React element
    if (React.isValidElement(children)) {
        return React.cloneElement(children, { ...rest });
    }

    // Otherwise just render children
    return children;
};

export default PrivateRoute;
