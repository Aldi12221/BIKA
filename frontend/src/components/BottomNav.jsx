import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  FiHome, 
  FiTrendingUp, 
  FiBookOpen, 
  FiBriefcase, 
  FiUser,
  FiPlus
} from 'react-icons/fi';

export default function BottomNav() {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/masa-depan', label: 'Masa', icon: FiTrendingUp },
    { path: '/tutorial', label: 'Tutorial', icon: FiBookOpen },
    { path: '/', label: 'Utama', icon: FiPlus, isCenter: true },
    { path: '/usaha', label: 'Usaha', icon: FiBriefcase },
    { path: '/profil', label: 'Profil', icon: FiUser },
  ];

  return (
    <>
      {/* Spacer agar konten bawah tidak tertutup */}
      <div className="block lg:hidden h-24" />

      <div className="fixed bottom-0 left-0 right-0 z-[9999] lg:hidden flex justify-center items-end pb-5 pointer-events-none px-4">
        <div className="relative w-full max-w-[400px] pointer-events-auto">
          
          {/* Notched Background SVG - Smoother Curve */}
          <div className="absolute inset-0 -z-10 h-[70px]">
            <svg
              width="100%"
              height="70"
              viewBox="0 0 360 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_-5px_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_-5px_20px_rgba(0,0,0,0.4)]"
              preserveAspectRatio="none"
            >
              <path
                d="M0 25C0 11.1929 11.1929 0 25 0H135.5C141.5 0 145.5 3 151 9C159.5 18 170.5 28 180 28C189.5 28 200.5 18 209 9C214.5 3 218.5 0 224.5 0H335C348.807 0 360 11.1929 360 25V45C360 58.8071 348.807 70 335 70H25C11.1929 70 0 58.8071 0 45V25Z"
                fill={isDarkMode ? "#1C1F3A" : "#ffffff"}
              />
            </svg>
          </div>

          {/* Nav Content */}
          <div className="relative flex items-center justify-between h-[70px] px-3">
            {navLinks.map((item, idx) => (
              <div key={idx} className="flex-1 flex justify-center items-center">
                {item.isCenter ? (
                  /* Floating Center Button */
                  <Link
                    to={item.path}
                    className="relative -top-7 w-15 h-15 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-[0_10px_20px_rgba(37,99,235,0.4)] border-4 border-white dark:border-[#0B0E1A] transition-all hover:scale-105 active:scale-90"
                  >
                    <FiHome size={28} />
                  </Link>
                ) : (
                  /* Normal Nav Item */
                  <Link
                    to={item.path}
                    className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-full py-2 rounded-2xl ${
                      isActive(item.path) 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <div className="relative">
                      <item.icon size={22} className={isActive(item.path) ? "animate-bounce-subtle" : ""} />
                      {isActive(item.path) && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                      )}
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest leading-none">
                      {item.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


