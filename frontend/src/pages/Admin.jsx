import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import {
  verifyAdmin,
  listBookings,
  getStats,
  updateBookingStatus,
  deleteBooking,
} from '../lib/api';
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Truck,
  Search,
  ArrowLeft,
} from 'lucide-react';
import Logo from '../components/Logo';

const STATUS_COLORS = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  completed: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
  rejected: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
};

const STATUSES = ['pending', 'confirmed', 'completed', 'rejected'];

export default function Admin() {
  const nav = useNavigate();
  const { toast } = useToast();
  const [token, setToken] = useState(localStorage.getItem('nwh_admin_token') || '');
  const [input, setInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(!!token);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // verify existing token on mount
  useEffect(() => {
    if (!token) return;
    verifyAdmin(token)
      .then(() => setAuthed(true))
      .catch(() => {
        localStorage.removeItem('nwh_admin_token');
        setToken('');
      })
      .finally(() => setChecking(false));
  }, [token]);

  const refresh = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [b, s] = await Promise.all([listBookings(token), getStats(token)]);
      setBookings(b);
      setStats(s);
    } catch (e) {
      toast({ title: 'Failed to load', description: 'Please try again' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) refresh();
  }, [authed]); // eslint-disable-line

  const login = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await verifyAdmin(input.trim());
      localStorage.setItem('nwh_admin_token', input.trim());
      setToken(input.trim());
      setAuthed(true);
      toast({ title: 'Welcome back', description: 'Signed in as admin.' });
    } catch (e) {
      toast({ title: 'Invalid token', description: 'Check the admin token and try again.' });
    }
  };

  const logout = () => {
    localStorage.removeItem('nwh_admin_token');
    setToken('');
    setAuthed(false);
    setInput('');
  };

  const onStatusChange = async (id, status) => {
    try {
      const updated = await updateBookingStatus(token, id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast({ title: 'Status updated', description: `Marked as ${status}` });
      // refresh stats
      getStats(token).then(setStats).catch(() => {});
    } catch {
      toast({ title: 'Update failed' });
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this booking? This cannot be undone.')) return;
    try {
      await deleteBooking(token, id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      getStats(token).then(setStats).catch(() => {});
    } catch {
      toast({ title: 'Delete failed' });
    }
  };

  const visible = useMemo(() => {
    let list = bookings;
    if (filter !== 'all') list = list.filter((b) => b.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.trailer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, filter, query]);

  // ---------- LOGIN ----------
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0d1210] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0d1210] flex items-center justify-center p-6">
        <form
          onSubmit={login}
          className="w-full max-w-md bg-[#141a17] border border-white/10 rounded-2xl p-8"
        >
          <button
            type="button"
            onClick={() => nav('/')}
            className="flex items-center gap-2 text-white/60 hover:text-amber-500 text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to site
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#0d1210]" />
            </div>
            <div>
              <div className="font-display text-2xl text-white leading-none">Admin Sign In</div>
              <div className="text-xs text-white/50 mt-1">Northwest Haul Rentals</div>
            </div>
          </div>
          <Label className="text-white/80 text-xs uppercase tracking-widest font-semibold">
            Admin Token
          </Label>
          <Input
            type="password"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your admin token"
            className="input-dark mt-2 bg-white/5 border-white/15 text-white placeholder:text-white/40 h-12"
          />
          <Button
            type="submit"
            className="mt-6 w-full bg-amber-500 hover:bg-amber-400 text-[#132119] font-semibold h-12"
          >
            Sign In
          </Button>
          <p className="mt-4 text-center text-xs text-white/40">
            Token is configured in the backend .env (ADMIN_TOKEN)
          </p>
        </form>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="min-h-screen bg-[#0d1210] text-white">
      <header className="border-b border-white/10 bg-[#0d1210]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="horizontal" color="white" height="52px" />
            <span className="hidden md:inline-block text-xs uppercase tracking-widest text-amber-500 border-l border-white/15 pl-3">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={refresh}
              variant="outline"
              className="h-9 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button
              onClick={() => nav('/')}
              variant="outline"
              className="h-9 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              View Site
            </Button>
            <Button
              onClick={logout}
              className="h-9 bg-white/5 border border-white/15 text-white hover:bg-rose-500 hover:border-rose-500"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <h1 className="font-display text-5xl leading-none">
          Reservations <span className="text-amber-500">Overview</span>
        </h1>
        <p className="mt-2 text-white/60">Manage incoming rental requests and update their status.</p>

        {/* stats */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-6 gap-3">
          <StatCard label="Total" value={stats?.total ?? 0} accent />
          <StatCard label="Pending" value={stats?.pending ?? 0} color="text-amber-400" />
          <StatCard label="Confirmed" value={stats?.confirmed ?? 0} color="text-emerald-400" />
          <StatCard label="Completed" value={stats?.completed ?? 0} color="text-sky-400" />
          <StatCard label="Rejected" value={stats?.rejected ?? 0} color="text-rose-400" />
          <StatCard label="Last 7 Days" value={stats?.week_count ?? 0} />
        </div>

        {/* filters */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all border ${
                  filter === s
                    ? 'bg-amber-500 text-[#0d1210] border-amber-500'
                    : 'bg-white/5 text-white/70 border-white/15 hover:border-amber-500/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, trailer..."
              className="input-dark pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/40 h-11"
            />
          </div>
        </div>

        {/* list */}
        <div className="mt-6">
          {visible.length === 0 ? (
            <div className="bg-[#141a17] border border-white/10 rounded-2xl p-16 text-center">
              <Truck className="w-10 h-10 text-white/30 mx-auto mb-4" />
              <div className="font-display text-2xl">No bookings found</div>
              <div className="text-white/50 text-sm mt-1">
                {bookings.length === 0 ? 'No reservations yet.' : 'Try adjusting filters.'}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color = 'text-white', accent = false }) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        accent ? 'bg-amber-500/10 border-amber-500/40' : 'bg-[#141a17] border-white/10'
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-semibold">
        {label}
      </div>
      <div className={`font-display text-4xl mt-1 leading-none ${accent ? 'text-amber-500' : color}`}>
        {value}
      </div>
    </div>
  );
}

function BookingRow({ booking, onStatusChange, onDelete }) {
  const created = new Date(booking.created_at).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  return (
    <div className="bg-[#141a17] border border-white/10 rounded-xl p-5 hover:border-amber-500/40 transition-colors">
      <div className="grid lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-3">
          <div className="text-white font-semibold">{booking.name}</div>
          <div className="text-white/50 text-xs mt-0.5">{created}</div>
          <Badge
            className={`mt-2 border ${STATUS_COLORS[booking.status] || ''} uppercase tracking-wider`}
          >
            {booking.status}
          </Badge>
        </div>

        <div className="lg:col-span-4 space-y-1 text-sm">
          <div className="flex items-center gap-2 text-white/70">
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <a href={`tel:${booking.phone}`} className="hover:text-amber-500">{booking.phone}</a>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            <a href={`mailto:${booking.email}`} className="hover:text-amber-500 break-all">
              {booking.email}
            </a>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-1 text-sm">
          <div className="flex items-center gap-2 text-white/70">
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            <span>{booking.trailer || 'No preference'}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {booking.pickup || 'flexible'} · {booking.duration}
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 flex items-center gap-2 justify-end">
          <Select value={booking.status} onValueChange={(v) => onStatusChange(booking.id, v)}>
            <SelectTrigger className="w-40 h-9 bg-white/5 border-white/15 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => onDelete(booking.id)}
            className="h-9 w-9 rounded-md bg-white/5 border border-white/15 flex items-center justify-center text-white/60 hover:text-rose-400 hover:border-rose-500/50 transition-colors"
            title="Delete booking"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {booking.message && (
        <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/70">
          <span className="text-amber-500 text-[10px] uppercase tracking-widest font-semibold mr-2">
            Note
          </span>
          {booking.message}
        </div>
      )}
    </div>
  );
}
