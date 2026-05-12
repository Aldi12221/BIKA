import { useState, useEffect } from 'react';
import { FiTrash2, FiSearch, FiRefreshCcw, FiCheckSquare, FiSquare, FiX, FiAlertTriangle } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';

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
    style: { background: '#1C1F3A', border: '1px solid rgba(255,82,82,0.3)', borderRadius: '16px', padding: '16px' },
  });
}

export default function ManageUserPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Batch delete state
  const [selected, setSelected] = useState(new Set());
  const [batchMode, setBatchMode] = useState(false);

  const load = () => {
    setLoading(true);
    api.adminUsers().then(d => {
      if (Array.isArray(d)) setUsers(d);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(c =>
    (c.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

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
      setSelected(new Set(filtered.map(u => u.id)));
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
            Hapus <span className="text-red-400">{selected.size} user</span> sekaligus?
          </p>
        </div>
        <p className="text-xs text-white/50">Tindakan ini tidak bisa dibatalkan.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const ids = [...selected];
              const toastId = toast.loading(`Menghapus ${ids.length} user...`);
              try {
                await Promise.all(ids.map(id => api.deleteAdminUser(id)));
                toast.success(`${ids.length} user berhasil dihapus!`, { id: toastId });
                exitBatchMode();
                load();
              } catch {
                toast.error('Sebagian user gagal dihapus.', { id: toastId });
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

  const handleDelete = (id) => {
    confirmToast('Hapus user ini? Tindakan tidak bisa dibatalkan.', async () => {
      await toast.promise(api.deleteAdminUser(id), {
        loading: 'Menghapus user...', success: 'User berhasil dihapus!', error: 'Gagal menghapus user.',
      });
      load();
    });
  };

  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Kelola User</h1>
          <p className="text-text-secondary text-sm">Lihat daftar pengguna dan hapus jika diperlukan</p>
        </div>
        <div className="flex items-center gap-2">
          {batchMode ? (
            <>
              <button onClick={exitBatchMode}
                className="text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-primary hover:border-border-light transition-all bg-transparent cursor-pointer">
                <FiX size={14} /> Batal
              </button>
              <button onClick={handleBatchDelete} disabled={selected.size === 0}
                className="text-sm flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                <FiTrash2 size={14} />
                Hapus {selected.size > 0 ? `(${selected.size})` : 'Terpilih'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setBatchMode(true)}
                className="text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-muted hover:text-text-primary hover:border-border-light transition-all bg-transparent cursor-pointer">
                <FiCheckSquare size={14} /> Pilih
              </button>
              <button onClick={load} className="btn-primary text-sm flex items-center gap-2">
                <FiRefreshCcw className={loading ? 'animate-spin' : ''} /> Refresh Data
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder="Cari nama atau email pengguna..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
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
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {batchMode && <th className="p-4 w-10" />}
              <th className="text-left p-4 text-xs text-text-muted font-medium uppercase min-w-[250px]">Nama</th>
              <th className="text-left p-4 text-xs text-text-muted font-medium uppercase hidden md:table-cell">Email</th>
              <th className="text-left p-4 text-xs text-text-muted font-medium uppercase hidden sm:table-cell">CV</th>
              <th className="text-right p-4 text-xs text-text-muted font-medium uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={batchMode ? 5 : 4} className="p-8 text-center text-text-muted text-sm">
                  {loading ? 'Memuat data...' : 'Tidak ada pengguna.'}
                </td>
              </tr>
            ) : filtered.map(item => {
              const isSelected = selected.has(item.id);
              return (
                <tr
                  key={item.id}
                  onClick={batchMode ? () => toggleSelect(item.id) : undefined}
                  className={`border-b border-border/50 transition-colors ${batchMode ? 'cursor-pointer' : ''} ${isSelected ? 'bg-primary/5' : 'hover:bg-bg-card/50'}`}
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
                      <img src={item.foto || 'https://via.placeholder.com/40'} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-sm text-text-primary font-medium">{item.nama}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-secondary truncate max-w-[200px] hidden md:table-cell">{item.email}</td>
                  <td className="p-4 text-sm text-text-muted truncate max-w-[150px] hidden sm:table-cell">
                    {item.cv_path ? (
                      <a href={item.cv_path} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-blue-500 hover:underline">Lihat CV</a>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-right">
                    {!batchMode && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer">
                          <FiTrash2 size={16} />
                        </button>
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
  );
}
