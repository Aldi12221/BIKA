import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiBookOpen, FiMessageCircle, FiX, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';

export default function TutorialPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getQuizzes().then(d => {
      if (Array.isArray(d)) setQuizzes(d);
    }).catch(console.error);

    api.getContents('tutorial').then(d => {
      if (Array.isArray(d)) setTutorials(d);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedContent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedContent]);

  const openContentDetail = (item) => {
    setSelectedContent(item);
  };

  const closeContentModal = () => {
    setSelectedContent(null);
  };

  const openQuizDetail = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const closeQuizModal = () => {
    setSelectedQuiz(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black overflow-x-hidden transition-colors duration-300 font-sans pb-24">
      {/* --- BACKGROUND ORNAMENTS --- */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-900/10 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-red-500/10 dark:bg-red-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      {/* Header */}
      <div className="text-center pt-32 pb-14 relative z-10">
        <div className="inline-flex items-center justify-center gap-2 bg-white/50 dark:bg-white/5 border border-rose-200/50 dark:border-rose-900/30 px-5 py-2 rounded-full mb-5 shadow-sm backdrop-blur-sm transition-all">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Platform Pembelajaran</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors mb-4">
          Tuto<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">rial</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium transition-colors">
          Learning <span className="font-light italic">&</span> Testing
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-8 relative z-10">

        {/* 1. Bank Kuis Section */}
        <div className="bg-rose-500/80 dark:bg-rose-900/40 rounded-[32px] p-8 shadow-sm border border-rose-200 dark:border-rose-900/50 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/30 dark:bg-black/20 rounded-xl flex items-center justify-center text-white">
              <FiBookOpen className="text-xl" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Bank Kuis</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.length > 0 ? quizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => openQuizDetail(quiz)}
                className="group bg-white/95 dark:bg-white/10 rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-xl transition-all duration-300 cursor-pointer shadow-sm"
              >
                {/* Quiz Image */}
                <div className="relative w-full h-40 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 overflow-hidden">
                  {quiz.gambar ? (
                    <img src={quiz.gambar} alt={quiz.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-50">
                      {quiz.kategori === 'psikotes' ? '🧠' : '📝'}
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full backdrop-blur-sm ${quiz.kategori === 'psikotes' ? 'bg-purple-500/80 text-white' : 'bg-white/80 text-rose-600 dark:bg-black/50 dark:text-rose-300'}`}>
                      {quiz.kategori}
                    </span>
                  </div>
                </div>

                {/* Quiz Info */}
                <div className="p-4">
                  <h4 className="font-black text-[15px] text-slate-800 dark:text-white leading-tight mb-2 line-clamp-2">
                    {quiz.judul}
                  </h4>
                  <p className="text-[12px] font-medium text-slate-500 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {quiz.deskripsi || 'Klik untuk melihat detail quiz'}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-white/10">
                    <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400">Lihat Detail</span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/50 text-rose-500 dark:text-rose-300 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <FiArrowRight className="text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-8 text-center text-white/80">
                <p className="text-lg font-bold mb-1">Belum ada kuis tersedia</p>
                <p className="text-sm opacity-70">Kuis akan segera ditambahkan</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Tips & Trick Wawancara Section */}
        <div className="bg-rose-500/80 dark:bg-rose-900/40 rounded-[32px] p-8 shadow-sm border border-rose-200 dark:border-rose-900/50 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/30 dark:bg-black/20 rounded-xl flex items-center justify-center text-white">
              <FiMessageCircle className="text-xl" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Tips & Trick Wawancara</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Articles */}
            <div className="space-y-4">
              {tutorials.length > 0 ? tutorials.map((item) => (
                <div key={item.id} onClick={() => openContentDetail(item)} className="flex items-center gap-4 bg-white/90 dark:bg-white/10 rounded-2xl p-3 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-black/30 rounded-xl overflow-hidden shrink-0">
                    <img src={item.gambar || `https://ui-avatars.com/api/?name=${item.judul}&background=cbd5e1&color=475569`} alt="Thumbnail" className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[13px] text-slate-800 dark:text-white leading-tight mb-1">{item.judul}</h4>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">{item.deskripsi ? item.deskripsi.substring(0, 50) + '...' : 'Klik untuk membaca selengkapnya'}</p>
                  </div>
                  <FiArrowRight className="text-slate-400 group-hover:text-rose-500" />
                </div>
              )) : (
                <div className="py-4 text-white/80">Belum ada tutorial...</div>
              )}
            </div>

            {/* Right Column - Videos */}
            <div className="space-y-4">
              {tutorials.length > 0 ? tutorials.slice(0, 3).map((video) => (
                <div key={video.id} onClick={() => video.link_eksternal && window.open(video.link_eksternal, '_blank')} className="flex items-center gap-4 bg-[#4A3B3B] dark:bg-zinc-900 rounded-2xl p-3 hover:shadow-md transition-shadow cursor-pointer border border-[#5A4B4B] dark:border-zinc-800">
                  <div className="w-16 h-16 bg-black/50 rounded-xl flex items-center justify-center text-white shrink-0 relative overflow-hidden">
                    {video.gambar ? <img src={video.gambar} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" /> : <div className="absolute inset-0 bg-rose-500/20"></div>}
                    <FiPlay className="text-xl relative z-10 ml-1" fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-white leading-tight mb-1">{video.judul}</h4>
                    <p className="text-[10px] font-medium text-slate-400">Tonton Sekarang</p>
                  </div>
                </div>
              )) : null}
            </div>
          </div>
        </div>

        {/* 3. Test Psikotes Section */}
        <div className="bg-rose-500/80 dark:bg-rose-900/40 rounded-[32px] p-8 shadow-sm border border-rose-200 dark:border-rose-900/50 transition-colors text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="flex flex-col items-center justify-center mb-8 relative z-10">
            <h2 className="text-2xl font-black text-white tracking-tight mb-6">Test Psikotes</h2>
            <button className="bg-blue-600 dark:bg-blue-600/50 border border-blue-600 text-white font-black text-sm px-8 py-3 rounded-full hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20">
              Start now
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {[
              { title: "Info", desc: "BIKA sekarang memiliki fitur pengelolaan keuangan untuk membantu teman-teman dalam menglola pengeluaran dan pemasukan sehari-hari" },
              { title: "Info", desc: "Jangan lupa lengkapi profil kamu agar terlihat lebih profesional" },
              { title: "Info", desc: "Page tutorial memuat kuis dan tips yang akan bermanfaat untuk masa depan teman teman yang lebih cerah kedepannya" }
            ].map((box, idx) => (
              <div key={idx} className="bg-white/90 dark:bg-white/10 rounded-2xl p-5 text-left hover:-translate-y-1 transition-transform cursor-pointer shadow-sm">
                <h4 className="font-black text-sm text-slate-800 dark:text-white mb-2">{box.title}</h4>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  {box.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ===== ARTICLE DETAIL MODAL ===== */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={closeContentModal}>
          <div
            className="bg-white dark:bg-zinc-900 rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-[slideUp_0.35s_ease-out] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header/Image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/40 dark:to-orange-900/40 shrink-0">
              {selectedContent.gambar ? (
                <img src={selectedContent.gambar} alt={selectedContent.judul} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">📰</div>
              )}
              <button onClick={closeContentModal} className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border-none cursor-pointer transition-all">
                <FiX size={20} />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Tutorial</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
                {selectedContent.judul}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 pb-4 border-b border-slate-100 dark:border-white/5">
                {selectedContent.deskripsi}
              </p>
              
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-base font-medium">
                  {selectedContent.isi_konten}
                </div>
              </div>

              {selectedContent.link_eksternal && (
                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5">
                  <button 
                    onClick={() => window.open(selectedContent.link_eksternal, '_blank')}
                    className="flex items-center gap-2 text-rose-500 font-black text-sm hover:gap-3 transition-all cursor-pointer bg-transparent border-none"
                  >
                    Kunjungi Sumber Eksternal <FiExternalLink />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ===== QUIZ DETAIL MODAL ===== */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={closeQuizModal}>
          <div
            className="bg-white dark:bg-zinc-900 rounded-[32px] w-full max-w-lg shadow-2xl animate-[slideUp_0.35s_ease-out] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/40 dark:to-orange-900/40 shrink-0">
              {selectedQuiz.gambar ? (
                <img src={selectedQuiz.gambar} alt={selectedQuiz.judul} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-40">
                  {selectedQuiz.kategori === 'psikotes' ? '🧠' : '📝'}
                </div>
              )}
              <button onClick={closeQuizModal} className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border-none cursor-pointer transition-all">
                <FiX size={20} />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg ${selectedQuiz.kategori === 'psikotes' ? 'bg-purple-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {selectedQuiz.kategori}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-3 tracking-tight">
                {selectedQuiz.judul}
              </h2>
              {selectedQuiz.deskripsi && (
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  {selectedQuiz.deskripsi}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeQuizModal}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-zinc-600 transition-all bg-transparent cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    closeQuizModal();
                    if (selectedQuiz.link_eksternal) {
                      window.open(selectedQuiz.link_eksternal, '_blank');
                    } else {
                      navigate(`/quiz/${selectedQuiz.id}`);
                    }
                  }}
                  className="flex-1 py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-lg shadow-rose-500/30"
                  style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)' }}
                >
                  <FiPlay size={14} fill="currentColor" /> Mulai Kuis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
