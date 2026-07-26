import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { faqs, brand } from '../mock';
import { Phone, MessageCircle } from 'lucide-react';

export default function FAQ() {
  return (
    <section id="faq" className="relative bg-[#f5f2ea] py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-amber-600 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Answers
            </div>
            <h2 className="font-display text-5xl sm:text-6xl text-[#132119] leading-[0.95]">
              Frequently Asked
              <br />
              <span className="text-amber-600">Questions.</span>
            </h2>
            <p className="mt-5 text-[#132119]/70 leading-relaxed">
              Can't find what you're looking for? Reach out to Jason directly — quick
              answers, no bots.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`tel:${brand.phoneRaw}`}
                className="flex items-center gap-3 bg-white border border-[#132119]/10 rounded-lg px-4 py-3 hover:border-amber-500 transition-colors"
              >
                <Phone className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-xs text-[#132119]/60">Call or Text</div>
                  <div className="font-semibold text-[#132119]">{brand.phone}</div>
                </div>
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="flex items-center gap-3 bg-white border border-[#132119]/10 rounded-lg px-4 py-3 hover:border-amber-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-xs text-[#132119]/60">Email</div>
                  <div className="font-semibold text-[#132119] text-sm break-all">{brand.email}</div>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-white border border-[#132119]/10 rounded-xl px-6 data-[state=open]:border-amber-500 transition-colors"
                >
                  <AccordionTrigger className="font-display text-xl text-[#132119] hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#132119]/70 text-[15px] leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
