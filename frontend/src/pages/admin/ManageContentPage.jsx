import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit3, FiX, FiSave, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';

export default function ManageContentPage() {
  const [contents, setContents] = useState([]);
  const [kategori, setKategori] = useState('lowongan');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: 'lowongan', link_eksternal: '' });
  const [search, setSearch] = useState('');

  const load = () => {
    api.getContents(kategori).then(d => Array.isArray(d) && setContents(d)).catch(() => {});
  };

  useEffect(() => { load(); }, [kategori]);

  const openAdd = () => { setEditItem(null); setForm({ judul: '', deskripsi: '', kategori, link_eksternal: '' }); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ judul: item.judul, deskripsi: item.deskripsi || '', kategori: item.kategori, link_eksternal: item.link_eksternal || '' }); setShowModal(true); };

  const handleSave = async () => {
    if (editItem) { await api.updateContent(editItem.id, form); }
    else { await api.createContent(form); }
    setShowModal(false); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus konten ini?')) return;
    await api.deleteContent(id); load();
  };

  const filtered = contents.filter(c => c.judul.toLowerCase().includes(search.toLowerCase()));
  const cats = ['lowongan', 'tutorial', 'usaha'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Kelola Konten</h1>
          <p className="text-text-secondary text-sm">Tambah, edit, dan hapus konten untuk pengguna</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2"><FiPlus /> Tambah Konten</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setKategori(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer border-none ${kategori === c ? 'gradient-primary text-white' : 'bg-bg-card text-text-secondary hover:bg-bg-card-hover'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder="Cari konten..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-xs text-text-muted font-medium uppercase">Judul</th>
              <th className="text-left p-4 text-xs text-text-muted font-medium uppercase hidden md:table-cell">Deskripsi</th>
              <th className="text-left p-4 text-xs text-text-muted font-medium uppercase hidden sm:table-cell">Link</th>
              <th className="text-right p-4 text-xs text-text-muted font-medium uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-text-muted text-sm">Belum ada konten</td></tr>
            ) : filtered.map(item => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-bg-card/50 transition-colors">
                <td className="p-4 text-sm text-text-primary font-medium">{item.judul}</td>
                <td className="p-4 text-sm text-text-secondary truncate max-w-[200px] hidden md:table-cell">{item.deskripsi}</td>
                <td className="p-4 text-sm text-text-muted truncate max-w-[150px] hidden sm:table-cell">{item.link_eksternal || '-'}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all bg-transparent border-none cursor-pointer"><FiEdit3 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">{editItem ? 'Edit Konten' : 'Tambah Konten'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-all bg-transparent border-none cursor-pointer"><FiX /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Judul</label>
                <input value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} placeholder="Judul konten"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} rows={3} placeholder="Deskripsi konten"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none" />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Kategori</label>
                <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-all">
                  {cats.map(c => <option key={c} value={c} className="bg-bg-surface">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Link Eksternal</label>
                <input value={form.link_eksternal} onChange={e => setForm({...form, link_eksternal: e.target.value})} placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              <button onClick={handleSave} className="w-full btn-primary flex items-center justify-center gap-2 text-sm"><FiSave /> Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
