# Zenith-Console-Cafe

Gaming cafe website and management system for **Zenith Console Cafe**: PS5 and PS2 gaming, a food menu, and party bookings.

## Features

**Website (`/`)**
- Animated neon-arcade landing page (Tailwind CSS v4 + Motion) with original pixel-art characters
- Live station status (free / in use) and hourly rates
- Game library (PS5 / PS2, filter by genre)
- Food menu with veg/non-veg marks and live stock, gamer combos
- Tournaments, prepaid passes
- Parties & events: birthday, kitty party, corporate, college, private booking, with a live quote
- Online station booking form
- QR table ordering at `/order?station=PS5-1`

**Admin (`/admin`)**
- Dashboard: today's gaming vs food revenue, station utilisation, bookings, parties, kitchen queue
- Live Stations: start a session, live timer, auto bill, add food, end & bill, WhatsApp receipt
- Kitchen board: New → Preparing → Ready → Served
- Bookings, Parties & Events, Menu & stock toggles, Members & passes

> All data is dummy and kept in memory. It resets when the server restarts. There is no login yet.

## Tech

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

See [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for full project context: data model, pricing rules, design system and roadmap.
