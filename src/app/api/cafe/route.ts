import { connection } from "next/server";
import { PARTY_ADDONS, PARTY_PACKAGES, PARTY_TYPES, STATIONS, type Console } from "@/lib/data";
import {
  addBooking,
  addOrder,
  addParty,
  PARTY_STATUSES,
  setPartyStatus,
  type PartyStatus,
  BOOKING_STATUSES,
  endSession,
  ORDER_STATUSES,
  setAvailability,
  setBookingStatus,
  setOrderStatus,
  snapshot,
  startSession,
  type BookingStatus,
  type LineItem,
  type OrderStatus,
} from "@/lib/store";

// Single endpoint for the cafe: GET returns live state, POST runs an action.

export async function GET() {
  await connection(); // live data, never prerender
  return Response.json(snapshot());
}

const PAY = ["Cash", "UPI", "Card", "Pass"] as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.action) return Response.json({ error: "Missing action" }, { status: 400 });

  try {
    switch (body.action) {
      case "startSession":
        startSession({
          stationId: String(body.stationId),
          customer: String(body.customer ?? "").trim(),
          phone: String(body.phone ?? "").trim(),
          players: Number(body.players) || 1,
          game: String(body.game ?? ""),
        });
        break;
      case "endSession": {
        const via = PAY.includes(body.paidVia) ? body.paidVia : "Cash";
        const bill = endSession(String(body.id), via);
        return Response.json({ ...snapshot(), bill });
      }
      case "addOrder": {
        const items = (Array.isArray(body.items) ? body.items : []).map((i: LineItem) => ({ menuId: String(i.menuId), qty: Math.max(0, Math.floor(Number(i.qty))) }));
        const source = STATIONS.some((s) => s.id === body.source) ? body.source : "Counter";
        const order = addOrder({ source, items, note: String(body.note ?? "").slice(0, 120) });
        return Response.json({ ...snapshot(), order });
      }
      case "orderStatus":
        if (!ORDER_STATUSES.includes(body.status)) throw new Error("Invalid status");
        setOrderStatus(String(body.id), body.status as OrderStatus);
        break;
      case "addBooking": {
        const name = String(body.name ?? "").trim();
        const phone = String(body.phone ?? "").replace(/\D/g, "");
        const consoleType: Console = body.console === "PS2" ? "PS2" : "PS5";
        if (!name || !/^[6-9]\d{9}$/.test(phone) || !/^\d{4}-\d{2}-\d{2}$/.test(body.date) || !/^\d{2}:\d{2}$/.test(body.time)) {
          throw new Error("Naam, sahi 10-digit mobile number, date aur time zaroori hai.");
        }
        const booking = addBooking({
          name,
          phone: `${phone.slice(0, 5)} ${phone.slice(5)}`,
          console: consoleType,
          date: body.date,
          time: body.time,
          hours: Math.min(6, Math.max(1, Number(body.hours) || 1)),
          players: Math.min(consoleType === "PS5" ? 4 : 2, Math.max(1, Number(body.players) || 1)),
        });
        return Response.json({ booking }, { status: 201 });
      }
      case "bookingStatus":
        if (!BOOKING_STATUSES.includes(body.status)) throw new Error("Invalid status");
        setBookingStatus(String(body.id), body.status as BookingStatus);
        break;
      case "addParty": {
        const name = String(body.name ?? "").trim();
        const phone = String(body.phone ?? "").replace(/\D/g, "");
        const pkg = PARTY_PACKAGES.find((p) => p.id === body.pkg);
        const type = PARTY_TYPES.find((t) => t.id === body.type);
        if (!name || !/^[6-9]\d{9}$/.test(phone) || !pkg || !type || !/^\d{4}-\d{2}-\d{2}$/.test(body.date) || !/^\d{2}:\d{2}$/.test(body.time)) {
          throw new Error("Naam, sahi mobile number, party type, package, date aur time zaroori hai.");
        }
        const guests = Math.min(pkg.maxGuests, Math.max(pkg.minGuests, Number(body.guests) || pkg.minGuests));
        const addons = (Array.isArray(body.addons) ? body.addons : []).filter((a: string) => PARTY_ADDONS.some((x) => x.id === a));
        const party = addParty({
          name,
          phone: `${phone.slice(0, 5)} ${phone.slice(5)}`,
          type: type.id,
          pkg: pkg.id,
          date: body.date,
          time: body.time,
          guests,
          addons,
          notes: String(body.notes ?? "").slice(0, 300),
        });
        return Response.json({ party }, { status: 201 });
      }
      case "partyStatus":
        if (!PARTY_STATUSES.includes(body.status)) throw new Error("Invalid status");
        setPartyStatus(String(body.id), body.status as PartyStatus);
        break;
      case "availability":
        setAvailability(String(body.menuId), Boolean(body.available));
        break;
      default:
        return Response.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
  return Response.json(snapshot());
}
