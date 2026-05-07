import { Link, useLocation } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiFileText, FiHelpCircle, FiLogOut, FiUsers, FiHome, FiPlus } from 'react-icons/fi';

export default function AdminBottomNav() {
  const location = useLocation();
  const { isDark } = useAdminTheme();
  const { logoutAdmin } = useAuth();

  const isActive = (path) => location.pathname === path;

  // 5 items for symmetry: [Home, Users, CENTER(Konten), Kuis, Logout]
  const navLinks = [
    { path: '/admin/dashboard', label: 'Home', icon: FiHome },
    { path: '/admin/users', label: 'Users', icon: FiUsers },
    { path: '/admin/konten', label: 'Konten', icon: FiPlus, isCenter: true },
    { path: '/admin/kuis', label: 'Kuis', icon: FiHelpCircle },
    { path: '#logout', label: 'Keluar', icon: FiLogOut, isLogout: true },
  ];

  const bgColor = isDark ? '#0B0E1A' : '#ffffff';
  const activeColor = '#6C63FF';
  const inactiveColor = isDark ? '#6B6D8A' : '#9A9BAF';

  return (
    <>
    <div className="admin-bnav-spacer" />
    <div className="admin-bnav">
      <div className="admin-bnav__container">
        {/* SVG Notched Background - Precise Center Notch */}
        <svg
          className="admin-bnav__bg"
          viewBox="0 0 360 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20C0 8.954 8.954 0 20 0H132C138 0 143 3 148 9C157 20 168 30 180 30C192 30 203 20 212 9C217 3 222 0 228 0H340C351.046 0 360 8.954 360 20V50C360 61.046 351.046 70 340 70H20C8.954 70 0 61.046 0 50V20Z"
            fill={bgColor}
          />
        </svg>

        {/* Nav Items */}
        <div className="admin-bnav__items">
          {navLinks.map((item, idx) => {
            if (item.isCenter) {
              return (
                <div key={idx} className="admin-bnav__slot admin-bnav__slot--center">
                  <Link
                    to={item.path}
                    className="admin-bnav__fab"
                    style={{
                      background: isActive(item.path)
                        ? 'linear-gradient(135deg, #6C63FF, #FF6B9D)'
                        : 'linear-gradient(135deg, #6C63FF, #00D9FF)',
                      borderColor: bgColor,
                    }}
                  >
                    <item.icon size={28} color="#fff" />
                  </Link>
                </div>
              );
            }

              if (item.isLogout) {
                return (
                  <div key={idx} className="admin-bnav__slot">
                    <button
                      onClick={logoutAdmin}
                      className="admin-bnav__link"
                      style={{ color: inactiveColor }}
                    >
                      <item.icon size={22} />
                      <span className="admin-bnav__text">{item.label}</span>
                    </button>
                  </div>
                );
              }

              const active = isActive(item.path);
              return (
                <div key={idx} className="admin-bnav__slot">
                  <Link
                    to={item.path}
                    className="admin-bnav__link"
                    style={{ color: active ? activeColor : inactiveColor }}
                  >
                    <div className="admin-bnav__icon-box">
                      <item.icon size={22} />
                      {active && <span className="admin-bnav__active-dot" />}
                    </div>
                    <span className="admin-bnav__text">{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
