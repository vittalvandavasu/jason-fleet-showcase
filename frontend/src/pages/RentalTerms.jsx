import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { brand, RENTAL_AGREEMENT_URL } from '../mock';
import Logo from '../components/Logo';

const INCLUDED_ITEMS = [
  { name: '2 steel ramps with locking pins', cost: '$150 each' },
  { name: '2 wood extension ramps', cost: '$40 each' },
  { name: 'Aluminum tool box', cost: '$250' },
  { name: 'Set of keys', cost: '$20' },
  { name: 'Spare tire (under trailer)', cost: '$140' },
  { name: 'Spare tire tool kit', cost: '$30' },
  { name: '12,000 lb winch', cost: '$350' },
  { name: 'Wireless winch remote', cost: '$60' },
  { name: 'Snatch block & ¾" shackle', cost: '$30' },
  { name: '5 car tie-down ratchet straps', cost: '$20 each' },
  { name: 'Recovery strap', cost: '$20' },
  { name: '4 axle straps', cost: '$10 each' },
  { name: 'Ball hitch lock', cost: '$20' },
  { name: 'Hitch pin lock', cost: '$20' },
  { name: 'Tire pressure gauge', cost: '$20' },
  { name: '2 stability jacks', cost: '$40 each' },
  { name: '12-volt battery', cost: '$100' },
  { name: 'Leather gloves', cost: '$20' },
];

const CHARGES = [
  { label: 'Rental rate', detail: 'Rate × days/hours', highlight: false },
  { label: 'Deposit', detail: 'Refundable at return', highlight: false },
  { label: '2 5/16" HD hitch rental', detail: '$10 (if needed)', highlight: false },
  { label: 'Delivery / pick-up charge', detail: 'Quoted by distance', highlight: false },
  { label: 'Sales tax', detail: '10.1%', highlight: false },
  { label: 'Processing fee', detail: '3%', highlight: false },
  { label: 'Clean-up fee', detail: '$20 (if returned dirty)', highlight: false },
  { label: 'Late fee', detail: '$30 per hour', highlight: true },
];

const CLAUSES = [
  'I acknowledge receiving all items above and know that I am responsible for returning all items in good working condition or else I will be expected to pay for that item.',
  'I have carefully inspected the trailer, tires, and hitch and find them all in satisfactory condition.',
  'I understand that I am responsible for any and all damages up to and including theft.',
  'By signing the agreement, you authorize us to process a credit-card voucher for all charges due, including later payment of any traffic, toll, or parking violations assessed against the trailer.',
];

