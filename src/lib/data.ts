// Dummy data for Zenith Console Cafe. Replace with a real database later.

export const CAFE = {
  name: "Zenith Console Cafe",
  tagline: "Play. Eat. Repeat.",
  phone: "+91 98XXX XXXXX",
  whatsapp: "919800000000",
  address: "Your cafe address, City",
  hours: "11:00 AM – 11:00 PM · All days",
};

// ---------- Stations & pricing ----------

export type Console = "PS5" | "PS2";

export type Station = {
  id: string;
  name: string;
  console: Console;
  screen: string;
  maxPlayers: number;
};

export const STATIONS: Station[] = [
  { id: "PS5-1", name: "PS5 · Arena 1", console: "PS5", screen: '55" 4K HDR', maxPlayers: 4 },
  { id: "PS5-2", name: "PS5 · Arena 2", console: "PS5", screen: '55" 4K HDR', maxPlayers: 4 },
  { id: "PS2-1", name: "PS2 · Retro 1", console: "PS2", screen: '32" LED', maxPlayers: 2 },
  { id: "PS2-2", name: "PS2 · Retro 2", console: "PS2", screen: '32" LED', maxPlayers: 2 },
];

// ₹ per hour, by number of players (controllers).
export const RATES: Record<Console, Record<number, number>> = {
  PS5: { 1: 100, 2: 150, 3: 190, 4: 220 },
  PS2: { 1: 50, 2: 70 },
};

export const BILLING_RULES = {
  minMinutes: 30, // minimum charge
  blockMinutes: 15, // after minimum, billed per 15-min block
  happyHour: { from: 11, to: 15, discount: 0.2 }, // 11am–3pm weekdays, 20% off gaming
};

// Gaming charge for a session of `minutes` with `players` on `console`.
export function gamingCharge(console: Console, players: number, minutes: number) {
  const rate = RATES[console][players] ?? RATES[console][1];
  const billable = Math.max(BILLING_RULES.minMinutes, Math.ceil(minutes / BILLING_RULES.blockMinutes) * BILLING_RULES.blockMinutes);
  return Math.round((rate * billable) / 60);
}

// ---------- Games ----------

export type Game = { title: string; console: Console; genre: string; players: string; hot?: boolean };

export const GAMES: Game[] = [
  { title: "EA Sports FC 25", console: "PS5", genre: "Football", players: "1–4", hot: true },
  { title: "Tekken 8", console: "PS5", genre: "Fighting", players: "1–2", hot: true },
  { title: "WWE 2K24", console: "PS5", genre: "Wrestling", players: "1–4", hot: true },
  { title: "Marvel's Spider-Man 2", console: "PS5", genre: "Action", players: "1" },
  { title: "Mortal Kombat 1", console: "PS5", genre: "Fighting", players: "1–2" },
  { title: "GTA V", console: "PS5", genre: "Open World", players: "1" },
  { title: "Call of Duty: MW III", console: "PS5", genre: "Shooter", players: "1–2" },
  { title: "God of War Ragnarök", console: "PS5", genre: "Action", players: "1" },
  { title: "Gran Turismo 7", console: "PS5", genre: "Racing", players: "1–2" },
  { title: "It Takes Two", console: "PS5", genre: "Co-op", players: "2" },
  { title: "GTA San Andreas", console: "PS2", genre: "Open World", players: "1", hot: true },
  { title: "Tekken 5", console: "PS2", genre: "Fighting", players: "1–2", hot: true },
  { title: "WWE SmackDown vs Raw 2007", console: "PS2", genre: "Wrestling", players: "1–2" },
  { title: "NFS Most Wanted", console: "PS2", genre: "Racing", players: "1" },
  { title: "DBZ Budokai Tenkaichi 3", console: "PS2", genre: "Fighting", players: "1–2" },
  { title: "PES 6", console: "PS2", genre: "Football", players: "1–2" },
  { title: "Contra: Shattered Soldier", console: "PS2", genre: "Shooter", players: "1–2" },
];

