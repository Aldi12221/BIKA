import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiChevronLeft, FiDollarSign, FiTrendingUp, FiShoppingBag,
    FiPercent, FiRefreshCw, FiChevronDown, FiInfo
} from 'react-icons/fi';

/* ─── Formatter ─── */
const fmt = (n) => new Intl.NumberFormat('id-ID').format(Math.round(n));
const parseNum = (s) => parseFloat(String(s).replace(/[.,]/g, '')) || 0;

/* ─── Input Component ─── */
function InputField({ label, value, onChange, prefix = 'Rp', suffix, hint, min = 0 }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {label}
            </label>
            <div className="relative flex items-center">
                {prefix && (
                    <span className="absolute left-4 text-sm font-bold text-slate-400 select-none">{prefix}</span>
                )}
                <input
                    type="number"
                    min={min}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl py-3.5 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all ${prefix ? 'pl-10 pr-4' : 'px-4'} ${suffix ? 'pr-12' : ''}`}
                    placeholder="0"
                />
                {suffix && (
                    <span className="absolute right-4 text-sm font-bold text-slate-400 select-none">{suffix}</span>
                )}
            </div>
            {hint && <p className="text-[10px] text-slate-400 dark:text-slate-500 pl-1">{hint}</p>}
        </div>
    );
}

/* ─── Result Card ─── */
function ResultCard({ label, value, color = 'blue', large = false, sub }) {
    const colors = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/40',
        green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40',
        red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900/40',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/40',
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/40',
    };
    return (
        <div className={`rounded-2xl border p-4 ${colors[color]}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70 mb-1">{label}</p>
            <p className={`font-black leading-tight ${large ? 'text-2xl' : 'text-lg'}`}>{value}</p>
            {sub && <p className="text-[10px] mt-1 opacity-60 font-medium">{sub}</p>}
        </div>
    );
}

