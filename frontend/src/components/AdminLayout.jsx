import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminBottomNav from './AdminBottomNav';
import { useAuth } from '../context/AuthContext';
import { AdminThemeProvider, useAdminTheme } from '../context/AdminThemeContext';
import '../admin.css';

export default function AdminLayout() {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminThemeProvider>
      <AdminLayoutInner />
    </AdminThemeProvider>
  );
}

function AdminLayoutInner() {
  const { sidebarCollapsed, isMobile } = useAdminTheme();

  const mainMarginLeft = isMobile ? 0 : (sidebarCollapsed ? '72px' : '260px');

  return (
    <div className="admin-layout">
      {/* Sidebar — hanya desktop */}
      {!isMobile && <AdminSidebar />}

      {/* Main content area */}
      <div
        className="admin-main"
        style={{ marginLeft: mainMarginLeft }}
      >
        <AdminHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav — hanya mobile */}
      {isMobile && <AdminBottomNav />}
    </div>
  );
}
