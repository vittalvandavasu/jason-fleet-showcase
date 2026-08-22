import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PHOTOS = [
  {
    src: '/trailers/ai/maxxd-c4x-7k.jpg',
    caption: 'MAXX-D C4X — car hauler in daylight',
    tag: 'Car Hauler',
  },
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/wcgnabxf_087b66f8-3396-4591-90d1-05f9abf33926.jfif',
    caption: 'Continental Cargo — our signature branding',
    tag: 'Cargo',
  },
  {
    src: '/trailers/ai/eagle-landscape.jpg',
    caption: 'Eagle Landscape — mesh-side hauler',
    tag: 'Landscape',
  },
  {
    src: '/trailers/maxxd-c4x-main.jpg',
    caption: 'MAXX-D C4X — ready to load',
    tag: 'Car Hauler',
  },
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/8fwkwmf2_6559fc41-858d-46b3-9e4f-15c308c15c53.jfif',
    caption: 'Continental Cargo — rear view',
    tag: 'Cargo',
  },
  {
    src: '/trailers/ai/olympic-utility.jpg',
    caption: 'Olympic Utility — open box hauler',
    tag: 'Utility',
  },
  {
    src: '/trailers/maxxd-c4x-grass.jpg',
    caption: 'MAXX-D — with mounted tool box',
    tag: 'Car Hauler',
  },
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/jluzylpu_4455edf8-8b85-4d2e-9cad-4f1b6b4c163f.jfif',
    caption: 'Continental Cargo — E-track interior',
    tag: 'Cargo',
  },
  {
    src: '/trailers/utility-ramp.jpg',
    caption: 'Utility — drop-down mesh ramp',
    tag: 'Utility',
  },
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/0nen5l5j_7e89d5ab-6f28-4759-9f55-a36038a86e61.jfif',
    caption: 'Continental Cargo — ramps down, ready to load',
    tag: 'Cargo',
  },
  {
    src: '/trailers/maxxd-c4x-wood.jpg',
    caption: 'MAXX-D — fresh wood deck',
    tag: 'Car Hauler',
  },
  {
    src: '/trailers/eagle-falcon.jpg',
    caption: 'Landscape utility — mesh gate lowered',
    tag: 'Landscape',
  },
];

export default function Gallery() {
  const [openIdx, setOpenIdx] = useState(null);
  const close = () => setOpenIdx(null);
  const prev = (e) => {
    e && e.stopPropagation();
    setOpenIdx((i) => (i === 0 ? PHOTOS.length - 1 : i - 1));
  };
  const next = (e) => {
    e && e.stopPropagation();
    setOpenIdx((i) => (i === PHOTOS.length - 1 ? 0 : i + 1));
  };

  // Keyboard shortcuts when lightbox open
  React.useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIdx]);

  return (
    <section id="gallery" className="relative bg-[#0d1210] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              <Camera className="w-4 h-4" /> Our Real Fleet
            </div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95]">
              Actual Trailers.
              <br />
              <span className="text-amber-500">On Our Lot.</span>
            </h2>
          </div>
          <p className="text-white/70 max-w-md text-base leading-relaxed">
            Not stock photos. These are the trailers you'll pick up in Olympia, WA —
            clean, branded, and ready to work. Tap any photo to zoom.
          </p>
        </div>

        {/* Masonry-ish grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {PHOTOS.map((p, i) => {
            // vary heights for visual interest
            const rowSpan =
              i === 0 || i === 4 || i === 7 ? 'lg:row-span-2 aspect-square lg:aspect-auto lg:h-full' : 'aspect-[4/3]';
            const colSpan = i === 0 ? 'col-span-2 lg:col-span-2' : '';
            return (
              <button
                key={p.src}
                onClick={() => setOpenIdx(i)}
                className={`relative rounded-2xl overflow-hidden group ${colSpan} ${rowSpan} text-left`}
              >
                <img
                  src={p.src}
                  alt={p.caption}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1210] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] font-semibold text-amber-500 tracking-[0.2em] uppercase">
                    {p.tag}
                  </div>
                  <div className="font-display text-base lg:text-lg text-white mt-1 leading-tight">
                    {p.caption}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {openIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 hover:text-[#0d1210] text-white flex items-center justify-center transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 hover:text-[#0d1210] text-white flex items-center justify-center transition"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={PHOTOS[openIdx].src}
                alt={PHOTOS[openIdx].caption}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-[10px] tracking-[0.3em] uppercase text-amber-500 font-semibold">
                {PHOTOS[openIdx].tag}
              </div>
              <div className="text-white font-display text-2xl mt-1">
                {PHOTOS[openIdx].caption}
              </div>
              <div className="text-white/50 text-xs mt-2">
                {openIdx + 1} / {PHOTOS.length} · Press Esc to close · ← → to navigate
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
