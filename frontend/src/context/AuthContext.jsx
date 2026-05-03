import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bika_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('bika_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('bika_admin_token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bika_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bika_user');
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('bika_admin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('bika_admin');
    }
  }, [admin]);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('bika_admin_token', adminToken);
    } else {
      localStorage.removeItem('bika_admin_token');
    }
  }, [adminToken]);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
  };

  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    setAdminToken(token);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user, admin, adminToken,
      loginUser, logoutUser,
      loginAdmin, logoutAdmin,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
