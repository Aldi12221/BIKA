import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiInstagram, 
  FiYoutube, 
  FiLinkedin, 
  FiMail, 
  FiPhone, 
  FiMapPin 
} from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import logoBika from '../assets/loog.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-slate-100 dark:border-zinc-900 pt-10 pb-28 md:pt-16 md:pb-8 px-6 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16">
          
          {/* Kolom 1: Branding & Deskripsi */}
          <div className="space-y-4 md:space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="no-underline">
              <img
                src={logoBika}
                alt="BIKA Bisa SMK"
                className="h-20 w-auto object-contain"
              />
            </Link>
            {/* Deskripsi disembunyikan di mobile agar lebih ringkas */}
            <p className="text-slate-500 text-sm leading-relaxed hidden md:block">
              BIKA (Bisa SMK) adalah platform digital yang membantu siswa SMK dalam mempersiapkan masa depan yang lebih cerah melalui informasi lowongan, tutorial, dan usaha.
            </p>
          </div>

          {/* Kolom 2: Menu Navigasi - Disembunyikan di mobile (karena sudah ada BottomNav) */}
          <div className="hidden md:block">
            <h4 className="text-blue-950 dark:text-white font-bold mb-6 transition-colors">Menu</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
              <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Beranda</Link></li>
              <li><Link to="/masa-depan" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Masa Depan</Link></li>
              <li><Link to="/tutorial" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tutorial</Link></li>
              <li><Link to="/profil" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Profil</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak - Tampil seadanya di mobile */}
          <div className="hidden md:block">
            <h4 className="text-blue-950 dark:text-white font-bold mb-6 transition-colors">Kontak</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
                  <FiMail size={16} />
                </span>
                bikadmin@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
                  <FiPhone size={16} />
                </span>
                0812-1367-635
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
                  <FiMapPin size={16} />
                </span>
                Ponorogo, Indonesia
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-blue-950 dark:text-white font-bold mb-4 md:mb-6 transition-colors hidden md:block">Ikuti Kami</h4>
            <div className="flex gap-4">
              <SocialIcon href="https://www.instagram.com" target="_blank" icon={<FiInstagram />} color="hover:bg-pink-500" />
              <SocialIcon href="https://www.youtube.com" target="_blank" icon={<FiYoutube />} color="hover:bg-red-600" />
              <SocialIcon href="https://www.tiktok.com" target="_blank" icon={<FaTiktok />} color="hover:bg-black" />
              <SocialIcon href="https://www.linkedin.com" target="_blank" icon={<FiLinkedin />} color="hover:bg-blue-700" />
            </div>
          </div>

        </div>

        {/* Garis Bawah, Copyright & Legal Links */}
        <div className="pt-6 md:pt-8 border-t border-slate-50 dark:border-zinc-900 flex flex-col items-center transition-colors">
          <p className="text-slate-400 dark:text-slate-600 text-[10px] md:text-xs font-medium text-center">
            © {currentYear} BIKA (Bisa SMK). All rights reserved.
          </p>
          
          {/* Link Legal Tambahan untuk kesan Profesional di Mobile */}
          <div className="flex gap-4 mt-3 md:mt-2">
            <Link to="#" className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 hover:text-blue-600 transition-colors">Kebijakan Privasi</Link>
            <span className="text-slate-200 dark:text-zinc-800">•</span>
            <Link to="#" className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 hover:text-blue-600 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Sub-komponen untuk Ikon Sosial Media
function SocialIcon({ href, icon, color }) {
  return (
    <a 
      href={href} 
      className={`w-10 h-10 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 transition-all duration-300 hover:text-white dark:hover:text-white hover:shadow-lg ${color}`}
    >
      {icon}
    </a>
  );
}