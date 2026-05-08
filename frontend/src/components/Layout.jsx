import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './footer';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-body">
      <Navbar />
      <Outlet />
      <Footer />
      {/* Bottom Navigation — hanya tampil di mobile (lg:hidden di dalam komponen) */}
      <BottomNav />
    </div>
  );
}
