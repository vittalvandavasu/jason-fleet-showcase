import React, { useState, useMemo, useEffect } from 'react';
import { Check, ArrowRight, Weight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { trailers as fallbackTrailers, categories } from '../mock';
import { getTrailers } from '../lib/api';

export default function TrailerSection({ onBook }) {
  const [active, setActive] = useState('All');
  const [trailers, setTrailers] = useState(fallbackTrailers);

  useEffect(() => {
    getTrailers()
      .then((data) => Array.isArray(data) && data.length && setTrailers(data))
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () => (active === 'All' ? trailers : trailers.filter((t) => t.category === active)),
    [active, trailers]
  );

  return (
    <section id="trailers" className="relative bg-[#0d1210] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Our Fleet
            </div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-none">
              Featured Rental
              <br />
              <span className="text-amber-500">Trailers</span>
            </h2>
            <p className="mt-5 text-white/70 max-w-xl text-base leading-relaxed">
              Every trailer comes ready to work — winches, straps, chains, and
              accessories included. Pick the size that fits your job.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  active === c
                    ? 'bg-amber-500 text-[#0d1210] border-amber-500'
                    : 'bg-white/5 text-white/80 border-white/15 hover:border-amber-500/50 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <TrailerCard key={t.id} trailer={t} onBook={onBook} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrailerCard({ trailer, onBook }) {
  return (
    <div className="card-hover group relative bg-[#141a17] border border-white/10 rounded-xl overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0d1210]">
        <img
          src={trailer.image}
          alt={trailer.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1210] via-transparent to-transparent" />
        {trailer.tag && (
          <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-500 text-[#0d1210] font-semibold border-0 uppercase tracking-wider">
            {trailer.tag}
          </Badge>
        )}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
          <Weight className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-medium text-white">{trailer.gvwr}</span>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="text-[10px] font-semibold text-amber-500 tracking-[0.2em] uppercase">
            {trailer.category}
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-2xl text-white leading-tight">{trailer.name}</h3>

        <ul className="mt-4 space-y-2">
          {trailer.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-white/70">
              <Check className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-3">
          <PriceCell label="Hourly" value={`$${trailer.pricing.hourly}`} sub="/ hr" />
          <PriceCell label="Mon–Thu" value={`$${trailer.pricing.weekday}`} sub="24 hrs" />
          <PriceCell label="Fri–Sun" value={`$${trailer.pricing.weekend}`} sub="24 hrs" />
          <PriceCell label="Weekly" value={`$${trailer.pricing.weekly}`} sub="7 days" highlight />
        </div>

        <Button
          onClick={() => onBook && onBook(trailer)}
          className="mt-6 bg-white text-[#0d1210] hover:bg-amber-500 hover:text-[#0d1210] font-semibold rounded-md h-11 group/btn"
        >
          Book This Trailer
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

function PriceCell({ label, value, sub, highlight = false }) {
  return (
    <div
      className={`rounded-md px-3 py-2.5 ${
        highlight ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-white/5 border border-white/10'
      }`}
    >
      <div className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
        {label}
      </div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className={`font-display text-2xl ${highlight ? 'text-amber-500' : 'text-white'}`}>
          {value}
        </span>
        <span className="text-[10px] text-white/50">{sub}</span>
      </div>
    </div>
  );
}
