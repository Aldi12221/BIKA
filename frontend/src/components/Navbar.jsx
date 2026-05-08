import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import { FiHome, FiBookOpen, FiBriefcase, FiUser, FiMenu, FiX, FiLogOut, FiTrendingUp, FiMessageCircle } from 'react-icons/fi';
import logoBika from '../assets/loog.svg';

const navLinks = [
  { path: '/',           label: 'Beranda',    icon: FiHome },
  { path: '/masa-depan', label: 'Masa Depan', icon: FiTrendingUp },
  { path: '/tutorial',   label: 'Tutorial',   icon: FiBookOpen },
  { path: '/usaha',      label: 'Usaha',      icon: FiBriefcase },
  { path: '/profil',     label: 'Profil',     icon: FiUser },
];

/* ─── Mobile Sidebar ─────────────────────────────────────────── */
function MobileSidebar({ open, onClose, user, logoutUser, location }) {
  const sidebarRef = useRef(null);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  /* lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[998] transition-all duration-300 lg:hidden"
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Sidebar panel */}
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 bottom-0 z-[999] flex flex-col lg:hidden"
        style={{
          width: 270,
          background: 'var(--sidebar-bg, #ffffff)',
          boxShadow: '8px 0 40px rgba(0,0,0,0.18)',
          borderRadius: '0 24px 24px 0',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── Top: user profile ── */}
        <div
          className="flex items-center gap-3 px-5 pt-8 pb-6"
          style={{ borderBottom: '1px solid var(--sidebar-border, rgba(0,0,0,0.07))' }}
        >
          {user ? (
            <>
              {user.foto ? (
                <img
                  src={user.foto}
                  alt={user.nama}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  style={{ boxShadow: '0 2px 10px rgba(37,99,235,0.25)' }}
                />
              ) : (
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 2px 10px rgba(37,99,235,0.3)' }}
                >
                  {user.nama?.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--sidebar-text, #1e293b)' }}>
                  {user.nama}
                </p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--sidebar-muted, #94a3b8)' }}>
                  {user.email}
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--sidebar-input, #f1f5f9)' }}
              >
                <FiUser size={20} style={{ color: 'var(--sidebar-muted, #94a3b8)' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--sidebar-text, #1e293b)' }}>Tamu</p>
                <p className="text-[11px]" style={{ color: 'var(--sidebar-muted, #94a3b8)' }}>Belum masuk</p>
              </div>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-xl transition-colors duration-200 border-none cursor-pointer flex-shrink-0"
            style={{ background: 'var(--sidebar-input, #f1f5f9)', color: 'var(--sidebar-muted, #94a3b8)' }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ── Nav links ── */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl no-underline transition-all duration-200 relative"
                style={{
                  background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
                  color: active ? '#2563eb' : 'var(--sidebar-text-sec, #64748b)',
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                }}
              >
                {/* Active left bar */}
                {active && (
                  <span
                    className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full"
                    style={{ background: '#2563eb' }}
                  />
                )}
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Support button ── */}
        <div className="px-4 pb-4">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] border-none cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
            }}
          >
            <FiMessageCircle size={16} />
            Support
          </button>
        </div>

        {/* ── Footer: theme + logout ── */}
        <div
          className="px-4 py-4 flex flex-col gap-1"
          style={{ borderTop: '1px solid var(--sidebar-border, rgba(0,0,0,0.07))' }}
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'var(--sidebar-input, #f1f5f9)' }}>
            <span className="text-sm font-medium flex-1" style={{ color: 'var(--sidebar-text-sec, #64748b)' }}>
              Tema
            </span>
            <ThemeToggleButton />
          </div>

          {user ? (
            <button
              onClick={() => { logoutUser(); onClose(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 border-none cursor-pointer w-full text-left"
              style={{
                background: 'transparent',
                color: 'var(--sidebar-text-sec, #64748b)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--sidebar-text-sec, #64748b)';
              }}
            >
              <FiLogOut size={18} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm no-underline transition-all duration-200"
              style={{ color: '#2563eb' }}
            >
              <FiUser size={18} />
              Masuk
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────── */
export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* CSS variables for sidebar — respects dark mode via Tailwind dark class */}
      <style>{`
        :root {
          --sidebar-bg: #ffffff;
          --sidebar-border: rgba(0,0,0,0.07);
          --sidebar-text: #1e293b;
          --sidebar-text-sec: #64748b;
          --sidebar-muted: #94a3b8;
          --sidebar-input: #f1f5f9;
        }
        .dark {
          --sidebar-bg: #0f172a;
          --sidebar-border: rgba(255,255,255,0.07);
          --sidebar-text: #e2e8f0;
          --sidebar-text-sec: #94a3b8;
          --sidebar-muted: #475569;
          --sidebar-input: #1e293b;
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center no-underline group">
              <img
                src={logoBika}
                alt="BIKA Bisa SMK"
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-bold no-underline transition-all duration-300 py-2 ${
                    isActive(link.path)
                      ? 'text-red-500'
                      : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full animate-in fade-in zoom-in duration-300" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop user section */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggleButton />
              {user ? (
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-1.5 pr-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    {user.foto ? (
                      <img src={user.foto} alt="" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-100">
                        {user.nama?.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-none mb-1">Halo,</span>
                      <span className="text-sm font-bold text-blue-950 dark:text-slate-200 leading-none">{user.nama}</span>
                    </div>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="ml-2 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all cursor-pointer bg-transparent border-none"
                    title="Keluar"
                  >
                    <FiLogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold no-underline shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    Login
                  </Link>
                  <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-colors cursor-pointer">
                    <FiUser size={20} />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: theme toggle + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggleButton />
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-blue-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Buka menu"
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        logoutUser={logoutUser}
        location={location}
      />
    </>
  );
}
