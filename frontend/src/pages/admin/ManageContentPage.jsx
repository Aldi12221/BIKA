import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit3, FiX, FiSave, FiSearch, FiExternalLink } from 'react-icons/fi';
import api from '../../utils/api';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ManageContentPage({ kategoriProp }) {
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: kategoriProp, link_eksternal: '', gambar: '', perusahaan: '', lokasi: '', tipe_pekerjaan: 'Full-Time', isi_konten: '' });
  const [search, setSearch] = useState('');

  const load = () => {
    api.getContents(kategoriProp).then(d => Array.isArray(d) && setContents(d)).catch(() => { });
  };

  useEffect(() => { 
    load(); 
    setForm(prev => ({ ...prev, kategori: kategoriProp }));
  }, [kategoriProp]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  const openAdd = () => { 
    setEditItem(null); 
    setForm({ judul: '', deskripsi: '', kategori: kategoriProp, link_eksternal: '', gambar: '', perusahaan: '', lokasi: '', tipe_pekerjaan: 'Full-Time', isi_konten: '' }); 
    setShowModal(true); 
  };

  const openEdit = (item) => { 
    setEditItem(item); 
    setForm({ 
      judul: item.judul, 
      deskripsi: item.deskripsi || '', 
      kategori: kategoriProp, 
      link_eksternal: item.link_eksternal || '', 
      gambar: item.gambar || '', 
      perusahaan: item.perusahaan || '', 
      lokasi: item.lokasi || '', 
      tipe_pekerjaan: item.tipe_pekerjaan || 'Full-Time',
      isi_konten: item.isi_konten || ''
    }); 
    setShowModal(true); 
  };

  const handleSave = async () => {
    if (editItem) { await api.updateContent(editItem.id, form); }
    else { await api.createContent(form); }
    setShowModal(false); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus konten ini?')) return;
    await api.deleteContent(id, kategoriProp); load();
  };

  const filtered = contents.filter(c => c.judul.toLowerCase().includes(search.toLowerCase()));

  const getTitle = () => {
    switch (kategoriProp) {
      case 'lowongan': return 'Kelola Lowongan';
      case 'tutorial': return 'Tips Wawancara';
      case 'usaha': return 'Tips Memulai Usaha';
      case 'keuangan': return 'Tips Keuangan';
      default: return 'Kelola Konten';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1 uppercase tracking-tight">{getTitle()}</h1>
          <p className="text-text-secondary text-sm">Manajemen data untuk kategori <span className="font-bold text-primary">{kategoriProp}</span></p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-primary/20">
          <FiPlus /> Tambah Data
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder={`Cari di ${getTitle()}...`} value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all shadow-sm" />
      </div>

      <div className="glass rounded-2xl overflow-hidden shadow-xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-card/50 border-b border-border">
                <th className="p-4 text-xs text-text-muted font-bold uppercase tracking-wider">Judul / Detail</th>
                <th className="p-4 text-xs text-text-muted font-bold uppercase tracking-wider hidden md:table-cell">Deskripsi</th>
                <th className="p-4 text-xs text-text-muted font-bold uppercase tracking-wider hidden sm:table-cell">Link / Media</th>
                <th className="p-4 text-xs text-text-muted font-bold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.length === 0 ? (
                <tr><td colSpan="4" className="p-12 text-center text-text-muted text-sm italic">Belum ada data tersedia di kategori ini.</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-bg-card/30 transition-colors group">
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
                      <a href={item.link_eksternal} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary/80 hover:text-primary hover:underline">
                        <FiExternalLink size={12} /> Buka Link
                      </a>
                    ) : (
                      <span className="text-[10px] bg-bg-surface px-2 py-1 rounded-md">Internal Content</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all bg-transparent border-none cursor-pointer"><FiEdit3 size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
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
                        const base64 = await readFileAsDataUrl(file);
                        setForm({ ...form, gambar: base64 });
                      }
                    }} className="hidden" />
                  </label>
                  {form.gambar && <button onClick={() => setForm({...form, gambar: ''})} className="mt-2 text-[10px] text-danger font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer">Hapus Gambar</button>}
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
                    <textarea value={form.isi_konten} onChange={e => setForm({ ...form, isi_konten: e.target.value })} placeholder="Tulis konten lengkap artikel di sini (mendukung spasi dan paragraf)..."
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
