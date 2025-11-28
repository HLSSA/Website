import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = () => {
  const token = Cookies.get('adminToken');

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;