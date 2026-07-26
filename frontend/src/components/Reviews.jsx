import React from 'react';
import { Star, Quote } from 'lucide-react';
import { reviews } from '../mock';

export default function Reviews() {
  return (
    <section id="reviews" className="relative bg-[#0d1210] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-14">
          <div>
            <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Customer Reviews
            </div>
            <h2 className="font-display text-5xl sm:text-6xl text-white leading-[0.95]">
              Real Renters.
              <br />
              <span className="text-amber-500">Real Reviews.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
            <div className="font-display text-5xl text-amber-500 leading-none">5.0</div>
            <div>
              <div className="flex gap-0.5">
                {[0,1,2,3,4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <div className="text-xs text-white/60 mt-1">Based on 100+ verified reviews</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="relative bg-[#141a17] border border-white/10 rounded-xl p-6 hover:border-amber-500/40 transition-colors duration-300"
            >
              <Quote className="w-8 h-8 text-amber-500/40 mb-3" />
              <p className="text-white/80 text-[15px] leading-relaxed">“{r.text}”</p>
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-[#132119] flex items-center justify-center font-display text-lg">
                  {r.initials}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{r.name}</div>
                  <div className="text-white/50 text-xs">{r.date}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
