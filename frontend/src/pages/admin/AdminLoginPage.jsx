import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../utils/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

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
        setError(res.message || 'Login gagal');
      }
    } catch {
      setError('Terjadi kesalahan server');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-body flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8 animate-slide-up">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-xl shadow-accent/25 animate-float">
            <FiLock />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Admin Panel</h1>
          <p className="text-text-secondary text-sm">BiKA - Bimbingan Karir</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm animate-fade-in">{error}</div>
          )}

          <div>
            <label className="text-xs text-text-muted flex items-center gap-2 mb-1.5"><FiUser size={14} /> Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="admin"
              className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div>
            <label className="text-xs text-text-muted flex items-center gap-2 mb-1.5"><FiLock size={14} /> Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary bg-transparent border-none cursor-pointer">
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? 'Memproses...' : 'Masuk sebagai Admin'}
          </button>

          <a href="/login" className="block text-center text-xs text-text-muted hover:text-primary transition-colors no-underline mt-4">
            ← Kembali ke login user
          </a>
        </form>
      </div>
    </div>
  );
}
