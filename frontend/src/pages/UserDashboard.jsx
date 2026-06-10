import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    FiSearch,
    FiBell,
    FiBriefcase,
    FiFileText,
    FiLayers,
    FiTrendingUp,
    FiArrowRight,
    FiClock,
    FiMapPin,
    FiChevronRight,
    FiPlayCircle,
    FiCalendar,
    FiBookOpen,
    FiMic,
    FiZap
} from 'react-icons/fi';
import studentBanner from '../assets/siswa.png';

export default function UserDashboard() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ totalJobs: 0, totalTutorials: 0, totalUsers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, statsRes] = await Promise.all([
                    api.getContents('lowongan'),
                    api.getPublicStats()
                ]);

                if (Array.isArray(jobsRes)) {
                    setAllJobs(jobsRes);
                    setJobs(jobsRes.slice(0, 4));
                }
                if (statsRes) setStats(statsRes);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter jobs by search query
    const filteredJobs = searchQuery.trim() === ''
        ? jobs
        : allJobs.filter(j => {
            const q = searchQuery.toLowerCase();
            return (
                (j.judul || '').toLowerCase().includes(q) ||
                (j.perusahaan || '').toLowerCase().includes(q) ||
                (j.lokasi || '').toLowerCase().includes(q) ||
                (j.tipe_pekerjaan || '').toLowerCase().includes(q)
            );
        });

    return (
        <div className="min-h-[100dvh] bg-slate-50 dark:bg-zinc-950 p-6 lg:p-10">
            {/* 1. TOP HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="relative flex-1 max-w-xl">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari lowongan, kelas, atau materi..."
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 dark:focus:border-blue-600 transition-all shadow-sm"
                    />
                </div>
                {/* User info — hidden on mobile (already in top bar) */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-4 border-l border-slate-200 dark:border-zinc-800 pl-6">
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">{user?.nama || 'Pengguna'}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Siswa SMK</p>
                        </div>
                        {user?.foto ? (
                            <img src={user.foto} alt="" className="w-11 h-11 rounded-xl object-cover border-2 border-white dark:border-zinc-800 shadow-md" />
                        ) : (
                            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-base font-black border-2 border-white dark:border-zinc-800">
                                {user?.nama?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {searchQuery.trim() === '' && (
                <>
                    {/* 2. HERO BANNER */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-[32px] p-8 md:p-12 mb-10 overflow-hidden relative border border-white dark:border-zinc-800 shadow-sm">
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                        Halo, Selamat Datang di BIKA!
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-8 leading-relaxed">
                        Siap kerja, siap usaha, siap masa depan. Mari mulai langkahmu hari ini.
                    </p>
                    <NavLink to="/masa-depan">
                        <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 border-none cursor-pointer">
                            Jelajahi <FiArrowRight strokeWidth={3} />
                        </button>
                    </NavLink>
                </div>
                <img
                    src={studentBanner}
                    alt=""
                    className="absolute right-0 bottom-0 h-[105%] w-auto opacity-20 md:opacity-100 mix-blend-multiply dark:mix-blend-normal transform translate-x-10 translate-y-2"
                />
            </section>

            {/* 3. QUICK STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <StatCard icon={<FiBriefcase />} count={stats.totalJobs.toString()} label="Lowongan Tersedia" color="blue" sub="Lihat semua lowongan" />
                <StatCard icon={<FiPlayCircle />} count={stats.totalTutorials.toString()} label="Tutorial & Kuis" color="emerald" sub="Mulai belajar sekarang" />
                <StatCard icon={<FiLayers />} count={stats.totalUsers.toString()} label="User Terdaftar" color="indigo" sub="Komunitas BIKA" />
            </div>

            {/* 4. RECOMMENDATIONS */}
            <section className="mb-12">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    Rekomendasi untuk Kamu
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ActionCard
                        title="Cari Lowongan Kerja"
                        desc="Temukan pekerjaan impianmu dan mulai berkarir hari ini."
                        icon={<FiBriefcase className="text-blue-600" />}
                        bg="bg-blue-50 dark:bg-blue-900/10"
                        link="/masa-depan"
                    />
                    <ActionCard
                        title="Belajar Skill Baru"
                        desc="Tingkatkan kemampuanmu dengan tutorial dan kuis interaktif."
                        icon={<FiPlayCircle className="text-emerald-600" />}
                        bg="bg-emerald-50 dark:bg-emerald-900/10"
                        link="/tutorial"
                    />
                    <ActionCard
                        title="Tips Memulai Usaha"
                        desc="Pelajari dasar-dasar bisnis dan mulai langkah pertamamu."
                        icon={<FiZap className="text-amber-600" />}
                        bg="bg-amber-50 dark:bg-amber-900/10"
                        link="/usaha"
                    />
                </div>
            </section>
                </>
            )}

            {/* 5. MAIN GRID */}
            <div className="grid grid-cols-1 gap-10">
                {/* Lowongan Terbaru */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            {searchQuery.trim() !== '' ? 'Hasil Pencarian' : 'Lowongan Terbaru'}
                        </h3>
                        <NavLink to="/masa-depan" className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">Lihat Semua Lowongan</NavLink>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-zinc-800/50">
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Posisi</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Perusahaan</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Lokasi</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Tipe</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">Memuat data...</td></tr>
                                ) : filteredJobs.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">Tidak ada hasil untuk "{searchQuery}"</td></tr>
                                ) : (
                                    filteredJobs.map((job, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer">
                                            <td className="px-6 py-5 font-bold text-sm text-slate-800 dark:text-slate-200">{job.judul}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-6 h-6 bg-slate-100 dark:bg-black rounded-lg flex items-center justify-center text-[10px]">🏢</div>
                                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{job.perusahaan}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {job.lokasi}{job.detail_lokasi ? `, ${job.detail_lokasi}` : ''}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tight ${job.tipe_pekerjaan === 'Magang' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    {job.tipe_pekerjaan || 'Full Time'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-slate-300 group-hover:text-blue-600 transition-colors border-none bg-transparent cursor-pointer">
                                                    <FiChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <button className="w-full py-4 bg-slate-50/50 dark:bg-zinc-800/50 text-[11px] font-black text-blue-600 uppercase tracking-widest border-t border-slate-50 dark:border-zinc-800 hover:bg-slate-100 transition-colors border-none cursor-pointer">
                            Lihat Semua Lowongan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, count, label, color, sub }) {
    const colors = {
        blue: 'bg-blue-600 text-white',
        emerald: 'bg-emerald-600 text-white',
        indigo: 'bg-indigo-600 text-white'
    };
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border-2 border-white dark:border-zinc-800 ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{count}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{label}</p>
                <button className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-tighter mt-1 bg-transparent border-none cursor-pointer p-0">{sub} &gt;</button>
            </div>
        </div>
    );
}

function StatProgressBar({ icon, progress, label, color, sub }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg bg-amber-500 text-white border-2 border-white dark:border-zinc-800">
                {icon}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{progress}%</span>
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-tighter">{label}</p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-1">{sub}</p>
            </div>
        </div>
    );
}

function ActionCard({ title, desc, icon, bg, link }) {
    return (
        <NavLink to={link} className="no-underline group">
            <div className={`p-6 rounded-[32px] border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full bg-white dark:bg-zinc-900`}>
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 transition-colors">{title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium">{desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Mulai Sekarang <FiArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </NavLink>
    );
}

function ProgressItem({ title, progress, icon }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-sm shadow-sm">{icon}</div>
                <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight flex-1">{title}</p>
                <span className="text-[11px] font-black text-slate-400">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}

function AgendaItem({ date, month, title, time, tag, tagColor }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    };
    return (
        <div className="flex items-center gap-4 group">
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-800 shrink-0 group-hover:border-blue-200 transition-colors shadow-sm">
                <span className="text-base font-black text-blue-600 leading-none">{date}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{month}</span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</h4>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><FiClock size={10} /> {time}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter ${colors[tagColor]}`}>{tag}</span>
                </div>
            </div>
        </div>
    );
}
