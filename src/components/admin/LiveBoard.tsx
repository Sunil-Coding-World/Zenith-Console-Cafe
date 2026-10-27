"use client";

import { useState, type FormEvent } from "react";
import { gamingCharge, GAMES, MENU, MENU_CATEGORIES, RATES, STATIONS, type Station } from "@/lib/data";
import { duration, inr } from "@/lib/format";
import type { Bill, Session, Snapshot } from "@/lib/store";
import { useCafe } from "./useCafe";

const price = (id: string) => MENU.find((m) => m.id === id)?.price ?? 0;
const itemName = (id: string) => MENU.find((m) => m.id === id)?.name ?? id;

export default function LiveBoard({ initial }: { initial: Snapshot }) {
  const { data, now, act, error } = useCafe(initial, 4000);
  const [starting, setStarting] = useState<string | null>(null);
  const [foodFor, setFoodFor] = useState<Session | null>(null);
  const [ending, setEnding] = useState<Session | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);

  const running = data.sessions.reduce((s, x) => {
    const st = STATIONS.find((y) => y.id === x.stationId)!;
    return s + gamingCharge(st.console, x.players, (now - x.startedAt) / 60000) + x.items.reduce((a, i) => a + price(i.menuId) * i.qty, 0);
  }, 0);

  return (
    <>
      <div className="live-sum">
        <span>
          <b>{data.sessions.length}</b>/{STATIONS.length} stations busy
        </span>
        <span>
          Running bills: <b>{inr(running)}</b>
        </span>
        <span className="muted">Auto-refresh every 4s</span>
      </div>
      {error && <p className="a-error">{error}</p>}

      <div className="live-grid">
        {STATIONS.map((st) => {
          const s = data.sessions.find((x) => x.stationId === st.id);
          return s ? (
            <BusyCard key={st.id} station={st} s={s} now={now} onFood={() => setFoodFor(s)} onEnd={() => setEnding(s)} />
          ) : (
            <FreeCard
              key={st.id}
              station={st}
              open={starting === st.id}
              onOpen={() => setStarting(st.id)}
              onCancel={() => setStarting(null)}
              onStart={async (payload) => {
                if (await act("startSession", { stationId: st.id, ...payload })) setStarting(null);
              }}
            />
          );
        })}
      </div>

      {foodFor && (
        <FoodPicker
          session={foodFor}
          onClose={() => setFoodFor(null)}
          unavailable={data.unavailable}
          onAdd={async (items, note) => {
            if (await act("addOrder", { source: foodFor.stationId, items, note })) setFoodFor(null);
          }}
        />
      )}

      {ending && (
        <EndModal
          session={ending}
          now={now}
          onClose={() => setEnding(null)}
          onConfirm={async (paidVia) => {
            const res = await act("endSession", { id: ending.id, paidVia });
            if (res?.bill) {
              setEnding(null);
              setBill(res.bill);
            }
          }}
        />
      )}

      {bill && <Receipt bill={bill} onClose={() => setBill(null)} />}
    </>
  );
}

function BusyCard({ station, s, now, onFood, onEnd }: { station: Station; s: Session; now: number; onFood: () => void; onEnd: () => void }) {
  const mins = (now - s.startedAt) / 60000;
  const gaming = gamingCharge(station.console, s.players, mins);
  const food = s.items.reduce((a, i) => a + price(i.menuId) * i.qty, 0);
  const long = mins > 120;
  return (
    <article className={`st busy ${station.console.toLowerCase()}`}>
      <header>
        <span className="pixel">{station.id}</span>
        <span className="pill bad">● In use</span>
      </header>
      <div className={`timer display${long ? " long" : ""}`}>{duration(now - s.startedAt)}</div>
      <p className="st-who">
        <b>{s.customer}</b> · {s.players}P · {s.game || "—"}
      </p>
      <div className="st-bill">
        <div>
          <span>Gaming</span>
          <b>{inr(gaming)}</b>
        </div>
        <div>
          <span>Food</span>
          <b>{inr(food)}</b>
        </div>
        <div className="tot">
          <span>Total</span>
          <b>{inr(gaming + food)}</b>
        </div>
      </div>
      {s.items.length > 0 && (
        <ul className="st-items">
          {s.items.map((i) => (
            <li key={i.menuId}>
              {i.qty}× {itemName(i.menuId)}
            </li>
          ))}
        </ul>
      )}
      <div className="st-actions">
        <button className="btn btn-ghost btn-sm" onClick={onFood}>
          🍕 Add food
        </button>
        <button className="btn btn-pink btn-sm" onClick={onEnd}>
          ⏹ End & Bill
        </button>
      </div>
    </article>
  );
}

