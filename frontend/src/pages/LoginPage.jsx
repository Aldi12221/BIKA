import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiBriefcase, FiTrendingUp, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const IS_GOOGLE_READY = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID';

const featureList = [
  {
    icon: <FiTrendingUp />,
    title: 'Masa Depan',
    desc: 'Link lowongan kerja dan tutorial CV/portofolio.',
  },
  {
    icon: <FiUser />,
    title: 'Profil',
    desc: 'Atur nama, foto profil, dan upload berkas CV.',
  },
  {
    icon: <FiBookOpen />,
    title: 'Tutorial',
    desc: 'Kuis, tips wawancara, dan latihan psikotes.',
  },
  {
    icon: <FiBriefcase />,
    title: 'Usaha',
    desc: 'Tips usaha, keuangan, dan kurva pendapatan.',
  },
];

function buildLocalUserFromGoogle(decoded) {
  return {
    id: `local-${decoded.sub || Date.now()}`,
    googleId: decoded.sub,
    nama: decoded.name,
    email: decoded.email,
    foto: decoded.picture,
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [message, setMessage] = useState('');

  const finishLogin = (userData) => {
    loginUser(userData);
    navigate('/masa-depan');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const localUser = buildLocalUserFromGoogle(decoded);

      try {
        const response = await api.loginGoogle(localUser);
        finishLogin(response?.data || localUser);
      } catch {
        // Fallback supaya frontend tetap bisa dipakai saat backend belum siap.
        finishLogin(localUser);
        setMessage('Masuk berhasil dengan mode lokal (backend belum terhubung).');
      }
    } catch {
      setMessage('Login Google gagal. Silakan coba lagi.');
    }
  };

  const handleDemoLogin = () => {
    finishLogin({
      id: `demo-${Date.now()}`,
      nama: 'Pengguna Demo',
      email: 'demo@bika.local',
      foto: '',
    });
  };

  return (
    <div className="min-h-screen bg-bg-body flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 -right-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-5">
        <div className="text-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4 shadow-xl shadow-primary/25">
            BK
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1">BiKA</h1>
          <p className="text-text-secondary text-sm">Bimbingan Karir dan Pengembangan Diri</p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 space-y-5 animate-slide-up">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-1">Login dengan Akun Google</h2>
            <p className="text-sm text-text-secondary">Masuk untuk mengakses fitur Masa Depan, Profil, Tutorial, dan Usaha.</p>
          </div>

          {IS_GOOGLE_READY ? (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setMessage('Login Google gagal. Silakan coba lagi.')}
                theme="outline"
                size="large"
                shape="pill"
                text="continue_with"
                locale="id"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
              Google Client ID belum diset. Untuk sementara kamu bisa pakai mode demo.
            </div>
          )}

          {!IS_GOOGLE_READY && (
            <button onClick={handleDemoLogin} className="w-full btn-primary text-sm">
              Masuk Mode Demo
            </button>
          )}

          {message && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-text-primary">
              {message}
            </div>
          )}

          <div className="border-t border-border pt-4">
            <p className="text-xs text-text-muted mb-3">Fitur yang tersedia</p>
            <div className="space-y-2">
              {featureList.map((feature) => (
                <div key={feature.title} className="bg-bg-card rounded-xl p-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-sm flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{feature.title}</p>
                    <p className="text-xs text-text-muted">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
