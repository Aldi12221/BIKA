import { useState, useEffect, useMemo } from 'react';
import { FiArrowRight, FiFileText, FiClock, FiSearch, FiChevronDown, FiMapPin, FiBriefcase, FiX, FiChevronLeft, FiChevronRight, FiFilter, FiRefreshCw, FiDownload, FiZoomIn } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Breakpoints: mobile < 640px → 2, tablet 640–1023px → 3, desktop ≥ 1024px → 4
function getJobsPerPage() {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth < 640) return 2;
  if (window.innerWidth < 1024) return 3;
  return 4;
}

function useJobsPerPage() {
  const [perPage, setPerPage] = useState(getJobsPerPage);
  useEffect(() => {
    const handler = () => setPerPage(getJobsPerPage());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return perPage;
}

export default function MasaDepanPage() {
  const [lowongans, setLowongans] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter states
  const [filterLokasi, setFilterLokasi] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [filterPerusahaan, setFilterPerusahaan] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = useJobsPerPage();

  useEffect(() => {
    api.getContents('lowongan').then(d => {
      if (Array.isArray(d)) setLowongans(d);
    }).catch(console.error);

    api.getContents('tutorial').then(d => {
      if (Array.isArray(d)) setTutorials(d.slice(0, 3));
    }).catch(console.error);
  }, []);

  // Derive unique filter options from data
  const lokasiOptions = useMemo(() => {
    const vals = lowongans.map(l => l.lokasi).filter(Boolean);
    return [...new Set(vals)].sort();
  }, [lowongans]);

  const tipeOptions = useMemo(() => {
    const vals = lowongans.map(l => l.tipe_pekerjaan).filter(Boolean);
    return [...new Set(vals)].sort();
  }, [lowongans]);

  const perusahaanOptions = useMemo(() => {
    const vals = lowongans.map(l => l.perusahaan).filter(Boolean);
    return [...new Set(vals)].sort();
  }, [lowongans]);

  // Filtered list
  const filteredLowongans = useMemo(() => {
    return lowongans.filter(l => {
      const matchSearch =
        l.judul.toLowerCase().includes(search.toLowerCase()) ||
        (l.deskripsi || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.perusahaan || '').toLowerCase().includes(search.toLowerCase());
      const matchLokasi = filterLokasi ? l.lokasi === filterLokasi : true;
      const matchTipe = filterTipe ? l.tipe_pekerjaan === filterTipe : true;
      const matchPerusahaan = filterPerusahaan ? l.perusahaan === filterPerusahaan : true;
      return matchSearch && matchLokasi && matchTipe && matchPerusahaan;
    });
  }, [lowongans, search, filterLokasi, filterTipe, filterPerusahaan]);

  // Reset to page 1 whenever filters or perPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterLokasi, filterTipe, filterPerusahaan, jobsPerPage]);

  // Pagination math
  const totalPages = Math.max(1, Math.ceil(filteredLowongans.length / jobsPerPage));
  const paginatedJobs = filteredLowongans.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const hasActiveFilters = search || filterLokasi || filterTipe || filterPerusahaan;

  const resetFilters = () => {
    setSearch('');
    setFilterLokasi('');
    setFilterTipe('');
    setFilterPerusahaan('');
  };

  // Page number array for pagination bar
  const pageNumbers = useMemo(() => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) range.push(i);
    if (range[0] > 2) range.unshift('...');
    if (range[0] > 1) range.unshift(1);
    if (range[range.length - 1] < totalPages - 1) range.push('...');
    if (range[range.length - 1] < totalPages) range.push(totalPages);
    return range;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black overflow-x-hidden transition-colors duration-300 font-sans">
      {/* Background ornaments */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3" />

      {/* Header */}
      <div className="text-center pt-32 pb-14 relative z-10">
        <div className="inline-flex items-center justify-center gap-2 bg-white/50 dark:bg-white/5 border border-blue-200/50 dark:border-blue-900/30 px-5 py-2 rounded-full mb-5 shadow-sm backdrop-blur-sm transition-all">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Portal Karir</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors mb-4 uppercase">
          Masa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Depan</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium transition-colors">
          Cari Lowongan <span className="font-light italic">&</span> Siapkan Diri
        </p>
      </div>

      {/* Lowongan Section */}
      <div className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-zinc-800 transition-colors">

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Lowongan Kerja</h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 px-4 py-2 rounded-xl transition-colors"
              >
                <FiRefreshCw size={12} /> Reset Filter
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400 text-lg" />
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari posisi, perusahaan, atau kata kunci..."
                className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-8 p-4 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
              <FiFilter size={13} /> Filter:
            </div>

            {/* Tipe Pekerjaan */}
            <div className="relative">
              <select
                value={filterTipe}
                onChange={e => setFilterTipe(e.target.value)}
                className={`appearance-none pl-4 pr-8 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${filterTipe
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:border-blue-400'
                  }`}
              >
                <option value="">Tipe Pekerjaan</option>
                {tipeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <FiChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[11px] ${filterTipe ? 'text-white' : 'text-slate-400'}`} />
            </div>

            {/* Lokasi */}
            <div className="relative">
              <select
                value={filterLokasi}
                onChange={e => setFilterLokasi(e.target.value)}
                className={`appearance-none pl-4 pr-8 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${filterLokasi
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:border-blue-400'
                  }`}
              >
                <option value="">Semua Lokasi</option>
                {lokasiOptions.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <FiChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[11px] ${filterLokasi ? 'text-white' : 'text-slate-400'}`} />
            </div>

            {/* Perusahaan */}
            <div className="relative">
              <select
                value={filterPerusahaan}
                onChange={e => setFilterPerusahaan(e.target.value)}
                className={`appearance-none pl-4 pr-8 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${filterPerusahaan
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:border-blue-400'
                  }`}
              >
                <option value="">Semua Perusahaan</option>
                {perusahaanOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <FiChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[11px] ${filterPerusahaan ? 'text-white' : 'text-slate-400'}`} />
            </div>

            {/* Active filter chips */}
            {filterTipe && (
              <button onClick={() => setFilterTipe('')} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                {filterTipe} <FiX size={11} />
              </button>
            )}
            {filterLokasi && (
              <button onClick={() => setFilterLokasi('')} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                {filterLokasi} <FiX size={11} />
              </button>
            )}
            {filterPerusahaan && (
              <button onClick={() => setFilterPerusahaan('')} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                {filterPerusahaan} <FiX size={11} />
              </button>
            )}

            <span className="ml-auto text-xs font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 self-center">
              {filteredLowongans.length} hasil
            </span>
          </div>

          {/* Job Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5 min-h-[200px]">
            {paginatedJobs.length > 0 ? paginatedJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[24px] p-6 flex flex-col hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-black border border-slate-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform overflow-hidden shrink-0">
                    {job.gambar ? <img src={job.gambar} alt="logo" className="w-full h-full object-cover" /> : '💼'}
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-black text-[16px] text-slate-900 dark:text-white leading-tight mb-1 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{job.judul}</h4>
                    <p className="text-[13px] font-bold text-blue-600 dark:text-blue-400 transition-colors mb-1">{job.perusahaan || 'Mitra Bika'}</p>
                  </div>
                </div>

                <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 transition-colors line-clamp-3 mb-5 leading-relaxed break-words">
                  {job.deskripsi || 'Tidak ada spesifikasi deskripsi detail yang dilampirkan.'}
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700">
                    <FiMapPin /> {job.lokasi || 'Nasional / Remote'}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/50">
                    <FiBriefcase /> {job.tipe_pekerjaan || 'Full-Time'}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                    <FiClock className="text-slate-300 dark:text-zinc-600" /> Aktif
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        toast.error('Silakan login untuk melamar lowongan');
                        navigate('/login');
                        return;
                      }
                      setSelectedJob(job);
                    }}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors shadow-sm cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-16 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">Tidak ada lowongan yang sesuai.</p>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    Reset semua filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 dark:border-zinc-800">
              {/* Info */}
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 hidden sm:block">
                Halaman {currentPage} dari {totalPages} &nbsp;·&nbsp; {filteredLowongans.length} lowongan
              </span>

              {/* Controls */}
              <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft size={15} />
                </button>

                {/* Page numbers */}
                {pageNumbers.map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm font-bold">
                      ···
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all
                        ${currentPage === p
                          ? 'bg-blue-600 text-white border border-blue-600 shadow-md shadow-blue-500/30'
                          : 'border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Tutorial & Panduan</h2>
          <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
            Lihat Semua <FiArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutorials.length > 0 ? tutorials.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => window.location.href = '/tutorial'}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[28px] p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm overflow-hidden shrink-0 ${idx % 3 === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                  idx % 3 === 1 ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' :
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                  }`}>
                  {item.gambar ? <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" /> : <FiFileText />}
                </div>
                <div className="w-10 h-10 rounded-full border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-500 transition-all">
                  <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-[15px] text-slate-900 dark:text-white leading-tight mb-2 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.judul}</h4>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors line-clamp-2">{item.deskripsi || 'Pelajari materi ini lebih lanjut di halaman tutorial.'}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-8 text-center text-slate-500">Belum ada tutorial.</div>
          )}
        </div>
      </div>

      {/* Modal Job Detail */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center z-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Detail Lowongan</h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-8">
              {/* Gambar besar di atas — klikable untuk lightbox */}
              {selectedJob.gambar && (
                <div
                  onClick={() => setLightboxImg(selectedJob.gambar)}
                  className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 cursor-zoom-in group border border-slate-100 dark:border-zinc-800"
                >
                  <img
                    src={selectedJob.gambar}
                    alt={selectedJob.judul}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                      <FiZoomIn size={14} /> Klik untuk perbesar
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 mb-8">
                {/* Thumbnail kecil — tetap ada sebagai identitas */}
                <div className="w-14 h-14 bg-slate-50 dark:bg-black border border-slate-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-3xl shadow-sm overflow-hidden shrink-0">
                  {selectedJob.gambar
                    ? <img src={selectedJob.gambar} alt="logo" className="w-full h-full object-cover" />
                    : '💼'}
                </div>
                <div className="flex-1 pt-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">{selectedJob.judul}</h2>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400 mb-3">{selectedJob.perusahaan || 'Mitra Bika'}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700">
                      <FiMapPin /> {selectedJob.lokasi || 'Nasional / Remote'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/50">
                      <FiBriefcase /> {selectedJob.tipe_pekerjaan || 'Full-Time'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Deskripsi Pekerjaan</h4>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.deskripsi || 'Tidak ada spesifikasi deskripsi detail yang dilampirkan.'}
                </div>

                {/* File Tambahan */}
                {selectedJob.file_tambahan && JSON.parse(selectedJob.file_tambahan).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">File Lampiran</h4>
                    <div className="flex flex-col gap-3">
                      {JSON.parse(selectedJob.file_tambahan).map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                              <FiFileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{file.name}</p>
                              <p className="text-[10px] font-medium text-slate-400 uppercase">{file.type?.split('/')[1] || 'File'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (!user) {
                                toast.error('Silakan login untuk mendownload lampiran');
                                navigate('/login');
                                return;
                              }
                              const link = document.createElement('a');
                              link.href = file.data;
                              link.download = file.name;
                              link.click();
                            }}
                            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer border-none"
                          >
                            <FiDownload size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    toast.error('Silakan login untuk melamar lowongan');
                    navigate('/login');
                    return;
                  }
                  selectedJob.link_eksternal ? window.open(selectedJob.link_eksternal, '_blank') : alert('Link lamaran tidak tersedia');
                }}
                className="w-full bg-blue-600 text-white text-sm font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-center cursor-pointer border-none"
              >
                Apply Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Lightbox — full screen image viewer */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxImg(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border-none cursor-pointer z-10"
          >
            <FiX size={20} />
          </button>

          {/* Image — stop propagation so clicking image itself doesn't close */}
          <img
            src={lightboxImg}
            alt="Gambar Lowongan"
            onClick={e => e.stopPropagation()}
            className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
            style={{ animation: 'lightboxPop 0.25s cubic-bezier(0.16,1,0.3,1) both' }}
          />

          <style>{`
            @keyframes lightboxPop {
              from { opacity: 0; transform: scale(0.88); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
