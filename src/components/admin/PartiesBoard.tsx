"use client";

import { useState } from "react";
import { PARTY_ADDONS, PARTY_PACKAGES, PARTY_TYPES } from "@/lib/data";
import { inr } from "@/lib/format";
import { PARTY_STATUSES, type Party, type PartyStatus, type Snapshot } from "@/lib/store";
import { Kpi, Pill } from "./ui";
import { useCafe } from "./useCafe";

const TONE: Record<PartyStatus, "warn" | "info" | "good" | "neutral" | "bad"> = {
  Enquiry: "warn",
  Confirmed: "info",
  "Advance Paid": "good",
  Completed: "neutral",
  Cancelled: "bad",
};

const NEXT: Partial<Record<PartyStatus, [PartyStatus, string]>> = {
  Enquiry: ["Confirmed", "Confirm"],
  Confirmed: ["Advance Paid", "Advance received"],
  "Advance Paid": ["Completed", "Mark done"],
};

function localDate(ms: number) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function message(p: Party) {
  const pkg = PARTY_PACKAGES.find((x) => x.id === p.pkg)!;
  const type = PARTY_TYPES.find((t) => t.id === p.type)!;
  const when = new Date(p.date + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  if (p.status === "Enquiry" || p.status === "Confirmed") {
    return `Hi ${p.name}! Zenith Console Cafe se 🎉\n${type.label} · ${pkg.name}\n${when}, ${p.time} · ${p.guests} guests\nTotal: ${inr(p.quote)}\nDate lock karne ke liye ${inr(p.advance)} advance UPI kar dijiye. Thank you!`;
  }
  return `Hi ${p.name}! Aapki ${type.label} (${when}, ${p.time}) Zenith Console Cafe pe confirmed hai ✅ Advance mil gaya. Balance ${inr(p.quote - p.advance)} party ke din. See you! 🎮`;
}

export default function PartiesBoard({ initial }: { initial: Snapshot }) {
  const { data, now, act } = useCafe(initial, 8000);
  const [filter, setFilter] = useState<PartyStatus | "Upcoming" | "All">("Upcoming");
  const today = localDate(now);

  const upcoming = data.parties.filter((p) => p.date >= today && p.status !== "Cancelled" && p.status !== "Completed");
  const rows = data.parties
    .filter((p) => (filter === "All" ? true : filter === "Upcoming" ? upcoming.includes(p) : p.status === filter))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const pipeline = upcoming.reduce((s, p) => s + p.quote, 0);
  const advanceDue = upcoming.filter((p) => p.status !== "Advance Paid").reduce((s, p) => s + p.advance, 0);

  return (
    <>
      <div className="kpis">
        <Kpi label="Upcoming parties" value={String(upcoming.length)} hint="Not completed / cancelled" tone="info" />
        <Kpi label="New enquiries" value={String(data.parties.filter((p) => p.status === "Enquiry").length)} hint="Call back jaldi karo" tone="warn" />
        <Kpi label="Party pipeline" value={inr(pipeline)} hint="Upcoming total value" tone="good" />
        <Kpi label="Advance pending" value={inr(advanceDue)} hint="Collect to lock dates" tone="bad" />
      </div>

      <div className="chips">
        {(["Upcoming", "All", ...PARTY_STATUSES] as const).map((s) => (
          <button key={s} className={filter === s ? "on" : ""} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="party-grid">
        {rows.map((p) => {
          const pkg = PARTY_PACKAGES.find((x) => x.id === p.pkg)!;
          const type = PARTY_TYPES.find((t) => t.id === p.type)!;
          const next = NEXT[p.status];
          const digits = p.phone.replace(/\D/g, "");
          const days = Math.round((Date.parse(p.date) - Date.parse(today)) / 86_400_000);
          return (
            <article key={p.id} className={`party s-${p.status.replace(" ", "-").toLowerCase()}`}>
              <header>
                <span className="party-ic" aria-hidden="true">
                  {type.icon}
                </span>
                <div>
                  <b>{p.name}</b>
                  <small>
                    {type.label} · #{p.id}
                  </small>
                </div>
                <Pill tone={TONE[p.status]}>{p.status}</Pill>
              </header>
              <div className="party-when">
                <div>
                  <span>Date</span>
                  <b>{new Date(p.date + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</b>
                  <small className={days >= 0 && days <= 2 && p.status !== "Completed" ? "t-warn" : "muted"}>
                    {days === 0 ? "Today!" : days === 1 ? "Tomorrow" : days > 0 ? `in ${days} days` : `${-days} days ago`}
                  </small>
                </div>
                <div>
                  <span>Time</span>
                  <b>{p.time}</b>
                </div>
                <div>
                  <span>Guests</span>
                  <b>{p.guests}</b>
                </div>
              </div>
              <p className="muted">
                {pkg.name} · {pkg.stations}
                {p.addons.length > 0 && ` · + ${p.addons.map((a) => PARTY_ADDONS.find((x) => x.id === a)?.label).join(", ")}`}
              </p>
              {p.notes && <p className="party-note">📝 {p.notes}</p>}
              <div className="party-money">
                <div>
                  <span>Quote</span>
                  <b>{inr(p.quote)}</b>
                </div>
                <div>
                  <span>Advance (30%)</span>
                  <b className={p.status === "Advance Paid" || p.status === "Completed" ? "t-good" : "t-warn"}>{inr(p.advance)}</b>
                </div>
                <div>
                  <span>Balance</span>
                  <b>{inr(p.quote - p.advance)}</b>
                </div>
              </div>
              <div className="st-actions">
                <a className="btn btn-ghost btn-sm" href={`https://wa.me/91${digits}?text=${encodeURIComponent(message(p))}`} target="_blank" rel="noopener">
                  💬 WhatsApp
                </a>
                {(p.status === "Enquiry" || p.status === "Confirmed") && (
                  <button className="btn btn-ghost btn-sm" onClick={() => act("partyStatus", { id: p.id, status: "Cancelled" })}>
                    Cancel
                  </button>
                )}
                {next && (
                  <button className="btn btn-lime btn-sm" onClick={() => act("partyStatus", { id: p.id, status: next[0] })}>
                    {next[1]}
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {!rows.length && <p className="muted">Koi party nahi is filter mein.</p>}
      </div>
    </>
  );
}
