import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userStr = localStorage.getItem('nova_user');

  if (!userStr) {
    // Hic giris yapilmamissa Login sayfasina at
    return <Navigate to="/auth/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Giris yapilmis ama ADMIN degilse
    if (user.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/auth/login" replace />;
  }

  // Eger her sey uyuyorsa (Giris yapmis + ADMIN ise) Admin panelini goster
  return <Outlet />;
};

export default AdminRoute;
