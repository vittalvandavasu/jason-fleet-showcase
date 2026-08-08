import React from 'react';
import { ArrowRight, Phone, MapPin, Star } from 'lucide-react';
import { Button } from './ui/button';
import { brand, heroImages } from '../mock';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#0d1210]">
      {/* background image */}
      <div className="absolute inset-0">
        <img
          src={heroImages.primary}
          alt="Truck hauling trailer through Pacific Northwest"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full pt-32 pb-20">
        <div className="max-w-3xl">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-amber-500">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75" />
            </span>
            <span className="text-xs font-medium tracking-wider text-white/90 uppercase">
              Same-Day Rentals · Olympia, WA
            </span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-white leading-[0.95]">
            Haul Smart.
            <br />
            <span className="text-amber-500">Rent Local.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Reliable car haulers, cargo trailers, tilt decks and utility trailers —
            fully equipped and ready to roll. Book in 2 minutes, pick up today.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="btn-glow bg-amber-500 hover:bg-amber-400 text-[#0d1210] font-semibold h-14 px-8 text-base rounded-md"
            >
              <a href="#trailers" className="inline-flex items-center gap-2">
                Browse Trailers <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 px-8 text-base rounded-md border-white/30 bg-white/5 text-white hover:bg-white hover:text-[#0d1210]"
            >
              <a href={`tel:${brand.phoneRaw}`} className="inline-flex items-center gap-2">
                <Phone className="w-5 h-5" /> {brand.phone}
              </a>
            </Button>
          </div>

          {/* trust chips */}
          <div className="mt-10 flex flex-wrap gap-6 text-white/85">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[0,1,2,3,4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-sm font-medium">5.0 · Trusted by 500+ locals</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              Serving the Pacific Northwest
            </div>
          </div>
        </div>

        {/* starting price card */}
        <div className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
          {[
            { k: 'FROM', v: '$20', s: '/ hour' },
            { k: 'DAILY', v: '$80', s: 'starting' },
            { k: 'WEEKLY', v: '$500', s: 'starting' },
            { k: 'BOOKING', v: '$50', s: 'deposit' },
          ].map((x) => (
            <div
              key={x.k}
              className="backdrop-blur-md bg-white/5 border border-white/15 rounded-lg p-5 hover:border-amber-500/50 transition-colors duration-300"
            >
              <div className="text-[10px] font-semibold tracking-[0.2em] text-amber-500">{x.k}</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-4xl text-white">{x.v}</span>
                <span className="text-xs text-white/60">{x.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
        <span className="text-xs text-white/50 tracking-widest">SCROLL</span>
        <div className="h-10 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
