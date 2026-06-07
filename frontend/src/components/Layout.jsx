import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Do not show sidebar on Beranda if user is not logged in
  const isBeranda = location.pathname === '/';
  const showSidebar = user || !isBeranda;

  return (
    <div className="flex bg-[#F8FAFC] dark:bg-black min-h-screen font-sans selection:bg-blue-500/30">
      {showSidebar && (
        <UserSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      )}

      <main
        className={`flex-1 transition-all duration-300 min-h-screen ${showSidebar ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : ''
          }`}
      >
        <div className="w-full h-full pb-20 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
