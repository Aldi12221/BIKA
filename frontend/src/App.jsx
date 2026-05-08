import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

import LoginPage from './pages/LoginPage';
import MasaDepanPage from './pages/MasaDepanPage';
import ProfilPage from './pages/ProfilPage';
import TutorialPage from './pages/TutorialPage';
import QuizPlayPage from './pages/QuizPlayPage';
import UsahaPage from './pages/UsahaPage';
import Beranda from './pages/beranda';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageContentPage from './pages/admin/ManageContentPage';
import ManageQuizPage from './pages/admin/ManageQuizPage';
import ManageUserPage from './pages/admin/ManageUserPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

function UserRouteGuard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* User Pages */}
              <Route element={<UserRouteGuard />}>
                <Route path="/" element={<Beranda />} />
                <Route path="/masa-depan" element={<MasaDepanPage />} />
                <Route path="/tutorial" element={<TutorialPage />} />
                <Route path="/usaha" element={<UsahaPage />} />
                <Route path="/profil" element={<ProfilPage />} />
                <Route path="/quiz/:id" element={<QuizPlayPage />} />
              </Route>

              {/* Admin Pages */}
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<ManageUserPage />} />
                <Route path="/admin/lowongan" element={<ManageContentPage kategoriProp="lowongan" />} />
                <Route path="/admin/tutorial" element={<ManageContentPage kategoriProp="tutorial" />} />
                <Route path="/admin/usaha" element={<ManageContentPage kategoriProp="usaha" />} />
                <Route path="/admin/keuangan" element={<ManageContentPage kategoriProp="keuangan" />} />
                <Route path="/admin/kuis" element={<ManageQuizPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
