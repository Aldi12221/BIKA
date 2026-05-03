import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-body flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 lg:p-8 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
