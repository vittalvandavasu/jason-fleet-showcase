import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import TrailerSection from '../components/TrailerSection';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Requirements from '../components/Requirements';
import CTABanner from '../components/CTABanner';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    // Simple scroll reveal for .fade-up elements
    const els = document.querySelectorAll('.fade-up');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleBook = (t) => {
    setSelectedTrailer(t);
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#0d1210]">
      <Navbar />
      <Hero />
      <TrustBar />
      <TrailerSection onBook={handleBook} />
      <Features />
      <HowItWorks />
      <Requirements />
      <CTABanner />
      <Reviews />
      <FAQ />
      <Contact selectedTrailer={selectedTrailer} onClear={() => setSelectedTrailer(null)} />
      <Footer />
    </div>
  );
}
