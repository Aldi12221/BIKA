import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('admin_theme');
    if (saved) return saved === 'dark';
    return true; // default dark for admin
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    localStorage.setItem('admin_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggle = () => setIsDark(prev => !prev);

  // Desktop: collapse/expand; Mobile: open/close overlay sidebar
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  }, [isMobile]);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  return (
    <AdminThemeContext.Provider value={{
      isDark, toggle,
      sidebarCollapsed, toggleSidebar,
      mobileSidebarOpen, closeMobileSidebar,
      isMobile
    }}>
      <div className={isDark ? 'admin-dark' : 'admin-light'} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export const useAdminTheme = () => useContext(AdminThemeContext);
