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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-slate-100 dark:border-zinc-900 pt-16 pb-8 px-6 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Kolom 1: Branding & Deskripsi */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-100 dark:shadow-none">
                B
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black text-blue-900 dark:text-white tracking-tight transition-colors">Bika</span>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Bisa SMK</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              BIKA (Bisa SMK) adalah platform digital yang membantu siswa SMK dalam mempersiapkan masa depan yang lebih cerah melalui informasi lowongan, tutorial, dan usaha.
            </p>
          </div>

          {/* Kolom 2: Menu Navigasi */}
          <div>
            <h4 className="text-blue-950 dark:text-white font-bold mb-6 transition-colors">Menu</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
              <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Beranda</Link></li>
              <li><Link to="/masa-depan" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Masa Depan</Link></li>
              <li><Link to="/tutorial" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tutorial</Link></li>
              <li><Link to="/profil" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Profil</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h4 className="text-blue-950 dark:text-white font-bold mb-6 transition-colors">Kontak</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
                  <FiMail size={16} />
                </span>
                info@bika-smk.id
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
                  <FiPhone size={16} />
                </span>
                0821-4123-6977
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
          <div>
            <h4 className="text-blue-950 dark:text-white font-bold mb-6 transition-colors">Ikuti Kami</h4>
            <div className="flex gap-4">
              <SocialIcon href="#" icon={<FiInstagram />} color="hover:bg-pink-500" />
              <SocialIcon href="#" icon={<FiYoutube />} color="hover:bg-red-600" />
              <SocialIcon href="#" icon={<FaTiktok />} color="hover:bg-black" />
              <SocialIcon href="#" icon={<FiLinkedin />} color="hover:bg-blue-700" />
            </div>
          </div>

        </div>

        {/* Garis Bawah & Copyright */}
        <div className="pt-8 border-t border-slate-50 dark:border-zinc-900 flex flex-col md:flex-row justify-center items-center transition-colors">
          <p className="text-slate-400 dark:text-slate-600 text-xs font-medium">
            © {currentYear} BIKA (Bisa SMK). All rights reserved.
          </p>
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