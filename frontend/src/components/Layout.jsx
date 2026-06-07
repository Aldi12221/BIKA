import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import UserSidebar from './UserSidebar';
import Footer from './footer';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg-body flex flex-col">
      {/* Jika user login, tampilkan Sidebar. Jika tidak, tampilkan Navbar biasa (Guest View) */}
      {user ? (
        <div className="flex flex-1">
          <UserSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
          <main
            className={`flex-1 transition-all duration-300 min-h-screen ${sidebarCollapsed ? 'ml-20' : 'ml-64'
              }`}
          >
            <div className="p-0">
              <Outlet />
            </div>
            <Footer />
          </main>
        </div>
      ) : (
        <>
          <Navbar />
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
