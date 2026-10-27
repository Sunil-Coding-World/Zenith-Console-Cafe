"use client";

import { useState } from "react";
import { RATES } from "@/lib/data";
import { inr } from "@/lib/format";
import { BOOKING_STATUSES, type BookingStatus, type Snapshot } from "@/lib/store";
import { Pill } from "./ui";
import { useCafe } from "./useCafe";

const TONE: Record<BookingStatus, "warn" | "good" | "info" | "bad"> = { Pending: "warn", Confirmed: "good", "Checked-in": "info", Cancelled: "bad" };

function dayLabel(date: string, now: number) {
  const d = new Date(now);
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const t = new Date(now + 86_400_000);
  const tomorrow = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  if (date === today) return "Today";
  if (date === tomorrow) return "Tomorrow";
  return new Date(date + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function BookingsBoard({ initial }: { initial: Snapshot }) {
  const { data, now, act } = useCafe(initial, 6000);
  const [filter, setFilter] = useState<BookingStatus | "All">("All");
  const rows = data.bookings
    .filter((b) => filter === "All" || b.status === filter)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  return (
    <>
      <div className="chips">
        {(["All", ...BOOKING_STATUSES] as const).map((s) => (
          <button key={s} className={filter === s ? "on" : ""} onClick={() => setFilter(s)}>
            {s} <small>{s === "All" ? data.bookings.length : data.bookings.filter((b) => b.status === s).length}</small>
          </button>
        ))}
      </div>
      <div className="card table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>When</th>
              <th>Customer</th>
              <th>Console</th>
              <th>Players · Hrs</th>
              <th className="num">Est.</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const digits = b.phone.replace(/\D/g, "");
              const msg = `Hi ${b.name}! Zenith Console Cafe se: aapki ${b.console} booking ${dayLabel(b.date, now)} ${b.time} baje (${b.hours} hr, ${b.players}P) confirm hai. See you! 🎮`;
              return (
                <tr key={b.id}>
                  <td>
                    <b>{dayLabel(b.date, now)}</b>
                    <small>{b.time}</small>
                  </td>
                  <td>
                    <b>{b.name}</b>
                    <small>{b.phone}</small>
                  </td>
                  <td>{b.console}</td>
                  <td>
                    {b.players}P · {b.hours}h
                  </td>
                  <td className="num">{inr((RATES[b.console][b.players] ?? 0) * b.hours)}</td>
                  <td>
                    <Pill tone={TONE[b.status]}>{b.status}</Pill>
                  </td>
                  <td className="acts">
                    {b.status === "Pending" && (
                      <button className="btn btn-lime btn-sm" onClick={() => act("bookingStatus", { id: b.id, status: "Confirmed" })}>
                        Confirm
                      </button>
                    )}
                    {b.status === "Confirmed" && (
                      <button className="btn btn-cyan btn-sm" onClick={() => act("bookingStatus", { id: b.id, status: "Checked-in" })}>
                        Check-in
                      </button>
                    )}
                    {(b.status === "Pending" || b.status === "Confirmed") && (
                      <button className="btn btn-ghost btn-sm" onClick={() => act("bookingStatus", { id: b.id, status: "Cancelled" })}>
                        Cancel
                      </button>
                    )}
                    <a className="icon-btn" href={`https://wa.me/91${digits}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener" title="WhatsApp confirmation">
                      💬
                    </a>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="muted center">
                  No bookings
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
