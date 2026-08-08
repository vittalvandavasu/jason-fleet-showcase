import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { brand, nav } from '../mock';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative bg-[#080b0a] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Logo variant="horizontal" color="#ffffff" accent="#f59e0b" showLLC />
            <p className="mt-5 text-white/60 max-w-md leading-relaxed">
              Locally owned trailer rentals serving Olympia, WA and the greater
              Puget Sound & Pacific Northwest. Fair prices, clean gear, and a real human on the phone.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-amber-500 hover:border-amber-500 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-white font-display text-xl mb-4">Navigate</div>
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-white/60 hover:text-amber-500 text-sm transition-colors"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="text-white font-display text-xl mb-4">Get in Touch</div>
            <div className="space-y-3">
              <a
                href={`tel:${brand.phoneRaw}`}
                className="flex items-center gap-3 text-white/70 hover:text-amber-500 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span className="text-sm">{brand.phone}</span>
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="flex items-center gap-3 text-white/70 hover:text-amber-500 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-500" />
                <span className="text-sm break-all">{brand.email}</span>
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="w-4 h-4 text-amber-500 mt-1" />
                <span className="text-sm">
                  {brand.street}
                  <br />
                  {brand.cityLine}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-line mt-12" />

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Northwest Haul Rentals. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <a href="#" className="text-white/50 hover:text-amber-500 transition-colors">Terms</a>
            <a href="#" className="text-white/50 hover:text-amber-500 transition-colors">Privacy</a>
            <a href="/rental-agreement" className="text-white/50 hover:text-amber-500 transition-colors">Rental Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
