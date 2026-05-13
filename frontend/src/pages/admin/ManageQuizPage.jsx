import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiSave, FiImage, FiEdit3, FiCheckSquare, FiSquare, FiAlertTriangle } from 'react-icons/fi';
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

export default function ManageQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [quizDetail, setQuizDetail] = useState({});
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [qForm, setQForm] = useState({ judul: '', deskripsi: '', kategori: 'umum', link_eksternal: '', gambar: '' });
  const [imagePreview, setImagePreview] = useState(null);

  // Batch delete state
  const [selected, setSelected] = useState(new Set());
  const [batchMode, setBatchMode] = useState(false);

  const load = () => { api.getQuizzes().then(d => Array.isArray(d) && setQuizzes(d)).catch(() => {}); };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    document.body.style.overflow = showQuizModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showQuizModal]);

  // ── Selection helpers ──
  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === quizzes.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(quizzes.map(q => q.id)));
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
            Hapus <span className="text-red-400">{selected.size} kuis</span> sekaligus?
          </p>
        </div>
        <p className="text-xs text-white/50">Tindakan ini tidak bisa dibatalkan.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const ids = [...selected];
              const toastId = toast.loading(`Menghapus ${ids.length} kuis...`);
              try {
                await Promise.all(ids.map(id => api.deleteQuiz(id)));
                toast.success(`${ids.length} kuis berhasil dihapus!`, { id: toastId });
                exitBatchMode();
                load();
              } catch {
                toast.error('Sebagian kuis gagal dihapus.', { id: toastId });
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

  const toggleExpand = async (id) => {
    if (batchMode) { toggleSelect(id); return; }
    if (expanded === id) { setExpanded(null); return; }
    const detail = await api.getQuizDetail(id);
    setQuizDetail(prev => ({ ...prev, [id]: detail }));
    setExpanded(id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        `Ukuran gambar terlalu besar! Maksimal 2MB, file kamu ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
        { duration: 5000 }
      );
      e.target.value = ''; // reset input
      return;
    }

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
    setQForm({ judul: quiz.judul, deskripsi: quiz.deskripsi || '', kategori: quiz.kategori, link_eksternal: quiz.link_eksternal || '', gambar: quiz.gambar || '' });
    setImagePreview(quiz.gambar || null);
    setShowQuizModal(true);
  };

  const handleSave = async () => {
    if (!qForm.judul?.trim()) { toast.error('Judul kuis tidak boleh kosong!'); return; }
    if (!qForm.link_eksternal?.trim()) { toast.error('Link Google Form tidak boleh kosong!'); return; }
    const savePromise = editItem ? api.updateQuiz(editItem.id, qForm) : api.createQuiz(qForm);
    await toast.promise(savePromise, {
      loading: editItem ? 'Menyimpan perubahan...' : 'Membuat kuis...',
      success: editItem ? 'Kuis berhasil diperbarui!' : 'Kuis berhasil dibuat!',
      error: 'Gagal menyimpan kuis.',
    });
    setShowQuizModal(false);
    load();
  };

  const deleteQuiz = (id) => {
    confirmToast('Hapus kuis ini? Tindakan tidak bisa dibatalkan.', async () => {
      await toast.promise(api.deleteQuiz(id), {
        loading: 'Menghapus kuis...', success: 'Kuis berhasil dihapus!', error: 'Gagal menghapus kuis.',
      });
      load();
    });
  };

  const allSelected = quizzes.length > 0 && selected.size === quizzes.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Kelola Kuis</h1>
          <p className="text-text-secondary text-sm">Buat dan edit kuis dengan gambar dan link Google Form</p>
        </div>
        <div className="flex items-center gap-2">
          {batchMode ? (
            <>
              <button onClick={exitBatchMode}
                className="text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-light transition-all bg-transparent cursor-pointer">
                <FiX size={14} /> Batal
              </button>
              <button onClick={handleBatchDelete} disabled={selected.size === 0}
                className="admin-danger-soft text-sm flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 hover:bg-red-500/20 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                <FiTrash2 size={14} />
                Hapus {selected.size > 0 ? `(${selected.size})` : 'Terpilih'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setBatchMode(true)}
                className="text-sm flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-light transition-all bg-transparent cursor-pointer">
                <FiCheckSquare size={14} /> Pilih
              </button>
              <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
                <FiPlus /> Buat Kuis
              </button>
            </>
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
          <span className="text-text-muted">{selected.size} dari {quizzes.length} dipilih</span>
        </div>
      )}

      {/* Quiz list */}
      {quizzes.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center"><p className="text-text-muted">Belum ada kuis</p></div>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => {
            const isSelected = selected.has(quiz.id);
            return (
              <div key={quiz.id}
                className={`glass rounded-2xl overflow-hidden transition-all ${batchMode ? 'cursor-pointer' : 'card-hover'} ${isSelected ? 'ring-2 ring-primary/50 bg-primary/5' : ''}`}
                onClick={batchMode ? () => toggleSelect(quiz.id) : undefined}
              >
                <div className="flex items-center justify-between p-5"
                  onClick={!batchMode ? () => toggleExpand(quiz.id) : undefined}
                  style={{ cursor: batchMode ? 'pointer' : 'pointer' }}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox in batch mode */}
                    {batchMode && (
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                        {isSelected && <FiCheckSquare size={12} className="text-white" />}
                      </div>
                    )}
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
                  {!batchMode && (
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(quiz); }}
                        className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all bg-transparent border-none cursor-pointer"><FiEdit3 size={16} /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}
                        className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"><FiTrash2 size={16} /></button>
                      {expanded === quiz.id ? <FiChevronUp className="text-primary" /> : <FiChevronDown className="text-text-muted" />}
                    </div>
                  )}
                </div>

                {!batchMode && expanded === quiz.id && quizDetail[quiz.id] && (
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
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL — Buat / Edit Kuis
          Inline styles dengan CSS variables admin
      ══════════════════════════════════════════ */}
      {showQuizModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            width: '100%', maxWidth: 480,
            maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            background: 'var(--ad-card)',
            border: '1px solid var(--ad-border)',
            borderRadius: 28,
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)',
          }}>

            {/* ── Header ── */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '24px 28px 20px',
              borderBottom: '1px solid var(--ad-border)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 4, height: 22, borderRadius: 4,
                    background: 'linear-gradient(180deg,#6C63FF,#FF6B9D)',
                    flexShrink: 0,
                  }} />
                  <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--ad-text)', lineHeight: 1 }}>
                    {editItem ? 'Edit Kuis' : 'Buat Kuis Baru'}
                  </h2>
                </div>
                <span style={{
                  display: 'inline-block', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#6C63FF',
                  background: 'rgba(108,99,255,0.12)',
                  border: '1px solid rgba(108,99,255,0.25)',
                  borderRadius: 20, padding: '3px 12px',
                }}>
                  {editItem ? 'Perbarui data kuis' : 'Isi detail kuis baru'}
                </span>
              </div>

              <button
                onClick={() => { setShowQuizModal(false); setImagePreview(null); }}
                style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--ad-input)',
                  border: '1px solid var(--ad-border)',
                  color: 'var(--ad-text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,82,82,0.12)';
                  e.currentTarget.style.color = '#FF5252';
                  e.currentTarget.style.borderColor = 'rgba(255,82,82,0.3)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--ad-input)';
                  e.currentTarget.style.color = 'var(--ad-text-muted)';
                  e.currentTarget.style.borderColor = 'var(--ad-border)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <FiX size={17} />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Judul */}
              <QField label="Judul Kuis">
                <QInput value={qForm.judul} onChange={e => setQForm({ ...qForm, judul: e.target.value })} placeholder="Judul kuis" />
              </QField>

              {/* Deskripsi */}
              <QField label="Deskripsi">
                <QTextarea value={qForm.deskripsi} onChange={e => setQForm({ ...qForm, deskripsi: e.target.value })} placeholder="Deskripsi quiz" rows={3} />
              </QField>

              {/* Kategori */}
              <QField label="Kategori">
                <QSelect
                  value={qForm.kategori}
                  onChange={e => setQForm({ ...qForm, kategori: e.target.value })}
                  options={[{ value: 'umum', label: 'Umum' }, { value: 'psikotes', label: 'Psikotes' }]}
                />
              </QField>

              {/* Cover */}
              <QField label="Cover Quiz">
                <label
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: imagePreview ? 8 : '14px 16px',
                    borderRadius: 14,
                    background: 'var(--ad-input)',
                    border: '2px dashed var(--ad-border)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(108,99,255,0.5)';
                    e.currentTarget.style.background = 'rgba(108,99,255,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--ad-border)';
                    e.currentTarget.style.background = 'var(--ad-input)';
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 10 }} />
                  ) : (
                    <>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'rgba(108,99,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#6C63FF',
                      }}>
                        <FiImage size={18} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ad-text-muted)' }}>
                        Upload Gambar Cover
                      </span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
                <p style={{ fontSize: 10, color: 'var(--ad-text-muted)', marginTop: 4 }}>
                  Maks. 2MB · JPG, PNG, WEBP
                </p>
                {imagePreview && (
                  <button
                    onClick={() => { setImagePreview(null); setQForm(prev => ({ ...prev, gambar: '' })); }}
                    style={{
                      marginTop: 4, fontSize: 10, fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: '#FF5252', background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    Hapus Gambar
                  </button>
                )}
              </QField>

              {/* Link Google Form */}
              <QField label="Link Google Form">
                <QInput
                  value={qForm.link_eksternal || ''}
                  onChange={e => setQForm({ ...qForm, link_eksternal: e.target.value })}
                  placeholder="https://forms.gle/..."
                />
              </QField>
            </div>

            {/* ── Footer ── */}
            <div style={{
              padding: '16px 28px 24px',
              borderTop: '1px solid var(--ad-border)',
              flexShrink: 0,
              display: 'flex', gap: 10,
            }}>
              <button
                onClick={() => { setShowQuizModal(false); setImagePreview(null); }}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
                  background: 'var(--ad-input)',
                  border: '1px solid var(--ad-border)',
                  color: 'var(--ad-text-sec)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ad-card-hover)'; e.currentTarget.style.color = 'var(--ad-text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--ad-input)'; e.currentTarget.style.color = 'var(--ad-text-sec)'; }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12, fontSize: 13, fontWeight: 700,
                  background: 'linear-gradient(135deg,#6C63FF,#9B59FF)',
                  border: 'none', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 6px 20px rgba(108,99,255,0.4)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(108,99,255,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(108,99,255,0.4)'; }}
              >
                <FiSave size={16} />
                {editItem ? 'Simpan Perubahan' : 'Buat Kuis'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ══════════════════════════════════════════
   Helper sub-components untuk modal kuis
   Semua pakai CSS variables admin
══════════════════════════════════════════ */
function QField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--ad-text-muted)',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function QInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '10px 14px',
        borderRadius: 12, fontSize: 13,
        background: 'var(--ad-input)',
        border: '1px solid var(--ad-border)',
        color: 'var(--ad-text)',
        outline: 'none', transition: 'border 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
      onFocus={e => {
        e.target.style.borderColor = 'rgba(108,99,255,0.6)';
        e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.1)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'var(--ad-border)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

function QTextarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '10px 14px',
        borderRadius: 12, fontSize: 13,
        background: 'var(--ad-input)',
        border: '1px solid var(--ad-border)',
        color: 'var(--ad-text)',
        outline: 'none', resize: 'vertical',
        transition: 'border 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
      onFocus={e => {
        e.target.style.borderColor = 'rgba(108,99,255,0.6)';
        e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.1)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'var(--ad-border)';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

function QSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%', padding: '10px 14px',
        borderRadius: 12, fontSize: 13,
        background: 'var(--ad-input)',
        border: '1px solid var(--ad-border)',
        color: 'var(--ad-text)',
        outline: 'none', cursor: 'pointer',
        transition: 'border 0.2s',
        boxSizing: 'border-box',
        appearance: 'none',
        fontFamily: 'inherit',
      }}
      onFocus={e => { e.target.style.borderColor = 'rgba(108,99,255,0.6)'; }}
      onBlur={e  => { e.target.style.borderColor = 'var(--ad-border)'; }}
    >
      {options.map(o => (
        <option
          key={o.value}
          value={o.value}
          style={{ background: 'var(--ad-surface)', color: 'var(--ad-text)' }}
        >
          {o.label}
        </option>
      ))}
    </select>
  );
}