function FreeCard({
  station,
  open,
  onOpen,
  onCancel,
  onStart,
}: {
  station: Station;
  open: boolean;
  onOpen: () => void;
  onCancel: () => void;
  onStart: (p: { customer: string; phone: string; players: number; game: string }) => void;
}) {
  const games = GAMES.filter((g) => g.console === station.console);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onStart({ customer: String(f.get("customer")), phone: String(f.get("phone")), players: Number(f.get("players")), game: String(f.get("game")) });
  }
  return (
    <article className={`st free ${station.console.toLowerCase()}`}>
      <header>
        <span className="pixel">{station.id}</span>
        <span className="pill good">● Free</span>
      </header>
      {!open ? (
        <>
          <div className="st-idle pixel">READY</div>
          <p className="muted center">
            {station.name} · ₹{RATES[station.console][1]}/hr onwards
          </p>
          <button className="btn btn-lime" onClick={onOpen}>
            ▶ Start session
          </button>
        </>
      ) : (
        <form className="st-form" onSubmit={submit}>
          <input name="customer" placeholder="Customer name (or Walk-in)" />
          <input name="phone" placeholder="Mobile (optional)" inputMode="numeric" maxLength={10} />
          <div className="row2">
            <select name="players" defaultValue="2" aria-label="Players">
              {Array.from({ length: station.maxPlayers }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}P · ₹{RATES[station.console][i + 1]}/hr
                </option>
              ))}
            </select>
            <select name="game" aria-label="Game">
              {games.map((g) => (
                <option key={g.title}>{g.title}</option>
              ))}
            </select>
          </div>
          <div className="st-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-lime btn-sm">▶ Start timer</button>
          </div>
        </form>
      )}
    </article>
  );
}

function FoodPicker({ session, unavailable, onClose, onAdd }: { session: Session; unavailable: string[]; onClose: () => void; onAdd: (items: { menuId: string; qty: number }[], note: string) => void }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState<(typeof MENU_CATEGORIES)[number]>("Pizza");
  const [note, setNote] = useState("");
  const lines = Object.entries(cart).filter(([, q]) => q > 0);
  const total = lines.reduce((s, [id, q]) => s + price(id) * q, 0);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <h2>Add food · {session.stationId}</h2>
        <div className="chips">
          {MENU_CATEGORIES.map((c) => (
            <button key={c} className={c === cat ? "on" : ""} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <ul className="pick-list">
          {MENU.filter((m) => m.category === cat).map((m) => {
            const off = unavailable.includes(m.id);
            const q = cart[m.id] ?? 0;
            return (
              <li key={m.id} className={off ? "off" : ""}>
                <span className={`veg-mark${m.veg ? "" : " non"}`} />
                <span>
                  {m.name} <small>₹{m.price}</small>
                </span>
                {off ? (
                  <small className="t-bad">Out</small>
                ) : (
                  <span className="qty">
                    <button onClick={() => setCart((c) => ({ ...c, [m.id]: Math.max(0, q - 1) }))}>−</button>
                    <b>{q}</b>
                    <button onClick={() => setCart((c) => ({ ...c, [m.id]: q + 1 }))}>+</button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <input className="note-in" placeholder="Kitchen note" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-lime btn-sm" disabled={!lines.length} onClick={() => onAdd(lines.map(([menuId, qty]) => ({ menuId, qty })), note)}>
            Send to kitchen · {inr(total)}
          </button>
        </div>
      </div>
    </div>
  );
}

function EndModal({ session, now, onClose, onConfirm }: { session: Session; now: number; onClose: () => void; onConfirm: (paidVia: Bill["paidVia"]) => void }) {
  const [via, setVia] = useState<Bill["paidVia"]>("UPI");
  const st = STATIONS.find((s) => s.id === session.stationId)!;
  const mins = (now - session.startedAt) / 60000;
  const gaming = via === "Pass" ? 0 : gamingCharge(st.console, session.players, mins);
  const food = session.items.reduce((a, i) => a + price(i.menuId) * i.qty, 0);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>End session · {session.stationId}</h2>
        <p className="muted">
          {session.customer} · {session.players}P · {duration(now - session.startedAt)}
        </p>
        <div className="st-bill">
          <div>
            <span>Gaming{via === "Pass" ? " (pass)" : ""}</span>
            <b>{inr(gaming)}</b>
          </div>
          <div>
            <span>Food</span>
            <b>{inr(food)}</b>
          </div>
          <div className="tot">
            <span>Total</span>
            <b>{inr(gaming + food)}</b>
          </div>
        </div>
        <div className="chips">
          {(["UPI", "Cash", "Card", "Pass"] as const).map((v) => (
            <button key={v} className={v === via ? "on" : ""} onClick={() => setVia(v)}>
              {v}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Keep playing
          </button>
          <button className="btn btn-pink btn-sm" onClick={() => onConfirm(via)}>
            Confirm & close bill
          </button>
        </div>
      </div>
    </div>
  );
}

function Receipt({ bill, onClose }: { bill: Bill; onClose: () => void }) {
  const text = `Zenith Console Cafe\nBill ${bill.id} · ${bill.stationId}\n${bill.customer} · ${bill.players}P · ${bill.minutes} min\nGaming: ${inr(bill.gaming)}\nFood: ${inr(bill.food)}\nTotal: ${inr(bill.total)} (${bill.paidVia})\nThanks for playing! GG 🎮`;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal receipt" onClick={(e) => e.stopPropagation()}>
        <div className="pixel big">GG!</div>
        <pre>{text}</pre>
        <div className="modal-actions">
          <a className="btn btn-ghost btn-sm" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener">
            💬 Share on WhatsApp
          </a>
          <button className="btn btn-lime btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
