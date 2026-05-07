import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggleButton({ className = '', iconSize = 18 }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const baseClassName =
    'p-2.5 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={className ? `${baseClassName} ${className}` : baseClassName}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
    >
      {isDarkMode ? <FiSun size={iconSize} /> : <FiMoon size={iconSize} />}
    </button>
  );
}
