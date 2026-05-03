import { useState, useEffect } from 'react';
import { FiUsers, FiFileText, FiHelpCircle, FiTrendingUp } from 'react-icons/fi';
import api from '../../utils/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalContents: 0, totalQuizzes: 0 });

  useEffect(() => {
    api.adminStats().then(d => d && setStats(d)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <FiUsers size={24} />, gradient: 'gradient-primary' },
    { label: 'Total Konten', value: stats.totalContents, icon: <FiFileText size={24} />, gradient: 'gradient-accent' },
    { label: 'Total Kuis', value: stats.totalQuizzes, icon: <FiHelpCircle size={24} />, gradient: 'gradient-success' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold gradient-text mb-1">Dashboard</h1>
        <p className="text-text-secondary text-sm">Selamat datang di Admin Panel BiKA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="glass rounded-2xl p-6 card-hover animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${c.gradient} flex items-center justify-center text-white shadow-lg`}>{c.icon}</div>
              <FiTrendingUp className="text-success" />
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{c.value}</p>
            <p className="text-sm text-text-secondary">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">📌 Quick Info</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-bg-card rounded-xl">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <p className="text-sm text-text-secondary">Gunakan menu <strong className="text-text-primary">Kelola Konten</strong> untuk menambah lowongan, tutorial, dan tips usaha.</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-bg-card rounded-xl">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <p className="text-sm text-text-secondary">Gunakan menu <strong className="text-text-primary">Kelola Kuis</strong> untuk membuat kuis dan soal baru.</p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-bg-card rounded-xl">
            <div className="w-2 h-2 rounded-full bg-warning"></div>
            <p className="text-sm text-text-secondary">Konten dengan kategori <strong className="text-text-primary">lowongan</strong> akan tampil di halaman Masa Depan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
