import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp, FiUser, FiBookOpen, FiBriefcase,
  FiArrowRight, FiShield, FiZap,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ThemeToggleButton from '../components/ThemeToggleButton';
import api from '../utils/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const IS_GOOGLE_READY = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID';

const featureList = [
  { icon: <FiTrendingUp size={15} />, title: 'Masa Depan', desc: 'Lowongan kerja & tutorial CV', color: 'bg-blue-500' },
  { icon: <FiUser size={15} />, title: 'Profil', desc: 'Bangun profil profesionalmu', color: 'bg-indigo-500' },
  { icon: <FiBookOpen size={15} />, title: 'Tutorial', desc: 'Kuis & latihan psikotes', color: 'bg-violet-500' },
  { icon: <FiBriefcase size={15} />, title: 'Usaha', desc: 'Tips & kurva pendapatan', color: 'bg-blue-600' },
];

const numberFormatter = new Intl.NumberFormat('id-ID');

const defaultLoginStats = {
  totalUsersLoggedIn: null,
  totalLowongan: null,
  totalTutorial: null,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [loginStats, setLoginStats] = useState(defaultLoginStats);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let active = true;

    const toCountOrNull = (value) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) return null;
      return Math.floor(parsed);
    };

    const loadLoginStats = async () => {
      try {
        const response = await api.getLoginStats();
        if (!active) return;

        setLoginStats({
          totalUsersLoggedIn: toCountOrNull(response?.totalUsersLoggedIn),
          totalLowongan: toCountOrNull(response?.totalLowongan),
          totalTutorial: toCountOrNull(response?.totalTutorial),
        });
      } catch {
        if (!active) return;
      }
    };

    loadLoginStats();
    const intervalId = setInterval(loadLoginStats, 30000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  // Returns animation style only after mount — uses 'fill: both' so opacity
  // starts at 0 inside the keyframe itself, never freezes element hidden.
  const anim = (name, delay = 0) =>
    mounted
      ? { animation: `${name} 0.75s ${delay}s cubic-bezier(0.16,1,0.3,1) both` }
      : {};

  const formatStat = (value) => (
    typeof value === 'number'
      ? numberFormatter.format(value)
      : '...'
  );

  const stats = [
    { label: 'Siswa Login', value: formatStat(loginStats.totalUsersLoggedIn), icon: <FiUser size={16} /> },
    { label: 'Lowongan', value: formatStat(loginStats.totalLowongan), icon: <FiBriefcase size={16} /> },
    { label: 'Tutorial', value: formatStat(loginStats.totalTutorial), icon: <FiBookOpen size={16} /> },
  ];

  const finishLogin = (userData, token) => {
    if (token) {
      localStorage.setItem('bika_token', token);
    }
    loginUser(userData);
    navigate('/masa-depan');
  };

  // Menggunakan useGoogleLogin untuk menghindari COOP error
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setMessage('');
      
      try {
        // Ambil data user dari Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        const googleUser = await userInfoResponse.json();
        
        const localUser = {
          id: `local-${googleUser.sub || Date.now()}`,
          googleId: googleUser.sub,
          nama: googleUser.name,
          email: googleUser.email,
          foto: googleUser.picture,
        };

        try {
          const response = await api.loginGoogle(localUser);
          
          // Pastikan ada token dari backend
          if (response?.token) {
            finishLogin(response.user || localUser, response.token);
          } else {
            // Fallback mode lokal dengan warning
            console.warn('Backend tidak mengembalikan token, menggunakan mode lokal');
            finishLogin(localUser);
            setMessage('Masuk berhasil dengan mode lokal (backend belum terhubung).');
          }
        } catch (error) {
          console.error('Backend login error:', error);
          // Mode lokal sebagai fallback
          finishLogin(localUser);
          setMessage('Masuk berhasil dengan mode lokal (backend belum terhubung).');
        }
      } catch (error) {
        console.error('Google userinfo error:', error);
        setMessage('Gagal mendapatkan informasi dari Google. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setMessage('Login Google gagal. Silakan coba lagi.');
    },
  });

  const handleGoogleLogin = () => {
    setMessage('');
    googleLogin();
  };

  const handleDemoLogin = () => {
    finishLogin({ id: `demo-${Date.now()}`, nama: 'Pengguna Demo', email: 'demo@bika.local', foto: '' });
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-black transition-colors duration-300">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggleButton />
      </div>

      {/* Left side branding removed to simplify login — only center card shown */}

        {/* RIGHT PANEL — Login Form (centered single column) */}
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 relative bg-[#F8FAFC] dark:bg-zinc-950 min-h-screen" >

        {/* Subtle background decoration (right panel) */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/60 dark:bg-blue-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-red-50 dark:bg-red-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Corner decoration squares */}
        <div className="absolute top-8 right-8 w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-800/50 rotate-45 opacity-60" />
        <div className="absolute bottom-12 left-10 w-2 h-2 rounded-sm bg-red-200 dark:bg-red-800/50 rotate-12 opacity-60" />
        <div className="absolute top-1/3 right-6 w-1.5 h-1.5 rounded-full bg-blue-400/40" />

        <div
          className="w-full max-w-sm sm:max-w-md lg:max-w-sm relative z-10"
          style={anim('slide-in-right', 0.1)}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 sm:mb-10 lg:hidden">
            <div className="relative">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-100 dark:shadow-blue-900/30">B</div>
              <div className="absolute inset-0 rounded-xl bg-blue-500/40" style={{ animation: 'pulse-ring 2.5s ease-out infinite' }} />
            </div>
            <div className="leading-none">
              <p className="text-lg font-black text-blue-950 dark:text-white tracking-tight">BIKA</p>
              <p className="text-[9px] font-bold text-red-500 uppercase tracking-[0.2em]">Bisa SMK</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-5 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 rounded-full bg-blue-600" />
              <div className="w-4 h-1 rounded-full bg-red-400" />
              <div className="w-2 h-1 rounded-full bg-blue-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-tight">
              Selamat Datang 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-2">
              Masuk dan mulai perjalanan karirmu bersama ribuan siswa SMK se-Indonesia.
            </p>
          </div>

          <div
            className="
              relative
              rounded-[20px] sm:rounded-[28px]
              p-5 sm:p-7
              overflow-hidden
              transition-all
              duration-500
              bg-white
              dark:bg-zinc-900
              border
              border-slate-200/80
              dark:border-zinc-700/80
              shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08),0_4px_20px_-4px_rgba(59,130,246,0.08)]"
            style={anim('fade-up', 0.3)}>

            <div className="space-y-6">
              {/* Trust badge */}
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-800/60 rounded-2xl px-4 py-3 border border-slate-100 dark:border-zinc-800/60">
                <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiShield size={15} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 ">100% Aman & Terenkripsi</p>
                  <p className="text-[10px] text-slate-400 dark:text-gray-300">Data kamu dilindungi standar Google OAuth 2.0</p>
                </div>
              </div>

              {/* Google Login section */}
              {IS_GOOGLE_READY ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-zinc-700" />
                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Masuk dengan</p>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-zinc-700" />
                  </div>
                  
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="group w-full relative flex items-center justify-center gap-3 font-bold py-4 rounded-2xl text-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isLoading ? 'Memproses...' : 'Masuk dengan Google'}
                  </button>
                  
                  {isLoading && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-slate-400">Memproses login...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 p-3.5">
                    <FiZap size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-amber-700 dark:text-amber-400 leading-snug">
                      Google Client ID belum dikonfigurasi. Coba mode demo dulu!
                    </p>
                  </div>
                  <button
                    onClick={handleDemoLogin}
                    className="group w-full relative flex items-center justify-center gap-2.5 font-bold py-4 rounded-2xl text-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: 'white',
                      boxShadow: '0 8px 24px -4px rgba(37,99,235,0.35)',
                    }}
                  >
                    {/* Shimmer on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
                        backgroundSize: '300px 100%',
                        animation: 'shimmer 1.5s linear infinite',
                      }}
                    />
                    <FiZap size={15} />
                    Masuk Mode Demo
                    <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              )}

              {/* Status message */}
              {message && (
                <div
                  className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 px-4 py-3"
                  style={{ animation: 'fade-up 0.4s ease both' }}
                >
                  <p className="text-[12px] text-blue-700 dark:text-blue-400 leading-snug">{message}</p>
                </div>
              )}

              {/* Divider + features row */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.18em] font-black mb-3 text-center">Fitur Unggulan</p>
                <div className="grid grid-cols-2 gap-2">
                  {featureList.map((f) => (
                    <div
                      key={f.title}
                      className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800/60 rounded-xl px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-zinc-700/60 transition-colors duration-200 cursor-default group"
                    >
                      <div className={`w-6 h-6 ${f.color} rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                        {f.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-none">{f.title}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-4 sm:mt-6 leading-relaxed pb-2">
            Dengan masuk, kamu menyetujui{' '}
            <span className="text-blue-600 dark:text-blue-500 cursor-pointer hover:underline font-semibold">Syarat & Ketentuan</span>
            {' '}dan{' '}
            <span className="text-blue-600 dark:text-blue-500 cursor-pointer hover:underline font-semibold">Kebijakan Privasi</span>
            {' '}BIKA.
          </p>
        </div>
      </div>
    </div>
  );
}

