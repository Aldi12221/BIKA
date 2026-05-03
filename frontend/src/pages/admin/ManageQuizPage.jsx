import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiSave } from 'react-icons/fi';
import api from '../../utils/api';

export default function ManageQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [quizDetail, setQuizDetail] = useState({});
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQModal, setShowQModal] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [qForm, setQForm] = useState({ judul: '', deskripsi: '', kategori: 'umum' });
  const [soalForm, setSoalForm] = useState({ teks_soal: '', opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', jawaban_benar: 'a' });

  const load = () => { api.getQuizzes().then(d => Array.isArray(d) && setQuizzes(d)).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const toggleExpand = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    const detail = await api.getQuizDetail(id);
    setQuizDetail(prev => ({ ...prev, [id]: detail }));
    setExpanded(id);
  };

  const addQuiz = async () => {
    await api.createQuiz(qForm);
    setShowQuizModal(false);
    setQForm({ judul: '', deskripsi: '', kategori: 'umum' });
    load();
  };

  const deleteQuiz = async (id) => {
    if (!confirm('Hapus kuis ini beserta semua soalnya?')) return;
    await api.deleteQuiz(id);
    load();
  };

  const openAddSoal = (quizId) => {
    setActiveQuizId(quizId);
    setSoalForm({ teks_soal: '', opsi_a: '', opsi_b: '', opsi_c: '', opsi_d: '', jawaban_benar: 'a' });
    setShowQModal(true);
  };

  const addSoal = async () => {
    await api.addQuestion(activeQuizId, soalForm);
    setShowQModal(false);
    const detail = await api.getQuizDetail(activeQuizId);
    setQuizDetail(prev => ({ ...prev, [activeQuizId]: detail }));
  };

  const deleteSoal = async (quizId, qId) => {
    if (!confirm('Hapus soal ini?')) return;
    await api.deleteQuestion(quizId, qId);
    const detail = await api.getQuizDetail(quizId);
    setQuizDetail(prev => ({ ...prev, [quizId]: detail }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Kelola Kuis</h1>
          <p className="text-text-secondary text-sm">Buat kuis dan tambahkan soal</p>
        </div>
        <button onClick={() => setShowQuizModal(true)} className="btn-primary text-sm flex items-center gap-2"><FiPlus /> Buat Kuis</button>
      </div>

      {quizzes.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center"><p className="text-text-muted">Belum ada kuis</p></div>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="glass rounded-2xl overflow-hidden card-hover">
              <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => toggleExpand(quiz.id)}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg ${quiz.kategori === 'psikotes' ? 'gradient-accent' : 'gradient-primary'}`}>
                    {quiz.kategori === 'psikotes' ? '🧠' : '📝'}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{quiz.judul}</h3>
                    <p className="text-xs text-text-muted capitalize">{quiz.kategori} · {quiz.deskripsi || 'Tanpa deskripsi'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}
                    className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"><FiTrash2 size={16} /></button>
                  {expanded === quiz.id ? <FiChevronUp className="text-primary" /> : <FiChevronDown className="text-text-muted" />}
                </div>
              </div>

              {expanded === quiz.id && quizDetail[quiz.id] && (
                <div className="border-t border-border p-5 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-text-secondary">Soal ({quizDetail[quiz.id].Questions?.length || 0})</p>
                    <button onClick={() => openAddSoal(quiz.id)} className="text-xs btn-primary flex items-center gap-1 py-1.5 px-3"><FiPlus size={14} /> Tambah Soal</button>
                  </div>
                  {(!quizDetail[quiz.id].Questions || quizDetail[quiz.id].Questions.length === 0) ? (
                    <p className="text-sm text-text-muted text-center py-4">Belum ada soal</p>
                  ) : (
                    <div className="space-y-3">
                      {quizDetail[quiz.id].Questions.map((s, i) => (
                        <div key={s.id} className="bg-bg-card rounded-xl p-4 border border-border">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm text-text-primary"><span className="text-text-muted mr-2">{i+1}.</span>{s.teks_soal}</p>
                            <button onClick={() => deleteSoal(quiz.id, s.id)} className="p-1 text-text-muted hover:text-danger bg-transparent border-none cursor-pointer flex-shrink-0"><FiTrash2 size={14} /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {['a','b','c','d'].map(k => (
                              <p key={k} className={`text-xs px-3 py-1.5 rounded-lg ${s.jawaban_benar === k ? 'bg-success/10 text-success font-medium' : 'bg-bg-surface text-text-muted'}`}>
                                {k.toUpperCase()}. {s[`opsi_${k}`]}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">Buat Kuis Baru</h2>
              <button onClick={() => setShowQuizModal(false)} className="p-2 rounded-lg text-text-muted hover:text-text-primary bg-transparent border-none cursor-pointer"><FiX /></button>
            </div>
            <div className="space-y-4">
              <input value={qForm.judul} onChange={e => setQForm({...qForm, judul: e.target.value})} placeholder="Judul kuis"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              <textarea value={qForm.deskripsi} onChange={e => setQForm({...qForm, deskripsi: e.target.value})} rows={2} placeholder="Deskripsi"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none" />
              <select value={qForm.kategori} onChange={e => setQForm({...qForm, kategori: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-all">
                <option value="umum" className="bg-bg-surface">Umum</option>
                <option value="psikotes" className="bg-bg-surface">Psikotes</option>
              </select>
              <button onClick={addQuiz} className="w-full btn-primary text-sm flex items-center justify-center gap-2"><FiSave /> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Soal Modal */}
      {showQModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">Tambah Soal</h2>
              <button onClick={() => setShowQModal(false)} className="p-2 rounded-lg text-text-muted hover:text-text-primary bg-transparent border-none cursor-pointer"><FiX /></button>
            </div>
            <div className="space-y-4">
              <textarea value={soalForm.teks_soal} onChange={e => setSoalForm({...soalForm, teks_soal: e.target.value})} rows={3} placeholder="Pertanyaan"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none" />
              {['a','b','c','d'].map(k => (
                <input key={k} value={soalForm[`opsi_${k}`]} onChange={e => setSoalForm({...soalForm, [`opsi_${k}`]: e.target.value})} placeholder={`Opsi ${k.toUpperCase()}`}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              ))}
              <select value={soalForm.jawaban_benar} onChange={e => setSoalForm({...soalForm, jawaban_benar: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-input border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-all">
                {['a','b','c','d'].map(k => <option key={k} value={k} className="bg-bg-surface">Jawaban Benar: {k.toUpperCase()}</option>)}
              </select>
              <button onClick={addSoal} className="w-full btn-primary text-sm flex items-center justify-center gap-2"><FiSave /> Simpan Soal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
