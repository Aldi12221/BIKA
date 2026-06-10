import React, { useState, useEffect } from 'react';
import { FiExternalLink, FiArrowRight, FiDownload, FiFileText, FiX } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function UsahaPage() {
  const [usahaItems, setUsahaItems] = useState([]);
  const [keuanganItems, setKeuanganItems] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeTab with URL hash
  const getTabFromHash = (hash) => {
    const map = { '#memulai': 'memulai', '#resources': 'resources', '#keuangan': 'keuangan' };
    return map[hash] || 'memulai';
  };
  const [activeTab, setActiveTab] = useState(() => getTabFromHash(location.hash));

  useEffect(() => {
    setActiveTab(getTabFromHash(location.hash));
  }, [location.hash]);

  useEffect(() => {
    api.getContents('usaha').then(d => { if (Array.isArray(d)) setUsahaItems(d); }).catch(console.error);
    api.getContents('keuangan').then(d => { if (Array.isArray(d)) setKeuanganItems(d); }).catch(console.error);
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

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden bg-[#F8FAFC] dark:bg-black transition-colors duration-300">
      {/* Background Ornaments like Beranda */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 dark:bg-red-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      {/* HEADER */}
      <section className="pt-32 pb-14 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-2 rounded-full shadow-sm border border-slate-100/50 dark:border-zinc-800 mb-5 hover:shadow-md transition-shadow">
          <span className="text-blue-600 text-lg">🚀</span>
          <span className="text-[11px] font-black text-blue-900 dark:text-blue-400 uppercase tracking-[0.25em]">Mulai Langkah Pertamamu</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-blue-950 dark:text-white tracking-tight uppercase mb-3 drop-shadow-sm transition-colors">
          Usaha
        </h1>
        <p className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600 dark:from-red-400 dark:to-blue-500 tracking-[0.1em]">
          Entrepreneurship
        </p>
      </section>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 space-y-12 relative z-10">

        {/* Tab Sub Menu */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => navigate('/usaha#memulai', { replace: true })}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border cursor-pointer ${activeTab === 'memulai' ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' : 'bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-blue-200/50 dark:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
          >
            Tips Memulai Usaha
          </button>
          <button
            onClick={() => navigate('/usaha#resources', { replace: true })}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border cursor-pointer ${activeTab === 'resources' ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20' : 'bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-red-200/50 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
          >
            Resources
          </button>
          <button
            onClick={() => navigate('/usaha#keuangan', { replace: true })}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border cursor-pointer ${activeTab === 'keuangan' ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' : 'bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-blue-200/50 dark:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
          >
            Tips Mengatur Keuangan
          </button>
        </div>

        {/* Tips memulai usaha */}
        {activeTab === 'memulai' && (
        <section className="scroll-mt-32 animate-[slideUp_0.35s_ease-out]">
          <h2 className="text-xl font-black text-blue-950 dark:text-white mb-4 transition-colors">Tips Memulai Usaha</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usahaItems.length > 0 ? usahaItems.map((item, idx) => (
              <div key={item.id} onClick={() => openContentDetail(item)} className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 shadow-sm border border-slate-50 dark:border-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="relative w-full h-36 mb-4 rounded-[16px] overflow-hidden">
                  <img src={item.gambar || `https://images.unsplash.com/photo-${1522071820081 + idx}?w=400&q=80`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.judul} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" }} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <h4 className="font-bold text-blue-950 dark:text-slate-100 text-[15px] mb-2 leading-snug group-hover:text-blue-600 transition-colors">{item.judul}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider line-clamp-2">{item.deskripsi || 'Klik untuk membaca selengkapnya'}</p>
                <div className="mt-3 pt-3 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">Baca Tips</span>
                  <FiArrowRight size={14} className="text-blue-400" />
                </div>
              </div>
            )) : (
              <div className="col-span-full py-8 text-center text-slate-500">Belum ada tips divalidasi.</div>
            )}
          </div>
        </section>
        )}

        {/* Resources Articles */}
        {activeTab === 'resources' && (
        <section className="animate-[slideUp_0.35s_ease-out]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 dark:bg-zinc-900 rounded-[24px] p-6 text-center border border-red-100 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-base mb-2">Articles</h4>
              <p className="text-[12px] text-red-600/80 dark:text-slate-400 mb-5 font-medium leading-relaxed px-4">Kumpulan artikel menarik tentang merintis bisnis skala kecil.</p>
              <div className="w-14 h-14 mx-auto bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400 text-2xl shadow-sm border border-red-50 dark:border-zinc-700 hover:scale-110 transition-transform">📰</div>
            </div>
            <div className="bg-red-50 dark:bg-zinc-900 rounded-[24px] p-6 text-center border border-red-100 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-base mb-2">Resources</h4>
              <p className="text-[12px] text-red-600/80 dark:text-slate-400 mb-5 font-medium leading-relaxed px-4">Dokumen template bisnis plan, invoice, dan laporan bulanan.</p>
              <div className="w-14 h-14 mx-auto bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400 text-2xl shadow-sm border border-red-50 dark:border-zinc-700 hover:scale-110 transition-transform">📑</div>
            </div>
            <div className="bg-red-50 dark:bg-zinc-900 rounded-[24px] p-6 text-center border border-red-100 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-base mb-2">Resource Tools</h4>
              <p className="text-[12px] text-red-600/80 dark:text-slate-400 mb-5 font-medium leading-relaxed px-4">Rekomendasi alat bantu produktivitas dan operasional.</p>
              <div className="w-14 h-14 mx-auto bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400 text-2xl shadow-sm border border-red-50 dark:border-zinc-700 hover:scale-110 transition-transform">▶️</div>
            </div>
          </div>
        </section>
        )}

        {/* Tips mengatur keuangan grid */}
        {activeTab === 'keuangan' && (
        <section className="scroll-mt-32 animate-[slideUp_0.35s_ease-out]">
          <h2 className="text-xl font-black text-blue-950 dark:text-white mb-4 transition-colors">Tips Mengatur Keuangan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {keuanganItems.length > 0 ? keuanganItems.map((item) => (
              <div key={item.id} onClick={() => openContentDetail(item)} className="bg-blue-50 dark:bg-zinc-900 rounded-[24px] p-5 text-center border border-blue-100 dark:border-zinc-800 hover:shadow-md hover:scale-[1.03] transition-all cursor-pointer group flex flex-col items-center">
                {item.gambar && (
                  <div className="w-full h-24 mb-4 rounded-xl overflow-hidden shrink-0">
                    <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
                  </div>
                )}
                <h4 className="font-bold text-blue-900 dark:text-blue-400 text-[13px] mb-4 group-hover:text-blue-600 transition-colors">{item.judul}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-3 mb-4">{item.deskripsi || 'Baca selengkapnya...'}</p>
                <div className="flex justify-center mt-auto">
                  <FiArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )) : (
              <div className="col-span-full py-8 text-center text-slate-500">Belum ada tips keuangan divalidasi.</div>
            )}
          </div>
        </section>
        )}
      </div>

      {/* ===== ARTICLE DETAIL MODAL ===== */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={closeContentModal}>
          <div
            className="bg-white dark:bg-zinc-900 rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-[slideUp_0.35s_ease-out] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header/Image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 shrink-0">
              {selectedContent.gambar ? (
                <img src={selectedContent.gambar} alt={selectedContent.judul} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">📰</div>
              )}
              <button onClick={closeContentModal} className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border-none cursor-pointer transition-all">
                <FiX size={20} />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg capitalize">
                  {selectedContent.kategori}
                </span>
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
                    className="flex items-center gap-2 text-blue-600 font-black text-sm hover:gap-3 transition-all cursor-pointer bg-transparent border-none"
                  >
                    Kunjungi Sumber Eksternal <FiExternalLink />
                  </button>
                </div>
              )}

              {/* File Tambahan */}
              {selectedContent.file_tambahan && JSON.parse(selectedContent.file_tambahan).length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">File Lampiran</h4>
                  <div className="flex flex-col gap-3">
                    {JSON.parse(selectedContent.file_tambahan).map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <FiFileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{file.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase">{file.type?.split('/')[1] || 'File'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (!user) {
                              toast.error('Silakan login untuk mendownload lampiran');
                              navigate('/login');
                              return;
                            }
                            const link = document.createElement('a');
                            link.href = file.data;
                            link.download = file.name;
                            link.click();
                          }}
                          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer border-none"
                        >
                          <FiDownload size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
}
