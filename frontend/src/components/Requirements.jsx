import React from 'react';
import { Check, IdCard, Shield, CreditCard, Truck, DollarSign, User } from 'lucide-react';
import { requirements } from '../mock';
import { Button } from './ui/button';

const icons = [IdCard, Shield, CreditCard, DollarSign, Truck, User];

export default function Requirements() {
  return (
    <section id="requirements" className="relative bg-[#f5f2ea] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-amber-600 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              What You'll Need
            </div>
            <h2 className="font-display text-5xl sm:text-6xl text-[#132119] leading-[0.95]">
              Simple Requirements.
              <br />
              <span className="text-amber-600">Zero Surprises.</span>
            </h2>
            <p className="mt-5 text-[#132119]/70 text-lg leading-relaxed max-w-lg">
              Bring these when you pick up and you're good to roll. Your $50 booking
              fee is applied to your total, and your deposit is returned when the
              trailer comes back clean and undamaged.
            </p>
            <Button
              asChild
              className="mt-8 bg-[#132119] hover:bg-amber-500 hover:text-[#132119] text-white font-semibold h-12 px-7 rounded-md"
            >
              <a href="#contact">Reserve Your Trailer</a>
            </Button>
            <div className="mt-4">
              <a
                href="/rental-agreement"
                className="inline-flex items-center gap-1.5 text-sm text-[#132119] hover:text-amber-600 font-medium underline underline-offset-4 decoration-[#132119]/30 hover:decoration-amber-600"
              >
                Read the full rental agreement &rarr;
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requirements.map((r, i) => {
              const Icon = icons[i] || Check;
              return (
                <div
                  key={r}
                  className="group flex items-start gap-4 bg-white border border-[#132119]/10 rounded-xl p-5 hover:border-amber-500 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-md bg-[#132119] flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors">
                    <Icon className="w-5 h-5 text-amber-500 group-hover:text-[#132119]" />
                  </div>
                  <p className="text-[#132119] font-medium leading-snug pt-1.5">{r}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
