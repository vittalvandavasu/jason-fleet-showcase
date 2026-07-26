import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { brand, trailers } from '../mock';
import { useToast } from '../hooks/use-toast';

export default function Contact({ selectedTrailer, onClear }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    trailer: '',
    pickup: '',
    duration: '24 Hours',
    message: '',
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (selectedTrailer) {
      setForm((f) => ({ ...f, trailer: selectedTrailer.id }));
    }
  }, [selectedTrailer]);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast({
        title: 'Missing info',
        description: 'Please fill in your name, email, and phone.',
      });
      return;
    }
    // save to localStorage (mock)
    const bookings = JSON.parse(localStorage.getItem('nwh_bookings') || '[]');
    bookings.push({ ...form, at: new Date().toISOString() });
    localStorage.setItem('nwh_bookings', JSON.stringify(bookings));
    setSent(true);
    toast({
      title: 'Reservation request sent!',
      description: 'Jason will call or text you shortly to confirm.',
    });
    setTimeout(() => {
      setSent(false);
      setForm({
        name: '', email: '', phone: '', trailer: '', pickup: '', duration: '24 Hours', message: '',
      });
      onClear && onClear();
    }, 4000);
  };

  return (
    <section id="contact" className="relative bg-[#0d1210] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* left — info */}
          <div>
            <div className="text-amber-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Reserve Your Trailer
            </div>
            <h2 className="font-display text-5xl sm:text-6xl text-white leading-[0.95]">
              Ready to Roll?
              <br />
              <span className="text-amber-500">Let's Get You Hooked Up.</span>
            </h2>
            <p className="mt-5 text-white/70 leading-relaxed max-w-lg">
              Fill out the form and Jason will personally call or text you within an hour
              (usually much sooner) to confirm your booking and answer any questions.
            </p>

            <div className="mt-10 space-y-4">
              <a href={`tel:${brand.phoneRaw}`} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#132119]" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Phone</div>
                  <div className="text-white text-lg font-semibold group-hover:text-amber-500 transition-colors">
                    {brand.phone}
                  </div>
                  <div className="text-white/50 text-sm">Call or text · fastest response</div>
                </div>
              </a>

              <a href={`mailto:${brand.email}`} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center shrink-0 group-hover:border-amber-500 transition-colors">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Email</div>
                  <div className="text-white font-semibold group-hover:text-amber-500 transition-colors break-all">
                    {brand.email}
                  </div>
                  <div className="text-white/50 text-sm">Replies within a few hours</div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Location</div>
                  <div className="text-white font-semibold">{brand.city}</div>
                  <div className="text-white/50 text-sm">Serving the Pacific Northwest</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Hours</div>
                  <div className="text-white font-semibold">{brand.hours}</div>
                  <div className="text-white/50 text-sm">Open 7 days a week</div>
                </div>
              </div>
            </div>
          </div>

          {/* right — form */}
          <div className="bg-[#141a17] border border-white/10 rounded-2xl p-8 lg:p-10 relative overflow-hidden">
            {sent ? (
              <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="font-display text-4xl text-white">Request Received!</h3>
                <p className="mt-3 text-white/70 max-w-sm">
                  Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. Jason will reach out
                  shortly to confirm your reservation.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <h3 className="font-display text-3xl text-white leading-none">Reservation Form</h3>
                <p className="text-white/60 text-sm -mt-2">
                  All fields marked * are required
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name *">
                    <Input
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Jane Doe"
                      className="input-dark bg-white/5 border-white/15 text-white placeholder:text-white/40 h-12"
                    />
                  </Field>
                  <Field label="Phone *">
                    <Input
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="(360) 555-1234"
                      className="input-dark bg-white/5 border-white/15 text-white placeholder:text-white/40 h-12"
                    />
                  </Field>
                </div>

                <Field label="Email *">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="input-dark bg-white/5 border-white/15 text-white placeholder:text-white/40 h-12"
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Trailer">
                    <Select value={form.trailer} onValueChange={(v) => update('trailer', v)}>
                      <SelectTrigger className="bg-white/5 border-white/15 text-white h-12">
                        <SelectValue placeholder="Select trailer" />
                      </SelectTrigger>
                      <SelectContent>
                        {trailers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Duration">
                    <Select value={form.duration} onValueChange={(v) => update('duration', v)}>
                      <SelectTrigger className="bg-white/5 border-white/15 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hourly">Hourly</SelectItem>
                        <SelectItem value="24 Hours">24 Hours</SelectItem>
                        <SelectItem value="Weekend">Weekend</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field label="Preferred Pickup Date">
                  <Input
                    type="date"
                    value={form.pickup}
                    onChange={(e) => update('pickup', e.target.value)}
                    className="input-dark bg-white/5 border-white/15 text-white h-12 [color-scheme:dark]"
                  />
                </Field>

                <Field label="Notes (optional)">
                  <Textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Tell us what you're hauling, questions, etc."
                    className="input-dark bg-white/5 border-white/15 text-white placeholder:text-white/40 resize-none"
                  />
                </Field>

                <Button
                  type="submit"
                  className="btn-glow w-full bg-amber-500 hover:bg-amber-400 text-[#132119] font-semibold h-13 py-4 rounded-md text-base"
                >
                  Send Reservation Request
                  <Send className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-white/50 text-center">
                  No charge yet. We'll confirm availability first.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label className="text-white/80 text-xs uppercase tracking-widest font-semibold">
        {label}
      </Label>
      {children}
    </div>
  );
}
