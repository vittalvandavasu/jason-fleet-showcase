import React from 'react';
import { steps, stats } from '../mock';

export default function HowItWorks() {
  return (
    <section id="how" className="relative bg-[#0d1210] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            How It Works
          </div>
          <h2 className="font-display text-5xl sm:text-6xl text-white leading-[0.95]">
            From Booking to Hauling in
            <span className="text-amber-500"> Minutes.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="relative bg-[#141a17] border border-white/10 rounded-xl p-7 h-full hover:border-amber-500/40 transition-colors duration-300">
                <div className="font-display text-6xl text-amber-500/30 leading-none">{s.n}</div>
                <h3 className="font-display text-2xl text-white mt-4 leading-tight">{s.title}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{s.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-amber-500/40 z-10" />
              )}
            </div>
          ))}
        </div>

        {/* stats */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 border-y border-white/10 py-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <div className="font-display text-5xl lg:text-6xl text-amber-500 leading-none">
                {s.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
