import React, { useEffect, useMemo, useState } from 'react';
import { format, differenceInDays, addDays, isSameDay, isWithinInterval } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useToast } from '../hooks/use-toast';
import { getBookedDates, createBooking } from '../lib/api';

/**
 * Reservation widget with date-range calendar and live availability check.
 *
 * Props:
 *   trailer  - the trailer object (must have id, name, pricing)
 *   compact  - if true, use tighter layout (for card use)
 */
export default function ReserveWidget({ trailer, compact = false }) {
  const { toast } = useToast();
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [ranges, setRanges] = useState([]); // booked ranges from server
  const [loadingDates, setLoadingDates] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState('dates'); // 'dates' | 'details' | 'done'

  // Load booked dates whenever the trailer changes
  useEffect(() => {
    if (!trailer?.id) return;
    setLoadingDates(true);
    getBookedDates(trailer.id)
      .then((data) => setRanges(data?.ranges || []))
      .catch(() => setRanges([]))
      .finally(() => setLoadingDates(false));
  }, [trailer?.id]);

  // Parse booked ranges into Date intervals
  const bookedIntervals = useMemo(() => {
    return ranges
      .map((r) => {
        const s = new Date(r.start + 'T00:00:00');
        const e = new Date((r.end || r.start) + 'T00:00:00');
        if (isNaN(s) || isNaN(e)) return null;
        return { start: s, end: e };
      })
      .filter(Boolean);
  }, [ranges]);

  // A day is disabled if it's in any booked interval or in the past
  const disabledMatcher = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return true;
    return bookedIntervals.some((iv) => isWithinInterval(day, iv));
  };

  const nights = useMemo(() => {
    if (!range.from) return 0;
    if (!range.to) return 1;
    return Math.max(1, differenceInDays(range.to, range.from) + 1);
  }, [range]);

  // Estimated price (uses trailer pricing tiers)
  const estimate = useMemo(() => {
    if (!trailer?.pricing || nights === 0) return null;
    const p = trailer.pricing;
    if (nights === 1) return { label: '1 day', total: p.weekday };
    if (nights >= 28) return { label: `${nights} days`, total: p.monthly };
    if (nights >= 7) {
      const weeks = Math.floor(nights / 7);
      const extra = nights % 7;
      return { label: `${nights} days`, total: weeks * p.weekly + extra * p.weekday };
    }
    return { label: `${nights} days`, total: nights * p.weekday };
  }, [nights, trailer]);

  // Range overlap check for user's selection
  const conflictInRange = useMemo(() => {
    if (!range.from) return false;
    const start = range.from;
    const end = range.to || range.from;
    return bookedIntervals.some(
      (iv) => start <= iv.end && iv.start <= end
    );
  }, [range, bookedIntervals]);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e && e.preventDefault();
    if (!range.from) {
      toast({ title: 'Pick a date', description: 'Choose your pickup date first.' });
      return;
    }
    if (!form.name || !form.email || !form.phone) {
      toast({ title: 'Missing info', description: 'Please fill in your name, email, and phone.' });
      return;
    }
    try {
      setSubmitting(true);
      const startISO = format(range.from, 'yyyy-MM-dd');
      const endISO = format(range.to || range.from, 'yyyy-MM-dd');
      await createBooking({
        name: form.name,
        email: form.email,
        phone: form.phone,
        trailer: trailer.id,
        pickup: startISO,
        end_date: endISO,
        duration: nights === 1 ? '24 Hours' : nights >= 7 ? 'Weekly' : `${nights} Days`,
        message: form.message,
      });
      setSent(true);
      setStep('done');
      toast({
        title: 'Reservation request sent!',
        description: `Jason will confirm your ${trailer.name} shortly.`,
      });
      // reload booked dates after successful booking
      getBookedDates(trailer.id).then((d) => setRanges(d?.ranges || []));
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Please try again or call directly.';
      toast({ title: 'Could not send request', description: String(detail) });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent && step === 'done') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <div className="font-display text-2xl text-white">Request Received!</div>
        <p className="mt-2 text-white/70 text-sm">
          Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. Jason will call or text you
          shortly to confirm your {trailer.name}.
        </p>
        <Button
          onClick={() => {
            setSent(false);
            setStep('dates');
            setRange({ from: undefined, to: undefined });
            setForm({ name: '', email: '', phone: '', message: '' });
          }}
          variant="outline"
          className="mt-4 border-white/20 bg-white/5 text-white hover:bg-white hover:text-[#0d1210]"
        >
          Book Another
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step 1: date range picker */}
      <div>
        <Label className="text-white/80 text-xs uppercase tracking-widest font-semibold mb-2 block">
          Pick Your Dates
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start h-12 bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white font-normal"
            >
              <CalendarIcon className="w-4 h-4 mr-2 text-amber-500" />
              {range.from ? (
                range.to && !isSameDay(range.from, range.to) ? (
                  <span>
                    {format(range.from, 'MMM d, yyyy')} → {format(range.to, 'MMM d, yyyy')}
                    <span className="text-white/50 ml-2">({nights} days)</span>
                  </span>
                ) : (
                  <span>
                    {format(range.from, 'MMM d, yyyy')}
                    <span className="text-white/50 ml-2">(1 day)</span>
                  </span>
                )
              ) : (
                <span className="text-white/50">Select pickup & return dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0 bg-[#141a17] border-white/15">
            <Calendar
              mode="range"
              numberOfMonths={compact ? 1 : 2}
              selected={range}
              onSelect={(r) => setRange(r || { from: undefined, to: undefined })}
              disabled={disabledMatcher}
              className="p-3 text-white [&_.rdp-day]:text-white/85 [&_.rdp-day_disabled]:text-red-400/40 [&_.rdp-day_disabled]:line-through [&_.rdp-day_selected]:bg-amber-500 [&_.rdp-day_selected]:text-[#0d1210] [&_.rdp-day_selected]:hover:bg-amber-400 [&_.rdp-day_range_middle]:bg-amber-500/25 [&_.rdp-day_range_middle]:text-white [&_.rdp-day_today]:bg-white/10 [&_.rdp-day_today]:text-white [&_.rdp-caption_label]:text-white [&_.rdp-head_cell]:text-white/50 [&_.rdp-nav_button]:text-white [&_.rdp-nav_button]:border-white/20"
            />
            <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500/20 border border-red-400/40" />
                  Booked
                </span>
              </div>
              {loadingDates && (
                <span className="flex items-center gap-1 text-white/50">
                  <Loader2 className="w-3 h-3 animate-spin" /> updating
                </span>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* live conflict warning */}
        {conflictInRange && (
          <div className="mt-2 flex items-start gap-2 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Some days in your range are already booked. Please pick a different range.
            </span>
          </div>
        )}
      </div>

      {/* estimate */}
      {estimate && !conflictInRange && (
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold">
              Estimated Total
            </div>
            <div className="text-white/70 text-xs">{estimate.label} · plus tax & deposit</div>
          </div>
          <div className="font-display text-3xl text-amber-500">${estimate.total}</div>
        </div>
      )}

      {/* contact fields */}
      <form onSubmit={submit} className="space-y-3">
        <div className={compact ? 'grid grid-cols-1 gap-3' : 'grid sm:grid-cols-2 gap-3'}>
          <div>
            <Label className="text-white/80 text-xs uppercase tracking-widest font-semibold">
              Full Name
            </Label>
            <Input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Jane Doe"
              className="input-dark mt-2 bg-white/5 border-white/15 text-white placeholder:text-white/40 h-11"
            />
          </div>
          <div>
            <Label className="text-white/80 text-xs uppercase tracking-widest font-semibold">
              Phone
            </Label>
            <Input
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="(360) 555-1234"
              className="input-dark mt-2 bg-white/5 border-white/15 text-white placeholder:text-white/40 h-11"
            />
          </div>
        </div>
        <div>
          <Label className="text-white/80 text-xs uppercase tracking-widest font-semibold">
            Email
          </Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            className="input-dark mt-2 bg-white/5 border-white/15 text-white placeholder:text-white/40 h-11"
          />
        </div>
        {!compact && (
          <div>
            <Label className="text-white/80 text-xs uppercase tracking-widest font-semibold">
              Notes (optional)
            </Label>
            <Textarea
              rows={3}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="What are you hauling? Any questions?"
              className="input-dark mt-2 bg-white/5 border-white/15 text-white placeholder:text-white/40 resize-none"
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting || conflictInRange || !range.from}
          className="btn-glow w-full bg-amber-500 hover:bg-amber-400 text-[#132119] font-semibold h-12 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
            </>
          ) : (
            <>
              Reserve Now <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
        <p className="text-[11px] text-white/50 text-center">
          No card charged yet — Jason will confirm availability first.
        </p>
      </form>
    </div>
  );
}
