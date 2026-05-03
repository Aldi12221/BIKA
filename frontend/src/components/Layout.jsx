import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './footer'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-body">
      <Navbar />
     
        <Outlet />
        <Footer/>
     
    </div>
  );
}
