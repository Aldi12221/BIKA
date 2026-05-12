import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiBell, FiSearch, FiX, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const pageTitle = {
  '/admin/dashboard': 'Dashboard',
  '/admin/konten':    'Kelola Konten',
  '/admin/kuis':      'Kelola Kuis',
  '/admin/users':     'Kelola Pengguna',
  '/admin/lowongan':  'Kelola Lowongan',
  '/admin/tutorial':  'Tips Wawancara',
  '/admin/usaha':     'Tips Memulai Usaha',
  '/admin/keuangan':  'Tips Keuangan',
};

export default function AdminHeader() {
  const { isDark, toggle, isMobile, toggleSidebar } = useAdminTheme();
  const { admin } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');

  const title = pageTitle[location.pathname] || 'Admin';
  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <header className="admin-header">
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="admin-header__icon-btn"
          style={{ marginRight: 4 }}
          title="Menu"
        >
          <FiMenu size={18} />
        </button>
      )}

      <div className="admin-header__left">
        <h2 className="admin-header__title">{title}</h2>
        <p className="admin-header__date">{today}</p>
      </div>

      <div className="admin-header__right">
        {searchOpen ? (
          <div className="admin-header__search admin-header__search--open">
            <FiSearch className="admin-header__search-icon" size={15} />
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-header__search-input"
              autoFocus
            />
            <button className="admin-header__search-close" onClick={() => setSearchOpen(false)}>
              <FiX size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className="admin-header__search admin-header__search--desktop">
              <FiSearch className="admin-header__search-icon" size={15} />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="admin-header__search-input"
              />
            </div>
            <button
              className="admin-header__icon-btn admin-header__search-mobile-btn"
              onClick={() => setSearchOpen(true)}
              title="Cari"
            >
              <FiSearch size={18} />
            </button>
          </>
        )}

        {/* Dark Mode Toggle */}
        <button onClick={toggle} className="admin-header__icon-btn" title={isDark ? 'Light Mode' : 'Dark Mode'}>
          <span className="admin-header__toggle-track">
            <span className="admin-header__toggle-thumb">
              {isDark ? <FiMoon size={11} /> : <FiSun size={11} />}
            </span>
          </span>
        </button>


        {/* Notification */}
        <button className="admin-header__icon-btn admin-header__notif" title="Notifikasi">
          <FiBell size={18} />
          <span className="admin-header__notif-badge" />
        </button>

        {/* Admin Avatar */}
        <div className="admin-header__avatar" title={admin?.nama}>
          {admin?.nama?.charAt(0)?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
