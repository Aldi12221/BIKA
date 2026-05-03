import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiFileText, FiHelpCircle, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { admin, logoutAdmin } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid size={20} /> },
    { path: '/admin/konten', label: 'Kelola Konten', icon: <FiFileText size={20} /> },
    { path: '/admin/kuis', label: 'Kelola Kuis', icon: <FiHelpCircle size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 bg-bg-surface border-r border-border transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center font-bold text-white text-sm">
              BK
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">BiKA</span>
              <p className="text-[10px] text-text-muted -mt-1">Admin Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-all bg-transparent border-none cursor-pointer"
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium no-underline transition-all duration-300 ${
              isActive(item.path)
                ? 'gradient-primary text-white shadow-lg shadow-primary/25'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
            }`}
            title={collapsed ? item.label : ''}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Admin Info */}
      <div className="p-4 border-t border-border">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {admin?.nama?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{admin?.nama || 'Admin'}</p>
              <p className="text-xs text-text-muted">{admin?.role || 'admin'}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logoutAdmin}
              className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"
              title="Keluar"
            >
              <FiLogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