/* ─── Accordion Section ─── */
function Section({ title, icon, open, onToggle, children, accent = 'blue' }) {
    const accents = {
        blue: 'text-blue-600',
        green: 'text-emerald-600',
        amber: 'text-amber-600',
        purple: 'text-purple-600',
    };
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-5 bg-transparent border-none cursor-pointer group"
            >
                <div className="flex items-center gap-3">
                    <span className={`text-xl ${accents[accent]}`}>{icon}</span>
                    <span className="font-black text-slate-800 dark:text-white text-base">{title}</span>
                </div>
                <FiChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="px-6 pb-6 border-t border-slate-100 dark:border-zinc-800 pt-5 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────
   KALKULATOR 1 — BEP (Break-Even Point)
────────────────────────────────────────────── */
function KalkulatorBEP() {
    const [biayaTetap, setBiayaTetap] = useState('');
    const [hargaJual, setHargaJual] = useState('');
    const [biayaVariabel, setBiayaVariabel] = useState('');

    const bt = parseNum(biayaTetap);
    const hj = parseNum(hargaJual);
    const bv = parseNum(biayaVariabel);

    const marginKontribusi = hj - bv;
    const bepUnit = marginKontribusi > 0 ? bt / marginKontribusi : null;
    const bepRupiah = bepUnit !== null ? bepUnit * hj : null;
    const rasioMK = hj > 0 ? (marginKontribusi / hj) * 100 : 0;

    const canCalc = bt > 0 && hj > 0 && bv >= 0 && marginKontribusi > 0;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField label="Biaya Tetap / Bulan" value={biayaTetap} onChange={setBiayaTetap}
                    hint="Sewa, gaji, listrik tetap, dll." />
                <InputField label="Harga Jual per Unit" value={hargaJual} onChange={setHargaJual}
                    hint="Harga yang kamu tawarkan ke pembeli" />
                <InputField label="Biaya Variabel per Unit" value={biayaVariabel} onChange={setBiayaVariabel}
                    hint="Bahan baku, ongkos kirim per produk" />
            </div>

            {canCalc ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    <ResultCard label="BEP Unit" value={`${fmt(bepUnit)} unit`} color="blue" large />
                    <ResultCard label="BEP Rupiah" value={`Rp ${fmt(bepRupiah)}`} color="indigo" large />
                    <ResultCard label="Margin Kontribusi" value={`Rp ${fmt(marginKontribusi)}`} color="green"
                        sub="per unit terjual" />
                    <ResultCard label="Rasio Margin" value={`${rasioMK.toFixed(1)}%`} color="amber"
                        sub="dari harga jual" />
                </div>
            ) : (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-slate-100 dark:border-zinc-700">
                    <FiInfo size={16} className="text-slate-400 shrink-0" />
                    <p className="text-[12px] text-slate-400 font-medium">
                        Isi semua field di atas dan pastikan Harga Jual &gt; Biaya Variabel untuk melihat hasil.
                    </p>
                </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
                <p className="text-[11px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">💡 Apa itu BEP?</p>
                <p className="text-[12px] text-blue-600 dark:text-blue-300 leading-relaxed">
                    Break-Even Point adalah titik di mana total pendapatan sama dengan total biaya — kamu belum untung, tapi juga tidak rugi.
                    Di atas BEP = profit. Di bawah BEP = rugi.
                </p>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   KALKULATOR 2 — Laba Rugi Sederhana
────────────────────────────────────────────── */
function KalkulatorLabaRugi() {
    const [pendapatan, setPendapatan] = useState('');
    const [hpp, setHpp] = useState('');
    const [biayaOp, setBiayaOp] = useState('');
    const [pajak, setPajak] = useState('');

    const p = parseNum(pendapatan);
    const h = parseNum(hpp);
    const b = parseNum(biayaOp);
    const pjk = parseNum(pajak);

    const labaKotor = p - h;
    const labaBersihSebelumPajak = labaKotor - b;
    const nilaiPajak = labaBersihSebelumPajak > 0 ? labaBersihSebelumPajak * (pjk / 100) : 0;
    const labaBersih = labaBersihSebelumPajak - nilaiPajak;
    const marginBersih = p > 0 ? (labaBersih / p) * 100 : 0;
    const marginKotor = p > 0 ? (labaKotor / p) * 100 : 0;

    const canCalc = p > 0;
    const isProfit = labaBersih >= 0;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Total Pendapatan" value={pendapatan} onChange={setPendapatan}
                    hint="Total uang masuk dari penjualan" />
                <InputField label="HPP (Harga Pokok Produksi)" value={hpp} onChange={setHpp}
                    hint="Total biaya langsung pembuatan produk" />
                <InputField label="Biaya Operasional" value={biayaOp} onChange={setBiayaOp}
                    hint="Sewa, marketing, gaji, listrik, dll." />
                <InputField label="Persentase Pajak" value={pajak} onChange={setPajak}
                    prefix="" suffix="%" hint="Kosongkan jika tidak kena pajak" />
            </div>

            {canCalc && (
                <div className="space-y-3">
                    {/* Waterfall ringkasan */}
                    <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-slate-100 dark:border-zinc-700 space-y-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <div className="flex justify-between"><span>Pendapatan</span><span className="text-emerald-600">+ Rp {fmt(p)}</span></div>
                        <div className="flex justify-between"><span>HPP</span><span className="text-red-500">− Rp {fmt(h)}</span></div>
                        <div className="flex justify-between border-t border-slate-200 dark:border-zinc-700 pt-2">
                            <span>Laba Kotor</span><span className={labaKotor >= 0 ? 'text-emerald-600' : 'text-red-500'}>Rp {fmt(labaKotor)}</span>
                        </div>
                        <div className="flex justify-between"><span>Biaya Operasional</span><span className="text-red-500">− Rp {fmt(b)}</span></div>
                        {pjk > 0 && <div className="flex justify-between"><span>Pajak ({pjk}%)</span><span className="text-red-500">− Rp {fmt(nilaiPajak)}</span></div>}
                        <div className="flex justify-between border-t-2 border-slate-300 dark:border-zinc-600 pt-2 text-base">
                            <span className="font-black">Laba Bersih</span>
                            <span className={`font-black ${labaBersih >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {labaBersih >= 0 ? '+' : ''} Rp {fmt(labaBersih)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <ResultCard label="Margin Kotor" value={`${marginKotor.toFixed(1)}%`} color="blue" />
                        <ResultCard label="Margin Bersih" value={`${marginBersih.toFixed(1)}%`} color={isProfit ? 'green' : 'red'} />
                        <ResultCard label="Status" value={isProfit ? '✅ UNTUNG' : '❌ RUGI'}
                            color={isProfit ? 'green' : 'red'} sub={isProfit ? 'Bisnis sehat' : 'Perlu evaluasi'} />
                    </div>
                </div>
            )}
        </div>
    );
}

/* ──────────────────────────────────────────────
   KALKULATOR 3 — Harga Jual (Pricing)
────────────────────────────────────────────── */
function KalkulatorHargaJual() {
    const [modalProduksi, setModalProduksi] = useState('');
    const [biayaOverhead, setBiayaOverhead] = useState('');
    const [targetMargin, setTargetMargin] = useState('30');
    const [qty, setQty] = useState('1');
    const [diskon, setDiskon] = useState('');

    const mp = parseNum(modalProduksi);
    const bo = parseNum(biayaOverhead);
    const tm = parseNum(targetMargin);
    const q = Math.max(1, parseNum(qty));
    const d = parseNum(diskon);

    const hppPerUnit = (mp + bo) / q;
    const hargaJualMin = hppPerUnit * (1 + tm / 100);
    const hargaSetelahDiskon = hargaJualMin * (1 - d / 100);
    const keuntunganPerUnit = hargaJualMin - hppPerUnit;
    const keuntunganSetelahDiskon = hargaSetelahDiskon - hppPerUnit;

    const canCalc = mp > 0 && tm > 0;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Total Modal Produksi" value={modalProduksi} onChange={setModalProduksi}
                    hint="Semua biaya bahan baku & produksi" />
                <InputField label="Biaya Overhead" value={biayaOverhead} onChange={setBiayaOverhead}
                    hint="Listrik, kemasan, transportasi, dll." />
                <InputField label="Jumlah Produk (pcs)" value={qty} onChange={setQty}
                    prefix="" hint="Berapa unit yang diproduksi?" />
                <InputField label="Target Margin Keuntungan" value={targetMargin} onChange={setTargetMargin}
                    prefix="" suffix="%" hint="Berapa % keuntungan yang kamu mau?" />
                <InputField label="Diskon (opsional)" value={diskon} onChange={setDiskon}
                    prefix="" suffix="%" hint="Diskon promosi jika ada" />
            </div>

            {canCalc && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <ResultCard label="HPP per Unit" value={`Rp ${fmt(hppPerUnit)}`} color="indigo" />
                    <ResultCard label="Harga Jual Ideal" value={`Rp ${fmt(hargaJualMin)}`} color="blue" large />
                    <ResultCard label="Untung per Unit" value={`Rp ${fmt(keuntunganPerUnit)}`} color="green" />
                    {d > 0 && <>
                        <ResultCard label={`Harga Setelah Diskon ${d}%`} value={`Rp ${fmt(hargaSetelahDiskon)}`} color="amber" />
                        <ResultCard label="Untung Setelah Diskon" value={`Rp ${fmt(keuntunganSetelahDiskon)}`}
                            color={keuntunganSetelahDiskon >= 0 ? 'green' : 'red'} />
                    </>}
                </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/30">
                <p className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">💡 Tips Pricing</p>
                <p className="text-[12px] text-amber-600 dark:text-amber-300 leading-relaxed">
                    Margin 20-30% umum untuk FMCG. Untuk jasa atau produk premium, margin bisa 50-100%+.
                    Pastikan harga jualmu kompetitif dengan riset harga kompetitor.
                </p>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   KALKULATOR 4 — ROI Investasi
────────────────────────────────────────────── */
function KalkulatorROI() {
    const [modalAwal, setModalAwal] = useState('');
    const [pendapatanBulanan, setPendapatanBulanan] = useState('');
    const [biayaBulanan, setBiayaBulanan] = useState('');
    const [durasi, setDurasi] = useState('12');

    const ma = parseNum(modalAwal);
    const pb = parseNum(pendapatanBulanan);
    const bb = parseNum(biayaBulanan);
    const d = Math.max(1, parseNum(durasi));

    const labaBersihBulanan = pb - bb;
    const labaBersihTotal = labaBersihBulanan * d;
    const roi = ma > 0 ? ((labaBersihTotal - ma) / ma) * 100 : null;
    const paybackPeriod = labaBersihBulanan > 0 ? ma / labaBersihBulanan : null;
    const canCalc = ma > 0 && pb > 0;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Modal Awal Investasi" value={modalAwal} onChange={setModalAwal}
                    hint="Total uang yang kamu keluarkan di awal" />
                <InputField label="Pendapatan per Bulan" value={pendapatanBulanan} onChange={setPendapatanBulanan}
                    hint="Estimasi pemasukan bulanan" />
                <InputField label="Biaya Operasional per Bulan" value={biayaBulanan} onChange={setBiayaBulanan}
                    hint="Semua pengeluaran rutin bulanan" />
                <InputField label="Durasi Proyeksi (bulan)" value={durasi} onChange={setDurasi}
                    prefix="" hint="Berapa bulan kamu proyeksikan?" />
            </div>

            {canCalc && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <ResultCard label="Laba Bersih / Bulan" value={`Rp ${fmt(labaBersihBulanan)}`}
                            color={labaBersihBulanan >= 0 ? 'green' : 'red'} />
                        <ResultCard label={`Total Laba ${d} Bulan`} value={`Rp ${fmt(labaBersihTotal)}`}
                            color={labaBersihTotal >= 0 ? 'blue' : 'red'} />
                        <ResultCard
                            label="ROI"
                            value={roi !== null ? `${roi.toFixed(1)}%` : '-'}
                            color={roi !== null && roi >= 0 ? 'green' : 'red'}
                            large
                            sub={roi !== null && roi >= 100 ? '🔥 Sangat menguntungkan!' : roi !== null && roi >= 0 ? 'Balik modal' : 'Perlu evaluasi'}
                        />
                        <ResultCard
                            label="Payback Period"
                            value={paybackPeriod !== null && paybackPeriod > 0 ? `${paybackPeriod.toFixed(1)} bulan` : '∞'}
                            color="amber"
                            sub="Estimasi balik modal"
                        />
                    </div>

                    {/* Progress bar balik modal */}
                    {paybackPeriod !== null && paybackPeriod > 0 && (
                        <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-slate-100 dark:border-zinc-700">
                            <div className="flex justify-between mb-2">
                                <span className="text-[11px] font-black text-slate-500 uppercase">Progress Balik Modal</span>
                                <span className="text-[11px] font-bold text-blue-600">{Math.min(100, (d / paybackPeriod * 100)).toFixed(0)}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(100, (d / paybackPeriod) * 100)}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">
                                {d >= paybackPeriod
                                    ? `✅ Sudah balik modal dalam proyeksi ${d} bulan`
                                    : `⏳ Butuh ${Math.ceil(paybackPeriod - d)} bulan lagi untuk balik modal`}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">💡 Interpretasi ROI</p>
                <p className="text-[12px] text-emerald-600 dark:text-emerald-300 leading-relaxed">
                    ROI &gt; 0%: Menguntungkan. ROI &gt; 100%: Sangat bagus — artinya kamu sudah balik modal dan masih untung.
                    ROI negatif: Perlu revisi strategi bisnis.
                </p>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────── */
export default function KalkulatorUsahaPage() {
    const navigate = useNavigate();
    const [openSection, setOpenSection] = useState('bep');

    const toggle = useCallback((id) => {
        setOpenSection(prev => prev === id ? null : id);
    }, []);

    return (
        <div className="min-h-screen pb-28 overflow-x-hidden bg-[#F8FAFC] dark:bg-black transition-colors duration-300">
            {/* BG Decoration */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-amber-50/50 dark:bg-amber-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            {/* Header */}
            <section className="pt-12 pb-10 text-center relative z-10 px-6">
                <button
                    onClick={() => navigate('/usaha')}
                    className="inline-flex items-center gap-2 mb-6 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer"
                >
                    <FiChevronLeft size={16} /> Kembali ke Menu Usaha
                </button>

                <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-2 rounded-full shadow-sm border border-slate-100/50 dark:border-zinc-800 mb-5">
                    <span className="text-lg">🧮</span>
                    <span className="text-[11px] font-black text-blue-900 dark:text-blue-400 uppercase tracking-[0.25em]">Tools Bisnis</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-blue-950 dark:text-white tracking-tight mb-3 drop-shadow-sm">
                    Kalkulator Usaha
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
                    Hitung BEP, laba rugi, harga jual, dan ROI investasi bisnismu dengan mudah.
                </p>
            </section>

            {/* Kalkulators */}
            <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-4">

                {/* Tab pills for quick jump */}
                <div className="flex flex-wrap gap-2 pb-2">
                    {[
                        { id: 'bep', label: '⚖️ BEP', color: 'blue' },
                        { id: 'laba', label: '📊 Laba Rugi', color: 'green' },
                        { id: 'harga', label: '🏷️ Harga Jual', color: 'amber' },
                        { id: 'roi', label: '📈 ROI', color: 'purple' },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setOpenSection(t.id)}
                            className={`px-4 py-2 rounded-full text-[12px] font-black transition-all border-none cursor-pointer ${openSection === t.id
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-700 hover:border-blue-400 hover:text-blue-600'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <Section
                    title="Kalkulator BEP (Break-Even Point)"
                    icon={<FiTrendingUp />}
                    open={openSection === 'bep'}
                    onToggle={() => toggle('bep')}
                    accent="blue"
                >
                    <KalkulatorBEP />
                </Section>

                <Section
                    title="Kalkulator Laba Rugi"
                    icon={<FiDollarSign />}
                    open={openSection === 'laba'}
                    onToggle={() => toggle('laba')}
                    accent="green"
                >
                    <KalkulatorLabaRugi />
                </Section>

                <Section
                    title="Kalkulator Harga Jual"
                    icon={<FiShoppingBag />}
                    open={openSection === 'harga'}
                    onToggle={() => toggle('harga')}
                    accent="amber"
                >
                    <KalkulatorHargaJual />
                </Section>

                <Section
                    title="Kalkulator ROI Investasi"
                    icon={<FiPercent />}
                    open={openSection === 'roi'}
                    onToggle={() => toggle('roi')}
                    accent="purple"
                >
                    <KalkulatorROI />
                </Section>
            </div>
        </div>
    );
}
