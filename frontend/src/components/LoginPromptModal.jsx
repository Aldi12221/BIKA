import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// reason → message mapping (design doc Section 5)
const REASON_MAP = {
  apply_job: {
    icon: '💼',
    title: 'Lamar Lowongan',
    message: 'Login untuk melamar lowongan ini dan melacak status lamaranmu.',
  },
  full_tutorial: {
    icon: '📖',
    title: 'Baca Artikel',
    message: 'Login untuk membaca artikel lengkap dan mengakses semua materi tutorial.',
  },
  start_quiz: {
    icon: '🧠',
    title: 'Mulai Kuis',
    message: 'Login untuk memulai kuis dan menyimpan skor hasil tesmu.',
  },
  download_file: {
    icon: '📥',
    title: 'Unduh File',
    message: 'Login untuk mengunduh file lampiran dari materi ini.',
  },
};

const DEFAULT_REASON = {
  icon: '🔐',
  title: 'Login Diperlukan',
  message: 'Login untuk mengakses fitur ini.',
};

export default function LoginPromptModal({
  reason,
  isOpen,
  onClose,
  returnTo,
  jobId,
  triggerRef,
}) {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const primaryBtnRef = useRef(null);

  // Lock body scroll when open; restore on close/unmount
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    // Move focus to the primary button on open
    const frame = requestAnimationFrame(() => {
      primaryBtnRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Tab') {
        trapFocus(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Focus trap: cycle focus only among the three buttons inside the modal
  const trapFocus = (e) => {
    if (!modalRef.current) return;

    const focusable = Array.from(
      modalRef.current.querySelectorAll(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null); // only visible elements

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if focus is on first, wrap to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if focus is on last, wrap to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleClose = () => {
    document.body.style.overflow = 'unset';
    onClose();
    // Return focus to the element that triggered the modal
    requestAnimationFrame(() => {
      triggerRef?.current?.focus();
    });
  };

  const buildLoginUrl = () => {
    const params = new URLSearchParams();
    if (returnTo) params.set('returnTo', returnTo);
    if (jobId) params.set('jobId', String(jobId));
    const query = params.toString();
    return `/login${query ? `?${query}` : ''}`;
  };

  const handleLoginNavigate = () => {
    handleClose();
    navigate(buildLoginUrl());
  };

  // Do not render when closed
  if (!isOpen) return null;

  const { icon, title, message } = REASON_MAP[reason] ?? DEFAULT_REASON;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={(e) => {
        // Close only when clicking the backdrop itself, not the card
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-message"
    >
      {/* Card */}
      <div
        ref={modalRef}
        className="bg-white dark:bg-zinc-900 rounded-[32px] max-w-sm w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top icon */}
        <div className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-3xl"
            aria-hidden="true"
          >
            {icon}
          </div>
        </div>

        {/* Title */}
        <h2
          id="login-modal-title"
          className="text-xl font-black text-blue-950 dark:text-white text-center mb-2"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="login-modal-message"
          className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Primary — Login dengan Google */}
          <button
            ref={primaryBtnRef}
            type="button"
            onClick={handleLoginNavigate}
            className="bg-blue-600 text-white rounded-2xl py-3 w-full font-black hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Login dengan Google
          </button>

          {/* Secondary — Daftar Gratis */}
          <button
            type="button"
            onClick={handleLoginNavigate}
            className="border border-slate-200 dark:border-zinc-700 rounded-2xl py-3 w-full font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Daftar Gratis
          </button>

          {/* Dismiss — Nanti saja */}
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-slate-400 underline cursor-pointer text-center mt-2 block w-full bg-transparent border-none hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 rounded-lg py-1"
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  );
}

LoginPromptModal.propTypes = {
  reason: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  returnTo: PropTypes.string,
  jobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  triggerRef: PropTypes.object,
};

LoginPromptModal.defaultProps = {
  returnTo: '',
  jobId: null,
  triggerRef: null,
};