// ---------- Food menu ----------

export const MENU_CATEGORIES = ["Pizza", "Chinese", "Starters", "Burgers & Wraps", "Drinks", "Shakes", "Ice Cream"] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export type MenuItem = { id: string; name: string; category: MenuCategory; price: number; veg: boolean; desc?: string; bestseller?: boolean; available: boolean };

export const MENU: MenuItem[] = [
  { id: "M01", name: "Margherita Pizza", category: "Pizza", price: 179, veg: true, desc: "Classic cheese, 8 inch", available: true },
  { id: "M02", name: "Farmhouse Pizza", category: "Pizza", price: 229, veg: true, desc: "Onion, capsicum, tomato, mushroom", bestseller: true, available: true },
  { id: "M03", name: "Paneer Tikka Pizza", category: "Pizza", price: 249, veg: true, desc: "Tandoori paneer, onion", available: true },
  { id: "M04", name: "Chicken Tikka Pizza", category: "Pizza", price: 279, veg: false, desc: "Spicy chicken tikka", bestseller: true, available: true },
  { id: "M05", name: "Veg Hakka Noodles", category: "Chinese", price: 149, veg: true, available: true },
  { id: "M06", name: "Chicken Hakka Noodles", category: "Chinese", price: 179, veg: false, available: true },
  { id: "M07", name: "Veg Manchurian (Gravy)", category: "Chinese", price: 159, veg: true, bestseller: true, available: true },
  { id: "M08", name: "Chilli Paneer (Dry)", category: "Chinese", price: 189, veg: true, available: true },
  { id: "M09", name: "Schezwan Fried Rice", category: "Chinese", price: 159, veg: true, available: true },
  { id: "M10", name: "Chilli Chicken", category: "Chinese", price: 209, veg: false, available: false },
  { id: "M11", name: "French Fries", category: "Starters", price: 99, veg: true, available: true },
  { id: "M12", name: "Peri Peri Fries", category: "Starters", price: 119, veg: true, bestseller: true, available: true },
  { id: "M13", name: "Cheese Garlic Bread", category: "Starters", price: 129, veg: true, available: true },
  { id: "M14", name: "Veg Spring Roll (6 pc)", category: "Starters", price: 139, veg: true, available: true },
  { id: "M15", name: "Chicken Nuggets (8 pc)", category: "Starters", price: 169, veg: false, available: true },
  { id: "M16", name: "Veg Momos (8 pc)", category: "Starters", price: 109, veg: true, bestseller: true, available: true },
  { id: "M17", name: "Aloo Tikki Burger", category: "Burgers & Wraps", price: 89, veg: true, available: true },
  { id: "M18", name: "Crispy Chicken Burger", category: "Burgers & Wraps", price: 149, veg: false, available: true },
  { id: "M19", name: "Paneer Tikka Wrap", category: "Burgers & Wraps", price: 139, veg: true, available: true },
  { id: "M20", name: "Cold Coffee", category: "Drinks", price: 99, veg: true, bestseller: true, available: true },
  { id: "M21", name: "Lemon Iced Tea", category: "Drinks", price: 79, veg: true, available: true },
  { id: "M22", name: "Blue Lagoon Mojito", category: "Drinks", price: 109, veg: true, available: true },
  { id: "M23", name: "Soft Drink (Can)", category: "Drinks", price: 50, veg: true, available: true },
  { id: "M24", name: "Energy Drink", category: "Drinks", price: 125, veg: true, available: true },
  { id: "M25", name: "Oreo Shake", category: "Shakes", price: 139, veg: true, bestseller: true, available: true },
  { id: "M26", name: "KitKat Shake", category: "Shakes", price: 149, veg: true, available: true },
  { id: "M27", name: "Chocolate Brownie Shake", category: "Shakes", price: 159, veg: true, available: true },
  { id: "M28", name: "Vanilla Scoop", category: "Ice Cream", price: 59, veg: true, available: true },
  { id: "M29", name: "Chocolate Sundae", category: "Ice Cream", price: 119, veg: true, available: true },
  { id: "M30", name: "Brownie with Ice Cream", category: "Ice Cream", price: 149, veg: true, bestseller: true, available: true },
];

