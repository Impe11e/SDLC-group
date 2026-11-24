import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function AdminRoute({ children }: { children: ReactNode }) {
    if (!authService.isLoggedIn()) return <Navigate to="/login" replace />;
    if (!authService.isAdmin()) return <Navigate to="/" replace />;
    return <>{children}</>;
}
