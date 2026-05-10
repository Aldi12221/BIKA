import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiSave, FiImage, FiEdit3 } from 'react-icons/fi';
import api from '../../utils/api';

export default function ManageQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [quizDetail, setQuizDetail] = useState({});
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [qForm, setQForm] = useState({ judul: '', deskripsi: '', kategori: 'umum', link_eksternal: '', gambar: '' });
  const [imagePreview, setImagePreview] = useState(null);

  const load = () => { api.getQuizzes().then(d => Array.isArray(d) && setQuizzes(d)).catch(() => {}); };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (showQuizModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showQuizModal]);

  const toggleExpand = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    const detail = await api.getQuizDetail(id);
    setQuizDetail(prev => ({ ...prev, [id]: detail }));
    setExpanded(id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setQForm(prev => ({ ...prev, gambar: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setEditItem(null);
    setQForm({ judul: '', deskripsi: '', kategori: 'umum', link_eksternal: '', gambar: '' });
    setImagePreview(null);
    setShowQuizModal(true);
  };

  const openEdit = (quiz) => {
    setEditItem(quiz);
    setQForm({ 
      judul: quiz.judul, 
      deskripsi: quiz.deskripsi || '', 
      kategori: quiz.kategori, 
      link_eksternal: quiz.link_eksternal || '', 
      gambar: quiz.gambar || '' 
    });
    setImagePreview(quiz.gambar || null);
    setShowQuizModal(true);
  };

  const handleSave = async () => {
    if (!qForm.judul || qForm.judul.trim() === '') {
      alert('Judul kuis tidak boleh kosong!');
      return;
    }
    if (!qForm.link_eksternal || qForm.link_eksternal.trim() === '') {
      alert('Link Google Form tidak boleh kosong!');
      return;
    }

    if (editItem) {
      await api.updateQuiz(editItem.id, qForm);
    } else {
      await api.createQuiz(qForm);
    }
    setShowQuizModal(false);
    load();
  };

  const deleteQuiz = async (id) => {
    if (!confirm('Hapus kuis ini?')) return;
    await api.deleteQuiz(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Kelola Kuis</h1>
          <p className="text-text-secondary text-sm">Buat dan edit kuis dengan gambar dan link Google Form</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2"><FiPlus /> Buat Kuis</button>
      </div>

      {quizzes.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center"><p className="text-text-muted">Belum ada kuis</p></div>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="glass rounded-2xl overflow-hidden card-hover">
              <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => toggleExpand(quiz.id)}>
                <div className="flex items-center gap-4">
                  {quiz.gambar ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <img src={quiz.gambar} alt={quiz.judul} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg ${quiz.kategori === 'psikotes' ? 'gradient-accent' : 'gradient-primary'}`}>
                      {quiz.kategori === 'psikotes' ? '🧠' : '📝'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{quiz.judul}</h3>
                    <p className="text-xs text-text-muted capitalize">{quiz.kategori}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); openEdit(quiz); }}
                    className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all bg-transparent border-none cursor-pointer"><FiEdit3 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}
                    className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"><FiTrash2 size={16} /></button>
                  {expanded === quiz.id ? <FiChevronUp className="text-primary" /> : <FiChevronDown className="text-text-muted" />}
                </div>
              </div>

              {expanded === quiz.id && quizDetail[quiz.id] && (
                <div className="border-t border-border p-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {quizDetail[quiz.id].gambar && (
                      <div>
                        <p className="text-xs text-text-muted mb-2 font-medium">Cover Quiz</p>
                        <img src={quizDetail[quiz.id].gambar} alt="Cover" className="w-full max-h-48 object-cover rounded-xl" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-text-muted mb-2 font-medium">Detail</p>
                      <div className="bg-bg-card rounded-xl p-4 border border-border space-y-2">
                        <p className="text-sm text-text-primary"><strong>Judul:</strong> {quizDetail[quiz.id].judul}</p>
                        <p className="text-sm text-text-primary"><strong>Kategori:</strong> {quizDetail[quiz.id].kategori}</p>
                        <p className="text-sm text-text-primary"><strong>Deskripsi:</strong> {quizDetail[quiz.id].deskripsi || '-'}</p>
                        <p className="text-sm text-text-primary"><strong>Link Form:</strong> {quizDetail[quiz.id].link_eksternal ? (
                          <a href={quizDetail[quiz.id].link_eksternal} target="_blank" rel="noreferrer" className="text-primary underline ml-1">{quizDetail[quiz.id].link_eksternal.substring(0, 40)}...</a>
                        ) : ' -'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">{editItem ? 'Edit Kuis' : 'Buat Kuis Baru'}</h2>
              <button onClick={() => { setShowQuizModal(false); setImagePreview(null); }} className="p-2 rounded-lg text-text-muted hover:text-text-primary bg-transparent border-none cursor-pointer"><FiX /></button>
            </div>
            <div className="space-y-4">
              <input value={qForm.judul} onChange={e => setQForm({...qForm, judul: e.target.value})} placeholder="Judul kuis"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              <textarea value={qForm.deskripsi} onChange={e => setQForm({...qForm, deskripsi: e.target.value})} rows={3} placeholder="Deskripsi quiz"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none" />
              <select value={qForm.kategori} onChange={e => setQForm({...qForm, kategori: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-all">
                <option value="umum" className="bg-bg-surface">Umum</option>
                <option value="psikotes" className="bg-bg-surface">Psikotes</option>
              </select>

              {/* Image Upload */}
              <div>
                <label className="text-xs font-medium text-text-secondary mb-2 block">Cover Quiz</label>
                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-bg-input border-2 border-dashed border-border text-text-muted hover:border-primary/50 transition-all cursor-pointer">
                  <FiImage size={18} />
                  <span className="text-sm">{imagePreview ? 'Ganti Gambar' : 'Upload Gambar Cover'}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                    <button onClick={() => { setImagePreview(null); setQForm(prev => ({...prev, gambar: ''})); }}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full border-none cursor-pointer hover:bg-black/80 transition-colors">
                      <FiX size={14} />
                    </button>
                  </div>
                )}
              </div>

              <input value={qForm.link_eksternal || ''} onChange={e => setQForm({...qForm, link_eksternal: e.target.value})} placeholder="Link Google Form"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              <button onClick={handleSave} className="w-full btn-primary text-sm flex items-center justify-center gap-2"><FiSave /> Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
