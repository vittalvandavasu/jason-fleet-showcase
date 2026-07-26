import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { brand, heroImages } from '../mock';

export default function CTABanner() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#0d1210]">
      <div className="absolute inset-0">
        <img
          src={heroImages.secondary}
          alt="Trailer on the road"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1210] via-[#0d1210]/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl">
          <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Same-Day Availability
          </div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95]">
            Need a Trailer
            <br />
            <span className="text-amber-500">Today?</span>
          </h2>
          <p className="mt-5 text-white/80 text-lg leading-relaxed max-w-lg">
            Give Jason a call — chances are we can have you hooked up and rolling within the hour.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="btn-glow bg-amber-500 hover:bg-amber-400 text-[#132119] font-semibold h-13 px-8 rounded-md"
            >
              <a href={`tel:${brand.phoneRaw}`} className="inline-flex items-center gap-2 h-13 py-4">
                <Phone className="w-5 h-5" /> Call {brand.phone}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-13 py-4 px-8 rounded-md border-white/30 bg-white/5 text-white hover:bg-white hover:text-[#0d1210]"
            >
              <a href="#contact" className="inline-flex items-center gap-2">
                Reserve Online <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
