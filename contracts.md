# Northwest Haul Rentals — Contracts

## Backend API (all under `/api` prefix)

### Public
- `GET /api/trailers` → returns list of trailers (same shape as mock.js `trailers`)
- `POST /api/bookings` → create booking request
  - Body: `{ name, email, phone, trailer, pickup, duration, message }`
  - Response: `{ id, ...body, status: 'pending', created_at }`

### Admin (require header `X-Admin-Token` equal to env `ADMIN_TOKEN`)
- `GET /api/admin/bookings` → list all bookings (newest first)
- `PATCH /api/admin/bookings/{id}` body `{ status }` (values: pending|confirmed|completed|rejected)
- `DELETE /api/admin/bookings/{id}`
- `GET /api/admin/stats` → `{ total, pending, confirmed, completed, rejected, week_count }`

## Mocked Data → Backend Replacement
- `trailers` (mock.js) → served from `/api/trailers` (backend seeds on startup from same list)
- Booking form (Contact.jsx localStorage) → `POST /api/bookings`

## Frontend Integration
- `TrailerSection.jsx` fetches from `/api/trailers` on mount (fallback to mock if fails).
- `Contact.jsx` calls `POST /api/bookings` (keep toast + success screen).
- New `/admin` route: login with token stored in localStorage, then table of bookings + status actions + stats cards.

## Env
- `ADMIN_TOKEN` in `/app/backend/.env` (default seeded, printed in console for owner).
- Existing `MONGO_URL`, `DB_NAME` untouched.

## Data Model (Mongo `bookings` collection)
```
{
  id: str (uuid),
  name, email, phone: str,
  trailer: str,  # trailer id
  pickup: str,   # ISO date str or ""
  duration: str,
  message: str,
  status: str,   # pending | confirmed | completed | rejected
  created_at: datetime (ISO str)
}
```
