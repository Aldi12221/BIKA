import React from 'react';
import { FiArrowRight, FiFileText, FiClock, FiSearch, FiChevronDown, FiMapPin, FiBriefcase } from 'react-icons/fi';

export default function MasaDepanPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black overflow-x-hidden transition-colors duration-300 font-sans">
      {/* --- BACKGROUND ORNAMENTS --- */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      {/* Header */}
      <div className="text-center pt-32 pb-14 relative z-10">
        <div className="inline-flex items-center justify-center gap-2 bg-white/50 dark:bg-white/5 border border-blue-200/50 dark:border-blue-900/30 px-5 py-2 rounded-full mb-5 shadow-sm backdrop-blur-sm transition-all">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Portal Karir</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors mb-4 uppercase">
          Masa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Depan</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium transition-colors">
          Cari Lowongan <span className="font-light italic">&</span> Siapkan Diri
        </p>
      </div>

      {/* Lowongan Kerja Section */}
      <div className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-zinc-800 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Lowongan Kerja</h2>
          </div>
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400 text-lg" />
              </div>
              <input 
                type="text" 
                placeholder="Cari posisi, perusahaan, atau kata kunci..." 
                className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
              />
            </div>
            <button className="bg-blue-600 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20 whitespace-nowrap">
              Cari Lowongan
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filter */}
            <div className="w-full lg:w-64 shrink-0 space-y-8">
              <div>
                <h3 className="font-bold text-[13px] text-slate-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">Filter Topik</h3>
                <div className="space-y-3">
                  {['Semua Topik', 'Kategori', 'Kursus'].map(item => (
                    <div key={item} className="relative group">
                      <select className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-black/50 dark:hover:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                        <option>{item}</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                        <FiChevronDown />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[13px] text-slate-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">Filter Spesifik</h3>
                <div className="space-y-3">
                  {['Berdasarkan Lokasi', 'Rentang Gaji'].map(item => (
                    <div key={item} className="relative group">
                      <select className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-black/50 dark:hover:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                        <option>{item}</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                        <FiChevronDown />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid Lowongan */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 transition-colors group">
                  Daftar Lowongan <FiChevronDown className="group-hover:translate-y-0.5 transition-transform" />
                </div>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full">8 Hasil Ditemukan</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { title: "Junior UI/UX Designer", company: "Tech Studio Inc.", location: "Jakarta Selatan", type: "Full-Time", time: "2 hari yang lalu", icon: "🎨" },
                  { title: "Frontend Developer", company: "Bika Solutions", location: "Yogyakarta", type: "Remote", time: "5 hari yang lalu", icon: "💻" },
                  { title: "Digital Marketing Intern", company: "Creative Agency", location: "Bandung", type: "Magang", time: "1 minggu yang lalu", icon: "📈" },
                  { title: "Customer Support Representative", company: "Global Tech", location: "Surabaya", type: "Full-Time", time: "2 minggu yang lalu", icon: "🎧" }
                ].map((job, idx) => (
                  <div key={idx} className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[24px] p-6 flex flex-col hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-black border border-slate-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {job.icon}
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className="font-black text-[15px] text-slate-900 dark:text-white leading-tight mb-1 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{job.title}</h4>
                        <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 transition-colors">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-black/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-zinc-800">
                        <FiMapPin /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <FiBriefcase /> {job.type}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                        <FiClock className="text-slate-300 dark:text-zinc-600" /> {job.time}
                      </span>
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors shadow-sm">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial membuat CV & Portofolio Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Tutorial & Panduan</h2>
          <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
            Lihat Semua <FiArrowRight />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 1, title: "Cara Membuat CV ATS Friendly", subtitle: "Tingkatkan peluang lolos seleksi berkas" },
            { id: 2, title: "Menyusun Portofolio Profesional", subtitle: "Tampilkan karyamu dengan elegan" },
            { id: 3, title: "Persiapan Wawancara Kerja", subtitle: "Panduan menjawab pertanyaan HRD" }
          ].map((item, idx) => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[28px] p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                  idx === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 
                  idx === 1 ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 
                  'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                }`}>
                  <FiFileText />
                </div>
                <div className="w-10 h-10 rounded-full border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-500 transition-all">
                  <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-[15px] text-slate-900 dark:text-white leading-tight mb-2 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.title}</h4>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
