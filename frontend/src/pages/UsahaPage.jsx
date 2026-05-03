import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartData = {
  labels: ['Bln 1','Bln 2','Bln 3','Bln 4','Bln 5','Bln 6','Bln 7','Bln 8','Bln 9','Bln 10','Bln 11','Bln 12'],
  datasets: [
    {
      label: 'Pendapatan (Rp)',
      data: [700000,1200000,1700000,2600000,3500000,4600000,5800000,6900000,7900000,9000000,10300000,12000000],
      borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: '#2563EB',
    },
    {
      label: 'Biaya Operasional (Rp)',
      data: [2300000,2200000,2100000,2200000,2400000,2600000,2800000,3000000,3200000,3400000,3600000,3900000],
      borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: '#EF4444',
    },
  ],
};

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#64748B', font: { family: 'inherit', weight: '600' } } } },
  scales: {
    x: { ticks: { color: '#64748B', font: { family: 'inherit', weight: '500' } }, grid: { color: '#F1F5F9' } },
    y: { ticks: { color: '#64748B', font: { family: 'inherit', weight: '500' }, callback: (v) => `Rp ${(v/1000000).toFixed(1)}jt` }, grid: { color: '#F1F5F9' } },
  },
};

function Calculator() {
  const [calcVal, setCalcVal] = useState('0');
  const [operator, setOperator] = useState(null);
  const [prevVal, setPrevVal] = useState(null);

  const handleCalc = (val) => {
    if (val === 'C') {
      setCalcVal('0');
      setOperator(null);
      setPrevVal(null);
    } else if (['+','-','*','/'].includes(val)) {
      setOperator(val);
      setPrevVal(calcVal);
      setCalcVal('0');
    } else if (val === '=') {
      if (operator && prevVal) {
        try {
          // eslint-disable-next-line no-eval
          const res = eval(`${prevVal}${operator}${calcVal}`);
          setCalcVal(String(res));
          setOperator(null);
          setPrevVal(null);
        } catch {
          setCalcVal('Err');
        }
      }
    } else {
      setCalcVal(calcVal === '0' ? val : calcVal + val);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[16px] p-3 shadow-inner dark:shadow-black/50 text-left mx-auto max-w-[200px] transition-colors border border-transparent dark:border-zinc-800">
      <div className="bg-slate-50 dark:bg-black text-right px-3 py-2 rounded-lg mb-3 text-lg font-black text-slate-800 dark:text-slate-100 tracking-wider truncate border border-slate-100 dark:border-zinc-800 shadow-inner transition-colors">
        {calcVal}
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs font-black">
        {['7','8','9','/'].map(k => <button key={k} onClick={()=>handleCalc(k)} className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border-none cursor-pointer shadow-sm active:scale-95">{k}</button>)}
        {['4','5','6','*'].map(k => <button key={k} onClick={()=>handleCalc(k)} className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border-none cursor-pointer shadow-sm active:scale-95">{k}</button>)}
        {['1','2','3','-'].map(k => <button key={k} onClick={()=>handleCalc(k)} className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border-none cursor-pointer shadow-sm active:scale-95">{k}</button>)}
        {['C','0','=','+'].map(k => <button key={k} onClick={()=>handleCalc(k)} className={`${k==='=' ? 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' : k==='C' ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900' : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900'} py-2 rounded transition-colors border-none cursor-pointer shadow-sm active:scale-95`}>{k}</button>)}
      </div>
    </div>
  );
}

export default function UsahaPage() {
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
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 shadow-sm border border-slate-50 dark:border-zinc-800 hover:shadow-lg transition-all cursor-pointer">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80" className="w-full h-36 object-cover rounded-[16px] mb-4 shadow-sm" alt="Mental Usaha" />
              <h4 className="font-bold text-blue-950 dark:text-slate-100 text-[15px] mb-2 leading-snug">Tips memulai usaha dari mental usaha</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">2 hours ago</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 shadow-sm border border-slate-50 dark:border-zinc-800 hover:shadow-lg transition-all cursor-pointer">
              <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80" className="w-full h-36 object-cover rounded-[16px] mb-4 shadow-sm" alt="Keuangan" />
              <h4 className="font-bold text-blue-950 dark:text-slate-100 text-[15px] mb-2 leading-snug">Tips mengatur keuangan merintis usaha</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">3 hours ago</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-5 shadow-sm border border-slate-50 dark:border-zinc-800 hover:shadow-lg transition-all cursor-pointer">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" className="w-full h-36 object-cover rounded-[16px] mb-4 shadow-sm" alt="Grafik" />
              <h4 className="font-bold text-blue-950 dark:text-slate-100 text-[15px] mb-2 leading-snug">Tips membaca kurva pendapatan bisnis</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">5 hours ago</p>
            </div>
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
          <h2 className="text-xl font-black text-blue-950 dark:text-white mb-4 transition-colors">Tips mengatur keuangan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-blue-600 dark:bg-blue-900 rounded-[24px] p-5 text-center shadow-lg shadow-blue-200 dark:shadow-none border border-blue-400 dark:border-blue-800 transition-colors">
              <h4 className="font-bold text-white text-[13px] mb-4">Calculator calculator</h4>
              <Calculator />
            </div>
            <div className="bg-blue-50 dark:bg-zinc-900 rounded-[24px] p-5 text-center border border-blue-100 dark:border-zinc-800 hover:shadow-md transition-all">
              <h4 className="font-bold text-blue-900 dark:text-blue-400 text-[13px] mb-4">Tips mengatur keuangan</h4>
              <Calculator />
            </div>
            <div className="bg-blue-50 dark:bg-zinc-900 rounded-[24px] p-5 text-center border border-blue-100 dark:border-zinc-800 hover:shadow-md transition-all">
              <h4 className="font-bold text-blue-900 dark:text-blue-400 text-[13px] mb-4">Calculator plannament</h4>
              <Calculator />
            </div>
            <div className="bg-blue-50 dark:bg-zinc-900 rounded-[24px] p-5 text-center border border-blue-100 dark:border-zinc-800 hover:shadow-md transition-all">
              <h4 className="font-bold text-blue-900 dark:text-blue-400 text-[13px] mb-4">Canva profits penderizations</h4>
              <Calculator />
            </div>
          </div>
        </section>

        {/* Kurva pendapatan usaha */}
        <section>
          <div className="bg-gradient-to-r from-blue-50 to-red-50 dark:from-zinc-900 dark:to-zinc-800 rounded-[36px] p-8 md:p-10 shadow-xl shadow-slate-200/40 dark:shadow-black/50 border border-white dark:border-zinc-800 relative overflow-hidden transition-colors">
            <div className="relative z-10">
              <h2 className="text-xl font-black text-blue-950 dark:text-white mb-1 transition-colors">Kurva pendapatan usaha</h2>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold mb-6 tracking-wide transition-colors">Kurva flow pendapatan usaha</p>
              <div className="bg-white dark:bg-black rounded-[24px] p-4 border border-slate-100 dark:border-zinc-800 shadow-sm transition-colors">
                <div className="h-[300px] w-full">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
