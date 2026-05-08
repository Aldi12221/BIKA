import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import { FiBookOpen, FiBriefcase, FiUser, FiMenu, FiX, FiLogOut, FiTrendingUp } from 'react-icons/fi';
import logoBika from '../assets/loog.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Beranda', icon: null },
    { path: '/masa-depan', label: 'Masa Depan', icon: <FiTrendingUp /> },
    { path: '/tutorial', label: 'Tutorial', icon: <FiBookOpen /> },
    { path: '/usaha', label: 'Usaha', icon: <FiBriefcase /> },
    { path: '/profil', label: 'Profil', icon: <FiUser /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo BIKA - Menggunakan aset lokal kamu */}
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
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full animate-in fade-in zoom-in duration-300"></span>
                )}
              </Link>
            ))}
          </div>

          {/* User Section / Login */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Section */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggleButton
              className="p-2 rounded-xl border-none hover:bg-slate-100 dark:hover:bg-slate-800"
              iconSize={20}
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-blue-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}