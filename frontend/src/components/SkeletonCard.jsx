/**
 * SkeletonCard — animated placeholder card for loading states.
 *
 * @param {{ variant?: 'job' | 'tutorial' | 'stat' }} props
 */
export default function SkeletonCard({ variant = 'job' }) {
  if (variant === 'stat') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-20 bg-slate-200 dark:bg-zinc-700 rounded-xl mb-2" />
        <div className="h-3 w-28 bg-slate-100 dark:bg-zinc-800 rounded-full" />
      </div>
    );
  }

  if (variant === 'tutorial') {
    return (
      <div className="animate-pulse bg-white dark:bg-zinc-900 rounded-[24px] border border-slate-100 dark:border-zinc-800 p-5 space-y-3">
        <div className="h-32 bg-slate-200 dark:bg-zinc-700 rounded-2xl" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-700 rounded-full" />
        <div className="h-3 w-1/2 bg-slate-100 dark:bg-zinc-800 rounded-full" />
      </div>
    );
  }

  // variant === 'job' (default)
  return (
    <div className="animate-pulse bg-white dark:bg-zinc-900 rounded-[24px] border border-slate-100 dark:border-zinc-800 p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 bg-slate-200 dark:bg-zinc-700 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded-full w-3/4" />
          <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full" />
        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-4/5" />
      </div>
      <div className="h-8 bg-slate-100 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}

/**
 * Prop types documentation (no runtime checking — project does not use prop-types package).
 *
 * variant: 'job' | 'tutorial' | 'stat'
 *   - 'job'      → card with avatar block, two text lines, and a tag row (default)
 *   - 'tutorial' → card with image placeholder and two text lines
 *   - 'stat'     → compact number + label block for stats rows
 */
SkeletonCard.defaultProps = { variant: 'job' };
