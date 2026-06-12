import { useState, useEffect } from 'react';
import {
  FiTrash2, FiSearch, FiRefreshCcw, FiEdit2, FiPlus,
  FiX, FiAlertTriangle, FiEye, FiEyeOff, FiShield, FiUser
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
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

const emptyForm = { username: '', nama: '', role: 'admin', password: '' };

export default function ManageAdminPage() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const load = () => {
    setLoading(true);
    api.getAdmins().then(d => {
      if (Array.isArray(d)) setAdmins(d);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = admins.filter(a =>
    (a.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.username || '').toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowPw(false);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({ username: item.username, nama: item.nama, role: item.role, password: '' });
    setShowPw(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.username.trim() || !form.nama.trim()) {
      return toast.error('Username dan Nama wajib diisi');
    }
    if (!editId && !form.password.trim()) {
      return toast.error('Password wajib diisi untuk admin baru');
    }

    setSaving(true);
    try {
      if (editId) {
        const payload = { username: form.username, nama: form.nama, role: form.role };
        if (form.password.trim()) payload.password = form.password;
        const res = await api.updateAdminUser(editId, payload);
        if (res.error || res.message?.includes('sudah digunakan')) {
          toast.error(res.message || res.error);
        } else {
          toast.success('Admin berhasil diupdate!');
          closeModal();
          load();
        }
      } else {
        const res = await api.adminRegister({
          username: form.username, nama: form.nama, role: form.role, password: form.password
        });
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success('Admin baru berhasil dibuat!');
          closeModal();
          load();
        }
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item) => {
    if (item.id === currentAdmin?.id) {
      return toast.error('Tidak bisa menghapus akun sendiri');
    }
    confirmToast(`Hapus admin "${item.nama}"? Tindakan ini tidak bisa dibatalkan.`, async () => {
      await toast.promise(api.deleteAdminAccount(item.id), {
        loading: 'Menghapus admin...', success: 'Admin berhasil dihapus!', error: 'Gagal menghapus admin.',
      });
      load();
    });
  };

  const roleBadge = (role) => {
    const isSuperadmin = role === 'superadmin';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
        background: isSuperadmin ? 'rgba(108,99,255,0.15)' : 'rgba(0,217,255,0.12)',
        color: isSuperadmin ? '#8B83FF' : '#00D9FF',
        border: `1px solid ${isSuperadmin ? 'rgba(108,99,255,0.3)' : 'rgba(0,217,255,0.25)'}`,
      }}>
        {isSuperadmin ? <FiShield size={11} /> : <FiUser size={11} />}
        {role}
      </span>
    );
  };

  /* ─── Modal Overlay Style ─── */
  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 999,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16,
  };
  const modalStyle = {
    background: 'var(--ad-card, #202447)', border: '1px solid var(--ad-border, rgba(255,255,255,0.14))',
    borderRadius: 20, padding: 28, width: '100%', maxWidth: 460,
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    animation: 'adminFadeUp 0.3s both',
  };
  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 12, fontSize: 13,
    background: 'var(--ad-input, #212649)', border: '1px solid var(--ad-border, rgba(255,255,255,0.14))',
    color: 'var(--ad-text, #E8E8F0)', outline: 'none', transition: 'border 0.2s',
    boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--ad-text-sec, #C2C6E4)', marginBottom: 4, display: 'block' };
  const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'auto' };

  return (
    <div className="space-y-6 text-text-primary">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Kelola Admin</h1>
          <p className="text-text-secondary text-sm">Tambah, edit, atau hapus akun administrator</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-light transition-all bg-transparent cursor-pointer">
            <FiRefreshCcw className={loading ? 'animate-spin' : ''} size={14} /> Refresh
          </button>
          <button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2">
            <FiPlus size={14} /> Tambah Admin
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder="Cari nama atau username admin..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-card/50">
              <th className="text-left p-4 text-xs text-text-primary font-bold uppercase tracking-wider min-w-[200px]">Nama</th>
              <th className="text-left p-4 text-xs text-text-primary font-bold uppercase tracking-wider hidden md:table-cell">Username</th>
              <th className="text-left p-4 text-xs text-text-primary font-bold uppercase tracking-wider hidden sm:table-cell">Role</th>
              <th className="text-left p-4 text-xs text-text-primary font-bold uppercase tracking-wider hidden lg:table-cell">Dibuat</th>
              <th className="text-right p-4 text-xs text-text-primary font-bold uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted text-sm">
                  {loading ? 'Memuat data...' : 'Tidak ada admin ditemukan.'}
                </td>
              </tr>
            ) : filtered.map(item => {
              const isSelf = item.id === currentAdmin?.id;
              return (
                <tr key={item.id} className="border-b border-border/50 hover:bg-bg-card/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: isSelf ? 'linear-gradient(135deg, #6C63FF, #FF6B9D)' : 'linear-gradient(135deg, #00D9FF, #6C63FF)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0,
                      }}>
                        {item.nama?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <span className="text-sm text-text-primary font-semibold">{item.nama}</span>
                        {isSelf && (
                          <span style={{
                            marginLeft: 6, fontSize: 9, fontWeight: 700, padding: '1px 6px',
                            borderRadius: 6, background: 'rgba(108,99,255,0.15)', color: '#8B83FF',
                          }}>ANDA</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-secondary hidden md:table-cell">{item.username}</td>
                  <td className="p-4 hidden sm:table-cell">{roleBadge(item.role)}</td>
                  <td className="p-4 text-sm text-text-muted hidden lg:table-cell">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)}
                        className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all bg-transparent border-none cursor-pointer"
                        title="Edit admin">
                        <FiEdit2 size={15} />
                      </button>
                      {!isSelf && (
                        <button onClick={() => handleDelete(item)}
                          className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"
                          title="Hapus admin">
                          <FiTrash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Modal Create / Edit ── */}
      {showModal && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ad-text)', margin: 0 }}>
                  {editId ? 'Edit Admin' : 'Tambah Admin Baru'}
                </h2>
                <p style={{ fontSize: 12, color: 'var(--ad-text-muted)', margin: '2px 0 0' }}>
                  {editId ? 'Perbarui informasi admin' : 'Isi data untuk membuat akun admin baru'}
                </p>
              </div>
              <button onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ad-text-muted)', padding: 4, borderRadius: 8, display: 'flex' }}>
                <FiX size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Nama Lengkap</label>
                <input style={inputStyle} placeholder="Contoh: John Doe" value={form.nama}
                  onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <input style={inputStyle} placeholder="Contoh: johndoe" value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <select style={selectStyle} value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>
                  {editId ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...inputStyle, paddingRight: 40 }}
                    type={showPw ? 'text' : 'password'} placeholder={editId ? '••••••••' : 'Min. 6 karakter'}
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  <button onClick={() => setShowPw(!showPw)}
                    style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ad-text-muted)',
                      display: 'flex', padding: 4,
                    }}>
                    {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={closeModal}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
                  background: 'transparent', border: '1px solid var(--ad-border)', cursor: 'pointer',
                  color: 'var(--ad-text-sec)', transition: 'all 0.2s',
                }}>
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12, fontSize: 13, fontWeight: 700,
                  background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)', border: 'none',
                  color: '#fff', cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1, transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(108,99,255,0.35)',
                }}>
                {saving ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Buat Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
