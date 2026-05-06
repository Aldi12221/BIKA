import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#64748B', font: { family: 'inherit', weight: '600' } } } },
  scales: {
    x: { ticks: { color: '#64748B', font: { family: 'inherit', weight: '500' } }, grid: { color: '#F1F5F9' } },
    y: { ticks: { color: '#64748B', font: { family: 'inherit', weight: '500' }, callback: (v) => `Rp ${(v / 1000).toFixed(0)}k` }, grid: { color: '#F1F5F9' } },
  },
};

export default function UsahaPage() {
  const [usahaItems, setUsahaItems] = useState([]);
  const [keuanganItems, setKeuanganItems] = useState([]);
  
  // Pengelola Keuangan State
  const [transactions, setTransactions] = useState([]);
  const [trxForm, setTrxForm] = useState({ jenis: 'pemasukan', nominal: '', keterangan: '', bulan: '1' });

  useEffect(() => {
    api.getContents('usaha').then(d => { if (Array.isArray(d)) setUsahaItems(d); }).catch(console.error);
    api.getContents('keuangan').then(d => { if (Array.isArray(d)) setKeuanganItems(d); }).catch(console.error);
  }, []);

  const addTransaction = () => {
    if (!trxForm.nominal || !trxForm.keterangan) return;
    setTransactions([...transactions, { ...trxForm, id: Date.now(), nominal: Number(trxForm.nominal) }]);
    setTrxForm({ ...trxForm, nominal: '', keterangan: '' });
  };
  
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Kalkulasi data chart
  const incomeData = Array(12).fill(0);
  const expenseData = Array(12).fill(0);
  
  transactions.forEach(t => {
    const idx = parseInt(t.bulan) - 1;
    if (t.jenis === 'pemasukan') incomeData[idx] += t.nominal;
    else expenseData[idx] += t.nominal;
  });

  const dynamicChartData = {
    labels: ['Bln 1', 'Bln 2', 'Bln 3', 'Bln 4', 'Bln 5', 'Bln 6', 'Bln 7', 'Bln 8', 'Bln 9', 'Bln 10', 'Bln 11', 'Bln 12'],
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: incomeData,
        borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: '#2563EB',
      },
      {
        label: 'Pengeluaran (Rp)',
        data: expenseData,
        borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: '#EF4444',
      },
    ],
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

        {/* Tips memulai usaha */}
        <section>
          <h2 className="text-xl font-black text-blue-950 dark:text-white mb-4 transition-colors">Tips memulai usaha</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usahaItems.length > 0 ? usahaItems.map((item, idx) => (
              <div key={item.id} onClick={() => item.link_eksternal && window.open(item.link_eksternal, '_blank')} className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 shadow-sm border border-slate-50 dark:border-zinc-800 hover:shadow-lg transition-all cursor-pointer">
                <img src={`https://images.unsplash.com/photo-${1522071820081 + idx}?w=400&q=80`} className="w-full h-36 object-cover rounded-[16px] mb-4 shadow-sm" alt="Mental Usaha" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" }} />
                <h4 className="font-bold text-blue-950 dark:text-slate-100 text-[15px] mb-2 leading-snug">{item.judul}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider line-clamp-2">{item.deskripsi || 'Terbaru'}</p>
              </div>
            )) : (
              <div className="col-span-full py-8 text-center text-slate-500">Belum ada tips divalidasi.</div>
            )}
          </div>
        </section>

        {/* Resources Articles */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 dark:bg-zinc-900 rounded-[24px] p-6 text-center border border-red-100 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-base mb-2">Articles</h4>
              <p className="text-[12px] text-red-600/80 dark:text-slate-400 mb-5 font-medium leading-relaxed px-4">Kumpulan artikel menarik tentang merintis bisnis skala kecil.</p>
              <div className="w-14 h-14 mx-auto bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400 text-2xl shadow-sm border border-red-50 dark:border-zinc-700 hover:scale-110 transition-transform">📰</div>
            </div>
            <div className="bg-red-50 dark:bg-zinc-900 rounded-[24px] p-6 text-center border border-red-100 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-base mb-2">Resources and</h4>
              <p className="text-[12px] text-red-600/80 dark:text-slate-400 mb-5 font-medium leading-relaxed px-4">Dokumen template bisnis plan, invoice, dan laporan bulanan.</p>
              <div className="w-14 h-14 mx-auto bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400 text-2xl shadow-sm border border-red-50 dark:border-zinc-700 hover:scale-110 transition-transform">📑</div>
            </div>
            <div className="bg-red-50 dark:bg-zinc-900 rounded-[24px] p-6 text-center border border-red-100 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-base mb-2">Resource tools</h4>
              <p className="text-[12px] text-red-600/80 dark:text-slate-400 mb-5 font-medium leading-relaxed px-4">Rekomendasi alat bantu produktivitas dan operasional.</p>
              <div className="w-14 h-14 mx-auto bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400 text-2xl shadow-sm border border-red-50 dark:border-zinc-700 hover:scale-110 transition-transform">▶️</div>
            </div>
          </div>
        </section>

        {/* Tips mengatur keuangan grid */}
        <section>
          <h2 className="text-xl font-black text-blue-950 dark:text-white mb-4 transition-colors">Tips Mengatur Keuangan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {keuanganItems.length > 0 ? keuanganItems.map((item) => (
              <div key={item.id} onClick={() => item.link_eksternal && window.open(item.link_eksternal, '_blank')} className="bg-blue-50 dark:bg-zinc-900 rounded-[24px] p-5 text-center border border-blue-100 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer">
                <h4 className="font-bold text-blue-900 dark:text-blue-400 text-[13px] mb-4">{item.judul}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-3">{item.deskripsi || 'Baca selengkapnya...'}</p>
              </div>
            )) : (
              <div className="col-span-full py-8 text-center text-slate-500">Belum ada tips keuangan divalidasi.</div>
            )}
          </div>
        </section>

        {/* Pengelola Keuangan Feature */}
        <section>
          <div className="bg-white dark:bg-zinc-900 rounded-[36px] p-8 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-zinc-800 transition-colors">
            <h2 className="text-xl font-black text-blue-950 dark:text-white mb-1">Pengelola Keuangan</h2>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold mb-6">Catat pemasukan dan pengeluaran usahamu</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Form Input */}
              <div className="md:col-span-1 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Jenis</label>
                  <select value={trxForm.jenis} onChange={e => setTrxForm({...trxForm, jenis: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all">
                    <option value="pemasukan" className="bg-white dark:bg-zinc-900">Pemasukan</option>
                    <option value="pengeluaran" className="bg-white dark:bg-zinc-900">Pengeluaran</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Bulan ke-</label>
                  <select value={trxForm.bulan} onChange={e => setTrxForm({...trxForm, bulan: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(b => <option key={b} value={b} className="bg-white dark:bg-zinc-900">Bulan {b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Nominal (Rp)</label>
                  <input type="number" value={trxForm.nominal} onChange={e => setTrxForm({...trxForm, nominal: e.target.value})} placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Keterangan</label>
                  <input type="text" value={trxForm.keterangan} onChange={e => setTrxForm({...trxForm, keterangan: e.target.value})} placeholder="Misal: Penjualan produk" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <button onClick={addTransaction} className="w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95">
                  <FiPlus /> Tambah Data
                </button>
              </div>

              {/* List Transaksi */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Riwayat Transaksi</h3>
                <div className="bg-slate-50 dark:bg-black/50 border border-slate-100 dark:border-zinc-800 rounded-2xl h-[380px] overflow-y-auto p-4 space-y-3 shadow-inner">
                  {transactions.length > 0 ? transactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800 animate-slide-up">
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.keterangan}</p>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Bulan ke-{t.bulan}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-black ${t.jenis === 'pemasukan' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {t.jenis === 'pemasukan' ? '+' : '-'} Rp {t.nominal.toLocaleString('id-ID')}
                        </span>
                        <button onClick={() => deleteTransaction(t.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-sm font-medium text-slate-400">Belum ada transaksi dicatat</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kurva pendapatan usaha */}
        <section>
          <div className="bg-gradient-to-r from-blue-50 to-red-50 dark:from-zinc-900 dark:to-zinc-800 rounded-[36px] p-8 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-black/50 border border-white dark:border-zinc-800 relative overflow-hidden transition-colors">
            <div className="relative z-10">
              <h2 className="text-xl font-black text-blue-950 dark:text-white mb-1 transition-colors">Kurva Keuangan Usaha</h2>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold mb-6 tracking-wide transition-colors">Visualisasi pemasukan dan pengeluaran per bulan</p>
              <div className="bg-white dark:bg-black rounded-[24px] p-4 border border-slate-100 dark:border-zinc-800 shadow-sm transition-colors">
                <div className="h-[300px] w-full">
                  <Line data={dynamicChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
