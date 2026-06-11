import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import { useAuth } from '../context/AuthContext';
import { FiMenu } from 'react-icons/fi';
import logoBika from '../assets/loog.svg';
import { Link } from 'react-router-dom';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Do not show sidebar on Beranda if user is not logged in
  const isBeranda = location.pathname === '/';
  const showSidebar = user || !isBeranda;

  return (
    <div className="flex bg-[#F8FAFC] dark:bg-black min-h-screen font-sans selection:bg-blue-500/30">
      {showSidebar && (
        <>
          {mobileOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
              onClick={() => setMobileOpen(false)}
            />
          )}
          <UserSidebar 
            collapsed={sidebarCollapsed} 
            setCollapsed={setSidebarCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        </>
      )}

      <main
        className={`flex-1 transition-all duration-300 min-h-[100dvh] w-full ${
          showSidebar ? (sidebarCollapsed ? 'md:ml-20' : 'md:ml-64') : ''
        }`}
      >
        {showSidebar && (
          <div className="md:hidden flex items-center justify-between bg-white dark:bg-zinc-950 p-4 border-b border-slate-100 dark:border-zinc-900 sticky top-0 z-30">
            
            <Link to="/">
              <img src={logoBika} alt="BIKA Logo" className="h-8" />
            </Link>
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 text-slate-500 hover:text-blue-600 border-none bg-transparent cursor-pointer"
            >
              <FiMenu size={24} />
            </button>
          </div>
        )}

        <div className="w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
