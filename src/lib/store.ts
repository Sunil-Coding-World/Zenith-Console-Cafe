import { gamingCharge, MENU, partyQuote, STATIONS, type Console, type PartyType } from "./data";

// In-memory store (resets when the server restarts). Swap for a database later.

export type LineItem = { menuId: string; qty: number };

export type Session = {
  id: string;
  stationId: string;
  customer: string;
  phone: string;
  players: number;
  game: string;
  startedAt: number; // epoch ms
  items: LineItem[];
};

export type Bill = {
  id: string;
  stationId: string;
  customer: string;
  players: number;
  minutes: number;
  gaming: number;
  food: number;
  total: number;
  paidVia: "Cash" | "UPI" | "Card" | "Pass";
  endedAt: number;
};

export const BOOKING_STATUSES = ["Pending", "Confirmed", "Checked-in", "Cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type Booking = {
  id: string;
  name: string;
  phone: string;
  console: Console;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  hours: number;
  players: number;
  status: BookingStatus;
  createdAt: number;
};

export const ORDER_STATUSES = ["New", "Preparing", "Ready", "Served"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  source: string; // station id or "Counter"
  items: LineItem[];
  note: string;
  status: OrderStatus;
  createdAt: number;
};

export const PARTY_STATUSES = ["Enquiry", "Confirmed", "Advance Paid", "Completed", "Cancelled"] as const;
export type PartyStatus = (typeof PARTY_STATUSES)[number];

export type Party = {
  id: string;
  name: string;
  phone: string;
  type: PartyType;
  pkg: string;
  date: string; // YYYY-MM-DD
  time: string;
  guests: number;
  addons: string[];
  notes: string;
  quote: number;
  advance: number; // amount to collect to lock the date
  status: PartyStatus;
  createdAt: number;
};

type State = {
  sessions: Session[];
  bills: Bill[];
  bookings: Booking[];
  orders: Order[];
  parties: Party[];
  unavailable: Set<string>; // menu item ids marked out of stock
  seq: number;
};

const g = globalThis as unknown as { __cafe?: State };

