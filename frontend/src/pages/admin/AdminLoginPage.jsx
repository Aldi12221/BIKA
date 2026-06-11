import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiLock, FiUser, FiEye, FiEyeOff,
  FiShield, FiZap, FiUsers, FiBookOpen,
  FiBarChart2, FiArrowRight, FiCheckCircle,
} from 'react-icons/fi';
import api from '../../utils/api';

/* ─── Floating orb ─── */
function Orb({ size, style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, ...style }}
    />
  );
}

/* ─── Animated counter ─── */
function CountUp({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{val.toLocaleString('id-ID')}</>;
}

const adminFeatures = [
  { icon: <FiUsers size={14} />,    label: 'Kelola Pengguna',    color: '#6C63FF' },
  { icon: <FiBookOpen size={14} />, label: 'Manajemen Konten',   color: '#FF6B9D' },
  { icon: <FiBarChart2 size={14} />,label: 'Statistik Real-time',color: '#00D9FF' },
  { icon: <FiShield size={14} />,   label: 'Keamanan Penuh',     color: '#00E676' },
];

export default function AdminLoginPage() {
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate   = useNavigate();
  const { loginAdmin } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.adminLogin({ username, password });
      if (res.token) {
        loginAdmin(res.admin, res.token);
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Username atau password salah.');
      }
    } catch {
      setError('Terjadi kesalahan server. Coba lagi.');
    }
    setLoading(false);
  };

  const anim = (delay = 0) =>
    mounted
      ? { animation: `alFadeUp 0.65s ${delay}s cubic-bezier(0.16,1,0.3,1) both` }
      : { opacity: 0 };

  return (
    <>
      <style>{`
        @keyframes alFadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes alSlideLeft {
          from { opacity:0; transform:translateX(-28px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes alOrbFloat {
          0%,100% { transform:translateY(0) scale(1); }
          50%      { transform:translateY(-16px) scale(1.03); }
        }
        @keyframes alSpin {
          to { transform:rotate(360deg); }
        }
        @keyframes alPulse {
          0%   { transform:scale(1);   opacity:.6; }
          100% { transform:scale(1.9); opacity:0; }
        }
        @keyframes alShimmer {
          0%   { background-position:-400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes alBlink {
          0%,100% { opacity:1; }
          50%      { opacity:.35; }
        }
        .al-shimmer-btn::after {
          content:'';
          position:absolute; inset:0;
          border-radius:inherit;
          background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.18) 50%,transparent 100%);
          background-size:400px 100%;
          animation:alShimmer 2s linear infinite;
          pointer-events:none;
        }
      `}</style>

      {/*
        ┌─────────────────────────────────────────────────────┐
        │  OUTER WRAPPER                                       │
        │  • Mobile  : single column, form fills screen        │
        │  • Desktop : two columns side-by-side (lg:flex-row)  │
        └─────────────────────────────────────────────────────┘
      */}
      <div
        className="min-h-screen flex flex-col lg:flex-row overflow-hidden"
        style={{ background: 'var(--color-bg-body,#0F1123)', fontFamily:"'Inter',system-ui,sans-serif" }}
      >

        {/* Left admin branding removed for simplified admin login */}

        {/* ══════════════════════════════════════════
            RIGHT PANEL — Login Form
            • Mobile  : w-full, min-h-screen, centered
            • Desktop : w-[48%], flex-shrink-0
        ══════════════════════════════════════════ */}
        <div
          className="w-full flex-1 flex flex-col items-center justify-center min-h-screen px-5 py-10 sm:px-8 relative"
          style={{ background:'var(--color-bg-body,#0F1123)' }}
        >
          {/* Bg glows */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,rgba(108,99,255,.08) 0%,transparent 70%)',
              transform:'translate(30%,-30%)' }} />
          <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,rgba(255,107,157,.07) 0%,transparent 70%)',
              transform:'translate(-30%,30%)' }} />

          <div className="w-full max-w-[360px] relative z-10">

            {/* ── Mobile-only logo ── */}
            <div className="flex items-center gap-3 mb-8 lg:hidden" style={anim(0)}>
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-lg"
                  style={{ background:'linear-gradient(135deg,#6C63FF,#FF6B9D)' }}>B</div>
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background:'linear-gradient(135deg,#6C63FF,#FF6B9D)', animation:'alPulse 2.5s ease-out infinite' }} />
              </div>
              <div>
                <p className="text-lg font-black text-white tracking-tight leading-none">BIKA</p>
                <p className="text-[9px] font-bold uppercase tracking-[.2em] leading-none mt-0.5" style={{ color:'#FF6B9D' }}>
                  Admin Panel
                </p>
              </div>
            </div>

            {/* ── Header text ── */}
            <div className="mb-7" style={anim(0.05)}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-1 rounded-full" style={{ background:'linear-gradient(90deg,#6C63FF,#FF6B9D)' }} />
                <div className="w-4 h-1 rounded-full" style={{ background:'#6C63FF55' }} />
                <div className="w-2 h-1 rounded-full" style={{ background:'#6C63FF33' }} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight"
                style={{ color:'var(--color-text-primary,#E8E8F0)' }}>
                Selamat Datang
              </h2>
              <p className="text-sm leading-relaxed mt-2"
                style={{ color:'var(--color-text-secondary,#9A9BBF)' }}>
                Masuk ke panel admin untuk mengelola platform BIKA.
              </p>
            </div>

            {/* ── Card ── */}
            <div
              className="relative rounded-[24px] p-5 sm:p-7 overflow-hidden"
              style={{
                background:'var(--color-bg-card,#1C1F3A)',
                border:'1px solid var(--color-border,rgba(255,255,255,.07))',
                boxShadow:'0 24px 64px -12px rgba(0,0,0,.5),0 0 0 1px rgba(108,99,255,.08)',
                ...anim(0.12),
              }}
            >
              {/* Top glow line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px pointer-events-none"
                style={{ background:'linear-gradient(90deg,transparent,rgba(108,99,255,.5),transparent)' }} />

              <div className="space-y-4">

                {/* Security badge */}
                <div className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
                  style={{ background:'rgba(0,230,118,.06)', border:'1px solid rgba(0,230,118,.15)' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:'rgba(0,230,118,.12)' }}>
                    <FiShield size={14} style={{ color:'#00E676' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate" style={{ color:'var(--color-text-primary,#E8E8F0)' }}>
                      Akses Terbatas
                    </p>
                    <p className="text-[10px] truncate" style={{ color:'var(--color-text-muted,#6B6D8A)' }}>
                      Hanya untuk administrator yang berwenang
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"
                      style={{ animation:'alBlink 2s ease-in-out infinite' }} />
                    <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3"
                    style={{ background:'rgba(255,82,82,.08)', border:'1px solid rgba(255,82,82,.25)',
                      animation:'alFadeUp .4s ease both' }}>
                    <FiZap size={13} style={{ color:'#FF5252', flexShrink:0, marginTop:1 }} />
                    <p className="text-[12px] leading-snug" style={{ color:'#FF5252' }}>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2"
                      style={{ color:'var(--color-text-muted,#6B6D8A)' }}>
                      <FiUser size={11} /> Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="admin"
                        className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all duration-200"
                        style={{
                          background:'var(--color-bg-input,#1A1D35)',
                          border:`1px solid ${focusedField==='username'?'rgba(108,99,255,.6)':'var(--color-border,rgba(255,255,255,.07))'}`,
                          color:'var(--color-text-primary,#E8E8F0)',
                          boxShadow:focusedField==='username'?'0 0 0 3px rgba(108,99,255,.12)':'none',
                        }}
                      />
                      {username && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <FiCheckCircle size={14} style={{ color:'#00E676' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2"
                      style={{ color:'var(--color-text-muted,#6B6D8A)' }}>
                      <FiLock size={11} /> Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-11 rounded-2xl text-sm outline-none transition-all duration-200"
                        style={{
                          background:'var(--color-bg-input,#1A1D35)',
                          border:`1px solid ${focusedField==='password'?'rgba(108,99,255,.6)':'var(--color-border,rgba(255,255,255,.07))'}`,
                          color:'var(--color-text-primary,#E8E8F0)',
                          boxShadow:focusedField==='password'?'0 0 0 3px rgba(108,99,255,.12)':'none',
                        }}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
                        style={{ background:'none', border:'none', cursor:'pointer',
                          color:'var(--color-text-muted,#6B6D8A)' }}>
                        {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="al-shimmer-btn relative w-full flex items-center justify-center gap-2.5 font-bold py-3.5 rounded-2xl text-sm text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    style={{
                      background: loading
                        ? 'rgba(108,99,255,.5)'
                        : 'linear-gradient(135deg,#6C63FF 0%,#9B59FF 50%,#FF6B9D 100%)',
                      boxShadow: loading ? 'none' : '0 8px 28px -4px rgba(108,99,255,.45)',
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                          style={{ animation:'alSpin .7s linear infinite' }} />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        <FiLock size={14} />
                        Masuk ke Admin Panel
                        <FiArrowRight size={14} className="ml-auto" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px" style={{ background:'var(--color-border,rgba(255,255,255,.07))' }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color:'var(--color-text-muted,#6B6D8A)' }}>atau</span>
                  <div className="flex-1 h-px" style={{ background:'var(--color-border,rgba(255,255,255,.07))' }} />
                </div>

                {/* Back link */}
                <a href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold no-underline transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background:'var(--color-bg-input,#1A1D35)',
                    border:'1px solid var(--color-border,rgba(255,255,255,.07))',
                    color:'var(--color-text-secondary,#9A9BBF)',
                  }}>
                  ← Kembali ke Login Siswa
                </a>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-[11px] mt-5 leading-relaxed"
              style={{ color:'var(--color-text-muted,#6B6D8A)', ...anim(0.35) }}>
              Dengan masuk, kamu menyetujui kebijakan keamanan dan privasi BIKA.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
