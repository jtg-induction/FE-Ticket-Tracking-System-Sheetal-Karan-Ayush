import { Navigate, Outlet } from 'react-router-dom';

import { CircularProgress } from '@mui/material';

import { useAuthStore } from '@features/auth';
import { useUserBasicDetails } from '@features/user/useUserBasicDetails';

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuthStore();
    const { isLoading } = useUserBasicDetails();

    if (isLoading) {
        return (
            <CircularProgress />
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};
