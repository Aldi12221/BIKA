import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../utils/api';
import siswa from '../assets/siswa.png';
import {
  FiArrowRight,
  FiPlayCircle,
  FiBookmark,
  FiPlay,
  FiSend,
  FiSmile,
  FiBriefcase,
  FiUser
} from 'react-icons/fi';

export default function Beranda() {
  const [lowongan, setLowongan] = useState([]);
  const [tutorial, setTutorial] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalTutorials: 0, totalUsers: 0 });

  useEffect(() => {
    api.getContents('lowongan').then(d => {
      if (Array.isArray(d)) setLowongan(d.slice(0, 6)); // Ambil lebih banyak untuk beranda
    }).catch(console.error);

    api.getContents('tutorial').then(d => {
      if (Array.isArray(d)) setTutorial(d.slice(0, 3));
    }).catch(console.error);

    api.getPublicStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black overflow-x-hidden transition-colors duration-300">
      {/* --- BACKGROUND ORNAMENTS --- */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 dark:bg-red-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      {/* HEADER GUEST */}
      <header className="absolute top-0 left-0 right-0 py-6 px-6 lg:px-12 z-50 flex items-center justify-between">
        <div className="text-3xl font-black text-blue-950 dark:text-white tracking-tighter">
          BIKA<span className="text-blue-600">.</span>
        </div>
        <NavLink to="/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center gap-2">
            Login <FiUser size={16} />
          </button>
        </NavLink>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors">
              <span className="text-blue-600 text-base">📢</span>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Platform Karir Siswa SMK</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-blue-950 dark:text-white leading-[1.05] tracking-tight transition-colors">
              Raih Karir <br className="hidden lg:block" /> Impianmu di <br />
              <span className="text-red-500">BIKA</span>
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium transition-colors">
              Temukan ribuan peluang kerja, magang, dan pelajari skill baru yang dibutuhkan industri saat ini.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <NavLink to={"/masa-depan"}>
                <button className="bg-blue-600 dark:bg-blue-600/40 border border-blue-600 text-white px-8 py-4 rounded-[20px] font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-blue-900/20 active:scale-95 text-base">
                  Cari Lowongan <FiArrowRight strokeWidth={3} />
                </button>
              </NavLink>
              <NavLink to={"/login"}>
                <button className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-blue-950 dark:text-white px-7 py-4 rounded-[20px] font-bold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-base shadow-sm">
                  Daftar Sekarang <FiSmile size={22} className="text-blue-600 dark:text-blue-500" />
                </button>
              </NavLink>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg">
            <div className="absolute inset-0 bg-blue-200/20 rounded-full blur-3xl scale-75"></div>
            <img src={siswa} alt="BIKA Students" className="w-full relative z-10 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* 2. STATS MONITOR - Memenuhi permintaan "tambahkan monitor jumlah lowongan dll di beranda" */}
      <section className="px-6 lg:px-12 py-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white dark:bg-zinc-900/80 backdrop-blur-xl p-8 md:p-12 rounded-[48px] border border-white dark:border-zinc-800 shadow-2xl shadow-blue-100/50 dark:shadow-none">
            <StatItem count={stats.totalJobs} label="Lowongan Aktif" color="text-blue-600" />
            <StatItem count={stats.totalTutorials} label="Tutorial & Tips" color="text-red-500" />
            <StatItem count={stats.totalUsers} label="Siswa Bergabung" color="text-indigo-600" />
            <StatItem count={Math.floor(stats.totalJobs * 0.8)} label="Mitra Perusahaan" color="text-emerald-600" />
          </div>
        </div>
      </section>

      {/* 3. FEATURE CARDS */}
      <section className="px-6 lg:px-12 py-12 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Portal Karir"
            desc="Akses ribuan lowongan kerja dan magang khusus untuk lulusan SMK."
            icon={<FiBriefcase size={22} className="text-indigo-50 dark:text-zinc-950" />}
            color="bg-blue-600 dark:bg-blue-600/50"
            shadow="shadow-blue-100"
            textColor="text-blue-600"
            link="/masa-depan"
          />

          <FeatureCard
            title="Tutorial Skill"
            desc="Tingkatkan kompetensimu dengan materi video dari para ahli industri."
            icon={<FiPlayCircle size={22} className="text-red-50 dark:text-zinc-950" />}
            color="bg-red-500 dark:bg-red-500/50"
            shadow="shadow-red-100"
            textColor="text-red-500"
            link="/tutorial"
          />

          <FeatureCard
            title="Bangun Profil"
            desc="Buat CV digital yang menarik dan profesional untuk memikat HRD."
            icon={<FiUser size={22} className="text-blue-50 dark:text-zinc-950" />}
            color="bg-blue-500 dark:bg-blue-500/50"
            shadow="shadow-blue-100"
            textColor="text-blue-500"
            link="/profil"
          />
        </div>
      </section>

      {/* 4. MAIN CONTENT GRID - Menonjolkan Lowongan sesuai permintaan */}
      <section className="px-6 lg:px-12 py-20 bg-white/50 dark:bg-zinc-900/20" id='content'>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Lowongan Section - Lebih Besar (2/3 width) */}
            <div className="lg:w-2/3 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight flex items-center gap-3">
                    <FiBriefcase className="text-blue-600" /> Lowongan Kerja Terpopuler
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Update terbaru hari ini untukmu</p>
                </div>
                <NavLink to="/masa-depan" className="text-blue-600 font-bold text-sm hover:underline">Lihat Semua</NavLink>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowongan.length > 0 ? lowongan.map((item, idx) => (
                  <JobItem
                    key={item.id}
                    title={item.judul}
                    company={item.perusahaan || "Perusahaan Mitra"}
                    type={item.tipe_pekerjaan || "Penuh Waktu"}
                    color={idx % 2 === 0 ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400"}
                  />
                )) : (
                  <p className="col-span-full py-10 text-center text-slate-400 italic">Memuat lowongan...</p>
                )}
              </div>

              <button onClick={() => window.location.href = '/masa-depan'} className="w-full py-5 bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-[32px] text-blue-600 dark:text-blue-400 font-black hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
                Jelajahi Peluang Karir Lainnya →
              </button>
            </div>

            {/* Sidebar Content (1/3 width) */}
            <div className="lg:w-1/3 space-y-12">
              {/* Tutorial Terbaru */}
              <div className="space-y-6">
                <SectionHeader title="Tutorial Terbaru" icon={<FiPlayCircle size={22} />} link="/tutorial" />
                <div className="space-y-5">
                  {tutorial.length > 0 ? tutorial.map((item) => (
                    <TutorialItem
                      key={item.id}
                      title={item.judul}
                      cat="Pilihan Redaksi"
                      time="Terbaru"
                    />
                  )) : (
                    <p className="text-sm text-slate-400 italic">Belum ada materi terbaru.</p>
                  )}
                </div>
              </div>

              {/* Call to Action Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <h4 className="text-xl font-black mb-2 relative z-10">Siap Melangkah?</h4>
                <p className="text-blue-50/80 text-sm mb-6 relative z-10 leading-relaxed">Bergabunglah dengan ribuan siswa SMK lainnya dan mulai bangun masa depanmu sekarang juga.</p>
                <button onClick={() => window.location.href = '/login'} className="w-full py-3 bg-white text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-50 transition-colors relative z-10 shadow-lg border-none cursor-pointer">
                  Mulai Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ count, label, color }) {
  return (
    <div className="text-center md:text-left">
      <h3 className={`text-3xl md:text-4xl font-black ${color} mb-1 transition-all`}>
        {count || 0}
        <span className="text-xl ml-0.5">+</span>
      </h3>
      <p className="text-[10px] md:text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

// Sub-komponen tetap sama, hanya padding internal yang disesuaikan sedikit agar lebih ringkas.
function FeatureCard({ title, desc, icon, color, shadow, textColor, link }) {
  return (
    <div className="group bg-white dark:bg-zinc-900 p-8 rounded-[36px] border border-slate-50 dark:border-zinc-800 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:border-zinc-700 hover:-translate-y-2 transition-all duration-300">
      <div className={`w-12 h-12 ${color} ${shadow} dark:shadow-none rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-black text-blue-950 dark:text-white mb-3 tracking-tight transition-colors">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium transition-colors">{desc}</p>
      <NavLink
        to={link || '/'}
        className={`font-black text-[12px] inline-flex items-center gap-2 ${textColor} uppercase tracking-widest no-underline hover:opacity-80 transition-opacity`}
      >
        Jelajahi <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </NavLink>
    </div>
  );
}

function SectionHeader({ title, icon, isChat, link }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3 transition-colors">
      <h3 className="font-black text-xl text-blue-950 dark:text-white flex items-center gap-2 tracking-tight transition-colors">
        <span className="text-blue-600 dark:text-blue-500">{icon}</span> {title}
      </h3>
      {isChat ? (
        <div className="flex items-center gap-2 bg-green-50 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Online</span>
        </div>
      ) : (
        <button onClick={() => link && (window.location.href = link)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest cursor-pointer">Lihat Semua</button>
      )}
    </div>
  );
}

function JobItem({ title, company, type, color }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-[24px] border border-slate-50 dark:border-zinc-800 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-50 dark:bg-black rounded-xl flex items-center justify-center text-lg">🏢</div>
        <div>
          <h4 className="text-[13px] font-black text-blue-950 dark:text-slate-200 mb-0.5 leading-tight transition-colors">{title}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{company}</p>
        </div>
      </div>
      <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${color} uppercase tracking-tighter`}>{type}</span>
    </div>
  );
}

function TutorialItem({ title, cat, time }) {
  return (
    <div className="flex gap-4 items-center group cursor-pointer">
      <div className="relative w-20 h-16 bg-slate-200 dark:bg-zinc-800 rounded-[16px] overflow-hidden shrink-0 shadow-sm">
        <img src={`https://picsum.photos/seed/${title}/150/100`} alt="thumb" className="w-full h-full object-cover opacity-90 dark:opacity-70" />
        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1.5 py-0.5 rounded-md font-black">{time}</span>
      </div>
      <div className="space-y-1">
        <h4 className="text-[13px] font-black text-blue-950 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{title}</h4>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{cat}</p>
      </div>
    </div>
  );
}