import { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/sections/Navbar';
import Hero from '@/sections/Hero';
import PopularProducts from '@/sections/PopularProducts';
import Menu from '@/sections/Menu';
import HowItWorks from '@/sections/HowItWorks';
import Hours from '@/sections/Hours';
import About from '@/sections/About';
import Reviews from '@/sections/Reviews';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import AdminModal from '@/components/AdminModal';
import Toast from '@/components/Toast';

function App() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#F5EFE6]">
        <Navbar onAdminClick={() => setAdminOpen(true)} />
        <Hero />
        <PopularProducts />
        <Menu />
        <HowItWorks />
        <Hours />
        <About />
        <Reviews />
        <Contact />
        <Footer />
        <CartDrawer />
        <AdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
        <Toast />
      </div>
    </CartProvider>
  );
}

export default App;
