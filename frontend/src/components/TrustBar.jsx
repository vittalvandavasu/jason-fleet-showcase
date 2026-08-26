import React from 'react';
import { ShieldCheck, Truck, Clock, DollarSign } from 'lucide-react';

const items = [
  { icon: ShieldCheck, text: 'Fully Insured & Inspected' },
  { icon: Truck, text: '4 Trailer Types' },
  { icon: Clock, text: 'Same-Day Pickup' },
  { icon: DollarSign, text: 'No Hidden Fees' },
  { icon: ShieldCheck, text: 'Winch + Straps Included' },
  { icon: Truck, text: 'Local Olympia, WA' },
];

export default function TrustBar() {
  const doubled = [...items, ...items];
  return (
    <section className="bg-[#0d1210] border-y border-white/10 py-5 overflow-hidden">
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {doubled.map((it, idx) => (
          <div key={idx} className="flex items-center gap-3 text-white/70">
            <it.icon className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium tracking-wide uppercase">{it.text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20 ml-6" />
          </div>
        ))}
      </div>
    </section>
  );
}
