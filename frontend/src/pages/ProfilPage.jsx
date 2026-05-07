import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiEdit2, FiFileText, FiImage, FiSave, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilPage() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const createFormFromUser = (source) => ({
    nama: source?.nama || '',
    foto: source?.foto || '',
    cv_file_name: source?.cv_file_name || '',
    portfolio_file_name: source?.portfolio_file_name || '',
    cv_path: source?.cv_path || '',
    portofolio_link: source?.portofolio_link || '',
  });

  const [form, setForm] = useState(() => createFormFromUser(user));

  if (!user) return <Navigate to="/login" replace />;

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await readFileAsDataUrl(file);
      handleChange('foto', base64);
      showMessage('Foto profil berhasil dipilih.');
    } catch {
      showMessage('Gagal membaca file foto.');
    }
  };



  const handleSave = async () => {
    setSaving(true);
    const payload = {
      nama: form.nama,
      foto: form.foto,
      cv_path: form.cv_path || form.cv_file_name,
      portofolio_link: form.portofolio_link || form.portfolio_file_name,
      cv_file_name: form.cv_file_name,
      portfolio_file_name: form.portfolio_file_name,
    };

    try {
      const response = await api.updateProfile(user.id, payload);
      const nextUser = response?.data ? { ...user, ...response.data } : { ...user, ...payload };
      setUser(nextUser);
      showMessage('Profil berhasil diperbarui.');
      setIsEditing(false);
    } catch {
      // Fallback local supaya halaman tetap fungsional saat API belum siap.
      setUser({ ...user, ...payload });
      showMessage('Profil tersimpan lokal (backend belum terhubung).');
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden transition-colors duration-300">
      {/* Background Ornaments */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 dark:bg-red-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-zinc-800 mb-4 transition-colors">
            <span className="text-blue-600 text-base">👤</span>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Akun Saya</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-blue-950 dark:text-white tracking-tight transition-colors">
            Profil <span className="text-blue-600 dark:text-blue-500">Pengguna</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto mt-4 font-medium transition-colors">
            Kelola informasi pribadimu, unggah CV, dan portofolio untuk menarik perhatian perekrut.
          </p>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-6 py-4 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm">
            {message}
          </div>
        )}

        {/* Profile Card (Header) */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-50 dark:border-zinc-800 rounded-[36px] p-8 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/10 dark:shadow-none transition-colors">
              {form.foto ? (
                <img src={form.foto} alt="Foto profil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-blue-600 dark:text-blue-400">{(form.nama || user.nama || 'U').charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 text-center md:text-left mb-2">
              <h2 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight transition-colors">{form.nama || 'Nama belum diisi'}</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">{user.email}</p>
            </div>

            <button
              onClick={() => {
                const nextEditing = !isEditing;
                if (nextEditing) setForm(createFormFromUser(user));
                setIsEditing(nextEditing);
              }}
              className={`px-6 py-3 rounded-[20px] font-bold flex items-center gap-2 transition-all shadow-md mb-2 cursor-pointer ${
                isEditing 
                  ? 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-none'
              }`}
            >
              <FiEdit2 />
              {isEditing ? 'Batalkan Edit' : 'Edit Profil'}
            </button>
          </div>
        </section>

        {/* Body Card - Form Edit */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-50 dark:border-zinc-800 rounded-[36px] p-8 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors">
          <h3 className="text-xl font-black text-blue-950 dark:text-white mb-6 flex items-center gap-2 transition-colors">
            <span className="text-blue-600 dark:text-blue-500">📋</span> Informasi Pribadi
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <label className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 transition-colors">
                <FiUser size={16} className="text-blue-500" />
                Nama Lengkap
              </label>
              <input
                value={form.nama}
                disabled={!isEditing}
                onChange={(event) => handleChange('nama', event.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-blue-950 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-zinc-950"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 transition-colors">
                <FiImage size={16} className="text-blue-500" />
                Ganti Foto Profil
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={!isEditing}
                onChange={handlePhotoUpload}
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-600 dark:text-slate-300 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-xl file:bg-blue-100 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 file:font-bold hover:file:bg-blue-200 dark:hover:file:bg-blue-900/50 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-zinc-950"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800 pt-8 mt-2 transition-colors">
            <h3 className="text-xl font-black text-blue-950 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <span className="text-red-500">📁</span> Dokumen & Portofolio
            </h3>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 transition-colors">
                  <FiFileText size={16} className="text-blue-500" />
                  Link CV (URL)
                </label>
                <input
                  value={form.cv_path}
                  disabled={!isEditing}
                  onChange={(event) => handleChange('cv_path', event.target.value)}
                  placeholder="link cv kamu (Google Drive, Dropbox, dll)"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-blue-950 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-zinc-950"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 transition-colors">
                  <FiFileText size={16} className="text-blue-500" />
                  Link Portofolio (URL)
                </label>
                <input
                  value={form.portofolio_link}
                  disabled={!isEditing}
                  onChange={(event) => handleChange('portofolio_link', event.target.value)}
                  placeholder="link portofolio kamu (Behance, Dribbble, dll)"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-blue-950 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-zinc-950"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-[20px] font-bold flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-70 active:scale-95 cursor-pointer"
              >
                <FiSave size={20} />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
