import React from 'react';
import { Camera } from 'lucide-react';

const REAL_PHOTOS = [
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/hbqiw7s2_2e3d96fb-ea2a-413c-8cbe-33301f4a0ede.jfif',
    caption: 'Our signature branding',
  },
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/wcgnabxf_087b66f8-3396-4591-90d1-05f9abf33926.jfif',
    caption: 'Enclosed cargo — side view',
  },
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/8fwkwmf2_6559fc41-858d-46b3-9e4f-15c308c15c53.jfif',
    caption: 'Enclosed cargo — rear',
  },
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/0nen5l5j_7e89d5ab-6f28-4759-9f55-a36038a86e61.jfif',
    caption: 'Ready-to-load ramps',
  },
  {
    src: 'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/jluzylpu_4455edf8-8b85-4d2e-9cad-4f1b6b4c163f.jfif',
    caption: 'E-track interior',
  },
];

export default function Gallery() {
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
            Not stock photos. These are the trailers you'll pick up in Vancouver, WA —
            clean, branded, and ready to work.
          </p>
        </div>

        {/* Mosaic layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {/* Large hero card */}
          <div className="col-span-2 lg:col-span-2 lg:row-span-2 relative rounded-2xl overflow-hidden group aspect-[4/3] lg:aspect-auto">
            <img
              src={REAL_PHOTOS[1].src}
              alt={REAL_PHOTOS[1].caption}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1210] via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="text-[10px] font-semibold text-amber-500 tracking-[0.25em] uppercase">
                Featured
              </div>
              <div className="font-display text-2xl lg:text-3xl text-white mt-1">
                {REAL_PHOTOS[1].caption}
              </div>
            </div>
          </div>

          {REAL_PHOTOS.filter((_, i) => i !== 1).map((p, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl overflow-hidden group aspect-square lg:aspect-[4/3]"
            >
              <img
                src={p.src}
                alt={p.caption}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1210] via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-display text-lg text-white leading-tight">{p.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