export default function RentalTerms() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1210] text-white">
      {/* header */}
      <header className="border-b border-white/10 bg-[#0d1210]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <button
            onClick={() => nav('/')}
            className="flex items-center gap-2 text-white/70 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Back to home</span>
          </button>
          <Logo variant="horizontal" color="#ffffff" accent="#f59e0b" />
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-400 text-[#0d1210] font-semibold h-9 rounded-md"
          >
            <a href={RENTAL_AGREEMENT_URL} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </a>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        {/* hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs uppercase tracking-widest font-semibold">
            <FileText className="w-3.5 h-3.5" /> Rental Agreement
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl leading-[0.95]">
            Terms &amp; Conditions.
            <br />
            <span className="text-amber-500">Fair. Clear. Signed.</span>
          </h1>
          <p className="mt-5 text-white/70 leading-relaxed">
            Here's exactly what you're agreeing to when you rent from Northwest Haul Rentals LLC.
            No fine print, no surprises. You'll sign a copy of this in-person at pickup.
          </p>
        </div>

        {/* business info */}
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          <InfoCard icon={FileText} label="Company">
            Northwest Haul Rentals LLC
          </InfoCard>
          <InfoCard icon={MapPin} label="Pickup Location">
            {brand.street}
            <br />
            {brand.cityLine}
          </InfoCard>
          <InfoCard icon={Phone} label="Contact">
            <a href={`tel:${brand.phoneRaw}`} className="hover:text-amber-500">
              {brand.phone}
            </a>
          </InfoCard>
        </div>

        {/* section 1: included equipment */}
        <section className="mt-16">
          <SectionHeader
            number="01"
            title="Included Equipment Checklist"
            subtitle="Everything you get with your rental — and the replacement cost if anything is lost or damaged. Walk through this list with Jason at pickup and again at return."
          />
          <div className="mt-8 bg-[#141a17] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-amber-500 border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 font-semibold">Item</th>
                  <th className="px-6 py-4 font-semibold text-right">Replacement Cost</th>
                </tr>
              </thead>
              <tbody>
                {INCLUDED_ITEMS.map((it, i) => (
                  <tr
                    key={it.name}
                    className={`${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'} border-b border-white/5 last:border-0`}
                  >
                    <td className="px-6 py-3.5 text-white/85 text-sm">{it.name}</td>
                    <td className="px-6 py-3.5 text-amber-400 text-sm font-semibold text-right whitespace-nowrap">
                      {it.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* section 2: charges */}
        <section className="mt-16">
          <SectionHeader
            number="02"
            title="Charges &amp; Fees"
            subtitle="What makes up your final bill. You'll always see the full breakdown before signing."
          />
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {CHARGES.map((c) => (
              <div
                key={c.label}
                className={`rounded-xl p-5 border ${
                  c.highlight
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-[#141a17] border-white/10'
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-semibold text-white">{c.label}</div>
                  <div className={`text-sm font-semibold ${c.highlight ? 'text-amber-400' : 'text-white/70'}`}>
                    {c.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* section 3: renter responsibilities */}
        <section className="mt-16">
          <SectionHeader
            number="03"
            title="Renter Responsibilities"
            subtitle="By initialing at pickup, you're acknowledging each of these. Read them carefully — this is what we shake hands on."
          />
          <div className="mt-8 space-y-3">
            {CLAUSES.map((c, i) => (
              <div
                key={i}
                className="bg-[#141a17] border border-white/10 rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-md bg-amber-500 text-[#0d1210] flex items-center justify-center shrink-0 font-display text-lg">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="text-white/85 leading-relaxed pt-1">{c}</p>
              </div>
            ))}
          </div>
        </section>

        {/* section 4: renter requirements recap */}
        <section className="mt-16">
          <SectionHeader
            number="04"
            title="What You Need to Rent"
            subtitle="Bring these when you come pick up. Missing any of them means we can't hand over the trailer."
          />
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {[
              "Valid U.S. driver's license",
              'Valid auto insurance',
              'Valid credit card for deposit',
              'A tow vehicle in good working condition',
              'Must be 21 or older',
              'Signed copy of this agreement',
            ].map((r) => (
              <div
                key={r}
                className="flex items-center gap-3 bg-[#141a17] border border-white/10 rounded-xl px-5 py-4"
              >
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-white/85">{r}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-8 lg:p-12">
          <div className="relative z-10 grid md:grid-cols-[1fr_auto] items-center gap-6">
            <div>
              <div className="font-display text-4xl text-[#0d1210] leading-none">
                Ready to reserve?
              </div>
              <p className="mt-3 text-[#0d1210]/80 max-w-xl">
                Sign the agreement in-person at pickup. Meanwhile, call Jason to hold your
                trailer, or send a reservation request online.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="bg-[#0d1210] hover:bg-black text-white font-semibold h-12 px-6 rounded-md"
              >
                <a href={`tel:${brand.phoneRaw}`}>
                  <Phone className="w-4 h-4 mr-2" /> {brand.phone}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 px-6 rounded-md border-[#0d1210] bg-white text-[#0d1210] hover:bg-[#0d1210] hover:text-white"
              >
                <a href="/#contact">Reserve Online</a>
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-white/40 text-xs">
          This page summarizes the full Northwest Haul Rentals LLC agreement.
          The signed paper copy at pickup is the binding version.
          &nbsp;·&nbsp;
          <a href={RENTAL_AGREEMENT_URL} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 underline">
            Download the full PDF
          </a>
        </p>
      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="bg-[#141a17] border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 text-amber-500 text-[10px] uppercase tracking-widest font-semibold mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-white leading-snug">{children}</div>
    </div>
  );
}

function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
      <div className="font-display text-6xl md:text-8xl text-amber-500/30 leading-none">
        {number}
      </div>
      <div className="flex-1">
        <h2
          className="font-display text-3xl md:text-4xl text-white leading-tight"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {subtitle && <p className="mt-2 text-white/60 max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
}
