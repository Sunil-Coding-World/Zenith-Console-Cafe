# Zenith Console Cafe: Project Context

Paste this file into any AI tool or give it to a developer to continue the work.

## 1. Business

- **What it is:** A console gaming cafe with a food menu. Same owner as BNB Enterprises (a solar business, separate project).
- **Stations:** 2× PS5 (`PS5-1`, `PS5-2`, up to 4 players) and 2× PS2 (`PS2-1`, `PS2-2`, up to 2 players).
- **Food:** Pizza, Chinese, Starters, Burgers & Wraps, Drinks, Shakes, Ice Cream. Items carry the Indian veg/non-veg mark.
- **Problems the software solves:**
  - Manual time tracking and billing disputes → live per-station timer with auto bill.
  - Peak-hour waiting → online slot booking.
  - Food orders not reaching the right bill → QR ordering from the seat; food is added to that station's running bill.
  - No repeat-customer system → prepaid passes (hour balance), tournaments, combos.
  - Kitchen delays → kitchen board; orders older than 15 min turn red.
  - Out-of-stock confusion → stock toggle that updates the website and QR menu instantly.
- **Copy tone:** Hinglish, gamer slang ("GG", "Respawn with snacks").
- **IP rule:** No licensed characters or real people (Spider-Man, Tekken, WWE, Ronaldo, etc.) as images. The site uses **original pixel-art characters**: BLAZE (fighter), TITAN (wrestler), KICKER (footballer), PIXEL (gamer mascot). Game titles appear only as text in the game library.

## 2. Tech stack

- **Next.js 16.4** (App Router, Turbopack), **React 19**, **TypeScript**.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. The theme is defined with `@theme inline` in `src/app/globals.css`.
- **Motion** (the new name for Framer Motion): `import { motion } from "motion/react"`.
- `next.config.ts` has `cacheComponents: true`. Consequences:
  - Runtime data must be read inside `<Suspense>` after `await connection()`.
  - No `new Date()` / `Date.now()` during render on the server.
  - Client-only "today" values use `useSyncExternalStore` with a server snapshot of `""` (see `BookingForm.tsx`).
- Fonts via `next/font`:
  - **Bungee** (display): `--nf-display` → `font-display`
  - **Chakra Petch** (body): `--nf-body` → `font-body`
  - **Press Start 2P** (pixel labels): `--nf-pixel` → `.pixel` / `font-pixel`
- **No database yet.** In-memory store in `src/lib/store.ts` (on `globalThis`, seeded lazily). It resets on server restart.
- **No auth yet.** `/admin` is open to anyone with the link.

Run it:

```
cd C:\Users\Asus\chainit-console-cafe
npm run dev        # usually http://localhost:3000 (3001 if 3000 is busy)
npm run build
```

## 3. Routes

| Route | What |
|---|---|
| `/` | Public site: Nav (scroll XP bar), Hero (GAME ON / FOOD ON, character select), live station status + rates, game library, food menu (live stock), combos, tournaments, passes, why-us, booking form, footer, WhatsApp button |
| `/order?station=PS5-1` | QR table ordering (mobile-first cart). Food goes to the kitchen and onto that station's running bill. |
| `/admin` | Dashboard: today's revenue (gaming vs food), busy stations, kitchen queue, revenue by hour, station utilisation, live now, today's bookings, 7-day revenue, top games, top food, recent bills |
| `/admin/live` | **Main tool.** Start a session (customer, players, game) → live timer + running bill → add food → End & Bill (UPI/Cash/Card/Pass) → receipt with WhatsApp share |
| `/admin/kitchen` | Kanban: New → Preparing → Ready → Served |
| `/admin/bookings` | Confirm / check-in / cancel, plus a WhatsApp confirmation message |
| `/admin/menu` | Stock on/off switch per item |
| `/admin/members` | Pass balances, low-balance reminders over WhatsApp, regulars |
| `POST /api/cafe` | Single endpoint, body `{ action, ... }`. Actions: `startSession`, `endSession`, `addOrder`, `orderStatus`, `addBooking`, `bookingStatus`, `availability`. `GET` returns a live snapshot. |

## 4. Files

```
src/app/globals.css            Tailwind import + @theme tokens + shared components (.btn, .veg-mark, .glitch, .grid-floor, .clip-corner)
src/app/(site)/page.tsx        landing page (server; live parts in Suspense)
src/app/order/page.tsx         QR order page shell
src/app/admin/*                admin pages; admin.css is still plain CSS (not yet Tailwind)
src/components/Pixel.tsx       pixel-art sprites (16-wide string grids) + Logo
src/components/site/motion.tsx Reveal, Stagger, Item, FillBar, MotionLink, SectionHead, MotionRoot (reducedMotion="user")
src/components/site/*          Nav, Hero (+CharacterSelect), GameLibrary, FoodMenu, BookingForm, OrderApp
src/components/admin/*         Sidebar, useCafe (polling + action helper), LiveBoard, KitchenBoard, BookingsBoard, MenuManager, ui (Kpi, Card, Pill, Bars, HBars)
src/lib/data.ts                ALL dummy data: CAFE info, STATIONS, RATES, BILLING_RULES, gamingCharge(), GAMES, MENU, COMBOS, MEMBERSHIPS, TOURNAMENTS, MEMBERS, chart data
src/lib/store.ts               in-memory sessions, bills, bookings, kitchen orders, stock
src/lib/format.ts              inr(), duration(), clock(), ago()
```

## 5. Pricing rules (dummy, `data.ts`)

| Console | 1P | 2P | 3P | 4P |
|---|---|---|---|---|
| PS5 (₹/hr) | 100 | 150 | 190 | 220 |
| PS2 (₹/hr) | 50 | 70 | — | — |

- Minimum charge is 30 min; after that, billing is in 15-min blocks.
- Happy hours: weekdays 11am–3pm, 20% off. This is shown on the site but **not yet applied** in billing.
- Pass payment: the gaming charge is ₹0 on the bill. Hours are **not yet deducted** from the member's balance.

## 6. Design system

- Neon arcade on near-black.
- Colors:
  - `bg #07060f`, `bg2 #0e0c1d`, `panel #14112a`, `line #2a2550`
  - `text #f1eefc`, `muted #9b95c4`
  - Accents: `pink #ff2e88`, `cyan #19e6ff`, `lime #b6ff2e`, `yellow #ffd23f`, `red #ff3b5c`
- Shapes: angular clipped corners, a perspective grid floor, scanlines, a glitch title, pixel sprites.
- Motion: spring hovers and taps, scroll reveals and staggers, `layoutId` sliding tabs, `AnimatePresence` swaps, parallax shapes.
- Respect reduced motion: wrap in `MotionRoot`; CSS animations are disabled under `prefers-reduced-motion`.

## 7. Placeholders and open questions

- Real cafe address, city, phone, WhatsApp (currently `919800000000`), opening hours.
- Real rates, menu prices, combos, pass prices, tournament dates.
- Exact spelling of the cafe name (assumed "Zenith").
- Logo and real photos of the setup.

## 8. Next steps (suggested)

1. Database (Supabase/Postgres) + staff login (Owner, Counter, Kitchen roles).
2. Convert the admin panel to Tailwind + Motion (the site is done).
3. Apply happy-hour discount and pass-hour deduction in billing.
4. Printable QR codes per station; GST invoice / thermal print.
5. Online payment (UPI intent / Razorpay) for bookings and passes.
6. Daily closing report on WhatsApp; inventory for food ingredients.
