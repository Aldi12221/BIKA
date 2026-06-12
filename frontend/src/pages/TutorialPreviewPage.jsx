import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBookOpen,
  FiPlay,
  FiArrowRight,
  FiLogIn,
} from 'react-icons/fi';
import api from '../utils/api';
import SkeletonCard from '../components/SkeletonCard';

// ─── Helper ──────────────────────────────────────────────────────────────────

const FALLBACK_THUMBNAIL =
  'https://ui-avatars.com/api/?name=Tutorial&background=fecaca&color=991b1b';

function getCategoryLabel(kategori) {
  if (kategori === 'psikotes') return 'Psikotes';
  if (kategori === 'umum') return 'Bank Kuis';
  return kategori || 'Kuis';
}

// ─── Tutorial Card ────────────────────────────────────────────────────────────

function TutorialCard({ item, onClick, cardRef }) {
  const shortDesc = item.deskripsi
    ? item.deskripsi.substring(0, 100) + (item.deskripsi.length > 100 ? '…' : '')
    : 'Klik untuk membaca selengkapnya';

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Baca tutorial: ${item.judul}`}
      ref={cardRef}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(e)}
      className="group bg-white dark:bg-zinc-900 rounded-[24px] border border-slate-100 dark:border-zinc-800 overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 overflow-hidden">
        <img
          src={item.gambar || FALLBACK_THUMBNAIL}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
          onError={(e) => { e.currentTarget.src = FALLBACK_THUMBNAIL; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/80 dark:bg-black/50 backdrop-blur-sm text-rose-600 dark:text-rose-300 text-[10px] font-black uppercase px-3 py-1 rounded-full">
          Tutorial
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-2">
        <h3 className="font-black text-[15px] text-slate-800 dark:text-white leading-tight line-clamp-2">
          {item.judul}
        </h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
          {shortDesc}
        </p>
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-zinc-800">
          <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400">Baca Artikel</span>
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/50 text-rose-500 dark:text-rose-300 group-hover:bg-rose-500 group-hover:text-white transition-colors">
            <FiArrowRight className="text-sm" />
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Quiz Card ────────────────────────────────────────────────────────────────

function QuizCard({ quiz, onStart, startBtnRef }) {
  const isPsych = quiz.kategori === 'psikotes';
  const accentColor = isPsych ? 'violet' : 'rose';

  return (
    <article
      className="group bg-white dark:bg-zinc-900 rounded-[24px] border border-slate-100 dark:border-zinc-800 overflow-hidden"
      aria-label={`Kuis: ${quiz.judul}`}
    >
      {/* Thumbnail */}
      <div
        className={`relative h-40 bg-gradient-to-br ${
          isPsych
            ? 'from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30'
            : 'from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30'
        } overflow-hidden`}
      >
        {quiz.gambar ? (
          <img
            src={quiz.gambar}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
            {isPsych ? '🧠' : '📝'}
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
              isPsych
                ? 'bg-violet-500/80 text-white'
                : 'bg-rose-500/80 text-white'
            } backdrop-blur-sm`}
          >
            {getCategoryLabel(quiz.kategori)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <h3 className="font-black text-[15px] text-slate-800 dark:text-white leading-tight line-clamp-2">
          {quiz.judul}
        </h3>
        {quiz.deskripsi && (
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {quiz.deskripsi}
          </p>
        )}

        {/* Start button */}
        <button
          ref={startBtnRef}
          onClick={onStart}
          aria-label={`Mulai kuis: ${quiz.judul} — perlu login`}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-black text-white border-none cursor-pointer transition-all shadow-lg hover:opacity-90 active:scale-[0.98] ${
            isPsych
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-500/30'
              : 'bg-gradient-to-r from-rose-500 to-orange-500 shadow-rose-500/30'
          }`}
        >
          <FiPlay size={13} fill="currentColor" />
          {isPsych ? 'Mulai Tes' : 'Mulai Kuis'}
        </button>
      </div>
    </article>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ emoji, message }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
      <span className="text-5xl opacity-40" aria-hidden="true">{emoji}</span>
      <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{message}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TutorialPreviewPage() {
  const [tutorials, setTutorials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tutorial');

  // Ref forwarded to whichever card triggered the modal (used by task 5.2)
  const triggerRef = useRef(null);

  // ── Data fetch ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getContents('tutorial').then((d) => (Array.isArray(d) ? d : [])).catch(() => []),
      api.getQuizzes().then((d) => (Array.isArray(d) ? d : [])).catch(() => []),
    ])
      .then(([t, q]) => {
        setTutorials(t);
        setQuizzes(q);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Placeholder handlers (soft-gate wired in task 5.2) ─────────────────────
  const handleTutorialClick = (e, _item) => {
    triggerRef.current = e.currentTarget;
    // TODO task 5.2: open LoginPromptModal with reason='full_tutorial'
  };

  const handleQuizStart = (e, _quiz) => {
    triggerRef.current = e.currentTarget;
    // TODO task 5.2: open LoginPromptModal with reason='start_quiz'
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black overflow-x-hidden transition-colors duration-300 font-sans pb-24">
      {/* Background ornaments */}
      <div
        aria-hidden="true"
        className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3"
      />
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3"
      />

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="text-center pt-32 pb-10 relative z-10 px-4">
        <div className="inline-flex items-center justify-center gap-2 bg-white/50 dark:bg-white/5 border border-blue-200/50 dark:border-blue-900/30 px-5 py-2 rounded-full mb-5 shadow-sm backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
          <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Preview Konten
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
          Tuto<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">rial</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto">
          Jelajahi materi pembelajaran &amp; kuis yang tersedia untuk kamu.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">

        {/* ── Teaser Counter Section ───────────────────────────────────────── */}
        <section
          aria-label="Ringkasan konten tersedia"
          className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-800 p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Counters */}
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="text-center">
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {tutorials.length}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Tutorial tersedia
                </p>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-zinc-700" aria-hidden="true" />
              <div className="text-center">
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {quizzes.length}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Kuis tersedia
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/login"
              aria-label="Login untuk akses penuh ke semua tutorial dan kuis"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 py-3 rounded-2xl transition-colors shadow-lg shadow-blue-600/30 shrink-0"
            >
              <FiLogIn size={16} />
              Login untuk Akses Penuh
            </Link>
          </div>
        </section>

        {/* ── Tab Navigation ───────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Pilih kategori konten"
          className="flex items-center gap-2"
        >
          <button
            role="tab"
            id="tab-tutorial"
            aria-selected={activeTab === 'tutorial'}
            aria-controls="panel-tutorial"
            onClick={() => setActiveTab('tutorial')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeTab === 'tutorial'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                : 'bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-blue-200/50 dark:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiBookOpen size={14} />
              Tutorial
            </span>
          </button>

          <button
            role="tab"
            id="tab-kuis"
            aria-selected={activeTab === 'kuis'}
            aria-controls="panel-kuis"
            onClick={() => setActiveTab('kuis')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === 'kuis'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                : 'bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-indigo-200/50 dark:border-indigo-900/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiPlay size={14} />
              Kuis
            </span>
          </button>
        </div>

        {/* ── Tutorial Panel ───────────────────────────────────────────────── */}
        <div
          id="panel-tutorial"
          role="tabpanel"
          aria-labelledby="tab-tutorial"
          hidden={activeTab !== 'tutorial'}
          className="animate-[slideUp_0.3s_ease-out]"
        >
          <div className="bg-blue-600/10 dark:bg-blue-900/20 rounded-[32px] border border-blue-200/40 dark:border-blue-900/40 p-6 sm:p-8">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white" aria-hidden="true">
                <FiBookOpen className="text-lg" />
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                Materi Tutorial
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <>
                  <SkeletonCard variant="tutorial" />
                  <SkeletonCard variant="tutorial" />
                  <SkeletonCard variant="tutorial" />
                </>
              ) : tutorials.length > 0 ? (
                tutorials.map((item) => (
                  <TutorialCard
                    key={item.id}
                    item={item}
                    onClick={(e) => handleTutorialClick(e, item)}
                  />
                ))
              ) : (
                <EmptyState
                  emoji="📚"
                  message="Belum ada materi tutorial yang tersedia saat ini."
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Kuis Panel ───────────────────────────────────────────────────── */}
        <div
          id="panel-kuis"
          role="tabpanel"
          aria-labelledby="tab-kuis"
          hidden={activeTab !== 'kuis'}
          className="animate-[slideUp_0.3s_ease-out]"
        >
          <div className="bg-indigo-600/10 dark:bg-indigo-900/20 rounded-[32px] border border-indigo-200/40 dark:border-indigo-900/40 p-6 sm:p-8">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white" aria-hidden="true">
                <FiPlay className="text-lg" />
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                Bank Kuis &amp; Tes Asesmen
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <>
                  <SkeletonCard variant="tutorial" />
                  <SkeletonCard variant="tutorial" />
                  <SkeletonCard variant="tutorial" />
                </>
              ) : quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onStart={(e) => handleQuizStart(e, quiz)}
                  />
                ))
              ) : (
                <EmptyState
                  emoji="🎯"
                  message="Belum ada kuis yang tersedia saat ini."
                />
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Slide-up animation */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
