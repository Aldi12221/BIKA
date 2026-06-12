import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiSearch, FiChevronDown, FiMapPin, FiBriefcase, FiX,
  FiFilter, FiRefreshCw, FiDownload, FiFileText, FiClock,
  FiZoomIn,
} from 'react-icons/fi';
import api from '../utils/api';
import SkeletonCard from '../components/SkeletonCard';
import LoginPromptModal from '../components/LoginPromptModal';

// ─── SearchableFilter (inline copy from MasaDepanPage) ───────────────────────
function SearchableFilter({ label, allLabel, value, options, isOpen, onToggle, onClose, onChange }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return options;
    return options.filter(option => String(option).toLowerCase().includes(keyword));
  }, [options, query]);

  const selectValue = (nextValue) => {
    onChange(nextValue);
    onClose();
  };

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={onToggle}
        title={value || allLabel}
        aria-label={`Filter ${label}: ${value || allLabel}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`inline-flex h-8 max-w-[10.5rem] sm:max-w-[12rem] items-center gap-1.5 rounded-xl border px-3 text-[11px] font-black transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20
          ${value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:border-blue-400'
          }`}
      >
        <span className="truncate">{value || label}</span>
        <FiChevronDown className={`shrink-0 text-[11px] transition-transform ${isOpen ? 'rotate-180' : ''} ${value ? 'text-white' : 'text-slate-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-2 w-60 max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40">
          <div className="relative mb-2">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Cari ${label.toLowerCase()}...`}
              aria-label={`Cari ${label}`}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-black/40 dark:text-white dark:placeholder:text-zinc-500"
              autoFocus
            />
          </div>

          <button
            type="button"
            onClick={() => selectValue('')}
            className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${!value ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-800'}`}
          >
            <span className="truncate">{allLabel}</span>
            {!value && <span className="text-[10px] uppercase">Aktif</span>}
          </button>

          <div className="max-h-48 overflow-y-auto pr-1" role="listbox">
            {filteredOptions.length > 0 ? filteredOptions.map(option => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={value === option}
                onClick={() => selectValue(option)}
                title={option}
                className={`mb-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${value === option ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-800'}`}
              >
                <span className="truncate">{option}</span>
              </button>
            )) : (
              <div className="px-3 py-4 text-center text-xs font-semibold text-slate-400">
                Tidak ada pilihan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LowonganPreviewPage() {
  const [searchParams] = useSearchParams();

  // ── Data state
  const [lowongans, setLowongans] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Filter state
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  const [filterMagang, setFilterMagang] = useState('');
  const [openFilter, setOpenFilter] = useState(null);

  // ── Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalReason, setLoginModalReason] = useState('apply_job');
  const applyBtnRef = useRef(null);

  // ── Fetch data once
  useEffect(() => {
    setLoading(true);
    api.getContents('lowongan')
      .then(d => setLowongans(Array.isArray(d) ? d : []))
      .catch(() => setLowongans([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Restore job from URL ?jobId= after login redirect
  const jobIdFromUrl = searchParams.get('jobId');
  useEffect(() => {
    if (jobIdFromUrl && lowongans.length > 0) {
      const job = lowongans.find(l => String(l.id) === jobIdFromUrl);
      if (job) setSelectedJob(job);
    }
  }, [jobIdFromUrl, lowongans]);

  // ── Body scroll lock when any modal is open
  useEffect(() => {
    if (selectedJob || lightboxImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedJob, lightboxImg]);

  // ── Derived filter options
  const tipeOptions = useMemo(() => {
    const vals = lowongans.map(l => l.tipe_pekerjaan).filter(Boolean);
    return [...new Set(vals)].sort();
  }, [lowongans]);

  const lokasiOptions = useMemo(() => {
    const vals = lowongans.map(l => l.lokasi).filter(Boolean);
    return [...new Set(vals)].sort();
  }, [lowongans]);

  // ── Filtered list (same logic as MasaDepanPage)
  const filteredLowongans = useMemo(() => {
    return lowongans.filter(l => {
      const matchSearch =
        l.judul.toLowerCase().includes(search.toLowerCase()) ||
        (l.deskripsi || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.perusahaan || '').toLowerCase().includes(search.toLowerCase());
      const matchLokasi = filterLokasi ? l.lokasi === filterLokasi : true;
      const matchTipe = filterTipe ? l.tipe_pekerjaan === filterTipe : true;
      const matchMagang =
        filterMagang === 'Magang' ? l.is_magang === true :
        filterMagang === 'Profesional' ? l.is_magang === false :
        true;
      return matchSearch && matchLokasi && matchTipe && matchMagang;
    });
  }, [lowongans, search, filterLokasi, filterTipe, filterMagang]);

  const hasActiveFilters = search || filterLokasi || filterTipe || filterMagang;

  const resetFilters = () => {
    setSearch('');
    setFilterLokasi('');
    setFilterTipe('');
    setFilterMagang('');
    setOpenFilter(null);
  };

  // ── Soft-gate helpers
  const openApplyModal = (e) => {
    if (e) e.stopPropagation();
    setLoginModalReason('apply_job');
    setLoginModalOpen(true);
  };

  const openDownloadModal = (e) => {
    if (e) e.stopPropagation();
    setLoginModalReason('download_file');
    setLoginModalOpen(true);
  };

  // ── File attachment parsing helper
  const parseFiles = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black overflow-x-hidden transition-colors duration-300 font-sans">
      {/* Background ornaments */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3" />

      {/* Sticky CTA Banner */}
      <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 flex items-center justify-between gap-3 shadow-md">
        <span className="text-sm font-bold truncate">
          🔒 Login untuk Melamar &amp; Menyimpan Lowongan
        </span>
        <Link
          to="/login?returnTo=/lowongan"
          className="shrink-0 border border-white/60 text-white text-xs font-black px-4 py-1.5 rounded-xl hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Login Sekarang
        </Link>
      </div>

      {/* Page Header */}
      <div className="text-center pt-16 pb-14 relative z-10">
        <div className="inline-flex items-center justify-center gap-2 bg-white/50 dark:bg-white/5 border border-blue-200/50 dark:border-blue-900/30 px-5 py-2 rounded-full mb-5 shadow-sm backdrop-blur-sm transition-all">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Preview Lowongan</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors mb-4 uppercase">
          Cari <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Lowongan</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium transition-colors">
          Temukan Peluang Karir <span className="font-light italic">&</span> Magang
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16 relative z-10">
        <div className="w-full min-w-0 bg-white dark:bg-zinc-900 rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-zinc-800 transition-colors">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Lowongan Kerja</h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                aria-label="Reset semua filter"
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 px-4 py-2 rounded-xl transition-colors"
              >
                <FiRefreshCw size={12} /> Reset Filter
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400 text-lg" />
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari posisi, perusahaan, atau kata kunci..."
                aria-label="Cari lowongan"
                className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-slate-50 dark:bg-black/30 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 dark:text-slate-400 mr-1">
              <FiFilter size={13} /> Filter:
            </div>

            <SearchableFilter
              label="Tipe"
              allLabel="Semua Tipe"
              value={filterTipe}
              options={tipeOptions}
              isOpen={openFilter === 'tipe'}
              onToggle={() => setOpenFilter(openFilter === 'tipe' ? null : 'tipe')}
              onClose={() => setOpenFilter(null)}
              onChange={setFilterTipe}
            />

            <SearchableFilter
              label="Kategori"
              allLabel="Semua Kategori"
              value={filterMagang}
              options={['Magang', 'Profesional']}
              isOpen={openFilter === 'magang'}
              onToggle={() => setOpenFilter(openFilter === 'magang' ? null : 'magang')}
              onClose={() => setOpenFilter(null)}
              onChange={setFilterMagang}
            />

            <SearchableFilter
              label="Lokasi"
              allLabel="Semua Lokasi"
              value={filterLokasi}
              options={lokasiOptions}
              isOpen={openFilter === 'lokasi'}
              onToggle={() => setOpenFilter(openFilter === 'lokasi' ? null : 'lokasi')}
              onClose={() => setOpenFilter(null)}
              onChange={setFilterLokasi}
            />

            {/* Active filter chips */}
            {filterTipe && (
              <button
                onClick={() => setFilterTipe('')}
                title={filterTipe}
                aria-label={`Hapus filter tipe: ${filterTipe}`}
                className="flex min-w-0 max-w-full items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-bold px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <span className="max-w-[10rem] truncate">{filterTipe}</span> <FiX className="shrink-0" size={11} />
              </button>
            )}
            {filterMagang && (
              <button
                onClick={() => setFilterMagang('')}
                title={filterMagang}
                aria-label={`Hapus filter kategori: ${filterMagang}`}
                className="flex min-w-0 max-w-full items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-bold px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <span className="max-w-[10rem] truncate">{filterMagang}</span> <FiX className="shrink-0" size={11} />
              </button>
            )}
            {filterLokasi && (
              <button
                onClick={() => setFilterLokasi('')}
                title={filterLokasi}
                aria-label={`Hapus filter lokasi: ${filterLokasi}`}
                className="flex min-w-0 max-w-full items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-bold px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <span className="max-w-[10rem] truncate">{filterLokasi}</span> <FiX className="shrink-0" size={11} />
              </button>
            )}

            {/* Result counter */}
            <span className="sm:ml-auto text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-zinc-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 self-center">
              {filteredLowongans.length} lowongan
            </span>
          </div>

          {/* Job Grid — skeleton | results | empty state */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[200px]">

            {/* Loading skeletons */}
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="job" />
            ))}

            {/* Empty state */}
            {!loading && filteredLowongans.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold">
                  {lowongans.length === 0
                    ? 'Belum ada lowongan yang tersedia.'
                    : 'Tidak ada lowongan yang sesuai dengan filter.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Reset semua filter
                  </button>
                )}
              </div>
            )}

            {/* Job cards */}
            {!loading && filteredLowongans.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="group min-w-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[24px] p-5 sm:p-6 flex flex-col hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                role="article"
                aria-label={`Lowongan: ${job.judul} di ${job.perusahaan || 'Mitra Bika'}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-black border border-slate-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform overflow-hidden shrink-0">
                    {job.gambar ? <img src={job.gambar} alt={`Logo ${job.perusahaan || 'Mitra Bika'}`} className="w-full h-full object-cover" /> : '💼'}
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <h4 className="font-black text-[16px] text-slate-900 dark:text-white leading-tight mb-1 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 break-words">
                      {job.judul}
                    </h4>
                    <p className="text-[13px] font-bold text-blue-600 dark:text-blue-400 transition-colors mb-1 truncate">
                      {job.perusahaan || 'Mitra Bika'}
                    </p>
                  </div>
                </div>

                <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 transition-colors line-clamp-3 mb-5 leading-relaxed break-words">
                  {job.deskripsi || 'Tidak ada spesifikasi deskripsi detail yang dilampirkan.'}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-6 min-w-0">
                  <span className="flex min-w-0 max-w-full items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700">
                    <FiMapPin className="shrink-0" />
                    <span className="max-w-[12rem] block truncate">
                      {job.lokasi || 'Nasional / Remote'}{job.detail_lokasi ? ` - ${job.detail_lokasi}` : ''}
                    </span>
                  </span>
                  <span className={`flex min-w-0 max-w-full items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border ${job.is_magang ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-900/50' : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-900/50'}`}>
                    <FiBriefcase className="shrink-0" />
                    <span className="max-w-[10rem] block truncate">
                      {job.is_magang ? 'Magang' : (job.tipe_pekerjaan || 'Profesional')}
                    </span>
                  </span>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                    <FiClock className="text-slate-300 dark:text-zinc-600" /> Aktif
                  </span>
                  {/* "Apply Now" on card — soft gate */}
                  <button
                    ref={applyBtnRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openApplyModal(e);
                    }}
                    aria-label={`Lamar lowongan ${job.judul}`}
                    className="shrink-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors shadow-sm cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedJob(null); }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Sticky modal header */}
            <div className="sticky top-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center z-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Detail Lowongan</h3>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                aria-label="Tutup detail lowongan"
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-8">
              {/* Large job image (lightbox trigger) */}
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
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                      <FiZoomIn size={14} /> Klik untuk perbesar
                    </div>
                  </div>
                </div>
              )}

              {/* Job header info */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 bg-slate-50 dark:bg-black border border-slate-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-3xl shadow-sm overflow-hidden shrink-0">
                  {selectedJob.gambar
                    ? <img src={selectedJob.gambar} alt="logo" className="w-full h-full object-cover" />
                    : '💼'}
                </div>
                <div className="flex-1 pt-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                    {selectedJob.judul}
                  </h2>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400 mb-3">
                    {selectedJob.perusahaan || 'Mitra Bika'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700">
                      <FiMapPin />
                      <span className="max-w-[18rem] block truncate">{selectedJob.lokasi || 'Nasional / Remote'}</span>
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${selectedJob.is_magang ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-900/50' : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-900/50'}`}>
                      <FiBriefcase /> {selectedJob.is_magang ? 'Magang' : (selectedJob.tipe_pekerjaan || 'Profesional')}
                    </span>
                  </div>
                  {selectedJob.detail_lokasi && (
                    <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <strong>Detail Lokasi:</strong> {selectedJob.detail_lokasi}
                    </div>
                  )}
                </div>
              </div>

              {/* Job description */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Deskripsi Pekerjaan
                </h4>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.deskripsi || 'Tidak ada spesifikasi deskripsi detail yang dilampirkan.'}
                </div>

                {/* File attachments — soft-gate download */}
                {selectedJob.file_tambahan && parseFiles(selectedJob.file_tambahan).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                      File Lampiran
                    </h4>
                    <div className="flex flex-col gap-3">
                      {parseFiles(selectedJob.file_tambahan).map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-zinc-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                              <FiFileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{file.name}</p>
                              <p className="text-[10px] font-medium text-slate-400 uppercase">{file.type?.split('/')[1] || 'File'}</p>
                            </div>
                          </div>
                          {/* Soft-gate download button */}
                          <button
                            type="button"
                            onClick={openDownloadModal}
                            aria-label={`Unduh ${file.name} (login diperlukan)`}
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

              {/* Apply button — soft gate (replaces "Apply Sekarang") */}
              <button
                ref={applyBtnRef}
                type="button"
                onClick={openApplyModal}
                aria-label="Lamar lowongan ini (login diperlukan)"
                className="w-full bg-blue-600 text-white text-sm font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-center cursor-pointer border-none"
              >
                Apply Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            aria-label="Tutup gambar"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border-none cursor-pointer z-10"
          >
            <FiX size={20} />
          </button>
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

      {/* Login Prompt Modal (soft gate) */}
      <LoginPromptModal
        reason={loginModalReason}
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        returnTo="/lowongan"
        jobId={String(selectedJob?.id ?? '')}
        triggerRef={applyBtnRef}
      />
    </div>
  );
}