function localDate(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Seeded lazily so nothing time-based runs during prerendering.
function seed(): State {
  const now = Date.now();
  const min = 60_000;
  return {
    seq: 1000,
    unavailable: new Set(MENU.filter((m) => !m.available).map((m) => m.id)),
    sessions: [
      { id: "S0991", stationId: "PS5-1", customer: "Aryan Sahu", phone: "98261 11223", players: 2, game: "EA Sports FC 25", startedAt: now - 52 * min, items: [{ menuId: "M02", qty: 1 }, { menuId: "M20", qty: 2 }] },
      { id: "S0992", stationId: "PS2-1", customer: "Walk-in", phone: "", players: 2, game: "Tekken 5", startedAt: now - 18 * min, items: [] },
    ],
    bills: [
      { id: "B0981", stationId: "PS5-2", customer: "Rohit Verma", players: 4, minutes: 120, gaming: 440, food: 836, total: 1276, paidVia: "UPI", endedAt: now - 70 * min },
      { id: "B0982", stationId: "PS5-1", customer: "Kunal Dewangan", players: 1, minutes: 75, gaming: 125, food: 238, total: 363, paidVia: "Pass", endedAt: now - 140 * min },
      { id: "B0983", stationId: "PS2-2", customer: "Walk-in", players: 2, minutes: 60, gaming: 70, food: 109, total: 179, paidVia: "Cash", endedAt: now - 190 * min },
      { id: "B0984", stationId: "PS5-2", customer: "Vivek Yadav", players: 2, minutes: 90, gaming: 225, food: 418, total: 643, paidVia: "UPI", endedAt: now - 260 * min },
    ],
    bookings: [
      { id: "BK201", name: "Ishaan Tiwari", phone: "93011 22334", console: "PS5", date: localDate(), time: "19:00", hours: 2, players: 4, status: "Confirmed", createdAt: now - 300 * min },
      { id: "BK202", name: "Priyansh Jain", phone: "98930 12121", console: "PS5", date: localDate(), time: "20:30", hours: 1, players: 2, status: "Pending", createdAt: now - 45 * min },
      { id: "BK203", name: "Sneha Patel", phone: "88271 77889", console: "PS2", date: localDate(1), time: "17:00", hours: 1, players: 2, status: "Pending", createdAt: now - 20 * min },
      { id: "BK204", name: "Team Bhilai Bros", phone: "97520 45454", console: "PS5", date: localDate(4), time: "16:00", hours: 3, players: 4, status: "Confirmed", createdAt: now - 1500 * min },
    ],
    parties: [
      seedParty("PT301", "Riya Agrawal", "98265 33110", "birthday", "levelup", localDate(3), "16:00", 12, ["cake", "decor"], "10th birthday, gaming theme cake", "Advance Paid", now - 3000 * min),
      seedParty("PT302", "Sunita Jain", "99261 77882", "kitty", "kitty", localDate(5), "15:00", 14, [], "Monthly kitty group, need tambola", "Confirmed", now - 1400 * min),
      seedParty("PT303", "Infotech Solutions", "97520 66001", "corporate", "takeover", localDate(9), "18:00", 24, ["hour"], "Team outing, GST invoice needed", "Enquiry", now - 90 * min),
      seedParty("PT304", "Aditya Verma", "88271 45670", "birthday", "mini", localDate(-2), "17:00", 7, ["cake"], "", "Completed", now - 6000 * min),
    ],
    orders: [
      { id: "K501", source: "PS5-1", items: [{ menuId: "M02", qty: 1 }, { menuId: "M20", qty: 2 }], note: "Less spicy", status: "Served", createdAt: now - 40 * min },
      { id: "K502", source: "Counter", items: [{ menuId: "M16", qty: 2 }, { menuId: "M25", qty: 1 }], note: "Parcel", status: "Preparing", createdAt: now - 9 * min },
      { id: "K503", source: "PS2-1", items: [{ menuId: "M12", qty: 1 }, { menuId: "M23", qty: 2 }], note: "", status: "New", createdAt: now - 2 * min },
    ],
  };
}

function seedParty(
  id: string, name: string, phone: string, type: PartyType, pkg: string, date: string, time: string,
  guests: number, addons: string[], notes: string, status: PartyStatus, createdAt: number,
): Party {
  const q = partyQuote(pkg, guests, addons);
  return { id, name, phone, type, pkg, date, time, guests, addons, notes, quote: q.total, advance: q.advance, status, createdAt };
}

function state() {
  return (g.__cafe ??= seed());
}

const nextId = (prefix: string) => `${prefix}${++state().seq}`;

export const menuPrice = (id: string) => MENU.find((m) => m.id === id)?.price ?? 0;
export const foodTotal = (items: LineItem[]) => items.reduce((s, i) => s + menuPrice(i.menuId) * i.qty, 0);

export function snapshot() {
  const s = state();
  return {
    sessions: s.sessions,
    bills: s.bills,
    bookings: s.bookings,
    orders: s.orders,
    parties: s.parties,
    unavailable: [...s.unavailable],
    now: Date.now(),
  };
}
export type Snapshot = ReturnType<typeof snapshot>;

// ----- sessions -----

export function startSession(input: { stationId: string; customer: string; phone: string; players: number; game: string }) {
  const s = state();
  const station = STATIONS.find((st) => st.id === input.stationId);
  if (!station) throw new Error("Unknown station");
  if (s.sessions.some((x) => x.stationId === station.id)) throw new Error("Station already in use");
  const session: Session = {
    id: nextId("S"),
    ...input,
    players: Math.min(Math.max(1, input.players), station.maxPlayers),
    customer: input.customer || "Walk-in",
    startedAt: Date.now(),
    items: [],
  };
  s.sessions.push(session);
  return session;
}

function mergeItems(target: LineItem[], add: LineItem[]) {
  for (const a of add) {
    const ex = target.find((t) => t.menuId === a.menuId);
    if (ex) ex.qty += a.qty;
    else target.push({ ...a });
  }
}

export function endSession(id: string, paidVia: Bill["paidVia"]) {
  const s = state();
  const idx = s.sessions.findIndex((x) => x.id === id);
  if (idx < 0) throw new Error("Session not found");
  const session = s.sessions[idx];
  const station = STATIONS.find((st) => st.id === session.stationId)!;
  const minutes = Math.max(1, Math.round((Date.now() - session.startedAt) / 60_000));
  const gaming = paidVia === "Pass" ? 0 : gamingCharge(station.console, session.players, minutes);
  const food = foodTotal(session.items);
  const bill: Bill = { id: nextId("B"), stationId: station.id, customer: session.customer, players: session.players, minutes, gaming, food, total: gaming + food, paidVia, endedAt: Date.now() };
  s.sessions.splice(idx, 1);
  s.bills.unshift(bill);
  return bill;
}

// ----- kitchen orders -----

export function addOrder(input: { source: string; items: LineItem[]; note?: string }) {
  const s = state();
  const items = input.items.filter((i) => i.qty > 0 && MENU.some((m) => m.id === i.menuId) && !s.unavailable.has(i.menuId));
  if (!items.length) throw new Error("No available items in order");
  const order: Order = { id: nextId("K"), source: input.source, items, note: input.note ?? "", status: "New", createdAt: Date.now() };
  s.orders.unshift(order);
  // Food ordered from a busy station goes onto that station's running bill.
  const session = s.sessions.find((x) => x.stationId === input.source);
  if (session) mergeItems(session.items, items);
  return order;
}

export function setOrderStatus(id: string, status: OrderStatus) {
  const order = state().orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = status;
  return order;
}

// ----- bookings -----

export function addBooking(input: Omit<Booking, "id" | "status" | "createdAt">) {
  const booking: Booking = { id: nextId("BK"), ...input, status: "Pending", createdAt: Date.now() };
  state().bookings.unshift(booking);
  return booking;
}

export function setBookingStatus(id: string, status: BookingStatus) {
  const b = state().bookings.find((x) => x.id === id);
  if (!b) throw new Error("Booking not found");
  b.status = status;
  return b;
}

// ----- parties -----

export function addParty(input: Omit<Party, "id" | "quote" | "advance" | "status" | "createdAt">) {
  const q = partyQuote(input.pkg, input.guests, input.addons);
  const party: Party = { id: nextId("PT"), ...input, quote: q.total, advance: q.advance, status: "Enquiry", createdAt: Date.now() };
  state().parties.unshift(party);
  return party;
}

export function setPartyStatus(id: string, status: PartyStatus) {
  const p = state().parties.find((x) => x.id === id);
  if (!p) throw new Error("Party not found");
  p.status = status;
  return p;
}

// ----- menu -----

export function setAvailability(menuId: string, available: boolean) {
  const s = state();
  if (available) s.unavailable.delete(menuId);
  else s.unavailable.add(menuId);
  return [...s.unavailable];
}
