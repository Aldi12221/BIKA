import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import {
    FiHome,
    FiBriefcase,
    FiPlay,
    FiZap,
    FiUser,
    FiLogOut,
    FiChevronLeft,
    FiChevronRight,
    FiChevronDown
} from 'react-icons/fi';
import logoBika from '../assets/loog.svg';

const navLinks = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/masa-depan', label: 'Lowongan Kerja', icon: FiBriefcase },
    {
        path: '/tutorial',
        label: 'Tutorial & Kuis',
        icon: FiPlay,
        children: [
            { path: '/tutorial#bank_kuis', label: 'Bank Kuis' },
            { path: '/tutorial#wawancara', label: 'Tips & Trick Wawancara' },
            { path: '/tutorial#asesmen', label: 'Tes Asesmen' }
        ]
    },
    {
        path: '/usaha',
        label: 'Tips Usaha',
        icon: FiZap,
        children: [
            { path: '/usaha#memulai', label: 'Tips Memulai Usaha' },
            { path: '/usaha#resources', label: 'Resources' },
            { path: '/usaha#keuangan', label: 'Tips Mengatur Keuangan' }
        ]
    },
    { path: '/profil', label: 'Profil Saya', icon: FiUser },
];

export default function UserSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
    const { user, logoutUser } = useAuth();
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const isActive = (path) => {
        if (path.includes('#')) {
            return location.pathname + location.hash === path;
        }
        return location.pathname === path;
    };

    const toggleSubmenu = (label) => {
        if (collapsed) {
            setCollapsed(false);
            setOpenSubmenu(label);
            return;
        }
        setOpenSubmenu(openSubmenu === label ? null : label);
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-white dark:bg-zinc-950 border-r border-slate-100 dark:border-zinc-900 transition-all duration-300 z-50 flex flex-col ${collapsed ? 'md:w-20' : 'md:w-64'
                } w-64 ${mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`}
        >
            {/* Header / Logo */}
            <div className="p-6 flex items-center justify-between">
                {!collapsed && (
                    <Link to="/" className="flex items-center gap-2 no-underline">
                        <img src={logoBika} alt="BIKA" className="h-7 w-auto" />
                    </Link>
                )}
                <button
                    onClick={() => {
                        setCollapsed(!collapsed);
                        if (!collapsed) setOpenSubmenu(null);
                    }}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-blue-600 transition-colors border-none cursor-pointer mx-auto"
                >
                    {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
                {navLinks.map((link) => {
                    const hasChildren = link.children && link.children.length > 0;
                    const isSubOpen = openSubmenu === link.label;
                    const active = isActive(link.path);

                    if (hasChildren) {
                        return (
                            <div key={link.label} className="space-y-1">
                                <button
                                    onClick={() => toggleSubmenu(link.label)}
                                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 border-none cursor-pointer bg-transparent group ${active || isSubOpen
                                        ? 'bg-blue-600/5 text-blue-600'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                                        }`}
                                >
                                    <span className={`text-lg ${active || isSubOpen ? 'text-blue-600' : 'group-hover:text-blue-600'}`}>
                                        <link.icon />
                                    </span>
                                    {!collapsed && (
                                        <>
                                            <span className="font-bold text-sm flex-1 text-left">{link.label}</span>
                                            {isSubOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                                        </>
                                    )}
                                </button>

                                {!collapsed && isSubOpen && (
                                    <div className="pl-12 space-y-1 ml-1 border-l-2 border-slate-100 dark:border-zinc-800">
                                        {link.children.map((sub) => (
                                            <Link
                                                key={sub.path}
                                                to={sub.path}
                                                className={`block py-2 text-[12px] font-bold no-underline transition-colors ${isActive(sub.path)
                                                    ? 'text-blue-600'
                                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                                    }`}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 no-underline group ${active
                                ? 'bg-blue-600/10 text-blue-600'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                                }`}
                        >
                            <span className={`text-lg ${active ? 'text-blue-600' : 'group-hover:text-blue-600'}`}>
                                <link.icon />
                            </span>
                            {!collapsed && (
                                <span className={`font-bold text-sm ${active ? 'text-blue-600' : ''}`}>
                                    {link.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-slate-50 dark:border-zinc-900">
                <div className={`flex items-center gap-3 p-2 rounded-2xl ${collapsed ? 'justify-center border border-slate-100 dark:border-zinc-800' : ''}`}>
                    {user?.foto ? (
                        <img src={user.foto} alt="" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
                    ) : (
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-sm font-black border border-blue-200 dark:border-blue-800">
                            {user?.nama?.charAt(0)}
                        </div>
                    )}
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-800 dark:text-white truncate mb-0.5">{user?.nama || 'User'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Siswa SMK</p>
                        </div>
                    )}
                    {!collapsed && <ThemeToggleButton />}
                </div>

                {!collapsed && (
                    <button
                        onClick={logoutUser}
                        className="mt-2 flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-all border-none cursor-pointer bg-transparent w-full text-left"
                    >
                        <FiLogOut size={16} />
                        <span className="font-bold text-[12px]">Logout</span>
                    </button>
                )}
            </div>
        </aside>
    );
}
