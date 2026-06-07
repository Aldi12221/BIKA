import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import {
    FiHome,
    FiTrendingUp,
    FiBookOpen,
    FiBriefcase,
    FiUser,
    FiLogOut,
    FiMessageCircle,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
import logoBika from '../assets/loog.svg';

const navLinks = [
    { path: '/', label: 'Beranda', icon: FiHome },
    { path: '/masa-depan', label: 'Portal Karir', icon: FiTrendingUp },
    { path: '/tutorial', label: 'Tutorial', icon: FiBookOpen },
    { path: '/usaha', label: 'Tips Usaha', icon: FiBriefcase },
    { path: '/profil', label: 'Profil Saya', icon: FiUser },
];

export default function UserSidebar({ collapsed, setCollapsed }) {
    const { user, logoutUser } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-white dark:bg-black border-r border-slate-100 dark:border-zinc-800 transition-all duration-300 z-50 flex flex-col ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header / Logo */}
            <div className="p-6 flex items-center justify-between">
                {!collapsed && (
                    <Link to="/" className="flex items-center gap-2 no-underline">
                        <img src={logoBika} alt="BIKA" className="h-8 w-auto" />
                        <span className="font-black text-xl text-blue-950 dark:text-white tracking-tighter">BIKA</span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors border-none cursor-pointer mx-auto"
                >
                    {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                {navLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 no-underline group ${active
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                                }`}
                        >
                            <span className={`text-xl ${active ? 'text-white' : 'group-hover:text-blue-600'}`}>
                                <link.icon />
                            </span>
                            {!collapsed && (
                                <span className={`font-bold text-sm ${active ? 'text-white' : ''}`}>
                                    {link.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 ${collapsed ? 'justify-center' : ''}`}>
                    {user.foto ? (
                        <img src={user.foto} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {user.nama?.charAt(0)}
                        </div>
                    )}
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-blue-950 dark:text-white truncate">{user.nama}</p>
                            <p className="text-[10px] text-slate-400 truncate">Siswa SMK</p>
                        </div>
                    )}
                </div>

                <div className={`flex flex-col gap-1 ${collapsed ? 'items-center' : ''}`}>
                    <div className="flex items-center justify-center">
                        <ThemeToggleButton />
                    </div>

                    <button
                        onClick={logoutUser}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border-none cursor-pointer bg-transparent w-full ${collapsed ? 'justify-center' : ''}`}
                    >
                        <FiLogOut size={18} />
                        {!collapsed && <span className="font-bold text-sm">Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
