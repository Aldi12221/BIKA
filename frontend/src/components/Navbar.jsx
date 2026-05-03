import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiBookOpen, FiBriefcase, FiUser, FiMenu, FiX, FiLogOut, FiTrendingUp, FiMessageCircle, FiMoon, FiSun } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
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
          
          {/* Logo sesuai WhatsApp Image 2026-05-01 at 13.02.09.jpeg */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-200 dark:shadow-none transition-transform group-hover:scale-105">
              B
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-blue-900 dark:text-white tracking-tight">Bika</span>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Bisa SMK</span>
            </div>
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
                {/* Indikator Garis Bawah Merah sesuai gambar */}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full animate-in fade-in zoom-in duration-300"></span>
                )}
              </Link>
            ))}
          </div>

          {/* User Section / Login */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer">
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-none cursor-pointer hover:bg-slate-100 transition-all">
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-blue-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-black border-t border-slate-50 dark:border-slate-900 absolute w-full shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold no-underline transition-all ${
                  isActive(link.path)
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span className="text-xl">{link.icon || <FiBriefcase />}</span>
                {link.label}
              </Link>
            ))}
            
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-900">
              {user ? (
                <button
                  onClick={() => { logoutUser(); setIsOpen(false); }}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all w-full bg-transparent border-none cursor-pointer"
                >
                  <FiLogOut size={20} />
                  Keluar Akun
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-4 bg-blue-600 text-white rounded-2xl font-bold no-underline shadow-lg shadow-blue-200"
                >
                  Masuk Sekarang
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}