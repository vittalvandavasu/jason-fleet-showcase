import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Weight,
  Truck as TruckIcon,
  Layers,
  Ruler,
  Check,
  Phone,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReserveWidget from '../components/ReserveWidget';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getTrailer, getTrailers } from '../lib/api';
import { brand } from '../mock';

export default function TrailerDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [trailer, setTrailer] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setActiveImg(0);
    getTrailer(id)
      .then((t) => setTrailer(t))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getTrailers()
      .then((list) => setOthers(list.filter((t) => t.id !== id).slice(0, 3)))
      .catch(() => {});
  }, [id]);

  // scroll to top when trailer changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1210] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (notFound || !trailer) {
    return (
      <div className="min-h-screen bg-[#0d1210] text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-40 text-center">
          <div className="font-display text-6xl">404</div>
          <p className="mt-3 text-white/60">Trailer not found.</p>
          <Button
            onClick={() => nav('/')}
            className="mt-6 bg-amber-500 hover:bg-amber-400 text-[#0d1210]"
          >
            Back to Fleet
          </Button>
        </div>
      </div>
    );
  }

  const gallery = trailer.gallery && trailer.gallery.length > 0 ? trailer.gallery : [trailer.image];

  return (
    <div className="min-h-screen bg-[#0d1210] text-white">
      <Navbar />

      {/* breadcrumb + hero */}
      <div className="pt-28 lg:pt-32 max-w-7xl mx-auto px-6 lg:px-10">
        <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
          <button onClick={() => nav('/')} className="hover:text-amber-500 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <Link to="/#trailers" className="hover:text-amber-500">Trailers</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-500">{trailer.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* left — gallery */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#141a17] border border-white/10">
              <img
                src={gallery[activeImg]}
                alt={trailer.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                key={activeImg}
              />
              {trailer.tag && (
                <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-500 text-[#0d1210] font-semibold border-0 uppercase tracking-wider">
                  {trailer.tag}
                </Badge>
              )}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                <Weight className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-white">GVWR {trailer.gvwr}</span>
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={g}
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? 'border-amber-500'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={g} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* right — info */}
          <div className="lg:col-span-5">
            {trailer.manufacturer && (
              <div className="text-[11px] uppercase tracking-widest text-amber-500 font-semibold">
                {trailer.manufacturer}
                {trailer.year ? ` · ${trailer.year}` : ''}
              </div>
            )}
            <h1 className="mt-2 font-display text-4xl lg:text-5xl leading-[0.95]">
              {trailer.name}
            </h1>
            <div className="mt-2 text-white/60 uppercase tracking-widest text-xs">
              {trailer.category}
            </div>

            {/* quick specs */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <SpecTile icon={Weight} label="GVWR" value={trailer.gvwr} />
              <SpecTile icon={TruckIcon} label="Axles" value={trailer.axles} />
              <SpecTile icon={Layers} label="Deck" value={trailer.deck} />
              <SpecTile icon={Ruler} label="Payload" value={trailer.payload} />
            </div>

            {/* pricing grid */}
            <div className="mt-6 rounded-2xl bg-[#141a17] border border-white/10 p-5">
              <div className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-3">
                Rental Rates
              </div>
              <div className="grid grid-cols-5 gap-2">
                <PriceTier label="Hourly" v={trailer.pricing.hourly} sub="/ hr" />
                <PriceTier label="Mon–Thu" v={trailer.pricing.weekday} sub="24 hr" />
                <PriceTier label="Fri–Sun" v={trailer.pricing.weekend} sub="24 hr" />
                <PriceTier label="Weekly" v={trailer.pricing.weekly} sub="7 day" highlight />
                <PriceTier label="Monthly" v={trailer.pricing.monthly} sub="30 day" />
              </div>
            </div>

            {/* CTA row */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="btn-glow bg-amber-500 hover:bg-amber-400 text-[#0d1210] font-semibold h-12 px-6 rounded-md flex-1"
              >
                <a href="#reserve">Reserve Dates Below</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 px-6 rounded-md border-white/20 bg-white/5 text-white hover:bg-white hover:text-[#0d1210]"
              >
                <a href={`tel:${brand.phoneRaw}`}>
                  <Phone className="w-4 h-4 mr-2" /> Call
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Best For + Features */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-2 gap-10">
          {trailer.bestFor && trailer.bestFor.length > 0 && (
            <div>
              <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
                Best For
              </div>
              <h2 className="font-display text-3xl lg:text-4xl leading-tight mb-6">
                Perfect for these jobs.
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {trailer.bestFor.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-3 bg-[#141a17] border border-white/10 rounded-lg px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-md bg-amber-500 text-[#0d1210] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-white/85 text-sm font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trailer.features && trailer.features.length > 0 && (
            <div>
              <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
                Included Features
              </div>
              <h2 className="font-display text-3xl lg:text-4xl leading-tight mb-6">
                What comes with it.
              </h2>
              <ul className="space-y-2">
                {trailer.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 bg-[#141a17] border border-white/10 rounded-lg px-4 py-3"
                  >
                    <Check className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                    <span className="text-white/85 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Reserve section */}
      <section id="reserve" className="bg-[#0a0e0c] border-y border-white/10 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Reserve
            </div>
            <h2 className="font-display text-4xl lg:text-5xl leading-[0.95]">
              Pick your dates.
              <br />
              <span className="text-amber-500">Lock it in.</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-xl mx-auto">
              Choose a pickup and return date — booked days are marked in red. Live availability
              — no double bookings.
            </p>
          </div>

          <div className="bg-[#141a17] border border-white/10 rounded-2xl p-6 lg:p-8">
            <ReserveWidget trailer={trailer} />
          </div>
        </div>
      </section>

      {/* Other trailers */}
      {others.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
                Also In Our Fleet
              </div>
              <h2 className="font-display text-3xl lg:text-4xl leading-[0.95]">
                Not the right fit? Check these out.
              </h2>
            </div>
            <Link
              to="/#trailers"
              className="hidden sm:inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 font-medium text-sm"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {others.map((t) => (
              <Link
                key={t.id}
                to={`/trailers/${t.id}`}
                className="group relative bg-[#141a17] border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold">
                    {t.category}
                  </div>
                  <div className="font-display text-xl text-white mt-1">{t.name}</div>
                  <div className="mt-3 text-white/60 text-xs">
                    From <span className="font-display text-lg text-amber-500">${t.pricing.weekday}</span> / day
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function SpecTile({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#141a17] border border-white/10 rounded-lg px-3 py-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-500 font-semibold">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="mt-1 text-white text-sm font-medium">{value}</div>
    </div>
  );
}

function PriceTier({ label, v, sub, highlight = false }) {
  return (
    <div
      className={`rounded-md px-2 py-2 ${
        highlight ? 'bg-amber-500/15 border border-amber-500/40' : 'bg-white/5 border border-white/10'
      }`}
    >
      <div className="text-[9px] font-semibold tracking-[0.12em] text-white/50 uppercase">
        {label}
      </div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className={`font-display text-xl ${highlight ? 'text-amber-500' : 'text-white'}`}>
          ${v}
        </span>
        <span className="text-[9px] text-white/50">{sub}</span>
      </div>
    </div>
  );
}
