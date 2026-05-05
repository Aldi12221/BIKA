import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPlay, FiBookOpen, FiMessageCircle, FiUserCheck } from 'react-icons/fi';
import api from '../utils/api';

export default function TutorialPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getQuizzes().then(d => {
      if (Array.isArray(d)) setQuizzes(d);
    }).catch(console.error);

    api.getContents('tutorial').then(d => {
      if (Array.isArray(d)) setTutorials(d);
    }).catch(console.error);
  }, []);
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

      <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">

        {/* 1. Bank Kuis Section */}
        <div className="bg-[#FF9B9B] dark:bg-rose-900/40 rounded-[32px] p-8 shadow-sm border border-rose-200 dark:border-rose-900/50 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/30 dark:bg-black/20 rounded-xl flex items-center justify-center text-white">
              <FiBookOpen className="text-xl" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Bank Kuis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {quizzes.length > 0 ? quizzes.map((quiz, idx) => (
              <div key={quiz.id} onClick={() => navigate(`/quiz/${quiz.id}`)} className="bg-white/90 dark:bg-white/10 rounded-2xl p-4 flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer shadow-sm">
                <div>
                  <h4 className="font-black text-[15px] text-slate-800 dark:text-white leading-tight">{quiz.judul}</h4>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-300 capitalize">{quiz.kategori} · {quiz.deskripsi || 'Belum dideskripsi'}</p>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/50 text-rose-400 dark:text-rose-300">
                  <FiPlay className="text-sm ml-0.5" />
                </div>
              </div>
            )) : (
              <div className="col-span-full py-4 text-white/80">Belum ada kuis tersedia.</div>
            )}
          </div>

          <div className="flex items-center gap-4 bg-white/20 dark:bg-black/20 rounded-2xl p-4">
            <span className="text-white font-bold text-sm whitespace-nowrap">Progress</span>
            <div className="flex-1 h-2.5 bg-white/30 dark:bg-black/40 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-[#93C5FD] dark:bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-white font-black text-sm">50/100</span>
            <button className="bg-[#93C5FD] dark:bg-blue-600 text-white text-xs font-black px-5 py-2 rounded-xl hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors shadow-sm">
              Progress
            </button>
          </div>
        </div>

        {/* 2. Tips & Trick Wawancara Section */}
        <div className="bg-[#FF9B9B] dark:bg-rose-900/40 rounded-[32px] p-8 shadow-sm border border-rose-200 dark:border-rose-900/50 transition-colors">
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
                <div key={item.id} onClick={() => item.link_eksternal && window.open(item.link_eksternal, '_blank')} className="flex items-center gap-4 bg-white/90 dark:bg-white/10 rounded-2xl p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-black/30 rounded-xl overflow-hidden shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${item.judul}&background=cbd5e1&color=475569`} alt="Thumbnail" className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div>
                    <h4 className="font-black text-[13px] text-slate-800 dark:text-white leading-tight mb-1">{item.judul}</h4>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">{item.deskripsi ? item.deskripsi.substring(0, 30) + '...' : 'Tutorial Baru'}</p>
                  </div>
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
                    <div className="absolute inset-0 bg-rose-500/20"></div>
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
        <div className="bg-[#FF9B9B] dark:bg-rose-900/40 rounded-[32px] p-8 shadow-sm border border-rose-200 dark:border-rose-900/50 transition-colors text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="flex flex-col items-center justify-center mb-8 relative z-10">
            <h2 className="text-2xl font-black text-white tracking-tight mb-6">Test Psikotes</h2>
            <button className="bg-[#93C5FD] dark:bg-blue-600 text-white font-black text-sm px-8 py-3 rounded-full hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors shadow-md shadow-blue-500/20">
              Start now
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {[
              { title: "Info", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
              { title: "Video", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
              { title: "Info", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
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
    </div>
  );
}
