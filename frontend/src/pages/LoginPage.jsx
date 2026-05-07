import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp, FiUser, FiBookOpen, FiBriefcase,
  FiArrowRight, FiShield, FiZap, FiStar, FiCheckCircle,
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

const benefits = [
  'Akses ratusan lowongan kerja & magang',
  'Tutorial skill karir langkah demi langkah',
  'Bangun portofolio digital profesional',
];

const numberFormatter = new Intl.NumberFormat('id-ID');

const defaultLoginStats = {
  totalUsersLoggedIn: null,
  totalLowongan: null,
  totalTutorial: null,
};

function buildLocalUserFromGoogle(decoded) {
  return {
    id: `local-${decoded.sub || Date.now()}`,
    googleId: decoded.sub,
    nama: decoded.name,
    email: decoded.email,
    foto: decoded.picture,
  };
}

// Floating orb component
function FloatingOrb({ size, color, style }) {
  return (
    <div
      className={`absolute rounded-full ${color} blur-[80px] pointer-events-none`}
      style={{ width: size, height: size, ...style }}
    />
  );
}

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
    finishLogin({ id: `demo-${Date.now()}`, nama: 'Pengguna Demo', email: 'demo@bika.local', foto: '' });
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-black transition-colors duration-300 overflow-hidden">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggleButton />
      </div>

      {/* ═══════════════════════════════════════
          LEFT PANEL — Animated Branding
      ═══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[58%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c1445 0%, #0f2060 40%, #0a1a4f 70%, #0d1238 100%)' }}>

        {/* Animated background orbs */}
        <FloatingOrb size="420px" color="bg-blue-600/25" style={{ top: '-80px', right: '-60px', animation: 'float-slow 8s ease-in-out infinite' }} />
        <FloatingOrb size="320px" color="bg-indigo-500/20" style={{ bottom: '60px', left: '-80px', animation: 'float-medium 6s ease-in-out infinite' }} />
        <FloatingOrb size="200px" color="bg-red-500/15" style={{ top: '40%', right: '5%', animation: 'float-fast 4s ease-in-out infinite' }} />
        <FloatingOrb size="150px" color="bg-violet-500/20" style={{ bottom: '25%', left: '30%', animation: 'float-medium 7s ease-in-out infinite reverse' }} />

        {/* Rotating ring decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full border border-white/5"
            style={{ animation: 'spin-slow 20s linear infinite' }}
          />
          <div
            className="absolute inset-8 rounded-full border border-white/5"
            style={{ animation: 'spin-slow 15s linear infinite reverse' }}
          />
          <div
            className="absolute inset-16 rounded-full border border-blue-400/5"
            style={{ animation: 'spin-slow 10s linear infinite' }}
          />
        </div>

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.5)_100%)] pointer-events-none" />

        {/* Logo */}
        <div
          className="relative z-10 flex items-center gap-3"
          style={anim('slide-in-left', 0)}
        >
          <div className="relative">
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-2xl bg-blue-500/40" style={{ animation: 'pulse-ring 2.5s ease-out infinite' }} />
          </div>
          <div className="leading-none">
            <img src="/src/assets/loog.svg" alt="logo bika" className="h-25" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-10 max-w-md">

          {/* Badge */}
          <div style={anim('fade-up', 0.1)}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 backdrop-blur-sm"
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}>
              <FiStar size={12} className="text-yellow-400" style={{ animation: 'bounce-subtle 2.5s ease-in-out infinite' }} />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">Platform #1 Siswa SMK</span>
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  backgroundSize: '400px 100%',
                  animation: 'shimmer 2.5s linear infinite',
                }}
              />
            </div>
          </div>

          {/* Headline */}
          <div style={anim('fade-up', 0.2)}>
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Bangun<br />
              Masa Depanmu<br />
              <span
                className="text-red-400"
                style={{ textShadow: '0 0 40px rgba(239,68,68,0.4)' }}
              >
                Bersama BIKA
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed mt-4 max-w-sm">
              Platform digital siswa SMK untuk menemukan peluang kerja, belajar skill, dan membangun profil profesional.
            </p>
          </div>

          {/* Benefit checklist */}
          <div style={anim('fade-up', 0.3)}>
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle size={12} className="text-green-400" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium">{b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3" style={anim('fade-up', 0.4)}>
            {featureList.map((f, i) => (
              <div
                key={f.title}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="relative flex items-center gap-3 rounded-2xl p-3.5 cursor-default transition-all duration-300 overflow-hidden"
                style={{
                  background: hoveredFeature === i
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.06)',
                  border: '1px solid',
                  borderColor: hoveredFeature === i ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                  transform: hoveredFeature === i ? 'translateY(-2px)' : 'none',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Hover glow */}
                {hoveredFeature === i && (
                  <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 30% 50%, white, transparent 70%)' }} />
                )}
                <div className={`w-8 h-8 ${f.color} rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transition-transform duration-300`}
                  style={{ transform: hoveredFeature === i ? 'scale(1.1) rotate(-5deg)' : 'none' }}>
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
        <div
          className="relative z-10 flex items-center gap-10 pt-8 border-t border-white/10"
          style={anim('fade-up', 0.5)}
        >
          {stats.map((s) => (
            <div key={s.label} className="group cursor-default">
              <div className="flex items-center gap-1.5">
                <span className="text-blue-200 group-hover:text-blue-100 transition-colors duration-300">{s.icon}</span>
                <p className="text-2xl font-black text-white group-hover:text-blue-300 transition-colors duration-300">{s.value}</p>
              </div>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — Login Form
      ═══════════════════════════════════════ */}
      <div className="w-full lg:w-[42%] flex flex-col items-center justify-center px-6 py-12 sm:px-10 relative bg-[#F8FAFC] dark:bg-zinc-950">

        {/* Subtle background decoration (right panel) */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/60 dark:bg-blue-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-red-50 dark:bg-red-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Corner decoration squares */}
        <div className="absolute top-8 right-8 w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-800/50 rotate-45 opacity-60" />
        <div className="absolute bottom-12 left-10 w-2 h-2 rounded-sm bg-red-200 dark:bg-red-800/50 rotate-12 opacity-60" />
        <div className="absolute top-1/3 right-6 w-1.5 h-1.5 rounded-full bg-blue-400/40" />

        <div
          className="w-full max-w-sm relative z-10"
          style={anim('slide-in-right', 0.1)}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
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
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 rounded-full bg-blue-600" />
              <div className="w-4 h-1 rounded-full bg-red-400" />
              <div className="w-2 h-1 rounded-full bg-blue-300" />
            </div>
            <h2 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-tight">
              Selamat Datang 👋 
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-2">
              Masuk dan mulai perjalanan karirmu bersama ribuan siswa SMK se-Indonesia.
            </p>
          </div>

          <div
            className="
              relative
              rounded-[28px]
              p-7
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
                  <div
                    className="flex justify-center transition-all duration-200"
                    style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
                  >
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
          <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-6 leading-relaxed">
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

