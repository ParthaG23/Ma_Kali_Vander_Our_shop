import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
const AdminRoute = () => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
export default AdminRoute;
