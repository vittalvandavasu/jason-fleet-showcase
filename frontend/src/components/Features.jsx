import React from 'react';
import { ShieldCheck, Clock, MapPin, Wallet, Sparkles, PhoneCall } from 'lucide-react';
import { features } from '../mock';

const iconMap = { ShieldCheck, Clock, MapPin, Wallet, Sparkles, PhoneCall };

export default function Features() {
  return (
    <section className="relative bg-[#f5f2ea] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <div className="text-amber-600 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Why Northwest Haul
            </div>
            <h2 className="font-display text-5xl sm:text-6xl text-[#132119] leading-[0.95]">
              Built for Real Work.
              <br />
              <span className="text-amber-600">Priced for Real People.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="text-lg text-[#132119]/70 leading-relaxed">
              We built Northwest Haul Rentals for the folks who actually use trailers —
              contractors, movers, gearheads, weekend warriors. Fair prices, clean equipment,
              and someone who picks up the phone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon];
            return (
              <div
                key={f.title}
                className="group relative bg-white border border-[#132119]/10 rounded-xl p-7 hover:border-amber-500 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-6 right-6 text-6xl font-display text-[#132119]/5 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-[#132119] flex items-center justify-center mb-5 group-hover:bg-amber-500 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-amber-500 group-hover:text-[#132119]" />
                  </div>
                  <h3 className="font-display text-2xl text-[#132119] leading-tight">{f.title}</h3>
                  <p className="mt-2 text-sm text-[#132119]/70 leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
