import { useState, useEffect } from 'react';
import { ShoppingCart, Settings, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  onAdminClick: () => void;
}

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Menu', href: '#menu' },
  { label: 'Horaires', href: '#horaires' },
  { label: '\u00c0 propos', href: '#apropos' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onAdminClick }: NavbarProps) {
  const { itemCount, setIsCartOpen } = useCart();
  const [activeSection, setActiveSection] = useState('accueil');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(250,248,245,0.95)] backdrop-blur-xl shadow-sm'
            : 'bg-[rgba(250,248,245,0.7)] backdrop-blur-md'
        }`}
        style={{ height: 72 }}
      >
        <div className="flex items-center justify-between h-full px-[5vw] max-w-[1400px] mx-auto">
          {/* Logo */}
          <button onClick={() => scrollTo('#accueil')} className="flex flex-col items-start">
            <span className="font-display text-[22px] font-bold text-[#1A1A1A] leading-tight">
              Snack CMC
            </span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#7A7A7A] font-body">
              Casa-Settat
            </span>
          </button>

          {/* Center Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="relative font-body text-sm font-medium text-[#4A4A4A] hover:text-[#C41E1E] transition-colors duration-200 tracking-[0.02em]"
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C41E1E] transition-all duration-200 ${
                    activeSection === link.href.replace('#', '') ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onAdminClick}
              className="p-2 rounded-full hover:bg-[#F5EFE6] transition-colors duration-200"
              title="Admin"
            >
              <Settings size={20} className="text-[#4A4A4A]" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-[#F5EFE6] transition-colors duration-200"
              title="Panier"
            >
              <ShoppingCart size={20} className="text-[#4A4A4A]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#C41E1E] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-300">
                  {itemCount}
                </span>
              )}
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#F5EFE6] transition-colors duration-200"
            >
              {mobileOpen ? <X size={22} className="text-[#4A4A4A]" /> : <Menu size={22} className="text-[#4A4A4A]" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAF8F5] transition-transform duration-400 md:hidden ${
          mobileOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-display text-[32px] text-[#1A1A1A] hover:text-[#C41E1E] transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