export const COMBOS = [
  { name: "Solo Grind", includes: "1 hr PS5 (1P) + Peri Peri Fries + Cold Coffee", price: 279, was: 318 },
  { name: "Duo Clash", includes: "1 hr PS5 (2P) + Farmhouse Pizza + 2 Soft Drinks", price: 399, was: 479 },
  { name: "Squad Night", includes: "2 hr PS5 (4P) + 2 Pizzas + 4 Shakes", price: 1299, was: 1574 },
  { name: "Retro Vibes", includes: "1 hr PS2 (2P) + Veg Momos + 2 Iced Teas", price: 239, was: 267 },
];

export const MEMBERSHIPS = [
  { name: "Rookie Pass", hours: 5, price: 450, perks: ["5 hrs PS5 (1P)", "Valid 30 days"] },
  { name: "Pro Pass", hours: 12, price: 999, perks: ["12 hrs PS5 (1P)", "10% off food", "Valid 45 days"], featured: true },
  { name: "Legend Pass", hours: 30, price: 2299, perks: ["30 hrs PS5 (1P)", "15% off food", "Free tournament entry", "Valid 90 days"] },
];

export const TOURNAMENTS = [
  { game: "Tekken 8", date: "Sat · 2 Nov", time: "5:00 PM", entry: 100, prize: "₹2,000 + Pro Pass", slots: 16, filled: 11 },
  { game: "EA Sports FC 25", date: "Sun · 3 Nov", time: "4:00 PM", entry: 150, prize: "₹3,000 + Trophy", slots: 16, filled: 14 },
  { game: "WWE 2K24 Royal Rumble", date: "Sat · 9 Nov", time: "6:00 PM", entry: 100, prize: "₹1,500 + Legend Pass", slots: 8, filled: 3 },
];

// ---------- Members, bookings, history (admin) ----------

export type Member = { id: string; name: string; phone: string; pass: string; hoursLeft: number; hoursTotal: number; visits: number; lastVisit: string; spent: number };

export const MEMBERS: Member[] = [
  { id: "C101", name: "Aryan Sahu", phone: "98261 11223", pass: "Legend Pass", hoursLeft: 18.5, hoursTotal: 30, visits: 22, lastVisit: "2026-10-27", spent: 6840 },
  { id: "C102", name: "Rohit Verma", phone: "99071 44556", pass: "Pro Pass", hoursLeft: 3, hoursTotal: 12, visits: 15, lastVisit: "2026-10-28", spent: 3120 },
  { id: "C103", name: "Sneha Patel", phone: "88271 77889", pass: "Rookie Pass", hoursLeft: 4, hoursTotal: 5, visits: 3, lastVisit: "2026-10-20", spent: 890 },
  { id: "C104", name: "Kunal Dewangan", phone: "97540 99001", pass: "Pro Pass", hoursLeft: 0.5, hoursTotal: 12, visits: 18, lastVisit: "2026-10-26", spent: 4210 },
  { id: "C105", name: "Ishaan Tiwari", phone: "93011 22334", pass: "Pro Pass", hoursLeft: 9, hoursTotal: 12, visits: 6, lastVisit: "2026-10-25", spent: 1750 },
  { id: "C106", name: "Vivek Yadav", phone: "70000 55667", pass: "—", hoursLeft: 0, hoursTotal: 0, visits: 9, lastVisit: "2026-10-28", spent: 2460 },
];

// Today's revenue by hour (dummy), gaming vs food in ₹.
export const HOURLY_TODAY = [
  { hour: "11", gaming: 150, food: 120 },
  { hour: "12", gaming: 300, food: 410 },
  { hour: "1", gaming: 420, food: 690 },
  { hour: "2", gaming: 380, food: 520 },
  { hour: "3", gaming: 260, food: 180 },
  { hour: "4", gaming: 540, food: 460 },
  { hour: "5", gaming: 720, food: 880 },
  { hour: "6", gaming: 690, food: 760 },
];

