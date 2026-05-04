import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp,
  FiUser,
  FiBookOpen,
  FiBriefcase,
  FiArrowRight,
  FiShield,
  FiZap,
  FiStar,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const IS_GOOGLE_READY = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID';

const featureList = [
  { icon: <FiTrendingUp size={16} />, title: 'Masa Depan', desc: 'Lowongan kerja & tutorial CV' },
  { icon: <FiUser size={16} />, title: 'Profil', desc: 'Bangun profil profesionalmu' },
  { icon: <FiBookOpen size={16} />, title: 'Tutorial', desc: 'Kuis & latihan psikotes' },
  { icon: <FiBriefcase size={16} />, title: 'Usaha', desc: 'Tips & kurva pendapatan' },
];

const stats = [
  { label: 'Siswa SMK', value: '2.400+' },
  { label: 'Lowongan', value: '180+' },
  { label: 'Tutorial', value: '90+' },
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
  const [isLoading, setIsLoading] = useState(false);

  const finishLogin = (userData) => {
    loginUser(userData);
    navigate('/masa-depan');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const localUser = buildLocalUserFromGoogle(decoded);
      try {
        const response = await api.loginGoogle(localUser);
        finishLogin(response?.data || localUser);
      } catch {
        finishLogin(localUser);
        setMessage('Masuk berhasil dengan mode lokal (backend belum terhubung).');
      }
    } catch {
      setMessage('Login Google gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-black transition-colors duration-300 overflow-hidden">

      {/* ── LEFT PANEL — Branding ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-blue-950 dark:bg-zinc-950">

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-blue-600/30 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] bg-red-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />

        {/* Grid dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/30">
            B
          </div>
          <div className="leading-none">
            <p className="text-xl font-black text-white tracking-tight">BIKA</p>
            <p className="text-[9px] font-bold text-red-400 uppercase tracking-[0.22em]">Bisa SMK</p>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8 max-w-md">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <FiStar size={12} className="text-yellow-400" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">Platform #1 Siswa SMK</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight">
              Bangun Masa<br />
              Depanmu<br />
              <span className="text-red-400">Bersama BIKA</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Platform digital untuk menemukan peluang kerja, belajar skill baru, dan membangun profil profesional yang memukau.
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-3">
            {featureList.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm hover:bg-white/12 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600/80 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{f.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex items-center gap-8 border-t border-white/10 pt-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Login form ── */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-6 py-12 sm:px-12 relative">

        {/* Mobile-only background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none lg:hidden" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-50/80 dark:bg-red-900/10 rounded-full blur-[70px] translate-y-1/2 -translate-x-1/2 pointer-events-none lg:hidden" />

        <div className="w-full max-w-sm relative z-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-100">
              B
            </div>
            <div className="leading-none">
              <p className="text-lg font-black text-blue-950 dark:text-white tracking-tight">BIKA</p>
              <p className="text-[9px] font-bold text-red-500 uppercase tracking-[0.2em]">Bisa SMK</p>
            </div>
          </div>

          {/* Header text */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-tight mb-2">
              Selamat Datang 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Masuk untuk mengakses semua fitur BIKA dan mulai perjalanan karirmu.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[28px] shadow-xl shadow-slate-100/80 dark:shadow-none p-7 space-y-6">

            {/* Trust badge */}
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-zinc-800 rounded-2xl px-4 py-3">
              <FiShield size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
                Login aman menggunakan akun Google. Data kamu terlindungi.
              </p>
            </div>

            {/* Google Login */}
            {IS_GOOGLE_READY ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Masuk dengan</p>
                <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
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
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 p-3.5">
                  <FiZap size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-amber-700 dark:text-amber-400 leading-snug">
                    Google Client ID belum dikonfigurasi. Gunakan mode demo untuk mencoba fitur BIKA.
                  </p>
                </div>
                <button
                  onClick={handleDemoLogin}
                  className="w-full flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-100 dark:shadow-blue-900/20 transition-all text-sm"
                >
                  <FiZap size={15} />
                  Masuk Mode Demo
                  <FiArrowRight size={15} />
                </button>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 px-4 py-3">
                <p className="text-[12px] text-blue-700 dark:text-blue-400 leading-snug">{message}</p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-6 leading-relaxed">
            Dengan masuk, kamu menyetujui{' '}
            <span className="text-blue-600 dark:text-blue-500 cursor-pointer hover:underline">Syarat & Ketentuan</span>{' '}
            dan{' '}
            <span className="text-blue-600 dark:text-blue-500 cursor-pointer hover:underline">Kebijakan Privasi</span>{' '}
            BIKA.
          </p>
        </div>
      </div>
    </div>
  );
}
