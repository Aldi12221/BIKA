import { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiTrash2, FiEdit3, FiX, FiSave, FiSearch, FiExternalLink, FiCheckSquare, FiSquare, FiAlertTriangle, FiBriefcase, FiBookOpen, FiActivity, FiDollarSign, FiFilter, FiRefreshCw, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const KATEGORI_TABS = [
  { key: 'lowongan', label: 'Lowongan',       icon: FiBriefcase,  path: '/admin/lowongan' },
  { key: 'tutorial', label: 'Tips Wawancara', icon: FiBookOpen,   path: '/admin/tutorial' },
  { key: 'usaha',    label: 'Tips Usaha',     icon: FiActivity,   path: '/admin/usaha'    },
  { key: 'keuangan', label: 'Tips Keuangan',  icon: FiDollarSign, path: '/admin/keuangan' },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Max image size: 2MB (base64 inflates ~33%, so 2MB → ~2.7MB payload, safe under 10MB backend limit)
const MAX_IMAGE_MB = 2;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

async function validateAndReadImage(file) {
  if (file.size > MAX_IMAGE_BYTES) {
    toast.error(
      `Ukuran gambar terlalu besar! Maksimal ${MAX_IMAGE_MB}MB, file kamu ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
      { duration: 5000 }
    );
    return null;
  }
  return readFileAsDataUrl(file);
}

function confirmToast(message, onConfirm) {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-white">{message}</p>
      <div className="flex gap-2">
        <button onClick={() => { toast.dismiss(t.id); onConfirm(); }}
          className="flex-1 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors border-none cursor-pointer">
          Hapus
        </button>
        <button onClick={() => toast.dismiss(t.id)}
          className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border-none cursor-pointer">
          Batal
        </button>
      </div>
    </div>
  ), {
    duration: 8000,
    style: { background: '#1C1F3A', border: '1px solid rgba(255,82,82,0.3)',         borderRadius: '16px', padding: '16px' },
  });
}

export default function ManageContentPage({ kategoriProp }) {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: kategoriProp, link_eksternal: '', gambar: '', perusahaan: '', lokasi: '', tipe_pekerjaan: 'Full-Time', isi_konten: '' });
  const [search, setSearch] = useState('');

  // Per-category filters
  // Lowongan
  const [filterLokasi, setFilterLokasi] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [filterPerusahaan, setFilterPerusahaan] = useState('');
  // Tutorial / Usaha / Keuangan
  const [filterMedia, setFilterMedia] = useState(''); // 'dengan_gambar' | 'tanpa_gambar' | ''
  const [filterLink, setFilterLink] = useState('');   // 'dengan_link' | 'tanpa_link' | ''

  // Batch delete state
  const [selected, setSelected] = useState(new Set());
  const [batchMode, setBatchMode] = useState(false);

  const load = () => {
    api.getContents(kategoriProp).then(d => Array.isArray(d) && setContents(d)).catch(() => {});
  };

  useEffect(() => {
    load();
    setForm(prev => ({ ...prev, kategori: kategoriProp }));
    setSelected(new Set());
    setBatchMode(false);
    // Reset all filters on category change
    setSearch('');
    setFilterLokasi(''); setFilterTipe(''); setFilterPerusahaan('');
    setFilterMedia(''); setFilterLink('');
  }, [kategoriProp]);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  // ── Derive unique filter options from data ──
  const lokasiOptions = useMemo(() => [...new Set(contents.map(c => c.lokasi).filter(Boolean))].sort(), [contents]);
  const tipeOptions   = useMemo(() => [...new Set(contents.map(c => c.tipe_pekerjaan).filter(Boolean))].sort(), [contents]);
  const perusahaanOptions = useMemo(() => [...new Set(contents.map(c => c.perusahaan).filter(Boolean))].sort(), [contents]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    return contents.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.judul.toLowerCase().includes(q) ||
        (c.deskripsi || '').toLowerCase().includes(q) ||
        (c.perusahaan || '').toLowerCase().includes(q);

      if (kategoriProp === 'lowongan') {
        const matchLokasi     = filterLokasi     ? c.lokasi         === filterLokasi     : true;
        const matchTipe       = filterTipe       ? c.tipe_pekerjaan === filterTipe       : true;
        const matchPerusahaan = filterPerusahaan ? c.perusahaan     === filterPerusahaan : true;
        return matchSearch && matchLokasi && matchTipe && matchPerusahaan;
      } else {
        const matchMedia = filterMedia === 'dengan_gambar' ? !!c.gambar
                         : filterMedia === 'tanpa_gambar'  ? !c.gambar
                         : true;
        const matchLink  = filterLink  === 'dengan_link'   ? !!c.link_eksternal
                         : filterLink  === 'tanpa_link'    ? !c.link_eksternal
                         : true;
        return matchSearch && matchMedia && matchLink;
      }
    });
  }, [contents, search, filterLokasi, filterTipe, filterPerusahaan, filterMedia, filterLink, kategoriProp]);

  const hasActiveFilters = search || filterLokasi || filterTipe || filterPerusahaan || filterMedia || filterLink;

  const resetFilters = () => {
    setSearch('');
    setFilterLokasi(''); setFilterTipe(''); setFilterPerusahaan('');
    setFilterMedia(''); setFilterLink('');
  };

  // ── Selection helpers ──
  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(c => c.id)));
    }
  };

  const exitBatchMode = () => {
    setBatchMode(false);
    setSelected(new Set());
  };

  // ── Batch delete ──
  const handleBatchDelete = () => {
    if (selected.size === 0) return;
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FiAlertTriangle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm font-semibold text-white">
            Hapus <span className="text-red-400">{selected.size} item</span> sekaligus?
          </p>
        </div>
        <p className="text-xs text-white/50">Tindakan ini tidak bisa dibatalkan.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const ids = [...selected];
              const toastId = toast.loading(`Menghapus ${ids.length} item...`);
              try {
                await Promise.all(ids.map(id => api.deleteContent(id, kategoriProp)));
                toast.success(`${ids.length} item berhasil dihapus!`, { id: toastId });
                exitBatchMode();
                load();
              } catch {
                toast.error('Sebagian item gagal dihapus.', { id: toastId });
                load();
              }
            }}
            className="flex-1 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors border-none cursor-pointer"
          >
            Hapus Semua
          </button>
          <button onClick={() => toast.dismiss(t.id)}
            className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border-none cursor-pointer">
            Batal
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      style: { background: '#1C1F3A', border: '1px solid rgba(255,82,82,0.4)', borderRadius: '16px', padding: '16px' },
    });
  };

  // ── Single CRUD ──
  const openAdd = () => {
    setEditItem(null);
    setForm({ judul: '', deskripsi: '', kategori: kategoriProp, link_eksternal: '', gambar: '', perusahaan: '', lokasi: '', tipe_pekerjaan: 'Full-Time', isi_konten: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ judul: item.judul, deskripsi: item.deskripsi || '', kategori: kategoriProp, link_eksternal: item.link_eksternal || '', gambar: item.gambar || '', perusahaan: item.perusahaan || '', lokasi: item.lokasi || '', tipe_pekerjaan: item.tipe_pekerjaan || 'Full-Time', isi_konten: item.isi_konten || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.judul?.trim()) { toast.error('Judul tidak boleh kosong!'); return; }
    if (kategoriProp === 'lowongan') {
      if (!form.perusahaan?.trim()) { toast.error('Nama perusahaan tidak boleh kosong!'); return; }
      if (!form.lokasi?.trim()) { toast.error('Lokasi tidak boleh kosong!'); return; }
    } else {
      if (!form.isi_konten?.trim()) { toast.error('Isi konten tidak boleh kosong!'); return; }
    }
    const savePromise = editItem ? api.updateContent(editItem.id, form) : api.createContent(form);
    await toast.promise(savePromise, {
      loading: editItem ? 'Menyimpan perubahan...' : 'Menambahkan data...',
      success: editItem ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!',
      error: 'Gagal menyimpan data.',
    });
    setShowModal(false);
    load();
  };

  const handleDelete = (id) => {
    confirmToast('Hapus konten ini? Tindakan tidak bisa dibatalkan.', async () => {
      await toast.promise(api.deleteContent(id, kategoriProp), {
        loading: 'Menghapus...', success: 'Konten berhasil dihapus!', error: 'Gagal menghapus konten.',
      });
      load();
    });
  };

  const getTitle = () => {
    switch (kategoriProp) {
      case 'lowongan': return 'Kelola Lowongan';
      case 'tutorial': return 'Tips Wawancara';
      case 'usaha': return 'Tips Memulai Usaha';
      case 'keuangan': return 'Tips Keuangan';
      default: return 'Kelola Konten';
    }
  };

  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className="space-y-6">
      {/* Category Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-bg-card rounded-2xl border border-border overflow-x-auto">
        {KATEGORI_TABS.map(tab => {
          const Icon = tab.icon;
          const active = tab.key === kategoriProp;
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-none cursor-pointer flex-1 justify-center
                ${active
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-surface'
                }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1 uppercase tracking-tight">{getTitle()}</h1>
          <p className="text-text-secondary text-sm">Manajemen data untuk kategori <span className="font-bold text-primary">{kategoriProp}</span></p>
        </div>
        <div className="flex items-center gap-2">
          {batchMode ? (
            <>
              <button
                onClick={exitBatchMode}
                className="text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-primary hover:border-border-light transition-all bg-transparent cursor-pointer"
              >
                <FiX size={14} /> Batal
              </button>
              <button
                onClick={handleBatchDelete}
                disabled={selected.size === 0}
                className="text-sm flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <FiTrash2 size={14} />
                Hapus {selected.size > 0 ? `(${selected.size})` : 'Terpilih'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setBatchMode(true)}
                className="text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-primary hover:border-border-light transition-all bg-transparent cursor-pointer"
              >
                <FiCheckSquare size={14} /> Pilih
              </button>
              <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-primary/20">
                <FiPlus /> Tambah Data
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder={`Cari di ${getTitle()}...`} value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all shadow-sm" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-bg-card/50 rounded-2xl border border-border">
        <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted mr-1">
          <FiFilter size={12} /> Filter:
        </div>

        {kategoriProp === 'lowongan' ? (
          <>
            {/* Tipe Pekerjaan */}
            <div className="relative">
              <select value={filterTipe} onChange={e => setFilterTipe(e.target.value)}
                className={`appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none
                  ${filterTipe ? 'bg-primary text-white border-primary' : 'bg-bg-input text-text-secondary border-border hover:border-primary/50'}`}>
                <option value="">Semua Tipe</option>
                {tipeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <FiChevronDown size={10} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${filterTipe ? 'text-white' : 'text-text-muted'}`} />
            </div>

            {/* Lokasi */}
            <div className="relative">
              <select value={filterLokasi} onChange={e => setFilterLokasi(e.target.value)}
                className={`appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none
                  ${filterLokasi ? 'bg-primary text-white border-primary' : 'bg-bg-input text-text-secondary border-border hover:border-primary/50'}`}>
                <option value="">Semua Lokasi</option>
                {lokasiOptions.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <FiChevronDown size={10} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${filterLokasi ? 'text-white' : 'text-text-muted'}`} />
            </div>

            {/* Perusahaan */}
            <div className="relative">
              <select value={filterPerusahaan} onChange={e => setFilterPerusahaan(e.target.value)}
                className={`appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none
                  ${filterPerusahaan ? 'bg-primary text-white border-primary' : 'bg-bg-input text-text-secondary border-border hover:border-primary/50'}`}>
                <option value="">Semua Perusahaan</option>
                {perusahaanOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <FiChevronDown size={10} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${filterPerusahaan ? 'text-white' : 'text-text-muted'}`} />
            </div>
          </>
        ) : (
          <>
            {/* Gambar */}
            <div className="relative">
              <select value={filterMedia} onChange={e => setFilterMedia(e.target.value)}
                className={`appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none
                  ${filterMedia ? 'bg-primary text-white border-primary' : 'bg-bg-input text-text-secondary border-border hover:border-primary/50'}`}>
                <option value="">Semua Gambar</option>
                <option value="dengan_gambar">Ada Gambar</option>
                <option value="tanpa_gambar">Tanpa Gambar</option>
              </select>
              <FiChevronDown size={10} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${filterMedia ? 'text-white' : 'text-text-muted'}`} />
            </div>

            {/* Link Eksternal */}
            <div className="relative">
              <select value={filterLink} onChange={e => setFilterLink(e.target.value)}
                className={`appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none
                  ${filterLink ? 'bg-primary text-white border-primary' : 'bg-bg-input text-text-secondary border-border hover:border-primary/50'}`}>
                <option value="">Semua Link</option>
                <option value="dengan_link">Ada Link</option>
                <option value="tanpa_link">Tanpa Link</option>
              </select>
              <FiChevronDown size={10} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${filterLink ? 'text-white' : 'text-text-muted'}`} />
            </div>
          </>
        )}

        {/* Active chips */}
        {filterTipe && (
          <button onClick={() => setFilterTipe('')} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors border-none cursor-pointer">
            {filterTipe} <FiX size={10} />
          </button>
        )}
        {filterLokasi && (
          <button onClick={() => setFilterLokasi('')} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors border-none cursor-pointer">
            {filterLokasi} <FiX size={10} />
          </button>
        )}
        {filterPerusahaan && (
          <button onClick={() => setFilterPerusahaan('')} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors border-none cursor-pointer">
            {filterPerusahaan} <FiX size={10} />
          </button>
        )}
        {filterMedia && (
          <button onClick={() => setFilterMedia('')} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors border-none cursor-pointer">
            {filterMedia === 'dengan_gambar' ? 'Ada Gambar' : 'Tanpa Gambar'} <FiX size={10} />
          </button>
        )}
        {filterLink && (
          <button onClick={() => setFilterLink('')} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors border-none cursor-pointer">
            {filterLink === 'dengan_link' ? 'Ada Link' : 'Tanpa Link'} <FiX size={10} />
          </button>
        )}

        {/* Result count + reset */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted bg-bg-surface px-2.5 py-1.5 rounded-lg border border-border">
            {filtered.length} / {contents.length}
          </span>
          {hasActiveFilters && (
            <button onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-bold text-danger hover:text-red-400 bg-danger/10 border border-danger/20 px-2.5 py-1.5 rounded-lg transition-colors border-none cursor-pointer">
              <FiRefreshCw size={10} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Batch info bar */}
      {batchMode && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
          <button onClick={toggleSelectAll} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer">
            {allSelected
              ? <FiCheckSquare size={16} className="text-primary" />
              : someSelected
                ? <FiCheckSquare size={16} className="text-primary/50" />
                : <FiSquare size={16} />
            }
            <span className="font-medium">Pilih Semua</span>
          </button>
          <span className="text-text-muted">·</span>
          <span className="text-text-muted">{selected.size} dari {filtered.length} dipilih</span>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden shadow-xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-card/50 border-b border-border">
                {batchMode && <th className="p-4 w-10" />}
                <th className="p-4 text-xs text-text-muted font-bold uppercase tracking-wider">Judul / Detail</th>
                <th className="p-4 text-xs text-text-muted font-bold uppercase tracking-wider hidden md:table-cell">Deskripsi</th>
                <th className="p-4 text-xs text-text-muted font-bold uppercase tracking-wider hidden sm:table-cell">Link / Media</th>
                <th className="p-4 text-xs text-text-muted font-bold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={batchMode ? 5 : 4} className="p-12 text-center text-text-muted text-sm italic">
                    Belum ada data tersedia di kategori ini.
                  </td>
                </tr>
              ) : filtered.map(item => {
                const isSelected = selected.has(item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={batchMode ? () => toggleSelect(item.id) : undefined}
                    className={`transition-colors group ${batchMode ? 'cursor-pointer' : ''} ${isSelected ? 'bg-primary/5' : 'hover:bg-bg-card/30'}`}
                  >
                    {batchMode && (
                      <td className="p-4 w-10">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                          {isSelected && <FiCheckSquare size={12} className="text-white" />}
                        </div>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.gambar && <img src={item.gambar} className="w-10 h-10 rounded-lg object-cover shadow-sm" alt="" />}
                        <div>
                          <p className="text-sm text-text-primary font-bold group-hover:text-primary transition-colors">{item.judul}</p>
                          {item.perusahaan && <p className="text-[10px] text-text-muted font-medium uppercase mt-0.5">{item.perusahaan} · {item.lokasi}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-secondary max-w-[250px] truncate hidden md:table-cell">{item.deskripsi}</td>
                    <td className="p-4 text-sm text-text-muted hidden sm:table-cell">
                      {item.link_eksternal ? (
                        <a href={item.link_eksternal} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-primary/80 hover:text-primary hover:underline">
                          <FiExternalLink size={12} /> Buka Link
                        </a>
                      ) : (
                        <span className="text-[10px] bg-bg-surface px-2 py-1 rounded-md">Internal Content</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!batchMode && (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all bg-transparent border-none cursor-pointer"><FiEdit3 size={16} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"><FiTrash2 size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="glass-strong rounded-[28px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-text-primary">{editItem ? 'Edit Data' : 'Tambah Data Baru'}</h2>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">{kategoriProp}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-bg-card text-text-muted hover:text-text-primary hover:rotate-90 transition-all flex items-center justify-center border-none cursor-pointer"><FiX size={20} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Judul</label>
                  <input value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} placeholder="Masukkan judul..."
                    className="w-full px-5 py-3 rounded-2xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Deskripsi Singkat</label>
                  <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={3} placeholder="Tampilkan sebagai snippet di card..."
                    className="w-full px-5 py-3 rounded-2xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Link Eksternal (Opsional)</label>
                  <input value={form.link_eksternal} onChange={e => setForm({ ...form, link_eksternal: e.target.value })} placeholder="https://..."
                    className="w-full px-5 py-3 rounded-2xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Gambar Cover</label>
                  <label className="flex flex-col items-center justify-center gap-3 w-full p-6 rounded-2xl bg-bg-input border-2 border-dashed border-border text-text-muted hover:border-primary/50 transition-all cursor-pointer hover:bg-primary/5 group">
                    {form.gambar ? (
                      <img src={form.gambar} className="w-full h-32 object-cover rounded-xl shadow-md" alt="" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><FiPlus size={24} /></div>
                        <span className="text-[11px] font-bold">Pilih File Gambar</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await validateAndReadImage(file);
                        if (base64) setForm({ ...form, gambar: base64 });
                        // reset input so same file can be re-selected after rejection
                        e.target.value = '';
                      }
                    }} className="hidden" />
                  </label>
                  {form.gambar && <button onClick={() => setForm({ ...form, gambar: '' })} className="mt-2 text-[10px] text-danger font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer">Hapus Gambar</button>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {kategoriProp === 'lowongan' ? (
                  <div className="bg-bg-card/30 p-5 rounded-2xl border border-border space-y-5">
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Detail Pekerjaan
                    </h3>
                    <div>
                      <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Nama Perusahaan</label>
                      <input value={form.perusahaan} onChange={e => setForm({ ...form, perusahaan: e.target.value })} placeholder="Misal: Google Inc"
                        className="w-full px-5 py-3 rounded-2xl bg-bg-input border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Lokasi</label>
                      <input value={form.lokasi} onChange={e => setForm({ ...form, lokasi: e.target.value })} placeholder="Misal: Jakarta / Remote"
                        className="w-full px-5 py-3 rounded-2xl bg-bg-input border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Tipe</label>
                      <select value={form.tipe_pekerjaan} onChange={e => setForm({ ...form, tipe_pekerjaan: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl bg-bg-input border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-all">
                        {['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Magang'].map(t => <option key={t} value={t} className="bg-bg-surface">{t}</option>)}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Isi Konten / Artikel Lengkap</label>
                    <textarea value={form.isi_konten} onChange={e => setForm({ ...form, isi_konten: e.target.value })} placeholder="Tulis konten lengkap artikel di sini..."
                      className="w-full flex-1 px-5 py-3 rounded-2xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none shadow-sm min-h-[300px]" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <button onClick={handleSave} className="btn-primary px-10 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-xl shadow-primary/30 active:scale-95 transition-all">
                <FiSave size={18} /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