export const WEEK_REVENUE = [
  { day: "Thu", total: 6420 },
  { day: "Fri", total: 8950 },
  { day: "Sat", total: 12840 },
  { day: "Sun", total: 13610 },
  { day: "Mon", total: 5120 },
  { day: "Tue", total: 5870 },
  { day: "Wed", total: 6930 },
];

export const TOP_GAMES_WEEK = [
  { label: "EA Sports FC 25", value: 31 },
  { label: "Tekken 8", value: 24 },
  { label: "WWE 2K24", value: 17 },
  { label: "GTA San Andreas", value: 12 },
  { label: "Tekken 5", value: 9 },
];

// ---------- Parties & events ----------

export const PARTY_TYPES = [
  { id: "birthday", label: "Birthday Party", icon: "🎂" },
  { id: "kitty", label: "Kitty Party", icon: "💃" },
  { id: "corporate", label: "Corporate / Team Outing", icon: "💼" },
  { id: "college", label: "School / College Group", icon: "🎓" },
  { id: "private", label: "Private Cafe Booking", icon: "🔒" },
] as const;
export type PartyType = (typeof PARTY_TYPES)[number]["id"];

export type PartyPackage = {
  id: string;
  name: string;
  price: number; // flat price, or per person when perPerson is true
  perPerson?: boolean;
  minGuests: number;
  maxGuests: number;
  hours: number;
  stations: string;
  includes: string[];
  featured?: boolean;
};

export const PARTY_PACKAGES: PartyPackage[] = [
  {
    id: "mini",
    name: "Mini Bash",
    price: 2999,
    minGuests: 4,
    maxGuests: 8,
    hours: 2,
    stations: "2× PS5",
    includes: ["2 hrs gaming on 2 PS5", "Pizza + fries + soft drinks", "Basic balloon decor", "Birthday shout-out on screen"],
  },
  {
    id: "levelup",
    name: "Level Up Party",
    price: 5499,
    minGuests: 8,
    maxGuests: 15,
    hours: 3,
    stations: "All 4 stations",
    includes: ["3 hrs on all 4 stations", "Pizza, starters, shakes", "Theme decor + cake table", "Mini tournament with medals", "Dedicated host"],
    featured: true,
  },
  {
    id: "takeover",
    name: "Full Cafe Takeover",
    price: 9999,
    minGuests: 15,
    maxGuests: 30,
    hours: 4,
    stations: "Whole cafe, private",
    includes: ["4 hrs, cafe closed for public", "Custom food menu", "Party playlist + lights", "Tournament + trophy", "Photo corner"],
  },
  {
    id: "kitty",
    name: "Kitty Party Special",
    price: 399,
    perPerson: true,
    minGuests: 8,
    maxGuests: 20,
    hours: 3,
    stations: "Reserved lounge + PS2 party games",
    includes: ["3 hrs reserved seating", "Snacks platter + mocktails", "Retro & party games", "Housie / tambola setup", "Decor on request"],
  },
];

export const PARTY_ADDONS = [
  { id: "cake", label: "Cake (1 kg)", price: 699 },
  { id: "hour", label: "Extra hour", price: 999 },
  { id: "decor", label: "Premium theme decor", price: 1499 },
  { id: "gifts", label: "Return gifts (per guest)", price: 99, perGuest: true },
] as const;

export function partyQuote(pkgId: string, guests: number, addons: string[]) {
  const pkg = PARTY_PACKAGES.find((p) => p.id === pkgId) ?? PARTY_PACKAGES[0];
  const base = pkg.perPerson ? pkg.price * guests : pkg.price;
  const extras = PARTY_ADDONS.filter((a) => addons.includes(a.id)).reduce((s, a) => s + ("perGuest" in a && a.perGuest ? a.price * guests : a.price), 0);
  return { base, extras, total: base + extras, advance: Math.round(((base + extras) * 0.3) / 100) * 100 };
}
