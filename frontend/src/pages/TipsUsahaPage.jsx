import React, { useState, useEffect } from 'react';
import { FiExternalLink, FiArrowRight, FiDownload, FiFileText, FiX, FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function TipsUsahaPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContent, setSelectedContent] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.getContents('usaha')
            .then(d => { if (Array.isArray(d)) setItems(d); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        document.body.style.overflow = selectedContent ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedContent]);

    return (
        <div className="min-h-screen pb-24 overflow-x-hidden bg-[#F8FAFC] dark:bg-black transition-colors duration-300">
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 dark:bg-red-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <section className="pt-12 pb-10 text-center relative z-10 px-6">
                <button
                    onClick={() => navigate('/usaha')}
                    className="inline-flex items-center gap-2 mb-6 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer"
                >
                    <FiChevronLeft size={16} /> Kembali ke Menu Usaha
                </button>

                <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-2 rounded-full shadow-sm border border-slate-100/50 dark:border-zinc-800 mb-5">
                    <span className="text-blue-600 text-lg">🚀</span>
                    <span className="text-[11px] font-black text-blue-900 dark:text-blue-400 uppercase tracking-[0.25em]">Mulai Langkah Pertamamu</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-blue-950 dark:text-white tracking-tight mb-3 drop-shadow-sm">
                    Tips Memulai Usaha
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
                    Panduan langkah demi langkah untuk memulai usahamu dari nol hingga sukses.
                </p>
            </section>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 border border-slate-100 dark:border-zinc-800 animate-pulse">
                                <div className="w-full h-36 bg-slate-100 dark:bg-zinc-800 rounded-[16px] mb-4" />
                                <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded mb-2" />
                                <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {items.map((item, idx) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedContent(item)}
                                className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                <div className="relative w-full h-36 mb-4 rounded-[16px] overflow-hidden">
                                    <img
                                        src={item.gambar || `https://images.unsplash.com/photo-${1522071820081 + idx}?w=400&q=80`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        alt={item.judul}
                                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80'; }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <h4 className="font-bold text-blue-950 dark:text-slate-100 text-[15px] mb-2 leading-snug group-hover:text-blue-600 transition-colors">{item.judul}</h4>
                                <p className="text-[11px] text-slate-400 font-medium line-clamp-2">{item.deskripsi || 'Klik untuk membaca selengkapnya'}</p>
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">Baca Tips</span>
                                    <FiArrowRight size={14} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-400 italic">Belum ada tips yang tersedia.</div>
                )}
            </div>

            {selectedContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedContent(null)}>
                    <div
                        className="bg-white dark:bg-zinc-900 rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-[slideUp_0.35s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 shrink-0">
                            {selectedContent.gambar
                                ? <img src={selectedContent.gambar} alt={selectedContent.judul} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🚀</div>
                            }
                            <button onClick={() => setSelectedContent(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border-none cursor-pointer">
                                <FiX size={20} />
                            </button>
                            <div className="absolute bottom-4 left-6">
                                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Memulai Usaha</span>
                            </div>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">{selectedContent.judul}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-8 pb-4 border-b border-slate-100 dark:border-white/5">{selectedContent.deskripsi}</p>
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-base font-medium">
                                {selectedContent.isi_konten}
                            </div>
                            {selectedContent.link_eksternal && (
                                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5">
                                    <button onClick={() => window.open(selectedContent.link_eksternal, '_blank')} className="flex items-center gap-2 text-blue-600 font-black text-sm hover:gap-3 transition-all cursor-pointer bg-transparent border-none">
                                        Kunjungi Sumber Eksternal <FiExternalLink />
                                    </button>
                                </div>
                            )}
                            {selectedContent.file_tambahan && (() => {
                                try {
                                    const files = JSON.parse(selectedContent.file_tambahan);
                                    if (files.length === 0) return null;
                                    return (
                                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">File Lampiran</h4>
                                            <div className="flex flex-col gap-3">
                                                {files.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><FiFileText size={20} /></div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{file.name}</p>
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase">{file.type?.split('/')[1] || 'File'}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                if (!user) { toast.error('Silakan login untuk mendownload'); navigate('/login'); return; }
                                                                const link = document.createElement('a'); link.href = file.data; link.download = file.name; link.click();
                                                            }}
                                                            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors border-none cursor-pointer"
                                                        ><FiDownload size={16} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                } catch { return null; }
                            })()}
                        </div>
                    </div>
                </div>
            )}
            <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(40px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        .custom-scrollbar::-webkit-scrollbar { width:6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background:#334155; }
      `}</style>
        </div>
    );
}
