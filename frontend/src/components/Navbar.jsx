import React, { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { brand, nav } from '../mock';
import { Button } from './ui/button';
import Logo from './Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0d1210]/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <a href="#home" className="flex items-center gap-3 group">
          <Logo variant="horizontal" color="#ffffff" accent="#f59e0b" />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 hover:text-amber-500 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${brand.phoneRaw}`}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <Phone className="w-4 h-4 text-amber-500" />
            {brand.phone}
          </a>
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-400 text-[#0d1210] font-semibold rounded-md h-10 px-5"
          >
            <a href="#contact">Book Now</a>
          </Button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-2"
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#0d1210] border-t border-white/10">
          <div className="px-6 py-6 flex flex-col gap-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-white/90 text-base font-medium py-1"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`tel:${brand.phoneRaw}`}
              className="flex items-center gap-2 text-white/90 py-1"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              {brand.phone}
            </a>
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-400 text-[#0d1210] font-semibold rounded-md w-full"
            >
              <a href="#contact" onClick={() => setOpen(false)}>Book Now</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
