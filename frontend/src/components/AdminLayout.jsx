import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
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

  const mainMarginLeft = isMobile ? 0 : (sidebarCollapsed ? '68px' : '240px');

  return (
    <div className="admin-layout">
      {/* Sidebar — selalu dirender; mobile slide-in via CSS */}
      <AdminSidebar />

      {/* Main content area */}
      <div
        className="admin-main"
        style={{ marginLeft: mainMarginLeft, transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <AdminHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
