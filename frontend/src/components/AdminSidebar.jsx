import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import {
  FiGrid, FiFileText, FiHelpCircle, FiLogOut,
  FiChevronLeft, FiChevronRight, FiX, FiBriefcase, FiBookOpen, FiActivity, FiDollarSign, FiUsers
} from 'react-icons/fi';

export default function AdminSidebar() {
  const { admin, logoutAdmin } = useAuth();
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useAdminTheme();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid size={20} /> },
    { path: '/admin/users', label: 'Kelola User', icon: <FiUsers size={20} /> },
    { path: '/admin/lowongan', label: 'Kelola Lowongan', icon: <FiBriefcase size={20} /> },
    { path: '/admin/tutorial', label: 'Tips Wawancara', icon: <FiBookOpen size={20} /> },
    { path: '/admin/usaha', label: 'Tips Memulai Usaha', icon: <FiActivity size={20} /> },
    { path: '/admin/keuangan', label: 'Tips Keuangan', icon: <FiDollarSign size={20} /> },
    { path: '/admin/kuis', label: 'Kelola Kuis', icon: <FiHelpCircle size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;
  const collapsed = sidebarCollapsed;
  const initials = admin?.nama?.charAt(0)?.toUpperCase() || 'A';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="admin-sidebar__overlay"
          onClick={closeMobileSidebar}
        />
      )}

      <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''} ${mobileSidebarOpen ? 'admin-sidebar--mobile-open' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar__logo">
          {!collapsed && (
            <div className="admin-sidebar__brand">
              <div className="admin-sidebar__brand-icon">BK</div>
              <div>
                <span className="admin-sidebar__brand-name">BiKA</span>
                <p className="admin-sidebar__brand-sub">Admin Panel</p>
              </div>
            </div>
          )}
          {/* Desktop toggle */}
          <button
            onClick={toggleSidebar}
            className="admin-sidebar__toggle admin-sidebar__toggle--desktop"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
          {/* Mobile close */}
          <button
            onClick={closeMobileSidebar}
            className="admin-sidebar__toggle admin-sidebar__toggle--mobile"
            title="Tutup"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar__nav">
          {!collapsed && <p className="admin-sidebar__nav-label">MENU</p>}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar__nav-item ${isActive(item.path) ? 'admin-sidebar__nav-item--active' : ''}`}
              title={collapsed ? item.label : ''}
              onClick={closeMobileSidebar}
            >
              <span className="admin-sidebar__nav-icon">{item.icon}</span>
              {!collapsed && <span className="admin-sidebar__nav-text">{item.label}</span>}
              {!collapsed && isActive(item.path) && <span className="admin-sidebar__nav-dot" />}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__spacer" />

        {/* Support Card (only when expanded) */}
        {!collapsed && (
          <div className="admin-sidebar__support">
            <div className="admin-sidebar__support-avatar">👤</div>
            <p className="admin-sidebar__support-title">Butuh bantuan?</p>
            <p className="admin-sidebar__support-sub">Hubungi developer</p>
            <button className="admin-sidebar__support-btn">Hubungi</button>
          </div>
        )}

        {/* Admin Info */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__admin-info">
            <div className="admin-sidebar__admin-avatar">{initials}</div>
            {!collapsed && (
              <div className="admin-sidebar__admin-details">
                <p className="admin-sidebar__admin-name">{admin?.nama || 'Admin'}</p>
                <p className="admin-sidebar__admin-role">{admin?.role || 'admin'}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={logoutAdmin} className="admin-sidebar__logout" title="Keluar">
              <FiLogOut size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
