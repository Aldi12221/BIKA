import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    FiSearch,
    FiBriefcase,
    FiLayers,
    FiArrowRight,
    FiClock,
    FiMapPin,
    FiChevronRight,
    FiPlayCircle,
    FiZap,
    FiBookOpen,
    FiX
} from 'react-icons/fi';
import studentBanner from '../assets/siswa.png';

export default function UserDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [usahaItems, setUsahaItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({ totalJobs: 0, totalTutorials: 0, totalUsers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, statsRes, tutorialRes, usahaRes] = await Promise.all([
                    api.getContents('lowongan'),
                    api.getPublicStats(),
                    api.getContents('tutorial'),
                    api.getContents('usaha')
                ]);

                if (Array.isArray(jobsRes)) {
                    setAllJobs(jobsRes);
                    setJobs(jobsRes.slice(0, 6));
                }
                if (Array.isArray(tutorialRes)) setTutorials(tutorialRes);
                if (Array.isArray(usahaRes)) setUsahaItems(usahaRes);
                if (statsRes) setStats(statsRes);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const isSearching = searchQuery.trim() !== '';

    // Global search across all content
    const searchResults = isSearching ? {
        jobs: allJobs.filter(j => {
            const q = searchQuery.toLowerCase();
            return (j.judul || '').toLowerCase().includes(q) ||
                (j.perusahaan || '').toLowerCase().includes(q) ||
                (j.lokasi || '').toLowerCase().includes(q);
        }),
        tutorials: tutorials.filter(t => {
            const q = searchQuery.toLowerCase();
            return (t.judul || '').toLowerCase().includes(q) ||
                (t.deskripsi || '').toLowerCase().includes(q);
        }),
        usaha: usahaItems.filter(u => {
            const q = searchQuery.toLowerCase();
            return (u.judul || '').toLowerCase().includes(q) ||
                (u.deskripsi || '').toLowerCase().includes(q);
        })
    } : null;

    const totalResults = searchResults
        ? searchResults.jobs.length + searchResults.tutorials.length + searchResults.usaha.length
        : 0;

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
                        placeholder="Cari lowongan, tutorial, tips usaha..."
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 dark:focus:border-blue-600 transition-all shadow-sm"
                    />
                    {isSearching && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
                        >
                            <FiX size={16} />
                        </button>
                    )}
                </div>
                {/* User info */}
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

            {/* ===== SEARCH RESULTS ===== */}
            {isSearching ? (
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Hasil Pencarian</h3>
                        <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-full">{totalResults} hasil</span>
                    </div>

                    {/* Jobs Results */}
                    {searchResults.jobs.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><FiBriefcase className="text-blue-600" size={14} /></div>
                                <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Lowongan ({searchResults.jobs.length})</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchResults.jobs.slice(0, 6).map(job => (
                                    <JobCard key={job.id} job={job} onClick={() => navigate('/masa-depan')} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tutorial Results */}
                    {searchResults.tutorials.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center"><FiBookOpen className="text-rose-600" size={14} /></div>
                                <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tutorial ({searchResults.tutorials.length})</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchResults.tutorials.slice(0, 6).map(item => (
                                    <ContentCard key={item.id} item={item} color="rose" onClick={() => navigate('/tutorial')} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Usaha Results */}
                    {searchResults.usaha.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><FiZap className="text-amber-600" size={14} /></div>
                                <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tips Usaha ({searchResults.usaha.length})</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {searchResults.usaha.slice(0, 6).map(item => (
                                    <ContentCard key={item.id} item={item} color="amber" onClick={() => navigate('/usaha')} />
                                ))}
                            </div>
                        </div>
                    )}

                    {totalResults === 0 && (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-4 opacity-30">🔍</div>
                            <h3 className="text-lg font-black text-slate-400 dark:text-slate-500 mb-2">Tidak ada hasil untuk "{searchQuery}"</h3>
                            <p className="text-sm text-slate-400">Coba kata kunci lain atau jelajahi menu di sidebar</p>
                        </div>
                    )}
                </div>
            ) : (
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

                    {/* 5. LOWONGAN TERBARU — CARD GRID */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Lowongan Terbaru
                            </h3>
                            <NavLink to="/masa-depan" className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest no-underline flex items-center gap-1">
                                Lihat Semua <FiChevronRight size={14} />
                            </NavLink>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 border border-slate-100 dark:border-zinc-800 animate-pulse">
                                        <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded-lg w-3/4 mb-4"></div>
                                        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-lg w-1/2 mb-3"></div>
                                        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-lg w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">Belum ada lowongan tersedia.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {jobs.map(job => (
                                    <JobCard key={job.id} job={job} onClick={() => navigate('/masa-depan')} />
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

/* ─── Job Card Component ─── */
function JobCard({ job, onClick }) {
    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-zinc-900 rounded-[24px] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
            {/* Accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${job.is_magang ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}></div>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                    <h4 className="font-black text-[15px] text-slate-900 dark:text-white leading-tight mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {job.judul}
                    </h4>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-slate-100 dark:bg-zinc-800 rounded-md flex items-center justify-center text-[10px]">🏢</div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{job.perusahaan}</span>
                    </div>
                </div>
                <span className={`shrink-0 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tight ${job.is_magang ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                    {job.is_magang ? 'Magang' : (job.tipe_pekerjaan || 'Profesional')}
                </span>
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg">
                    <FiMapPin size={11} className="text-slate-400" />
                    <span className="truncate max-w-[10rem]">{job.lokasi || 'Remote'}</span>
                </span>
                {job.detail_lokasi && (
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg truncate max-w-[12rem]">
                        {job.detail_lokasi}
                    </span>
                )}
            </div>

            {/* Deskripsi preview */}
            {job.deskripsi && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed line-clamp-2 mb-4">
                    {job.deskripsi}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-zinc-800">
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider group-hover:tracking-widest transition-all">
                    Lihat Detail
                </span>
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FiArrowRight size={13} />
                </div>
            </div>
        </div>
    );
}

/* ─── Content Card (for tutorial/usaha search results) ─── */
function ContentCard({ item, color, onClick }) {
    const colorMap = {
        rose: {
            bg: 'bg-rose-50 dark:bg-rose-900/10',
            text: 'text-rose-600 dark:text-rose-400',
            accent: 'bg-gradient-to-r from-rose-500 to-orange-400',
            iconBg: 'bg-rose-100 dark:bg-rose-900/30',
        },
        amber: {
            bg: 'bg-amber-50 dark:bg-amber-900/10',
            text: 'text-amber-600 dark:text-amber-400',
            accent: 'bg-gradient-to-r from-amber-500 to-orange-400',
            iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        }
    };
    const c = colorMap[color] || colorMap.rose;

    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-zinc-900 rounded-[24px] p-6 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
            <div className={`absolute top-0 left-0 right-0 h-1 ${c.accent}`}></div>
            {item.gambar && (
                <div className="w-full h-28 rounded-xl overflow-hidden mb-4">
                    <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
            )}
            <h4 className="font-black text-[14px] text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.judul}
            </h4>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">
                {item.deskripsi || 'Klik untuk membaca selengkapnya'}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-zinc-800">
                <span className={`text-[10px] font-black uppercase tracking-wider ${c.text}`}>
                    Baca Selengkapnya
                </span>
                <FiArrowRight size={13} className={`${c.text} group-hover:translate-x-1 transition-transform`} />
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
