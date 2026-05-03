import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiClock, FiAward } from 'react-icons/fi';
import api from '../utils/api';

export default function QuizPlayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    api.getQuizDetail(id).then(d => { if (d && d.Questions) setQuiz(d); }).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!quiz || finished) return;
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [quiz, finished]);

  if (!quiz) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">Memuat kuis...</p>
      </div>
    </div>
  );

  const questions = quiz.Questions || [];
  const q = questions[current];
  const total = questions.length;
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const selectAnswer = (opt) => { setAnswers({ ...answers, [current]: opt }); };

  const handleFinish = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.jawaban_benar) correct++; });
    setScore(correct);
    setFinished(true);
  };

  if (finished) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="glass rounded-2xl p-8 text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-3xl mx-auto mb-4 animate-pulse-glow"><FiAward /></div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Kuis Selesai!</h1>
          <p className="text-text-secondary mb-6">{quiz.judul}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-bg-card rounded-xl p-4"><p className="text-2xl font-bold text-primary">{score}</p><p className="text-xs text-text-muted">Benar</p></div>
            <div className="bg-bg-card rounded-xl p-4"><p className="text-2xl font-bold text-danger">{total - score}</p><p className="text-xs text-text-muted">Salah</p></div>
            <div className="bg-bg-card rounded-xl p-4"><p className="text-2xl font-bold text-secondary">{pct}%</p><p className="text-xs text-text-muted">Skor</p></div>
          </div>
          <p className="text-sm text-text-muted mb-6">Waktu: {formatTime(time)}</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/tutorial')} className="btn-secondary flex-1 text-sm">Kembali</button>
            <button onClick={() => { setCurrent(0); setAnswers({}); setFinished(false); setScore(0); setTime(0); }} className="btn-primary flex-1 text-sm">Ulangi</button>
          </div>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const options = [
    { key: 'a', text: q.opsi_a },
    { key: 'b', text: q.opsi_b },
    { key: 'c', text: q.opsi_c },
    { key: 'd', text: q.opsi_d },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/tutorial')} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer text-sm">
          <FiArrowLeft /> Kembali
        </button>
        <div className="flex items-center gap-2 text-text-muted text-sm"><FiClock /> {formatTime(time)}</div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>{quiz.judul}</span><span>{current + 1}/{total}</span>
        </div>
        <div className="w-full h-2 bg-bg-card rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question */}
      <div className="glass rounded-2xl p-6 animate-fade-in" key={current}>
        <p className="text-lg font-semibold text-text-primary mb-6">{q.teks_soal}</p>
        <div className="space-y-3">
          {options.map(opt => (
            <button key={opt.key} onClick={() => selectAnswer(opt.key)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer text-sm font-medium ${
                answers[current] === opt.key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-bg-card text-text-primary hover:border-primary/30 hover:bg-bg-card-hover'
              }`}>
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg mr-3 text-xs font-bold ${
                answers[current] === opt.key ? 'gradient-primary text-white' : 'bg-bg-surface text-text-muted'
              }`}>{opt.key.toUpperCase()}</span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
          className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2 disabled:opacity-30"><FiArrowLeft /> Sebelumnya</button>
        {current < total - 1 ? (
          <button onClick={() => setCurrent(c => c + 1)} disabled={!answers[current]}
            className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 disabled:opacity-30">Selanjutnya <FiArrowRight /></button>
        ) : (
          <button onClick={handleFinish} disabled={Object.keys(answers).length < total}
            className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 disabled:opacity-30"><FiCheck /> Selesai</button>
        )}
      </div>
    </div>
  );
}
